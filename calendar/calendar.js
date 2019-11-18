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
            'Kesäkuu',
            'Heinäkuu',
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
            'Kesä',
            'Heinä',
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
    });
});
