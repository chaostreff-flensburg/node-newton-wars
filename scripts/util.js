exports.round = (number, precision) => {
  const factor = Math.pow(10, precision)
  const large = number * factor
  const rounded = Math.round(large)
  return (rounded / factor)
}

exports.getHumanFilesize = (size) => {
  let units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let unit = 0;
  while (size > 1000) {
    ++unit
    size /= 1000
  }
  return {
    number: size,
    unit: units[unit]
  }
}
