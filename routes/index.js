var express = require('express');
var router = express.Router();
var html_dir = './public/';
var mysql = require("mysql"),
    connection = mysql.createConnection({
        user: "root",               // For Offline Database
        password: "",               // For Offline Database
        database: "device-monitor"         // For Offline Database

        //host: 'db4free.net',      // For Online database
        //user: "chattingapp",      // For Online database
        //password: "zeusChatApp",  // For Online database
        //database: "chatappzeus"   // For Online database
    });
/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.sendFile(html_dir + 'index.htm')
});

router.post('/getAllDevices', function (req, res, next) {
    //res.render('index', { title: 'Express' });
    //res.sendFile(html_dir + 'index.htm')
    console.log('inside get all devices of server');
    connection.query("SELECT * FROM current_device_users;",
            function (error, rows, fields) {
                res.send(JSON.stringify(rows));
    });
    
    
    //res.send(JSON.stringify({ 'charles': 'iPad Air' }));
});

router.post('/deleteEntry', function (req, res, next) {
    var io = req.io;
    io.sockets.emit("entry_deleted", 1);
});

module.exports = router;
