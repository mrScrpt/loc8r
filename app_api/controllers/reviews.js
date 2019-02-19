var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};
module.exports.reviewsReadOne = function(req, res) {
  if (req.params && req.params.locationid && req.params.reviewid){
    Loc
      .findById(req.params.locationid)
      .select('name reviews')
      .exec((err, location)=>{
        let response, review;
        if(!location){
          sendJSONresponse(res, 404, {
            "message": "location not found"
          });
          return;
        }else if (err){
          sendJSONresponse(res, 400, err);
          return;
        }
        if(location.reviews && location.reviews.length > 0){
          console.log(location.reviews.id);
          review = location.reviews.id(req.params.reviewid);

          if(!review){
            sendJSONresponse(res, 404, {
              "message": "review id not found"
            })
          }else {
            response = {
              location : {
                name: location.name,
                id: req.params.locationid
              },
              review: review
            };
            sendJSONresponse(res, 200, response);
          }
        }else {
          sendJSONresponse(res, 404, {
            "message": "No reviews found"
          });
        }

      })
  } else {
    sendJSONresponse(res, 404, {
      "message": "Not found location and review id are both required"
    })
  }

};