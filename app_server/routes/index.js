let
  express = require('express'),
  router = express.Router(),
  ctrlMain = require('../controllers/main');

/* GET home page. */
router.get('/', ctrlMain.index);

module.exports = router;
