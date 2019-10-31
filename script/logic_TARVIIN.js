var cameraID = "";
var cameras = new Array();
var cameraStartedDate;

$(document).ready(function () {
// this should display the list of cameras
    makeCamerasRequest();
});

// call it when camera list is available
function startDatePicker() {

    var d = new Date();
    // check that state exists
    if (!Array.isArray(cameraStartedDate) || 3 !== cameraStartedDate.length) {
        cameraStartedDate = new Array();
        cameraStartedDate.push(d.getFullYear());
        cameraStartedDate.push(d.getMonth());
        cameraStartedDate.push(d.getDate());
    }
    // destroy to recreate if already exists
    $('#from').datepicker('destroy');
    $('#to').datepicker('destroy');

    var dateFormat = "yymmdd",  // DO NOT CHANGE THIS FORMAT, this value corresponds to rowkey within azure table 
        from = $("#from")
            .datepicker({
                dateFormat: 'yymmdd',
                minDate: new Date(cameraStartedDate[0], cameraStartedDate[1] - 1, cameraStartedDate[2]),  // set this to the first day when app should start
                maxDate: new Date(d.getFullYear(), d.getMonth(), d.getDate()), // set this to current day so it can't go out of bounds
                defaultDate: "+1w",
                changeMonth: true,
                numberOfMonths: 1
            })
            .on("change", function () {
                to.datepicker("option", "minDate", getDate(this));
            }),
        to = $("#to").datepicker({
            dateFormat: 'yymmdd',
            minDate: new Date(cameraStartedDate[0], cameraStartedDate[1] - 1, cameraStartedDate[2]),
            maxDate: new Date(d.getFullYear(), d.getMonth(), d.getDate()), // same as "from"   
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1
        })
            .on("change", function () {
                from.datepicker("option", "maxDate", getDate(this));
            });

    function getDate(element) {
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
        } catch (error) {
            date = null;
        }
        return date;
    }
} // ^ what all this does? 

function makeCamerasRequest() {
    // API HTTP request, Gets all cameras that are assosiated with pedestrian detection
    // Needed with camera details
    fetch('https://pedestriandetection.azurewebsites.net/api/GetCameras', {
        headers: new Headers({
            'Content-Type': 'application/json',
            'GetCameras': 'camera'
        })
    })
        .then(response => response.json())
        .then(data => {
            var select = document.getElementById("select");
            //alert (data.length );
            if ("undefined" !== typeof data && data.length && data.length > 0) {
                for (var i = 0; i < data.length; i++) {

                    cameras[i] = data[i];

                    var option = document.createElement("option");
                    option.appendChild(document.createTextNode(data[i].RowKey));
                    option.value = data[i].RowKey;
                    select.appendChild(option);

                    if (i == 0) {   // set default camera
                        cameraID = data[i].RowKey;
                        if (data[i].cameraStarted && 0 !== (data[i].cameraStarted).length) {
                            setCameraStartDate(data[i].cameraStarted);
                            startDatePicker();
                            enableSearchBtn();
                            enableResetBtn();
                        }
                        if (cameraID && 0 !== cameraID.length) {
                            fillCameraDetailsParagraph(data[i]);
                            makeTotalRequest();
                        }
                    }
                }
                enableCameraSelect();
            }

        })
        .catch(error => alert(error))
}

function makeDayRangeRequest(firstValue, secondValue) {
    // API HTTP request, Get the data for a specific camera from a starting date to the end date
    // Needed with search button logic & Day Range
    fetch('https://pedestriandetection.azurewebsites.net/api/GetDayRange', {
        headers: new Headers({
            'Content-Type': 'application/json',
            'GetDayRange': '',
            'GetStartDay': firstValue.toString(),
            'GetEndDay': secondValue.toString(),
            'CameraID': cameraID
        })
    })
        .then(response => response.json())  // TODO: check if response contains actual data, else print error statement
        .then(data => {
            // alert(JSON.stringify(data));

            if ("undefined" !== typeof data && "undefined" !== typeof data.numberOfObjects) {
                fillDayRangeParagraph(data);
            }
            else if ("undefined" !== typeof data && "undefined" !== typeof data.error) {
                fillErrorParagraph(data);
            }
        })
        .catch(error => alert(error))
}

