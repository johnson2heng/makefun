var express = require('express');
var router = express.Router();

var index =  require('./controller/index');

router.get('/', index.index);
router.get('/detail', index.detail);

module.exports = router;