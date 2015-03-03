var express = require('express');
var router = express.Router();
var html_dir = './public/';
/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.sendFile(html_dir + 'index.htm')
});

router.post('/getAllDevices', function (req, res, next) {
    //res.render('index', { title: 'Express' });
    //res.sendFile(html_dir + 'index.htm')
    console.log('inside get all devices of server');
    res.send(JSON.stringify({ 'charles': 'iPad Air' }));
});

module.exports = router;
