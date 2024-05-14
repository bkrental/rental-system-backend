const getRadius = require("./getRadius");

const getLocationQueryObj = ({ center, distance = 20, unit = "km" }) => {
  if (!center) return {};

  const [lng, lat] = center.split(",");
  const radius = getRadius(distance, unit);

  return {
    $geoWithin: {
      $centerSphere: [[lng * 1, lat * 1], radius],
    },
  };
};

module.exports = getLocationQueryObj;
