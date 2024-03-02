const getRadius = (distance, unit) => {
  let divider
  switch (unit) {
    case "mi":
      divider = 3963.2;
      break;
    case "km":
      divider = 6378.1;
      break;
    case "m":
      divider = 6378100;
      break;
  }
  return distance / divider;
}

module.exports = getRadius;