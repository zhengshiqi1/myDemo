/**
 * Creates a new array with all of the elements of this array for which
 * the provided filtering function returns a truthy value.
 *
 * @param {Array} array
 * @param {Function} fn Callback function for each item.
 * @param {Mixed} fn.item Current item.
 * @param {Number} fn.index Index of the item.
 * @param {Array} fn.array The whole array that's being iterated.
 * @param {Object} scope Callback function scope.
 * @return {Array} results
 */
Ext.Array.filter = ('filter' in Array.prototype) ? function (array, fn, scope) {
    //<debug>
    Ext.Assert.isFunction(fn,
        'Ext.Array.filter must have a filter function passed as second argument.');
    //</debug>

    return array ? array.filter(fn, scope) : array;
} : function (array, fn, scope) {
    //<debug>
    Ext.Assert.isFunction(fn,
        'Ext.Array.filter must have a filter function passed as second argument.');
    //</debug>
    array = Ext.Array.from(array);

    var results = [],
        i = 0,
        ln = array.length;

    for (; i < ln; i++) {
        if (fn.call(scope, array[i], i, array)) {
            results.push(array[i]);
        }
    }

    return results;
};

/**
 * 将数组倒序。
 */
Ext.Array.reverse = function (array) {
    if (array == undefined) {
        return array;
    }

    var i = 0,
        len = array.length,
        temp;

    for (; i < len - i; i++) {
        temp = array[len - i - 1];
        array[len - i - 1] = array[i];
        array[i] = temp;
    }
    return array;
};

/**
 * array为空时返回空
 */
Ext.Array.findBy = function (array, fn, scope) {
    if (array == undefined)
        return null;

    var i = 0,
        len = array.length;

    for (; i < len; i++) {
        if (fn.call(scope || array, array[i], i)) {
            return array[i];
        }
    }
    return null;
};

/**
 * 1、结果不为空。
 * 2、过滤空值
 * 3、不做unique处理
 */
Ext.Array.merge = function () {
    var args = Array.prototype.slice.call(arguments),
        array = [],
        i, ln;

    for (i = 0, ln = args.length; i < ln; i++) {
        if (args[i]) {
            array = array.concat(args[i]);
        }
    }

    return array;
};

/**
 * 1、结果不为空。
 * 2、过滤空值
 */
Ext.Array.union = function () {
    var args = Array.prototype.slice.call(arguments),
        array = [],
        i, ln;

    for (i = 0, ln = args.length; i < ln; i++) {
        if (args[i]) {
            array = array.concat(args[i]);
        }
    }

    return Ext.Array.unique(array);
};

/**
 *  重写数组最大值比较
 */
Ext.Array.max = function (array, comparisonFn) {
    var max = array[0],
        i, ln, item;

    for (i = 0, ln = array.length; i < ln; i++) {
        item = array[i];
        if (item == null || item == undefined)
            continue;

        if (max == null || max == undefined) {
            max = item;
            continue;
        }
        if (comparisonFn) {
            if (comparisonFn(max, item) === -1) {
                max = item;
            }
        }
        else {
            if (item > max) {
                max = item;
            }
        }
    }

    return max;
};

/**
 * 重写数组的最小值比较
 */
Ext.Array.min = function (array, comparisonFn) {
    var min = array[0],
        i, ln, item;

    for (i = 0, ln = array.length; i < ln; i++) {
        item = array[i];
        if (item == null || item == undefined)
            continue;

        if (min == null || min == undefined) {
            min = item;
            continue;
        }

        if (comparisonFn) {
            if (comparisonFn(min, item) === 1) {
                min = item;
            }
        }
        else {
            if (item < min) {
                min = item;
            }
        }
    }

    return min;
};