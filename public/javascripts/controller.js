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

function deleteEntry(rowNumber) {
    $('.device-table-container .device-table tbody tr')[rowNumber].remove();
}

function addEntry(data) {
    var $rowHtml = "<tr>", j = 0,
        columns = Object.keys(data[0]);

    for (j = 0; j < columns.length; j++) {
        $rowHtml += "<td>" + data[0][columns[j]] + "</td>";
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
    $.post(siteUrl + "/deleteEntry");
}

bindSocketEvents();
