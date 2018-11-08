/**
 * Created by cRazy on 2016/8/25.
 */Ext.define('overrides.form.field.Number', {
    override: 'Ext.form.field.Number',

    requires: [
        'Ext.form.field.Number',
        'Ext.util.Format'
    ],

    /**
     * 默认隐藏trigger
     */
    hideTrigger: true,
    maxValue: 99999999999.99999,
    minValue: -99999999999.99999,


    minText: "该输入项必须大于 {0}",
    maxText: "该输入项必须小于 {0}",

    minEqualsText: "该输入项必须大于等于 {0}",
    maxEqualsText: "该输入项必须小于等于 {0}",

    config: {

        /**
         * @cfg {boolean} maxEquals
         * 针对于maxValue的补充限定，是否允许等于最大日期。
         */
        maxEquals: true,

        /**
         * @cfg {boolean} minEquals
         * 针对于minValue的补充限定，是否允许等于最小日期。
         */
        minEquals: true
    },

    initComponent: function () {
        var me = this;

        if (me.decimalSeparator === null) {
            me.decimalSeparator = Ext.util.Format.decimalSeparator;
        }
        if (me.decimalPrecision != undefined) {
            Ext.apply(me, {
                maxValue: me.maxValue.scale(me.decimalPrecision, Ext.ROUND_DOWN),
                minValue: me.minValue.scale(me.decimalPrecision, Ext.ROUND_DOWN)
            });
        }

        Ext.form.field.Number.superclass.initComponent.call(this);

        me.setMinValue(me.minValue, me.minEquals);
        me.setMaxValue(me.maxValue, me.maxEquals);
    },


    /**
     * Replaces any existing {@link #minValue} with the new value.
     * @param {Number} value The minimum value
     * @param {boolean} minEquals 是否允许等于最小值。为设置则认为true
     */
    setMinValue: function (value, minEquals) {
        var me = this;

        me.minEquals = minEquals !== false;
        me.callParent(arguments);
    },

    /**
     * Replaces any existing {@link #maxValue} with the new value.
     * @param {Number} value The maximum value
     * @param {boolean} maxEquals 是否允许等于最大值。为设置则认为true
     */
    setMaxValue: function (value, maxEquals) {
        var me = this;

        me.maxEquals = maxEquals !== false;
        me.callParent(arguments);
    },


    /**
     * Runs all of Number's validations and returns an array of any errors. Note that this first runs Text's
     * validations, so the returned array is an amalgamation of all field errors. The additional validations run test
     * that the value is a number, and that it is within the configured min and max values.
     * @param {Object} [value] The value to get errors for (defaults to the current field value)
     * @return {String[]} All validation errors for this field
     */
    getErrors: function (value) {
        value = arguments.length > 0 ? value : this.processRawValue(this.getRawValue());

        var me = this,
            errors = Ext.form.field.Number.superclass.getErrors.call(this, value),
            format = Ext.String.format,
            num;

        if (value.length < 1) { // if it's blank and textfield didn't flag it then it's valid
            return errors;
        }

        value = String(value).replace(me.decimalSeparator, '.');

        if (isNaN(value)) {
            errors.push(format(me.nanText, value));
            return errors;
        }

        num = me.parseValue(value);

        if (me.minValue != undefined && me.minEquals === false && num <= me.minValue) {
            errors.push(format(me.minText, me.minValue));
        } else if (me.minValue != undefined && num < me.minValue) {
            errors.push(format(me.minEqualsText, me.minValue));
        }

        if (me.maxValue != undefined && me.maxEquals === false && num >= me.maxValue) {
            errors.push(format(me.maxText, me.maxValue));
        } else if (me.maxValue != undefined && num > me.maxValue) {
            errors.push(format(me.maxEqualsText, me.maxValue));
        }


        return errors;
    }
});