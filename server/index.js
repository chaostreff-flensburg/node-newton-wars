const express = require('express')
const http = require('http')
const websockets = require('socket.io')
const crypto = require('crypto')
const winston = require('winston')

const config = require('./config')
const util = require('./util')

const app = express()
const server = http.Server(app)
const io = websockets(server)

winston.cli()

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

const Planet = util.Planet
const User = util.User
const Vector = util.Vector
const Projectile = util.Projectile

function spawnEntity (Entity) {
  let entity = null
  let next = false
  while (true) {
    next = false
    entity = new Entity()
    if (!users.length && !planets.length) break
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
  winston.info(`[Server] Created ${planets.length} planets.`)
  if (collisions.planets) {
    winston.info(`[Server] ${collisions.planets} ${collisions.planets > 1 ? 'planets' : 'planet'} had to be respawned.`)
  }
  return {
    planets,
    dimensions: {
      x: config.xResolution,
      y: config.yResolution
    }
  }
}

const universe = spawnUniverse ()

io.on('connection', (connection) => {
  // make connection available in callbacks
	const socket = connection

  // force synchronisation
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
	socket.on('request-universe', (data) => {
		socket.emit('send-universe', universe)
  })

  socket.on('request-players', (data) => {
		socket.emit('send-players', { players: users.map((user) => util.getPublicUser(user)) })
  })

})
