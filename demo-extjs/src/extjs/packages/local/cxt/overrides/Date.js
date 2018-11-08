Ext.Date.defaultFormat = 'Y-m-d';

/**
 *  增加空值处理
 */
Ext.Date.add = function (date, interval, value) {
    if (!date)
        return date;

    var d = Ext.Date.clone(date),
        day, decimalValue, base = 0;
    if (!interval || value === 0) {
        return d;
    }

    decimalValue = value - parseInt(value, 10);
    value = parseInt(value, 10);

    if (value) {
        switch (interval.toLowerCase()) {
            // See EXTJSIV-7418. We use setTime() here to deal with issues related to
            // the switchover that occurs when changing to daylight savings and vice
            // versa. setTime() handles this correctly where setHour/Minute/Second/Millisecond
            // do not. Let's assume the DST change occurs at 2am and we're incrementing using add
            // for 15 minutes at time. When entering DST, we should see:
            // 01:30am
            // 01:45am
            // 03:00am // skip 2am because the hour does not exist
            // ...
            // Similarly, leaving DST, we should see:
            // 01:30am
            // 01:45am
            // 01:00am // repeat 1am because that's the change over
            // 01:30am
            // 01:45am
            // 02:00am
            // ....
            //
            case Ext.Date.MILLI:
                d.setTime(d.getTime() + value);
                break;
            case Ext.Date.SECOND:
                d.setTime(d.getTime() + value * 1000);
                break;
            case Ext.Date.MINUTE:
                d.setTime(d.getTime() + value * 60 * 1000);
                break;
            case Ext.Date.HOUR:
                d.setTime(d.getTime() + value * 60 * 60 * 1000);
                break;
            case Ext.Date.DAY:
                d.setDate(d.getDate() + value);
                break;
            case Ext.Date.MONTH:
                day = date.getDate();
                if (day > 28) {
                    day = Math.min(day, Ext.Date.getLastDateOfMonth(Ext.Date.add(Ext.Date.getFirstDateOfMonth(date), Ext.Date.MONTH, value)).getDate());
                }
                d.setDate(day);
                d.setMonth(date.getMonth() + value);
                break;
            case Ext.Date.YEAR:
                day = date.getDate();
                if (day > 28) {
                    day = Math.min(day, Ext.Date.getLastDateOfMonth(Ext.Date.add(Ext.Date.getFirstDateOfMonth(date), Ext.Date.YEAR, value)).getDate());
                }
                d.setDate(day);
                d.setFullYear(date.getFullYear() + value);
                break;
        }
    }

    if (decimalValue) {
        switch (interval.toLowerCase()) {
            case Ext.Date.MILLI:
                base = 1;
                break;
            case Ext.Date.SECOND:
                base = 1000;
                break;
            case Ext.Date.MINUTE:
                base = 1000 * 60;
                break;
            case Ext.Date.HOUR:
                base = 1000 * 60 * 60;
                break;
            case Ext.Date.DAY:
                base = 1000 * 60 * 60 * 24;
                break;

            case Ext.Date.MONTH:
                day = Ext.Date.getDaysInMonth(d);
                base = 1000 * 60 * 60 * 24 * day;
                break;

            case Ext.Date.YEAR:
                day = (Ext.Date.isLeapYear(d) ? 366 : 365);
                base = 1000 * 60 * 60 * 24 * day;
                break;
        }
        if (base) {
            d.setTime(d.getTime() + base * decimalValue);
        }
    }

    return d;
};

Ext.Date.clearTime = function (date, clone) {
    if (!date)
        return date;

    if (clone) {
        return Ext.Date.clearTime(Ext.Date.clone(date));
    }

    // get current date before clearing time
    var d = date.getDate(),
        hr,
        c;

    // clear time
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    if (date.getDate() !== d) { // account for DST (i.e. day of month changed when setting hour = 0)
        // note: DST adjustments are assumed to occur in multiples of 1 hour (this is almost always the case)
        // refer to http://www.timeanddate.com/time/aboutdst.html for the (rare) exceptions to this rule

        // increment hour until cloned date == current date
        for (hr = 1, c = Ext.Date.add(date, Ext.Date.HOUR, hr); c.getDate() !== d; hr++, c = Ext.Date.add(date, Ext.Date.HOUR, hr));

        date.setDate(d);
        date.setHours(c.getHours());
    }

    return date;
};

/**
 * 增加空值处理。input为空时，返回空。
 * 增加Date类型处理。input为Date时，直接返回
 */
Ext.Date.parse = function (input, format, strict) {
    if (Ext.isEmpty(input)) {
        return input;
    }
    if (input instanceof Date)
        return input;

    var p = Ext.Date.parseFunctions;
    if (p[format] == null) {
        Ext.Date.createParser(format);
    }
    return p[format].call(Ext.Date, input, Ext.isDefined(strict) ? strict : Ext.Date.useStrict);
};

/**
 * Checks if a date falls on or between the given start and end dates.
 * @param {Date/String} date The date to check
 * @param {Date/String} start Start date
 * @param {Date/String} end End date
 * @param {String} format 格式化，如果输入日期为字符串，可以先进行格式化后再比较
 * @return {Boolean} `true` if this date falls on or between the given start and end dates.
 */
Ext.Date.between = function (date, start, end, format) {
    if (!date) {
        return false;
    }
    if (!!format) {
        date = Ext.Date.parse(date, format);
        start = Ext.Date.parse(start, format);
        end = Ext.Date.parse(end, format);
    }

    var t = date.getTime();
    if (!!start && start.getTime() > t) {
        return false;
    }
    if (!!end && t > end.getTime()) {
        return false;
    }
    return true;
};