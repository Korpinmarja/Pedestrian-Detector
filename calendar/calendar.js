//var dates;
//dates =
    $(function () {
    $('.calendar').pignoseCalendar({
     // sets that user can't select future days
        maxDate: moment(), 
     // sets earlies day user can select
        minDate: '2019-10-12', 
     // enables the range selection
        multiple: true, 
        format: 'YY-MM-DD',
     // light, dark, custom
        theme: 'custom',
     // first day of the week, 0 = sunday - 6 = saturday
        week: 1, 
     // Prints the selected days to the console
        select: function (date, context) {
            var $this = $(this);
            console.log(date[0], date[1])
            //return (startDate, endDate);
            //function daterangerequest(startdate, enddate) {
                //t‰h‰n tulee funktio joka valittujen p‰ivien sis‰ll‰ ottaa dataa
            //};
            //Saattaa olla ettei toimi, kutsu funktiota normaalisti ja syˆt‰ sille arvot
            //daterangerequest(startDate,endDate);
            //makeDayRangeRequest funktiokutsu pit‰‰ lis‰t‰ t‰h‰n jotta kamera tiet‰‰ halutut p‰iv‰t ja antaa informaation sen mukaan.
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
        }
        //make total request funktio kutsu t‰h‰n kohtaan, jotta koko kalenteri on varmasti ladannut
        //printataan johonkin elementtiin sivustolla
        //k‰ytet‰‰n appendChildia ett‰ saadaan data toivottuihin kohtiin
    });
});
