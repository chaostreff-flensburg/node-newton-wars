let scales = {}
let universe = {}
let canvas = {}
let context = null

export const applyScales = (universeDimensions, canvasDimensions) => {
  scales.x = universeDimensions.x / canvasDimensions.x
  scales.y = universeDimensions.y / canvasDimensions.y
  scales.r = (scales.x + scales.y) / 2
  universe = universeDimensions
  canvas = canvasDimensions
}

export const applyContext = (canvasContext) => {
  context = canvasContext
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

export const drawCircle = (x, y, r, color) => {
  context.beginPath()
  context.arc(x / scales.x, y / scales.y, r / scales.r, 0, 2 * Math.PI)
  context.fillStyle = color
  context.fill()
}

export const drawText = (x, y, text, color, xOffset, yOffset) => {
  context.font = '20px Arial'
  context.fillStyle = color
  context.fillText(text, x / scales.x + xOffset, y / scales.y + yOffset)
}
