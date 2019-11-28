
// T‰‰ paska tuskin toimii mitenk‰‰n p‰in, k‰yt‰ vaan apikutsuja, mutta yrit‰ rakentaa ymp‰rille asiat oikein
//staattisia muuttujia, static

// --- DAYS ---

var cameraID = "";
var cameras = new Array();
//var cameraStartedDate;
var dates;

var cameraStartedDate = [19,10,01];

// StartDatePicker tuskin toimii, koska from on jQueryn? oma kalenteri juttu
// call it when camera list is available
// T‰‰ funktio etsii ensimm‰isen mahdollisen p‰iv‰n
// Miten saan t‰n funktion tiedon kalenterin ensimm‰iseksi mahdolliseksi p‰iv‰ks

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
        //from funktion arvoksi/datepickerin arvoksi pit‰‰ saada kalenterin Date[0]
        
        from = $("#from")
            .datepicker({
                dateFormat: 'yymmdd',
                // set this to the first day when app should start
                //Tee samanlainen min date kuten t‰ss‰ tehtyn‰, koska alhaalla koodissa on m‰‰ritetty kameran k‰ynnistys arvon mukaan 
                minDate: new Date(cameraStartedDate[0], cameraStartedDate[1] - 1, cameraStartedDate[2]),
                // set MaxDate to current day so it can't go out of bounds
                maxDate: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
                defaultDate: "+1w",
                changeMonth: true,
                numberOfMonths: 1
            })//T‰m‰n j‰lkeen funktio antaa optionille valitun p‰iv‰n(getDate funktio lˆytyy v‰h‰n alempaa[laittaa datepickerin arvot dateen])
            .on("change", function () {
                to.datepicker("cameraList", "minDate", getDate(this)); //cameraList vanha option
            }),
        //sama juttu ku ylemm‰ss‰ mutta date[1]
        to = $("#to").datepicker({
            dateFormat: 'yymmdd',
            minDate: new Date(cameraStartedDate[0], cameraStartedDate[1] - 1, cameraStartedDate[2]),
            // same as "from"
            maxDate: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1
        })//katso ylemm‰st‰
            .on("change", function () {
                from.datepicker("cameraList", "maxDate", getDate(this)); //cameraList vanha option
            });
    //getDate saa t‰‰ll‰ arvon mink‰ se antaa optionille, joka m‰‰ritell‰‰n datepickerin arvojen mukaan
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

// Ottaa kameran p‰‰llelaitto p‰iv‰n ja muuttaa sen muotoon jossa kalenteri ymm‰rt‰‰ sen
// T‰m‰ laitetaan kameran aikaisimmaksi StartDateksi
function setCameraStartDate(datestring) {
    var splitYearAndMonth = datestring.match(/.{1,4}/g);
    var splitMonthAndDay = splitYearAndMonth[1].match(/.{1,2}/g);
    cameraStartedDate = new Array();
    cameraStartedDate.push(parseInt(splitYearAndMonth[0]));
    cameraStartedDate.push(parseInt(splitMonthAndDay[0]));
    cameraStartedDate.push(parseInt(splitMonthAndDay[1]));
}
// END OF DAYS



// --- CAMERAS ---
// Jotta t‰‰ toimii, niin camera request tapahtuu ns. ekana koska muuten mik‰‰n muu info ei mee l‰pi

//$(document).ready(function () {
    // display the list of cameras
    //makeCamerasRequest();
