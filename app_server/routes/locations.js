let
  express = require('express')
  ,router = express.Router()
  ,ctrlLocations = require('../controllers/locations')
  ,ctrlOther = require('../controllers/other');


/* GET home page. */
router.get('/', ctrlLocations.homeList);
router.get('/location/:locationid', ctrlLocations.locationInfo);
router.get('/location/review/new', ctrlLocations.addReview);

router.get('/about', ctrlOther.about);

module.exports = router;
