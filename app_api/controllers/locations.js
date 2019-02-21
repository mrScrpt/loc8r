const
  mongoose = require('mongoose')
  ,Loc = mongoose.model('Location');

//модуль для перевода радиан в километры и обратно
const theEarth = (function() {
  const earthRadius = 6371;

  const getDistanceFromRads = (rads)=>{
    return parseFloat(rads * earthRadius);
  };

  const getRadsFromDistance = (distance)=>{
    return parseFloat(distance / earthRadius);
  };

  return {
    getDistanceFromRads,
    getRadsFromDistance
  };
})();
//Вспомагательная функция, которая отпраляет запросы и статус
const sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};
module.exports.locationsListByDistance = function(req, res) {
  const
    lng = parseFloat(req.query.lng)
    ,lat = parseFloat(req.query.lat)
    ,maxDistance = parseFloat(req.query.maxDistance);

    //Настройки для точки отсчета
    const point = {
      type: "Point",
      coordinates: [lng, lat]
    };


    if ((!lng && lng!==0) || (!lat && lat!==0) || ! maxDistance) {
      console.log('locationsListByDistance missing params');
      sendJSONresponse(res, 404, {
        "message": "lng, lat and maxDistance query parameters are all required"
      });
      return;
    } else {
      console.log('locationsListByDistance running...');
      Loc.aggregate(
        [{
          '$geoNear': {
            'near': point,
            'spherical': true,
            'distanceField': 'dist.calculated'
            ,'maxDistance': theEarth.getDistanceFromRads(maxDistance)

          }
        }],
        (err, results)=> {
          if (err) {
            sendJSONresponse(res, 404, err);
          } else {
            locations = buildLocationList(req, res, results);
            sendJSONresponse(res, 200, locations);
          }
        }
      )
    }
};



var buildLocationList = function(req, res, results) {
  //console.log('buildLocationList:');
  var locations = [];
  results.forEach(function(doc) {
    console.log("Дистанция", theEarth.getRadsFromDistance(doc.dist.calculated));
    locations.push({
      distance: theEarth.getRadsFromDistance(doc.dist.calculated),
      name: doc.name,
      address: doc.address,
      rating: doc.rating,
      facilities: doc.facilities,
      _id: doc._id
    });
  });
  return locations;
};


module.exports.locationsCreate = function(req, res) {
  console.log('Finding location details' + res);
};

module.exports.locationsReadOne = function(req, res) {
  if (req.params && req.params.locationid){
    Loc
      .findById(req.params.locationid)
      .exec((err, location)=>{
        if(!location){
          sendJSONresponse(res, 404, {
            "message": "location not found"
          });
          return;
        }else if (err){
          sendJSONresponse(res, 200, err);
          return;
        }
        sendJSONresponse(res, 200, location)
      })
  } else {
    sendJSONresponse(res, 404, {
      "message": "No location in request"
    })
  }

};

module.exports.locationsUpdateOne = function(req, res) {
  console.log('Finding location details' + res);
};

module.exports.locationsDeleteOne = function(req, res) {
  console.log('Finding location details' + res);
};
