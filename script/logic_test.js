//toimii

var cameraID = "";
var cameras = new Array();
var cameraStartedDate = [19, 10, 01];

//function startDate

function makeCamerasRequest() {
    fetch('https://pedestriandetection.azurewebsites.net/api/GetCameras', {
        headers: new Headers({
            'Content-Type': 'application/json',
            'GetCameras': 'camera'
        })
    })
        .then(response => response.json())
        .then(data => {
            // this
            var cameraListMaker = document.getElementById("cameraListMaker"); // old was 'select'
            // alert(data.length);
            if ("undefined" !== typeof data && data.length && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    cameras[i] = data[i];
                    //googlaa document.element ja/tai appendchild ja rowkey
                    var cameraList = document.createElement("cameraList"); // vnaha option
                    cameraList.appendChild(document.createTextNode(data[i].RowKey));
                    cameraList.value = data[i].RowKey;
                    cameraListMaker.appendChild(cameraList);

                    if (i == 0) {
                        cameraID = data[i].RowKey;
                    }
                        // set default camera
                        //if (data[i].cameraStarted && 0 !== (data[i].cameraStarted).length) {
                          //  setCameraStartDate(data[i].cameraStarted);
                            //startDatePicker();
                            //enableSearchBtn();
                            //enableResetBtn();
                        //}
                        /*
                        if (cameraID && 0 !== cameraID.length) {
                            fillCameraDetailsParagraph(data[i]);
                            makeTotalRequest();
                        }*/
                    }
                }
                // enableCameraSelect();
            })
        .catch(error => alert(error)
}

//toimii
function jonnanDatePikcer(date1, date2) {
    var startdate = date1;
    var enddate = date2;
    var dateformat = "yymmdd";
    if (startdate != null && enddate != null) {
        //pyydäKameraltaNämäPäivät(startdate.format(dateformat), enddate.format(dateformat));
        var elementInHTML = document.getElementById("selectedDaysData");
        elementInHTML.innerHTML = startdate.format('DD.MM.YYYY') + " to " + enddate.format('DD.MM.YYYY');
        //elementInHTML.innerHTML += päivienTiedot;
    }
    else {
        var elementInHTML = document.getElementById("selectedDaysData");
        elementInHTML.innerHTML = startdate.format('DD.MM.YYYY');
    }
}
    //function pyydäKameraltaNämäPäivät(startdate, enddate) {
    //Apikutsu, joka antaa kameroiden tiedot näiltä päiviltä
    //printtiävarten(apikutsuntiedot);
    //}

    //function printtiävarten(päiviltäSaatuData){
    //var printattavaData = päiviltäSaatuData;
    //var elementInHTML = document.getElementById("selectedDaysData");
    //elementInHTML.innerHTML = printattavaData;
    //}