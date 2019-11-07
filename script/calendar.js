$(function () {
    $('.calendar').pignoseCalendar({
        maxDate: moment(), //sets that user can't select future days
        minDate: '2019-10-12', //sets earlies day user can select
        multiple: true, // enables the range selection
        theme: 'custom', // light, dark, custom
        week: 1, // first day of the week, 0 = sunday - 6 = saturday
        // buttons: true,
        // Custom language back
        // This works
        weeks: [
            'Su',
            'Ma',
            'Ti',
            'Ke',
            'To',
            'Pe',
            'La'
        ],
        // This doesn't work WHY!?!?!?!?
        monthLong: [
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
        // Not sure if this works...
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