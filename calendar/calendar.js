//var dates;
//dates =
    $(function () {
    $('.calendar').pignoseCalendar({
     // sets that user can't select future days
        maxDate: moment(), 
     // sets earlies day user can select

        //min daten sis‰lle pit‰‰ tehd‰ functiokutsu, joka hakee function enableCameraSelect sis‰lt‰ valitun kameran startdaten
        //Joka haetaan azuren kautta. Azuresta haettujen tietojen j‰lkeen kameroilta voidaan pyyt‰‰ dataa luokkaa camera[i].cameraStarted

     // minDate: function(){
     // cameraStartDate = cameranStartDate();
     // return camestartdate;
     // ,  // voinko jotenkin vaan saada t‰h‰n arvon jonka startDatePicker tekee? Rikkoo n‰in kalenterin

     // enables the range selection
        multiple: true, 
        format: 'YY-MM-DD',
     // light, dark, custom
        theme: 'custom',
     // first day of the week, 0 = sunday - 6 = saturday
        week: 1, 

     // Prints the selected days to the console
        select: function (date, context) {
            //var $this = $(this);
            console.log(date[0], date[1]);
            jonnanDatePikcer(date[0], date[1]);
            //return (startDate, endDate);
            //function daterangerequest(startdate, enddate) {
                //t‰h‰n tulee funktio joka valittujen p‰ivien sis‰ll‰ ottaa dataa
            //};
            //Saattaa olla ettei toimi, kutsutaan funktio normaalisti ja syˆt‰ arvot
            //daterangerequest(startDate,endDate);
            //makeDayRangeRequest funktiokutsu pit‰‰ lis‰t‰ t‰h‰n jotta kamera tiet‰‰ halutut p‰iv‰t ja antaa informaation sen mukaan
        },


        // Custom language back, do we even need this?
        weeks: [
            'Su',
            'Ma',
            'Ti',
            'Ke',
            'To',
            'Pe',
            'La'
        ],
        monthsLong: [
            'Tammikuu',
            'Helmikuu',
            'Maaliskuu',
            'Huhtikuu',
            'Toukokuu',
            'Kes‰kuu',
            'Hein‰kuu',
            'Elokuu',
            'Syyskuu',
            'Lokakuu',
            'Marraskuu',
            'Joulukuu'
        ],
        months: [
            'Tammi',
            'Helmi',
            'Maalis',
            'Huhti',
            'Touko',
            'Kes‰',
            'Hein‰',
            'Elo',
            'Syys',
            'Loka',
            'Marras',
            'Joulu'
        ],
        controls: {
            ok: 'OK',
            cancel: 'Peruuta'
        },

        // Toimisko t‰‰ vaan n‰in? Rikkoo kalenterin atm


        //make total request funktio vasta loppuun, jotta koko kalenteri on varmasti ladannut
        
        // Miten teen sen ett‰ kun vaihtaa kalenterissa p‰ivi‰ niin saan oikeet infot? 
        });//T‰h‰n loppuu varsinainen KALENTERI, jonka sis‰ll‰ on pari aluetta mihin voit laittaa koodia, mm. select functio
        
});
makeCamerasRequest()
makeTotalRequest();
