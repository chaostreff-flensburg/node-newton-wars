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

function spawnPlanet () {
  let planet = null
  let valid = false
  let next = false
  while (!valid) {
    next = false
    planet = new Planet()
    if (!users.length && !planets.length) {
      valid = true
    }
    for (let i = 0; i < planets.length; ++i) {
      if (util.collide(planets[i], planet)) {
        next = true
        break
      }
    }
    if (next) {
      ++collisions.planets
      continue
    }
    for (let i = 0; i < users.length; ++i) {
      if (util.collide(users[i], planet)) {
        next = true
        break
      }
    }
    if (next) {
      ++collisions.planets
      continue
    }
    valid = true
  }
  return planet
}

function spawnUser (username, token, socket) {
  let user = null
  let valid = false
  let next = false
  while (!valid) {
    next = false
    user = new User(username, token, socket)
    if (!users.length && !planets.length) {
      valid = true
    }
    for (let i = 0; i < planets.length; ++i) {
      if (util.collide(planets[i], user)) {
        next = true
        break
      }
    }
    if (next) {
      ++collisions.users
      continue
    }
    for (let i = 0; i < users.length; ++i) {
      if (util.collide(users[i], user)) {
        next = true
        break
      }
    }
    if (next) {
      ++collisions.users
      continue
    }
    valid = true
  }
  return user
}

function spawnUniverse () {
  const timestamp = Date.now()
  for (let i = 0; i < config.planets.amount; ++i) {
    planets.push(spawnPlanet())
  }
  winston.info(`[Server] Cthulhu created ${planets.length} planets after he had devoured ${collisions.planets} in ${Date.now() - timestamp}ms.`)
  return {
    planets,
    dimensions: {
      x: config.xResolution,
      y: config.yResolution
    }
  }
}

const universe = spawnUniverse ()

/*
function check_against_planets(spot)
{
	var response = new SAT.Response();
	planets.forEach(function(ptt) {
		var util.collided = SAT.testCircleCircle(spot, ptt.c, response);
		if(util.collided == true)
			return util.collided;
	})
	return (util.collided) ? true :false;
}

function check_against_players(spot)
{
	var response = new SAT.Response();
	players.forEach(function(ptt) {
		var util.collided = SAT.testCircleCircle(spot, ptt.c, response);
		if(util.collided == true)
			return util.collided;
	})
	return (util.collided) ? true : false;
}

//7680x4320 // such solution // much pixel // wow planets
let planets = [];
for(let i = 0; i < config.planetAmount; i++)
{
	var x = random_int(config.maximalSize,config.xSize-config.maximalSize);
	var y = random_int(config.maximalSize,config.ySize-config.maximalSize);
	var s = random_int(config.minimalSize,config.maximalSize)
	var ptt = new C(new V(x,y), s + config.playersafespace);
	var util.collided = check_against_planets(ptt);
	console.log(util.collided);
	if(!util.collided)
		planets.push({ x: x, y: y, s: s, c: new C(new V(x,y), s)});
	else
		i--;
}

function find_new_spot()
{
	while(true)
	{
			var test = {x: random_int(0,config.xSize), y: random_int(0,config.ySize), s: config.playersize};
			var ptt = new C(new V(test.x,test.y), test.s + config.playersafespace);
			var util.collided = check_against_planets(ptt);
			if(!util.collided)
			{
				var util.collided = check_against_players(ptt);
				if(!util.collided)
				{
					return test;
				}
			}
	}
}

function create_shot(player, pind, velocity, angle)
{
	shots.push({pind: pind, c: new C(new V(player.x,player.y), 1), v: new V((velocity * Math.cos(angle / 180 * Math.PI)),(velocity * -Math.sin(angle / 180 * Math.PI)))});
	//players.find(function(p){return p.username == player.username})
}

function testCircleCollision(a, b) {
  var response = new SAT.Response();
  var util.collided = SAT.testCircleCircle(a.c, b.c, response);

  return {
    util.collided: util.collided,
    response: response
  };
};

function stepper()
{
	shots.forEach(function(shot,sind,sarr) {
		shot.c.pos = shot.c.pos.add(shot.v)
		players.forEach(function(ptt,pind,parr) {
			var response = SAT.testCircleCollision(shot, ptt);
			if(response.util.collided == true)
			{
				players[pind].c = find_new_spot(); // Shot trifft auf Player = Player tot
				players[pind].deads++; // Shot trifft auf Player = Player tot
				if(shot.pind != pind) // Shot trifft auf Player = Schütze kriegt Punkt
					players[shot.pind].kills++; // allerdings nur wenn er es nicht selbst war :P
				shots.indexOf(sind); // Shot trifft auf Player = Shot geht in Rente
				socket.emit('player-update')
			}
		});
		planets.forEach(function(ptt,pind,parr) {
			var response = SAT.testCircleCollision(shot, ptt);
			if(response.util.collided == true)
				shots.indexOf(sind); // Shot trifft auf Planet = Shot geht garnicht mehr
		});
	});
}
*/

io.on('connection', (connection) => {
  // make connection available in callbacks
	const socket = connection

	socket.emit('send-universe', universe)
  socket.emit('send-players', { players: users.map((user) => util.getPublicUser(user)) })

  // user logs in
  socket.on('login', (data) => {
    const username = data.username
    if (username.length < 2) {
      socket.emit('unauthorized', { error: `Username must be at least two characters long: ${username}` })
      winston.error(`[Server] Username is to short: ${username}`)
    } else if (users.filter((user) => user.username === username).length) {
      socket.emit('unauthorized', { error: `User already exists: ${username}` })
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

  /*
	// get Shot
	socket.on('shot-fired', function (data) {
		console.log('shot-fired');
		create_shot(data.username,players.findIndex(function(ele,ind,arr){}),data.velocity,data.angle);
	});
	socket.on('reset', function(data) {
		planets = [];
		for(let i = 0; i < config.planetAmount; i++)
		{
			var x = random_int(config.maximalSize,config.xSize-config.maximalSize);
			var y = random_int(config.maximalSize,config.ySize-config.maximalSize);
			var s = random_int(config.minimalSize,config.maximalSize)
			var ptt = new C(new V(x,y), s);
			var util.collided = check_against_planets(ptt);
			if(!util.collided)
				planets.push({ x: x, y: y, s: s, c: new C(new V(x,y), s)});
			else
				i--;
		}
		socket.emit('send-map', {'planets': planets, dimensions: { x: config.xSize, y: config.ySize}});
	})
});
// event-handler for new incoming connections
/*io.on('connection', function(socket) {
    //
	console.log('connected');
	socket.on('getMap', function(data) {
  	  socket.emit('map', {
  		  'planets': planets
  	  });
    });
});
*/
