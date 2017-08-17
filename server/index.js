const express = require('express')
const http = require('http')
const websockets = require('socket.io')
const crypto = require('crypto')
const winston = require('winston')

const config = require('./config')
const util = require('./util')
const math = require('./math')
const entities = require('./entities')
const tools = require('../scripts/util')

winston.cli()
winston.info('[Server] Starting server ...')

if (config.updateFrequency < 20 || config.updateFrequency > 200) {
  winston.error('[Server] Update frequency must be between 20Hz and 200Hz.')
  winston.error('[Server] Please adjust the configuration.')
  process.exit(1)
}

const interval = 1000 / config.updateFrequency

const app = express()
const server = http.Server(app)
const io = websockets(server)

server.listen(config.port, config.host, () => {
  winston.info(`[Server] Server online: http://${config.host}:${config.port}`)
})

const timestamp = Date.now()
const planets = []
const users = []
const collisions = {
  users: 0,
  planets: 0
}

const Vector = math.Vector
const Planet = entities.Planet
const User = entities.User

function spawnEntity (Entity) {
  let entity = null
  let next = false
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
      ++collisions.planets
      continue
    }
    for (let i = 0; i < users.length; ++i) {
      if (util.collide(users[i], entity)) {
        next = true
        break
      }
    }
    if (next) {
      ++collisions.planets
      continue
    }
    break
  }
  return entity
}

const spawnPlanet = () => spawnEntity(Planet)
const spawnUser = (username, token, socket) => spawnEntity(User.bind(null, username, token, socket))

function spawnUniverse () {
  for (let i = 0; i < config.planets.amount; ++i) {
    planets.push(spawnPlanet())
  }
  winston.info(`[Server] Created planets: ${planets.length} planets / ${collisions.planets} ${collisions.planets === 1 ? 'collision' : 'collisions'}`)
  return {
    planets,
    dimensions: config.resolution
  }
}

const universe = spawnUniverse()

io.on('connection', (connection) => {
  // make connection available in callbacks
	const socket = connection

  // synchronise client with server
	socket.emit('send-universe', universe)
  socket.emit('send-players', { players: users.map((user) => util.getPublicUser(user)) })
  socket.emit('unauthorized', { sync: true })

  // user logs in
  socket.on('login', (data) => {
    const username = data.username
    if (username.length < 2) {
      socket.emit('unauthorized', { error: `The username must be at least two characters long: ${username}` })
      winston.error(`[Server] Username is to short: ${username}`)
    } else if (users.filter((user) => user.username === username).length) {
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
        users.push(user)
        socket.emit('authorized', user)
        socket.broadcast.emit('join', util.getPublicUser(user))
        winston.info(`[Server] User joined: ${username}`)
      })
    }
	})

  // user logs out
  socket.on('logout', (data) => {
    const index = users.findIndex((user) => user.auth.socket === socket.id)
    if (~index) {
      const user = users[index]
      users.splice(index, 1)
      socket.emit('unauthorized', { message: 'User successfully closed connection!' })
      socket.broadcast.emit('leave', { socket: user.auth.socket })
      winston.info(`[Server] User left: ${user.username}`)
    } else {
      socket.emit('unauthorized', { error: 'Invalid token to log out!' })
      winston.error(`[Server] Invalid token to log out!`)
    }
  })

  // user or viewer disconnects
  socket.on('disconnect', () => {
    const index = users.findIndex((user) => user.auth.socket === socket.id)
    if (~index) {
      const user = users[index]
      users.splice(index, 1)
      socket.emit('unauthorized', { message: 'User successfully closed connection!' })
      socket.broadcast.emit('leave', { socket: user.auth.socket })
      winston.info(`[Server] User left: ${user.username}`)
    }
  })

  // user requests universe
	socket.on('request-universe', () => {
		socket.emit('send-universe', universe)
  })

  // user requests players
  socket.on('request-players', () => {
		socket.emit('send-players', { players: users.map((user) => util.getPublicUser(user)) })
  })

  socket.on('shoot', (data) => {
    const { velocity, angle, token } = data
    const index = users.findIndex((user) => user.auth.socket === socket.id)

  })

})

let counter = 0
let logging = false
let clear = false

const loop = setInterval(() => {
  ++counter
  users.forEach((user) => {
    user.rockets.forEach((rocket) => {
      rocket.move(planets)
    })
  })
  if (!(counter % 100) && logging) {
    const human = tools.getHumanFilesize(process.memoryUsage().rss)
    if (clear) {
      process.stdout.cursorTo(0)
      process.stdout.moveCursor(0, -1)
      process.stdout.clearLine()
    }
    winston.info(`[Server] Using ${tools.round(human.number, 2).toFixed(2)}${human.unit} of RAM.`)
    clear = true
  }
}, interval)
