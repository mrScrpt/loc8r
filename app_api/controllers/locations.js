const
  mongoose = require('mongoose')
  ,Loc = mongoose.model('Location');

//Вспомагательная функция, которая отпраляет запросы и статус
const sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};



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
//функция для упаковки результатов в массив для ответа api
const buildLocationList = function(req, res, results) {
  const locations = [];
  results.forEach((doc)=> {
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
        }])
        .then(data =>{
          locations = buildLocationList(req, res, data);
          sendJSONresponse(res, 200, locations);
        })
        .catch(err =>{
          sendJSONresponse(res, 404, err);
        })
    }
};


module.exports.locationsCreate = function(req, res) {
  Loc
    .create({
      name: req.body.name
      ,address: req.body.address
      ,facilities: req.body.facilities.split(',')
      ,coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
      ,openingTime: [
        {
          days: req.body.days1
          ,opening: req.body.opening1
          ,closing: req.body.closing1
          ,closed: req.body.closed1
        }
        ,{
          days: req.body.days2
          ,opening: req.body.opening2
          ,closing: req.body.closing2
          ,closed: req.body.closed2
        }
      ]
    })
    .then(data=>{
      sendJSONresponse(res, 400, data)
    })
    .catch(err=>{
      sendJSONresponse(res, 400, err)
    })

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

          sendJSONresponse(res, 404, err);
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

module.exports.locationsUpdateOne = (req, res) => {
  if(!req.params.locationid){
    sendJSONresponse(res, 404,{
      "message": "Not found, location Id required"
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('-reviews -rating')
    .exec()
    .then((err, location)=>{
      if(!location){
        sendJSONresponse(res, 404, {
          "message": "location not found"
        });
        return;
      }
      location.name = req.body.name;
      location.address = req.body.address;
      location.facilities = req.body.facilities.split(",");
      location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)]
      location.openingTime = [
        {
          days: req.body.days1
          ,opening: req.body.opening1
          ,closing: req.body.closing1
          ,closed: req.body.closed1
        }
        ,{
          days: req.body.days2
          ,opening: req.body.opening2
          ,closing: req.body.closing2
          ,closed: req.body.closed2
        }
      ];
      location
        .save()
        .then(location =>{
          sendJSONresponse(res, 200, location);
        })
        .catch(err=>{
          sendJSONresponse(res, 404, err);
        })

    })
    .catch((err)=>{
      sendJSONresponse(res, 400, err)
    })
};

module.exports.locationsDeleteOne = function(req, res) {
  const loctionid = req.params.locationid;
  if (loctionid){
    Loc
      .findeByIdRemove(loctionid)
      .exec()
      .then(()=>{
        sendJSONresponse(res, 204, null);
      })
      .catch(err=>{
        sendJSONresponse(res, 404, err);
      })
  } else {
    sendJSONresponse(res, 404, {
      "message": "No location id"
    })
  }
};
