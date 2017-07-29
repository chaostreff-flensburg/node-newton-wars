// get a random integer from including the minumum and excluding the maximum
exports.randomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

// convert degrees to radians
exports.degToRad = (degrees) => {
  return (degress / 180 * Math.PI)
}

// convert radians to degrees
exports.radToDeg = (radians) => {
  return (radians * 180 / Math.PI)
}

// a full-featured vector implementation
exports.Vector = function (x, y) {
  this.x = x || 0
  this.y = y || 0
  // get vector from polar coordinates
  this.fromPolar = function (radius, angle) {
    this.x = radius * Math.cos(angle)
    this.y = radius * Math.sin(angle)
    return this
  }
  // multiply vector by a scalar
  this.times = function (n) {
    this.x *= n
    this.y *= n
    return this
  }
  // divide vector by a scalar
  this.over = function (n) {
    this.x /= n
    this.y /= n
    return this
  }
  // add a vector
  this.plus = function (vector) {
    this.x += vector.x
    this.y += vector.y
    return this
  }
  // subtract a vector
  this.minus = function (vector) {
    this.x -= vector.x
    this.y -= vector.y
    return this
  }
  // get the scalar length of the vector
  this.longitude = function () {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }
  // get the unit vector
  this.unit = function () {
    return this.over(this.longitude())
  }
  // get the dot product
  this.dot = function (vector) {
    return (this.x * vector.x + this.y * vector.y)
  }
  // get a cloned version to work with to prevent mutation
  this.clone = function () {
    return new exports.Vector(this.x, this.y)
  }
}
