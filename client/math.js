// round a number to a specified precision
exports.round = (number, precision) => {
  const factor = Math.pow(10, precision)
  const large = number * factor
  const rounded = Math.round(large)
  return (rounded / factor)
}

// a slim vector implementation for the front-end
exports.Vector = function (x, y) {
  this.x = x || 0
  this.y = y || 0
  // get the scalar length of the vector
  this.longitude = function () {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }
  // get angle of a vector
  this.angle = function () {
    return Math.atan2(this.y, this.x)
  }
}