//});
// API HTTP request,
// Gets all cameras that are assosiated with pedestrian detection
function makeCamerasRequest() {
    // Needed with camera details
    //alert("miksi");
    fetch('https://pedestriandetection.azurewebsites.net/api/GetCameras', {
        headers: new Headers({
            'Content-Type': 'application/json',
            'GetCameras': 'camera'
        })
    })
        .then(response => response.json())
        .then(data => {
			// this
            var select = document.getElementById("select"); // old was 'select' // cameraList
            alert (data.length );
            if ("undefined" !== typeof data && data.length && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    cameras[i] = data[i];
                    //googlaa document.element ja/tai appendchild lis‰tietoja varten ja rowkey
                    var cameraList = document.createElement("cameraList"); // vnaha option
                    cameraList.appendChild(document.createTextNode(data[i].RowKey));
                    cameraList.value = data[i].RowKey;
                    select.appendChild(cameraList);

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
// Fills wanted camera details
//document.getElementByID("location").textNode = "Location: " + data.cameralocation;
function fillCameraDetailsParagraph(data) {
    var paragraph = document.getElementById("cameraInfo"); // old displayDetails
    var cameraLocation = document.createTextNode(
        "Location: " + data.cameraLocation);
    var cameraCity = document.createTextNode(
        "City: " + data.cameraCity);
    var cameraName = document.createTextNode(
        "Name: " + data.cameraName);
    var cameraEnabled = document.createTextNode(
        "Camera is enabled: " + data.isEnabled);
    // Creates br elements between data
    paragraph.appendChild(cameraCity);
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(cameraLocation);
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(cameraEnabled);
    paragraph.appendChild(document.createElement("br"));
}

// Kun uusi kamera on valittu, tullaan tekem‰‰n t‰m‰ funktio
// t‰ytet‰‰n kameran tiedot niiden paikkoihin htmlss‰. Ylemp‰n‰ itse fillaus "fillcameradetailsparagraph"
// Switch cameras with select onchange
function enableCameraSelect() {
    document.getElementById("select").onchange = function () {
        cameraID = this.value;
        if ("undefined" !== cameraID && 0 !== cameraID.length) {
            //alert(cameras.length);
            if (Array.isArray(cameras) && cameras.length > 0) {
                for (var i = 0; i < cameras.length; i++) {
                    if (cameraID.trim() === cameras[i].RowKey.trim()) {
						// Calls the functio to clear the old info
                        clearBox("cameraInfo");
                        fillCameraDetailsParagraph(cameras[i]);
                        if (cameras[i].cameraStarted && 0 !== (cameras[i].cameraStarted).length) {
                            //alert (cameras[i].cameraStarted);
                            setCameraStartDate(cameras[i].cameraStarted);
                            //cameranStartDate()
                            resetCameraData();
                        }
                    }
                }
            }
        }
    };
}
// Clears old camerainfo data and replace it with new selected camera info
function clearBox(elementID) {
    document.getElementById(elementID).innerHTML = "";
}
// END OF CAMERAS



// --- ALL DATA ---

// API HTTP reguest, 
// Gets the total number of passerby and processed images for a camera
function makeTotalRequest() {
    //alert("miksi");
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
            alert(Date.lenght);
            if ("undefined" !== typeof data && "undefined" !== typeof data.numberOfObjects) {
                // this actually checks string against word "undefined" within blob url, 
                // which means there is no image currently presented on backend side..
                if ("undefined" !== data.blobUrl) {
                    // attach new image
                    document.getElementById("cameraImage").src = data.blobUrl; // old cameraimg
                }
                else {
                    // use default image if new image is not found 
                    document.getElementById("cameraImage").src = "images/demo/960x360.gif";
                }
                fillTotalParagraph(data);
            }
            else if ("undefined" !== typeof data && "undefined" !== typeof data.error) {
                fillErrorParagraph(data);
            }
        })
        .catch(error => alert(error))
}
// Fills total cathered data
// Voiko t‰st‰ tehd‰ itse‰‰n kutsuvan koska t‰‰ info aina n‰kyviss‰?
//document.getElementByID("location").textNode = "Location: " + data.cameralocation;
function fillTotalParagraph(data) {
    // Needed with makeTotalRequest
    var paragraph = document.getElementById("totalData"); // old displayBar
    var objects = document.createTextNode(
        "Total number of passerby: " + data.numberOfObjects
        //JSON.stringify(data)
    );
    var pedestrians = document.createTextNode(
        "Pedestrians: " + data.numberOfPedestrians);
    var bicyclers = document.createTextNode(
        "Cyclists: " + data.numberOfBicyclers);
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
//END OF ALL DATA



// --- DAY RANGE ---

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

// Fills wanted day range data
//k‰ytet‰‰n appendChildia ett‰ saadaan data toivottuihin kohtiin
//document.getElementByID("location").textNode = "Location: " + data.cameralocation;
function fillDayRangeParagraph(data) {
    var paragraph = document.getElementById("selectedDaysData"); // old displayBar
    var objects = document.createTextNode(
        "Total number of passerby: " + data.numberOfObjects);
    var pedestrians = document.createTextNode(
        "Pedestrians: " + data.numberOfPedestrians);
    var bicyclers = document.createTextNode(
        "Cyclists: " + data.numberOfBicyclers);
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
// Error message if day range data fails
function fillErrorParagraph(data) {
    var paragraph = document.getElementById("selectedDaysData"); // old displayBar
    var error = document.createTextNode(
        "Response: " + data.error
        //JSON.stringify(data) 
    );
    paragraph.appendChild(error);
    paragraph.appendChild(document.createElement("br"));
}
// END OF DAY RANGE


// P‰iv‰m‰‰r‰t kalenterista koodi

