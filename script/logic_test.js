function makeCamerasRequest() {
    alert("miksi");
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
            alert(data.length);
            if ("undefined" !== typeof data && data.length && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    cameras[i] = data[i];
                    //googlaa document.element ja/tai appendchild lisätietoja varten ja rowkey
                    var cameraList = document.createElement("cameraList"); // vnaha option
                    cameraList.appendChild(document.createTextNode(data[i].RowKey));
                    cameraList.value = data[i].RowKey;
                    cameraListMaker.appendChild(cameraList);

                    if (i == 0) {
                        cameraID = data[i].RowKey;
                    }
                        /* set default camera
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
                    }*/
                }
                // enableCameraSelect();
            }
        })
        .catch(error => alert(error))
}