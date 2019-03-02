let
  express = require('express')
  ,router = express.Router()
  ,ctrlLocations = require('../controllers/locations')
  ,ctrlOther = require('../controllers/other');


/* GET home page. */
router.get('/', ctrlOther.angularApp);
/*
router.get('/location/:locationid', ctrlLocations.locationInfo);
router.get('/location/:locationid/review/new', ctrlLocations.addReview);
router.post('/location/:locationid/review/new', ctrlLocations.doReview);


router.get('/about', ctrlOther.about);
*/

module.exports = router;
