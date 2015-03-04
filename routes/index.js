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
router.get('/', function (req, res, next) {
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

/**
* Requires 2 strings empCode and deviceCode in the request
*/
router.post('/deviceTaken', function (req, res, next) {
    var empCode = req.body.empCode,
        deviceCode = req.body.deviceCode;

    onDeviceTake(empCode, deviceCode, req.io);
});

function onDeviceTake(empCode, deviceCode, io) {
    connection.query("SELECT emp_name FROM employee WHERE emp_code = '" + empCode + "';",
            function (error, rows, fields) {
                if (rows.length > 0) {
                    var empName = rows[0]['emp_name'];
                    connection.query("SELECT device_name FROM device WHERE device_code = '" + deviceCode + "';",
                        function (error, rows, fields) {
                            if (rows.length > 0) {
                                var deviceName = rows[0]['device_name'];
                                makeDeviceEntryInDatabase(empName, deviceName, io);
                            } else {
                                console.log(deviceCode + 'does not have a matching device');
                            }
                        });
                } else {
                    console.log(empCode + 'does not have a matching employee');
                }
            });
}

function makeDeviceEntryInDatabase(empName, deviceName, io) {
    var currentTime = getDateTimeForSQL();
    connection.query("INSERT INTO current_device_users (emp_name,device_name,time_taken) VALUES ('"
        + empName + "','" + deviceName + "','" + currentTime + "');", function (error, rows, fields) {
            io.sockets.emit("entry_added", { 'emp_name': empName, 'device_name': deviceName, 'time_taken': currentTime });
        });
}

function getDateTimeForSQL() {

    var str = "";
    var date = new Date();
    str += date.getFullYear() + "-";
    str += (date.getMonth() + 1) + "-";
    str += date.getDate();

    str += " ";

    str += date.getHours() + ":";
    str += date.getMinutes() + ":";
    str += date.getSeconds();

    console.log('INSERTING IN DB:' + str);
    return str;

    //return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

/**
* Requires 1 string deviceCode in the request
*/
router.post('/deviceReturned', function (req, res, next) {
    var deviceCode = req.body.deviceCode;

    onDeviceReturned(deviceCode, req.io);
});

function onDeviceReturned(deviceCode, io) {
    connection.query("SELECT device_name FROM device WHERE device_code = '" + deviceCode + "';",
        function (error, rows, fields) {
            if (rows.length > 0) {
                var deviceName = rows[0]['device_name'];
                removeDeviceEntryInDatabase(deviceName, io);
            } else {
                console.log(deviceCode + 'does not have a matching device');
            }
        });
}

function removeDeviceEntryInDatabase(deviceName, io) {
    connection.query("DELETE FROM current_device_users WHERE device_name = '" + deviceName + "';", function (error, rows, fields) {
        io.sockets.emit("entry_deleted", { 'deviceName': deviceName });
    });
}



module.exports = router;
