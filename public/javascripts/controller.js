function showDevices() {
    var siteUrl = DeviceMonitoringApplication.SERVER_ADDRESS;
    $.post(siteUrl + "/getAllDevices", function (result) {
        result = JSON.parse(result);
        console.log(result);
    });
}
