
$(function () {
    $('#wrapper .version strong').text('v' + $.fn.pignoseCalendar.ComponentVersion);
    function onClickHandler(date, obj) {
        /**
         * @date is an array which be included dates(clicked date at first index)
         * @obj is an object which stored calendar interal data.
         * @obj.calendar is an element reference.
         * @obj.storage.activeDates is all toggled data, If you use toggle type calendar.
         * @obj.storage.events is all events associated to this date
         */
        var $calendar = obj.calendar;
        var $box = $calendar.parent().siblings('.box').show();
        var text = 'You choose date ';
        if (date[0] !== null) {
            text += date[0].format('YYYY-MM-DD');
        }
        if (date[0] !== null && date[1] !== null) {
            text += ' ~ ';
        } else if (date[0] === null && date[1] == null) {
            text += 'nothing';
        }
        if (date[1] !== null) {
            text += date[1].format('YYYY-MM-DD');
        }
        $box.text(text);
    }
})



$(function () {
    $('.calendar').pignoseCalendar({
        maxDate: moment(), //sets that user can't select future days
        minDate: '2019-10-12', //sets earlies day user can select
        multiple: true, // enables the range selection
        format: 'YYYY-MM-DD',
        // selectOver: true,
        select: onClickHandler,
        theme: 'custom', // light, dark, custom
        week: 1, // first day of the week, 0 = sunday - 6 = saturday
        // buttons: true,

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
