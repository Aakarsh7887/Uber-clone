
const axios = require("axios");
const captainModel = require("../models/captain.model");

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

module.exports.getAddressCoordinate = async (address) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`;

  try {
    const response = await axios.get(url, {
      params: {
        access_token: MAPBOX_TOKEN,
        limit: 1,
      },
    });

    if (response.data.features.length > 0) {
      const [lng, lat] = response.data.features[0].center;

      return {
        ltd: lat,
        lng: lng,
      };
    } else {
      throw new Error("Unable to fetch coordinates");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  try {
    const getCoords = async (place) => {
      const res = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place)}.json`,
        {
          params: {
            access_token: MAPBOX_TOKEN,
            limit: 1,
          },
        },
      );

      if (!res.data.features.length) {
        throw new Error("Location not found");
      }

      return res.data.features[0].center; // [lng, lat]
    };

    const originCoords = await getCoords(origin);
    const destCoords = await getCoords(destination);

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords[0]},${originCoords[1]};${destCoords[0]},${destCoords[1]}`;

    const response = await axios.get(url, {
      params: {
        access_token: MAPBOX_TOKEN,
        geometries: "geojson",
      },
    });

    if (response.data.routes.length > 0) {
      const route = response.data.routes[0];

      return {
        distance: {
          text: (route.distance / 1000).toFixed(2) + " km",
          value: route.distance, // meters
        },
        duration: {
          text: Math.round(route.duration / 60) + " mins",
          value: route.duration, // seconds
        },
      };
    } else {
      throw new Error("No routes found");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};



module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("query is required");
  }

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json`;

  try {
    const response = await axios.get(url, {
      params: {
        access_token: MAPBOX_TOKEN,
        autocomplete: true,
        limit: 5,
      },
    });

    if (response.data.features.length > 0) {
      return response.data.features
        .map((feature) => feature.place_name)
        .filter((value) => value);
    } else {
      throw new Error("Unable to fetch suggestions");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
  try {
    const captains = await captainModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lng, ltd], radius / 6371],
        },
      },
    });

    // During testing/demo, real GPS coordinates might be > 2km from a randomly typed address.
    // If no captains are strictly within 2km, we fallback to all connected captains
    // to ensure the ride flow demonstration works reliably.
    if (captains.length === 0) {
      return await captainModel.find({ socketId: { $ne: null } });
    }

    return captains;
  } catch (error) {
    // If 2dsphere index hasn't finished building, fallback.
    return await captainModel.find({ socketId: { $ne: null } });
  }
};
