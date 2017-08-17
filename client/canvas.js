let scales = {}
let universe = {}
let canvas = {}
let context = null

export const setScales = (universeDimensions, canvasDimensions) => {
  scales.x = universeDimensions.x / canvasDimensions.x
  scales.y = universeDimensions.y / canvasDimensions.y
  scales.r = (scales.x + scales.y) / 2
  universe = universeDimensions
  canvas = canvasDimensions
}

export const setContext = (canvasContext) => {
  context = canvasContext
}

export const getScales = () => {
  return scales
}

export const clearCanvas = () => {
  context.clearRect(0, 0, canvas.x, canvas.y)
}

export const drawCurve = (points, color, width) => {
  context.beginPath()
  context.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length - 2; ++i) {
    const dx = (points[i].x + points[i + 1].x) / 2
    const dy = (points[i].y + points[i + 1].y) / 2
    context.quadraticCurveTo(points[i].x, points[i].y, dx, dy)
  }
  context.quadraticCurveTo(points[points.length - 2].x, points[points.length - 2].y, points[points.length - 1].x, points[points.length - 1].y)
  context.lineWidth = width
  context.strokeStyle = color
  context.stroke()
}

export const drawCircle = (vector, r, color) => {
  context.beginPath()
  context.arc(vector.x / scales.x, vector.y / scales.y, r / scales.r, 0, 2 * Math.PI)
  context.fillStyle = color
  context.fill()
}

export const drawText = (vector, text, color, xOffset, yOffset, align) => {
  context.font = '20px Arial'
  context.fillStyle = color
  if (align === 'auto') {
    context.textAlign = vector.x > universe.x / 2 ? 'right' : 'left'
    xOffset = vector.x > universe.x / 2 ? xOffset * -1 : xOffset
  } else {
    align = align || 'left'
  }
  context.fillText(text, vector.x / scales.x + xOffset, vector.y / scales.y + yOffset)
}

export const drawImage = (vector, image, size, angle) => {
  context.save()
  context.translate(vector.x / scales.x, vector.y / scales.y)
  context.rotate(angle)
  context.translate(-size / 2, -size / 2)
  context.drawImage(image, 0, 0, size, size)
  context.restore()
}