function makeTotalRequest() {
    // API HTTP reguest, Gets the total number of passerby and processed images for a camera
    // Needed with Total paragraph
    fetch('https://pedestriandetection.azurewebsites.net/api/GetTotal', {
        headers: new Headers({
            'Content-Type': 'application/json',
            'GetTotal': 'total',
            'CameraID': cameraID
        })
    })
        .then(response => response.json())
        .then(data => {
            if ("undefined" !== typeof data && "undefined" !== typeof data.numberOfObjects) {
                if ("undefined" !== data.blobUrl) { // this actually checks string against word "undefined" within blob url, which means there is no image currently presented on backend side..
                    document.getElementById("cameraimg").src = data.blobUrl;    // attach new image        
                }
                else {
                    document.getElementById("cameraimg").src = "images/demo/960x360.gif";   // use default image if new image is not found 
                }
                fillTotalParagraph(data);
            }
            else if ("undefined" !== typeof data && "undefined" !== typeof data.error) {
                fillErrorParagraph(data);
            }
        })
        .catch(error => alert(error))
}
function clearBox(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

// -----------------------------  I NEED ------
function fillTotalParagraph(data) {
// Needed with makeTotalRequest
    var paragraph = document.getElementById("displayBar");
    var objects = document.createTextNode(
        "Total number of passerby: " + data.numberOfObjects
        //JSON.stringify(data)
    );
    var pedestrians = document.createTextNode(
        "Pedestrians: " + data.numberOfPedestrians
    );
    var bicyclers = document.createTextNode(
        "Cyclists: " + data.numberOfBicyclers
    );
    var frames = document.createTextNode(
        "Pictures analyzed: " + data.numberOfFrames
    );
    // What this does? 
    paragraph.appendChild(objects);
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(pedestrians);
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(bicyclers);
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(frames);
    paragraph.appendChild(document.createElement("br"));
} // --------------------------------------------------

// What this does? 
function fillDayRangeParagraph(data) {
    var paragraph = document.getElementById("displayBar");
    var objects = document.createTextNode(
        "Total number of passerby: " + data.numberOfObjects
    );
    var pedestrians = document.createTextNode(
        "Pedestrians: " + data.numberOfPedestrians
    );
    var bicyclers = document.createTextNode(
        "Cyclists: " + data.numberOfBicyclers
    );
    var frames = document.createTextNode(
        "Pictures analyzed: " + data.numberOfFrames
    );
    paragraph.appendChild(objects);
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(pedestrians);
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(bicyclers);
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(frames);
    paragraph.appendChild(document.createElement("br"));
}
// What this does? 
function fillErrorParagraph(data) {

    var paragraph = document.getElementById("displayBar");
    var error = document.createTextNode(
        "Response: " + data.error
        //JSON.stringify(data)
    );
    paragraph.appendChild(error);
    paragraph.appendChild(document.createElement("br"));
}

// ------------------------ I NEED ---
function fillCameraDetailsParagraph(data) {

    var paragraph = document.getElementById("displayDetails");
    var cameraLocation = document.createTextNode(
        "Location: " + data.cameraLocation
    );
    var cameraCity = document.createTextNode(
        "City: " + data.cameraCity
    );
    var cameraName = document.createTextNode(
        "Name: " + data.cameraName
    );
    var cameraEnabled = document.createTextNode(
        "Camera is enabled: " + data.isEnabled
    );
    //What it this again??
    paragraph.appendChild(cameraCity);
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(cameraLocation);
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(cameraEnabled);
    paragraph.appendChild(document.createElement("br"));
} // ------------------------------------------------

// What this does? 
function setCameraStartDate(datestring) {

    var splitYearAndMonth = datestring.match(/.{1,4}/g);
    var splitMonthAndDay = splitYearAndMonth[1].match(/.{1,2}/g);
    cameraStartedDate = new Array();
    cameraStartedDate.push(parseInt(splitYearAndMonth[0]));
    cameraStartedDate.push(parseInt(splitMonthAndDay[0]));
    cameraStartedDate.push(parseInt(splitMonthAndDay[1]));
}

// ---------------------------------- I MAYBE NEED?? -----------------
function enableCameraSelect() {

    // switch cameras with select onchange
    document.getElementById("select").onchange = function () {
        cameraID = this.value;
        if ("undefined" !== cameraID && 0 !== cameraID.length) {
            //alert(cameras.length);
            if (Array.isArray(cameras) && cameras.length > 0) {
                for (var i = 0; i < cameras.length; i++) {
                    if (cameraID.trim() === cameras[i].RowKey.trim()) {
                        clearBox("displayDetails");
                        fillCameraDetailsParagraph(cameras[i]);
                        if (cameras[i].cameraStarted && 0 !== (cameras[i].cameraStarted).length) {
                            //alert (cameras[i].cameraStarted);
                            setCameraStartDate(cameras[i].cameraStarted);
                            resetCameraData();
                        }
                    }
                }
            }
        }
    };
} // -----------------------------------------------------------------------

// ------------------------------ I NEEED -----------
function enableSearchBtn() {

    // search button logic, both 'from' and 'to' values must be presented
    var searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', function () {
        var toValue = document.getElementById('to').value;
        var fromValue = document.getElementById('from').value;
        if ("undefined" !== typeof toValue && 0 !== toValue.length &&
            "undefined" !== typeof fromValue && 0 !== fromValue.length &&
            "undefined" !== typeof cameraID && 0 !== cameraID.length) {
            clearBox("displayBar");
            makeDayRangeRequest(fromValue, toValue);
        }
    }, false);
}

function enableResetBtn() {
    // reset button logic
    var resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', function () {
        resetCameraData();
    }, false);
}
function resetCameraData() {
    clearBox("displayBar");
    document.getElementById('to').value = "";
    document.getElementById('from').value = "";
    makeTotalRequest();
    startDatePicker();
} // --------------------------------------------------------
