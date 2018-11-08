Ext.util.Format.permilSign = '‰';

Ext.util.Format.percentRenderer = function (formatString) {
    return function (v) {
        return Ext.util.Format.percent(v, formatString);
    };
};

Ext.util.Format.permil = function (value, formatString) {
    return Ext.util.Format.number(value * 1000, formatString || '0') + Ext.util.Format.permilSign;
};

Ext.util.Format.permilRenderer = function () {
    return function (v) {
        return Ext.util.Format.permil(v);
    };
};


Ext.util.Format.date = function (v, format) {
    var vDate = v;
    if (!v || v.valueOf() == 'NaN' || v.toString() == 'Invalid Date') {
        return "";
    }
    if (!Ext.isDate(v)) {
        vDate = new Date(Date.parse(v));
    }
    if (vDate.toDateString() == 'Invalid Date') {
        vDate = new Date(Ext.Date.parse(v));
        if (vDate.toDateString() == 'Invalid Date') {
            return "";
        }
    }
    return Ext.Date.dateFormat(vDate, format || Ext.Date.defaultFormat);
};