const
  mongoose = require('mongoose'),
  Loc = mongoose.model('Location');

//Вспомагательная функция, которая отпраляет запросы и статус
const sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

//Вспомагательная функция для добавления и сохранения отзыва
const doAddReview = (req, res, location)=>{
  if(!location){
    sendJSONresponse(res, 404, {
      "message":"location Id not found"
    });
  } else {
    location.reviews.push({
      author: req.body.author
      ,rating: req.body.rating
      ,reviewText: req.body.reviewText
    });
    location
      .save()
      .then(location=>{
        updateAverageRating(location._id);
        const thisReview = location.reviews[location.reviews.length - 1];
        sendJSONresponse(res, 201, thisReview)
      })
      .catch(err=>{
        sendJSONresponse(res, 400, err)
      })
  }
};
const updateAverageRating = (locationid)=>{
  Loc
    .findById(locationid)
    .select()
    .exec()
    .then(location=>{
      doSetAverageRating(location);
    })
    .catch(err=>{
      console.log(err)
    })
};

const doSetAverageRating = (location)=>{
  let reviewCount, ratingAverage, ratingTotal;
  if(location.reviews && location.reviews.length > 0 ){

    reviewCount = location.reviews.length;
    ratingTotal = 0;
    for (let i = 0; i < reviewCount; i++ ){
      ratingTotal = ratingTotal + location.reviews[i].rating;
      console.log(ratingTotal);
    }
    ratingAverage = parseInt(ratingTotal / reviewCount, 10)
    location.rating = ratingAverage;
    console.log('sssssssss', ratingAverage);
    location
      .save()
      .then(()=>{
        console.log('Average rating update to', ratingAverage);
      })
      .catch(err =>{
        console.log(err);
      })

  }
};

module.exports.reviewsReadOne = (req, res) => {
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

module.exports.reviewsCreate = (req, res)=>{
  const locationid = req.params.locationid;
  if (locationid) {
    Loc
      .findById(locationid)
      .select('reviews')
      .exec()
      .then(location =>{
        doAddReview(req, res, location);
      })
      .catch(err=>{
        sendJSONresponse(res, 400, err)
      })
  }else {
    sendJSONresponse(res, 404, {
      "message": "Not found, location Id request"
    })
  }
};


module.exports.reviewsUpdateOne= (req, res) =>{
  if(!req.params.locationid || !req.params.reviewid){
    sendJSONresponse(res, 404, {
      "message" : " Not found, location id and review id are are both required"
    });
    return;
  }
  Loc
    .findById(req.params.locations)
    .select('reviews')
    .exec()
    .then(location =>{
      if(!location){
        sendJSONresponse(res, 404, {
          "message": "location id not found"
        });
        return;
      }
      if (location.reviews && location.reviews.length > 0){
        const thisReview = location.reviews.id(req.params.reviewid);
        if(!thisReview){
          sendJSONresponse(res, 404, {
            "message": "review not found"
          });
        }else {
          thisReview.author = req.body.author;
          thisReview.rating = req.body.rating;
          thisReview.reviewText = req.body.reviewText;
          location
            .save()
            .then(location=>{
              updateAverageRating(location._id);
              sendJSONresponse(res, 200, thisReview);
            })
            .catch(err=>{
              sendJSONresponse(res, 404, err)
            })
        }
      }else {
        sendJSONresponse(res, 404, {
          "message": "No reviews to update"
        })
      }
    })
    .catch(err => {
      sendJSONresponse(res, 400, err)
    })
};


module.exports.reviewsDeleteOne = (req, res) =>{
  if(!req.params.locationid || !req.params.reviewid){
    sendJSONresponse(res, 404, {
      "message":"Not found, location id and review id are both require"
    });
    return;
  }
  Loc
    .findById(locationid)
    .select('reviews')
    .exec()
    .then(location=>{
      if(!location){
        sendJSONresponse(res, 404, {
          "message":"location id not found"
        });
        return;
      }
      if (location.reviews && location.reviews.length > 0){
        if(!location.reviews.id(req.params.reviewid)){
          sendJSONresponse(res, 404, {
            "message": "reviews not found"
          });
        }else {
          location.reviews.id(req.params.reviewid).remove()
          location
            .save()
            .then(()=>{
              updateAverageRating(location._id);
              sendJSONresponse(res, 204, null);
            })
            .catch(err=>{
              sendJSONresponse(res, 404, err)
            })
        }
      } else {
        sendJSONresponse(res, 404, {
          "message": "No review to delete"
        });
      }
    })
    .catch(err=>{
      sendJSONresponse(res, 404, err)
    })
};