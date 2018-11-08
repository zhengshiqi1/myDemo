Ext.ROUND_UP = 0;
Ext.ROUND_DOWN = 1;
Ext.ROUND_CEILING = 2;
Ext.ROUND_FLOOR = 3;
Ext.ROUND_HALF_UP = 4;
Ext.ROUND_HALF_DOWN = 5;
Ext.ROUND_HALF_EVEN = 6;
Ext.ROUND_UNNECESSARY = 7;

Number.prototype.toFixed = function (n) {
    if (n > 20 || n < 0) {
        throw new RangeError('toFixed() digits argument must be between 0 and 20');
    }

    var number = this,
        i;

    if (isNaN(number) || number >= Math.pow(10, 21)) {
        return number.toString();
    }
    if (typeof(n) == 'undefined' || n == 0) {
        return (Math.round(number)).toString();
    }

    var result = number.toString();
    var arr = result.split('.');

    // 整数的情况
    if (arr.length < 2) {
        result += '.';
        for (i = 0; i < n; i++) {
            result += '0';
        }
        return result;
    }

    var integer = arr[0];
    var decimal = arr[1];
    if (decimal.length == n) {
        return result;
    }
    if (decimal.length < n) {
        for (i = 0; i < n - decimal.length; i++) {
            result += '0';
        }
        return result;
    }
    result = integer + '.' + decimal.substr(0, n);

    var last = decimal.substr(n, 1);

    // 四舍五入，转换为整数再处理，避免浮点数精度的损失
    if (parseInt(last) >= 5) {
        var x = Math.pow(10, n);
        result = (parseFloat(result) * x + 1.000000001) / x; //乘法可能出现误差，用小数点后几位来去除这个误差
        result = result.toFixed(n);
    }
    return result;
};

/**
 * 精度
 * @param scale
 * 精度，若不设置，则返回精度
 * @param roundingMode
 * 与scale搭配使用，默认采用Ext.ROUND_HALF_UP
 * @returns {*}
 */
Number.prototype.scale = function (scale, roundingMode) {
    var number = this;
    if (!number)
        return 0;

    if (arguments.length === 0) {
        var s = number + '';
        s = s.split('.');
        return s[1] ? s[1].length : 0;
    }

    if (Ext.isEmpty(roundingMode)) {
        roundingMode = Ext.ROUND_HALF_UP;
    }

    number = parseFloat(number);
    scale = parseInt(scale);
    if (scale > number.scale()) {
        return number;
    }
    roundingMode = parseInt(roundingMode);

    if (roundingMode < Ext.ROUND_UP || roundingMode > Ext.ROUND_UNNECESSARY)
        Ext.raise("Invalid rounding mode");

    if (number == 0)
        return number;

    var temp = ('1' + '0'.repeat(scale)) - 0;
    if (roundingMode === Ext.ROUND_UP) {
        return Math.ceil(number * temp) / temp;
    } else if (roundingMode === Ext.ROUND_DOWN) {
        return Math.floor(number * temp) / temp;
    } else if (roundingMode === Ext.ROUND_CEILING) {
        if (number < 0) {
            return Math.floor(number * temp) / temp;
        } else {
            return Math.ceil(number * temp) / temp;
        }
    } else if (roundingMode === Ext.ROUND_FLOOR) {
        if (number > 0) {
            return Math.floor(number * temp) / temp;
        } else {
            return Math.ceil(number * temp) / temp;
        }
    } else if (roundingMode === Ext.ROUND_HALF_UP) {
        return Math.round(number * temp) / temp;
    } else if (roundingMode === Ext.ROUND_HALF_DOWN) {
        var r = number * temp;
        if (r - Math.floor(r) > 0.5) {
            return Math.floor(r + 1) / temp;
        }
        return Math.floor(r) / temp;
    } else if (roundingMode === Ext.ROUND_HALF_EVEN) {
        Ext.raise("roundingMode not supported");
    } else if (roundingMode === Ext.ROUND_UNNECESSARY) {
        return number;
    }
};

/** 加法
 * @param addend
 * 加数
 * @param scale
 * 精度
 * @param roundingMode
 */
Number.prototype.add = function (addend, scale, roundingMode) {
    var augend = this;
    if (addend == undefined) {
        addend = 0;
    }
    if (scale == undefined) {
        scale = Math.max(augend.scale(), addend.scale());
    }
    return (augend + addend).scale(scale, roundingMode);
};


/**
 * 减法
 * @param subtrahend
 * 减数
 * @param scale
 * 精度
 * @param roundingMode
 */
Number.prototype.subtract = function (subtrahend, scale, roundingMode) {
    var minuend = this;
    if (subtrahend == undefined) {
        subtrahend = 0;
    }
    if (scale == undefined) {
        scale = Math.max(minuend.scale(), subtrahend.scale());
    }
    return (minuend - subtrahend).scale(scale, roundingMode);
};

/**
 * 乘法
 * @param multiplier
 * 乘数
 * @param scale
 * 精度
 * @param roundingMode
 */
Number.prototype.multiply = function (multiplier, scale, roundingMode) {
    var multiplicand = this;
    if (multiplicand == 0 || multiplier == undefined || multiplier == 0) {
        return 0
    }

    if (scale == undefined) {
        scale = multiplicand.scale().add(multiplier.scale());
    }
    return (multiplicand * multiplier).scale(scale, roundingMode);
};

/**
 * 除法
 * @param divisor
 * 除数
 * @param scale
 * 精度
 * @param roundingMode
 */
Number.prototype.divide = function (divisor, scale, roundingMode) {
    var dividend = this;
    if (divisor == undefined) {
        divisor = 0;
    }
    if (scale == undefined) {
        return dividend / divisor
    }
    return (dividend / divisor).scale(scale, roundingMode);
};