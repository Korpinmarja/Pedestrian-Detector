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

    var dateFormat = "yymmdd",
// DO NOT CHANGE THIS FORMAT, this value corresponds to rowkey within azure table
    from = $("#from")
        .datepicker({
            dateFormat: 'yymmdd',
            // set this to the first day when app should start
            minDate: new Date(cameraStartedDate[0], cameraStartedDate[1] - 1, cameraStartedDate[2]), 
            // set MaxDate to current day so it can't go out of bounds
            maxDate: new Date(d.getFullYear(), d.getMonth(), d.getDate()), 
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
        // same as "from"
        maxDate: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
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
} 

// I NEED
// API HTTP request,
// Gets all cameras that are assosiated with pedestrian detection
function makeCamerasRequest() {
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

                // set default camera
                if (i == 0) {   
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

// I NEED
// API HTTP request, 
// Get the data for a specific camera from a starting date to the end date
function makeDayRangeRequest(firstValue, secondValue) {
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
    // TODO: check if response contains actual data, else print error statement
    .then(response => response.json())  
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

// I NEED
// API HTTP reguest, 
// Gets the total number of passerby and processed images for a camera
function makeTotalRequest() {
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
        // this actually checks string against word "undefined" within blob url, 
        // which means there is no image currently presented on backend side..
            if ("undefined" !== data.blobUrl) { 
                // attach new image
                document.getElementById("cameraimg").src = data.blobUrl;        
            }
            else {
                // use default image if new image is not found 
                document.getElementById("cameraimg").src = "images/demo/960x360.gif";
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

// I NEED
// Fills total cathered data
function fillTotalParagraph(data) {
// Needed with makeTotalRequest
    var paragraph = document.getElementById("displayBar");
    var objects = document.createTextNode(
        "Total number of passerby: " + data.numberOfObjects
        //JSON.stringify(data)
    );
    var pedestrians = document.createTextNode(
        "Pedestrians: " + data.numberOfPedestrians );
    var bicyclers = document.createTextNode(
        "Cyclists: " + data.numberOfBicyclers );
    var frames = document.createTextNode(
        "Pictures analyzed: " + data.numberOfFrames );
    // Creates br elements between data
    paragraph.appendChild(objects);
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(pedestrians);
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(bicyclers);
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(frames);
    paragraph.appendChild(document.createElement("br"));
}

// I NEED
// Fills wanted day range data
function fillDayRangeParagraph(data) {
    var paragraph = document.getElementById("displayBar");
    var objects = document.createTextNode(
        "Total number of passerby: " + data.numberOfObjects );
    var pedestrians = document.createTextNode(
        "Pedestrians: " + data.numberOfPedestrians );
    var bicyclers = document.createTextNode(
        "Cyclists: " + data.numberOfBicyclers );
    var frames = document.createTextNode(
        "Pictures analyzed: " + data.numberOfFrames);
    // Creates br elements between data
    paragraph.appendChild(objects);
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(pedestrians);
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(bicyclers);
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(frames);
    paragraph.appendChild(document.createElement("br"));
}
// What this does? Maybe some error thingy
function fillErrorParagraph(data) {
    var paragraph = document.getElementById("displayBar");
    var error = document.createTextNode(
        "Response: " + data.error
        //JSON.stringify(data) 
    );
    paragraph.appendChild(error);
    paragraph.appendChild(document.createElement("br"));
}

// I NEED
// Fills wanted camera details
function fillCameraDetailsParagraph(data) {
    var paragraph = document.getElementById("displayDetails");
    var cameraLocation = document.createTextNode(
        "Location: " + data.cameraLocation );
    var cameraCity = document.createTextNode(
        "City: " + data.cameraCity );
    var cameraName = document.createTextNode(
        "Name: " + data.cameraName );
    var cameraEnabled = document.createTextNode(
        "Camera is enabled: " + data.isEnabled );
    // Creates br elements between data
    paragraph.appendChild(cameraCity);
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(cameraLocation);
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(cameraEnabled);
    paragraph.appendChild(document.createElement("br"));
}

// MAYBE NEED - Not sure what this does
function setCameraStartDate(datestring) {
    var splitYearAndMonth = datestring.match(/.{1,4}/g);
    var splitMonthAndDay = splitYearAndMonth[1].match(/.{1,2}/g);
    cameraStartedDate = new Array();
    cameraStartedDate.push(parseInt(splitYearAndMonth[0]));
    cameraStartedDate.push(parseInt(splitMonthAndDay[0]));
    cameraStartedDate.push(parseInt(splitMonthAndDay[1]));
}

// MAYBE NEED - Not sure what does
// Switch cameras with select onchange
function enableCameraSelect() {
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
}

// DONT NEED
// Search button logic
function enableSearchBtn() {
    // both 'from' and 'to' values must be presented
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
// reset button logic
function enableResetBtn() {
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
}
