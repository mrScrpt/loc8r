const
  mongoose = require('mongoose')
  ,Loc = mongoose.model('Location');

//модуль для перевода радиан в километры и обратно
const theEarch = (()=>{
  const earthRadius = 6371;
  const getDistanceFromRads = (rads)=>{
    return parseFloat( rads * earthRadius);
  };
  const getRadsFromDistance = (distance)=>{
    return parseFloat( distance / earthRadius);
  };
  return {
    getDistanceFromRads
    ,getRadsFromDistance
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

    ,point = {
      type: "Point"
      ,coordinates: [lng,lat]
    }
    ,geoOption = {
      spherical: true
      ,maxDistance: theEarch.getRadsFromDistance(20)
      ,num: 10
    };

  Loc.geoNear(point,geoOption,(err, result, stats)=>{
    const locations = [];
    result.forEach((doc)=>{
      locations.push({
        distance: theEarch.getDistanceFromRads(doc.dis)
        ,name: doc.obj.name
        ,address: doc.obj.address
        ,rating: doc.obj.rating
        ,facilities: doc.obj.facilities
        ,_id: doc.obj._id
      });
    });
    sendJSONresponse(res, 200, locations)
  })
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
