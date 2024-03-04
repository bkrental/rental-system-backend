const getRadius = (distance, unit) => {
  const dividerMapping = {
    km: 6378.1,
    mi: 3963.2,
    m: 6378100,
  }
  let divider = dividerMapping[unit] ? dividerMapping[unit] : dividerMapping['km'];

  return distance / divider;
}

module.exports = getRadius;
