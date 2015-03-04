var socketio = io.connect("192.168.2.10:3031"),
    siteUrl = DeviceMonitoringApplication.SERVER_ADDRESS;

function showDevices() {
    $.post(siteUrl + "/getAllDevices", function (result) {
        result = JSON.parse(result);
        console.log(result);
        displayDeviceUsers(result);
        temp();
    });
}

function displayDeviceUsers(result) {
    if (result.length > 0) {
        var columns = Object.keys(result[0]),
            $tableHtml = "<table id='device-table' class='device-table' border='1'>",
            i = 0, j = 0;

        $tableHtml += "<thead><tr>";
        for (; i < columns.length; i++) {
            $tableHtml += "<th>" + columns[i] + "</th>";
        }
        $tableHtml += "</tr></thead>";

        i = 0;
        $tableHtml += "<tbody>";
        for (; i < result.length; i++) {
            $tableHtml += "<tr>";
            for (j=0; j < columns.length;j++) {
                $tableHtml += "<td>" + result[i][columns[j]] + "</td>";
            }
            $tableHtml += "</tr>";
        }
        $tableHtml += "</tbody>";
        $tableHtml += "</table>";
    }

    $('.device-table-container').html($tableHtml);
}

function deleteEntry(data) {
    var rows = $('.device-table-container .device-table tbody tr'),
        cells;
    for (var i = 0; i < rows.length; i++) {
        cells = $(rows[i]).find('td');
        for (var j = 0; j < cells.length; j++) {
            if ($(cells[j]).html() === data.deviceName) {
                rows[i].remove();
                return;
            }
        }
    }
    //$('.device-table-container .device-table tbody tr.'+data.deviceName).remove();
}

function addEntry(data) {
    var $rowHtml = "<tr>", j = 0,
        columns = Object.keys(data);

    for (j = 0; j < columns.length; j++) {
        $rowHtml += "<td>" + data[columns[j]] + "</td>";
    }

    $rowHtml += "</tr>";
    $('.device-table-container .device-table tbody').append($rowHtml);
}

function bindSocketEvents() {
    socketio.on("entry_deleted", function (data) {
        deleteEntry(data);
    });
    socketio.on("entry_added", function (data) {
        addEntry(data);
    });
}

function temp() {
    //$.post(siteUrl + "/deleteEntry");
    //$.post(siteUrl + "/deviceTaken", { empCode: 'rst', deviceCode: 'efg' });
    $.post(siteUrl + "/deviceReturned", { deviceCode: 'efg' });
}

bindSocketEvents();
