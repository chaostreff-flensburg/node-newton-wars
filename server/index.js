const express = require('express')
const http = require('http')
const websockets = require('socket.io')
const crypto = require('crypto')
const winston = require('winston')

const config = require('./config')

const app = express()
const server = http.Server(app)
const io = websockets(server)

winston.cli()

server.listen(config.port, config.host, () => {
  winston.info(`[Server] Server online: http://${config.host}:${config.port}`)
})

const planets = []
const users = []
const shots = []
const gravity = 9.81

const V = function (x, y) {
  this.x = x
  this.y = y
}

function getUser (token) {
  return users.filter((user) => user.token === token)[0] || null
}

function randomInt (min, max) {
  return Math.ceil(Math.random() * (max - min) + min)
}

function Planet () {
  const x = randomInt(config.planets.maximalSize, config.xResolution - config.planets.maximalSize)
  const y = randomInt(config.planets.maximalSize, config.yResolution - config.planets.maximalSize)
  const r = randomInt(config.planets.minimalSize, config.planets.maximalSize)
  this.pos = new V(x, y)
  this.entitity = r
  this.gravity = r * gravity
}

function User (username, token, socketId) {
  const x = randomInt(config.planets.maximalSize, config.xResolution - config.planets.maximalSize)
  const y = randomInt(config.planets.maximalSize, config.yResolution - config.planets.maximalSize)
  this.username = username
  this.token = token
  this.socketId = socketId
  this.pos = new V(x, y)
  this.entitity = config.userSize
}

function collide (a, b) {
  let clearance = 0
  if (a instanceof User && b instanceof User) {
    clearance += config.clearance.users
  } else if (a instanceof Planet && b instanceof Planet) {
    clearance += config.clearance.planets
  } else {
    clearance += config.clearance.common
  }
  const x = a.pos.x - b.pos.x
  const y = a.pos.y - b.pos.y
  return (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) < (a.entitity + b.entitity + clearance))
}

function spawnPlanets () {
  planets[0] = new Planet()
  let planet = null
  for (let i = 0; i < config.planets.amount; ++i) {
    planet = new Planet()
    for (let j = 0; j < i; ++j) {
      if (i !== j && collide(planets[j], planet)) {
        j = 0
        planet = new Planet()
      }
    }
    if (i < config.planets.amount - 1) {
      planets[i + 1] = planet
    }
  }
  return {
    planets,
    dimensions: {
      x: config.xResolution,
      y: config.yResolution
    }
  }
}

const universe = spawnPlanets()

/*
function check_against_planets(spot)
{
	var response = new SAT.Response();
	planets.forEach(function(ptt) {
		var collided = SAT.testCircleCircle(spot, ptt.c, response);
		if(collided == true)
			return collided;
	})
	return (collided) ? true :false;
}

function check_against_players(spot)
{
	var response = new SAT.Response();
	players.forEach(function(ptt) {
		var collided = SAT.testCircleCircle(spot, ptt.c, response);
		if(collided == true)
			return collided;
	})
	return (collided) ? true : false;
}

//7680x4320 // such solution // much pixel // wow planets
let planets = [];
for(let i = 0; i < config.planetAmount; i++)
{
	var x = random_int(config.maximalSize,config.xSize-config.maximalSize);
	var y = random_int(config.maximalSize,config.ySize-config.maximalSize);
	var s = random_int(config.minimalSize,config.maximalSize)
	var ptt = new C(new V(x,y), s + config.playersafespace);
	var collided = check_against_planets(ptt);
	console.log(collided);
	if(!collided)
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
			var collided = check_against_planets(ptt);
			if(!collided)
			{
				var collided = check_against_players(ptt);
				if(!collided)
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
  var collided = SAT.testCircleCircle(a.c, b.c, response);

  return {
    collided: collided,
    response: response
  };
};

function stepper()
{
	shots.forEach(function(shot,sind,sarr) {
		shot.c.pos = shot.c.pos.add(shot.v)
		players.forEach(function(ptt,pind,parr) {
			var response = SAT.testCircleCollision(shot, ptt);
			if(response.collided == true)
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
			if(response.collided == true)
				shots.indexOf(sind); // Shot trifft auf Planet = Shot geht garnicht mehr
		});
	});
}
*/

io.on('connection', function (connection) {

	const socket = connection

	socket.emit('send-universe', universe)

  // user logs in
  socket.on('login', function (data) {
    if (users.filter((user) => user.username === data.username).length) {
      socket.emit('unauthorized', { error: `User already exists: ${data.username}` })
      winston.error(`[Server] User already exists: ${data.username}`)
    } else {
      crypto.randomBytes(512, (err, buffer) => {
        if (err) {
          socket.emit('unauthorized', { error: 'Generating token failed!' })
          winston.error('[Server] Generating token failed!')
        }
        const user = {
          token: buffer.toString('base64'),
          socket: socket.socketId,
          username: data.username,
          entitity: spawn(),
          deaths: 0,
          kills: 0,
          energy: 20,
          velocity: 10
        }
        console.log(socket.socketId)
        socket.emit('authorized', user)
        users.push(user)
        winston.info(`User joined: ${user.username}`)
      })
    }
	})

  // user logs out
  socket.on('logout', function (data) {
    const user = getUser(data.token)
    if (user) {
      socket.emit('unauthorized', { message: 'User successfully closed connection!' })
      winston.info(`[Server] User left: ${user.username}`)
    } else {
      socket.emit('unauthorized', { error: 'Invalid token to log out!' })
      winston.error(`[Server] Invalid token to log out!`)
    }
  })

  // user requests map
	socket.on('request-universe', function (data) {
		socket.emit('send-universe', universe)
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
			var collided = check_against_planets(ptt);
			if(!collided)
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
