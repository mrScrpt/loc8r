module.exports.homeList = (req, res)=>{
  res.render('locations-list', {title: 'Home'})
};

module.exports.locationInfo = (req, res)=>{
  res.render('locations-info', {title: 'location Info'})
};

module.exports.addReview = (req, res)=>{
  res.render('location-review-form', {title: 'Add Review'})
};