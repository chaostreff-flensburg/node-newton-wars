const express = require('express')
const http = require('http')
const websockets = require('socket.io')
const crypto = require('crypto')
const winston = require('winston')
const lowdb = require('lowdb')

const config = require('./config')
const util = require('./util')
const math = require('./math')
const entities = require('./entities')

const Vector = math.Vector
const Planet = entities.Planet
const User = entities.User

winston.cli()
winston.info('[Server] Starting server ...')

if (config.updateFrequency < 20 || config.updateFrequency > 200) {
  winston.error('[Server] Update frequency must be between 20Hz and 200Hz.')
  winston.error('[Server] Please adjust the configuration.')
  process.exit(1)
}

const timestamp = Date.now()
const interval = 1000 / config.updateFrequency

const app = express()
const server = http.Server(app)
const io = websockets(server)
const db = lowdb()

server.listen(config.port, config.host, () => {
  winston.info(`[Server] Server online: http://${config.host}:${config.port}`)
})

winston.info('[Server] Initializing lowdb database backend ...')
db.defaults({
  planets: [],
  users: [],
  collisions: 0
}).write()

function spawnEntity (Entity) {
  let entity = null
  let next = false
  const planets = db.get('planets').value()
  const users = db.get('users').value()
  while (true) {
    next = false
    entity = new Entity()
    if (!users.length && !planets.length) {
      break
    }
    for (let i = 0; i < planets.length; ++i) {
      if (util.collide(planets[i], entity)) {
        next = true
        break
      }
    }
    if (next) {
      const collisions = db.get('collisions').value()
      db.get('collisions').assign(collisions + 1).write()
      continue
    }
    for (let i = 0; i < users.length; ++i) {
      if (util.collide(users[i], entity)) {
        next = true
        break
      }
    }
    if (next) {
      const collisions = db.get('collisions').value()
      db.get('collisions').assign(collisions + 1).write()
      continue
    }
    break
  }
  return entity
}

const spawnPlanet = () => spawnEntity(Planet)
const spawnUser = (username, token, socket) => spawnEntity(User.bind(null, username, token, socket))

for (let i = 0; i < config.planets.amount; ++i) {
  const planet = spawnPlanet()
  db.get('planets').push(planet).write()
}
winston.info(`[Server] Created planets: ${db.get('planets').size().value()} planets / ${db.get('collisions').value() ? db.get('collisions').value() : 'No'} ${db.get('collisions').value() > 1 ? 'collisions' : 'collision'}`)

const getUniverse = () => {
  return {
    planets: db.get('planets').value(),
    dimensions: config.resolution
  }
}

io.on('connection', (connection) => {
	const socket = connection

	socket.emit('send-universe', getUniverse())
  socket.emit('send-players', { players: db.get('users').map((user) => util.getPublicUser(user)).value() })
  socket.emit('unauthorized', { sync: true })

  socket.on('login', (data) => {
    const username = data.username
    if (username.length < 2) {
      socket.emit('unauthorized', { error: `The username must be at least two characters long: ${username}` })
      winston.error(`[Server] Username is too short: ${username}`)
    } else if (db.get('users').filter({ username }).size().value()) {
      socket.emit('unauthorized', { error: `This user already exists: ${username}` })
      winston.error(`[Server] User already exists: ${username}`)
    } else {
      crypto.randomBytes(config.tokenSize, (err, buffer) => {
        if (err) {
          socket.emit('unauthorized', { error: 'Generating token failed!' })
          winston.error('[Server] Generating token failed!')
        }
        const token = buffer.toString('base64')
        const user = spawnUser(username, token, socket.id)
        db.get('users').push(user).write()
        socket.emit('authorized', user)
        socket.broadcast.emit('join', util.getPublicUser(user))
        winston.info(`[Server] User joined: ${username}`)
      })
    }
	})

  socket.on('logout', (data) => {
    const user = db.get('users').filter((user) => user.auth.socket === socket.id).first().value()
    if (user) {
      db.get('users').remove({ username: user.username }).write()
      socket.emit('unauthorized', { message: 'User successfully closed connection!' })
      socket.broadcast.emit('leave', { socket: user.auth.socket })
      winston.info(`[Server] User left: ${user.username}`)
    } else {
      socket.emit('unauthorized', { error: 'Invalid token to log out!' })
      winston.error(`[Server] Invalid token to log out!`)
    }
  })

  socket.on('disconnect', () => {
    const user = db.get('users').filter((user) => user.auth.socket === socket.id).first().value()
    if (user) {
      db.get('users').remove({ username: user.username }).write()
      socket.emit('unauthorized', { message: 'User successfully closed connection!' })
      socket.broadcast.emit('leave', { socket: user.auth.socket })
      winston.info(`[Server] User left: ${user.username}`)
    }
  })

	socket.on('request-universe', () => {
		socket.emit('send-universe', getUniverse())
  })

  socket.on('request-players', () => {
		socket.emit('send-players', { players: db.get('users').map((user) => util.getPublicUser(user)).value() })
  })

  socket.on('shoot', (data) => {
    winston.info(`User shot: ${data.username}`)
    console.log(data)
  })
})

let counter = 0
let logging = false
let clear = false

const loop = setInterval(() => {
  ++counter
}, interval)
