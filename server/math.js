exports.randomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

exports.degToRad = (degrees) => {
  return (degress / 180 * Math.PI)
}

exports.radToDeg = (radians) => {
  return (radians * 180 / Math.PI)
}

exports.Vector = function (x, y) {
  this.x = x || 0
  this.y = y || 0
  this.fromPolar = function (radius, angle) {
    this.x = radius * Math.cos(angle)
    this.y = radius * Math.sin(angle)
    return this
  }
  this.times = function (n) {
    this.x *= n
    this.y *= n
    return this
  }
  this.over = function (n) {
    this.x /= n
    this.y /= n
    return this
  }
  this.plus = function (vector) {
    this.x += vector.x
    this.y += vector.y
    return this
  }
  this.minus = function (vector) {
    this.x -= vector.x
    this.y -= vector.y
    return this
  }
  this.size = function () {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }
  this.unit = function () {
    return this.over(this.size())
  }
  this.dot = function (vector) {
    return (this.x * vector.x + this.y * vector.y)
  }
  this.clone = function () {
    return new exports.Vector(this.x, this.y)
  }
}
