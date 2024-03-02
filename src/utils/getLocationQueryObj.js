const getRadius = require("./getRadius");

const getLocationQueryObj = ({ center, distance, unit }) => {
  if (!center || !distance || !unit) return {};

  const [lng, lat] = center.split(",");
  const radius = getRadius(distance, unit);

  return {
    location: {
      $geoWithin: {
        $centerSphere: [[lng * 1, lat * 1], radius]
      }
    }
  }
}

module.exports = getLocationQueryObj;