$(function () {
    $('.calendar').pignoseCalendar({
        multiple: true, // enables the range selection
        theme: 'custom', // light, dark, custom
        week: 1, // first day of the week, 0 = sunday - 6 = saturday
        format: 'YYYY-MM-DD',

        // Custom language back
        weeks: [
            'Su',
            'Ma',
            'Ti',
            'Ke',
            'To',
            'Pe',
            'La'
        ],
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