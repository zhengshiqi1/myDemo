/**
 * 时间控件
 * Created by cRazy on 2016/8/9.
 */
Ext.define('Cxt.form.field.Time', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.timespinnerfield',

    requires: [
        'Ext.form.field.Number'
    ],
    inputType: 'text',
    fieldLabel: '时间',
    value: null,

    initComponent: function () {
        var me = this;
        me.value = me.value || Ext.Date.format(new Date(), 'H:i:s');

        var spinnerCfg = Ext.apply({}, me.defaults, {
            readOnly: me.readOnly,
            disabled: me.disabled,
            style: 'float: left',
            listeners: {
                change: {
                    fn: me.onSpinnerChange,
                    scope: me
                }
            }
        });
        me.hoursSpinner = Ext.create('Ext.form.field.Number', Ext.apply({}, spinnerCfg, {
            hideTrigger: false,
            width: '30%',
            //          minValue: -1,
            //          maxValue: 24,
            minNum: 0,
            maxNum: 23,
            padding:'0 0 0 3px'
        }));
        me.minutesSpinner = Ext.create('Ext.form.field.Number', Ext.apply({}, spinnerCfg, {
            hideTrigger: false,
            width: '30%',
            //          minValue: -1,
            //          maxValue: 60,
            minNum: 0,
            maxNum: 59,
            padding:'0 0 0 3px'
        }));
        me.secondsSpinner = Ext.create('Ext.form.field.Number', Ext.apply({}, spinnerCfg, {
            hideTrigger: false,
            width: '30%',
            //          minValue: -1,
            //          MAXVALUE: 60,
            minNum: 0,
            maxNum: 59,
            padding:'0 0 0 3px'
        }));
        me.items = [];
        me.items.push(me.hoursSpinner, me.minutesSpinner, me.secondsSpinner);

        me.callParent(arguments);
    },

    _valueSplit: function (v) {
        if (Ext.isDate(v)) {
            v = Ext.Date.format(v, 'H:i:s');
        }
        var split = v.split(':');
        return {
            h: split.length > 0 ? split[0] : 0,
            m: split.length > 1 ? split[1] : 0,
            s: split.length > 2 ? split[2] : 0
        };
    },
    onSpinnerChange: function () {
        if (!this.rendered) {
            return;
        }
        //限制时间范围
        var args = arguments; //this, newValue, oldValue, eOpts
        args[0].setValue((args[1] > args[0].maxNum) ? args[0].minNum : args[0].value);
        args[0].setValue((args[1] < args[0].minNum) ? args[0].maxNum : args[0].value);
        this.fireEvent('change', this, this.getValue(), this.getRawValue());
    },

    getRawValue: function () {
        if (!this.rendered) {
            var date = this.value || new Date();
            return this._valueSplit(date);
        }
        else {
            return {
                h: this.hoursSpinner.getValue(),
                m: this.minutesSpinner.getValue(),
                s: this.secondsSpinner.getValue()
            };
        }
    },
    setRawValue: function (value) {
        var v = this._valueSplit(value);
        if (this.hoursSpinner) {
            this.hoursSpinner.setValue(v.h);
            this.minutesSpinner.setValue(v.m);
            this.secondsSpinner.setValue(v.s);
        }
    },

    getValue: function () {
        var v = this.getRawValue();
        return Ext.String.leftPad(v.h, 2, '0') + ':' + Ext.String.leftPad(v.m, 2, '0') + ':'
            + Ext.String.leftPad(v.s, 2, '0');
    },

    setValue: function (value) {
        this.value = Ext.isDate(value) ? Ext.Date.format(value, 'H:i:s') : value;
        if (!this.rendered) {
            return;
        }
        this.setRawValue(this.value);
        this.validate();
    },

    clearInvalid: function () {
        var me = this,
            wasDisabled = me.disabled,
            itemsToDisable, len, i;

        if (!me.preventChildDisable && !wasDisabled) {
            itemsToDisable = me.getChildItemsToDisable();
            len = itemsToDisable.length;

            for (i = 0; i < len; i++) {
                if (Ext.isFunction(itemsToDisable[i].clearInvalid)) {
                    itemsToDisable[i].clearInvalid();
                }
            }
        }
        return me;
    },

    isValid: function () {
        return true;
    },

    validate: function () {
        return this.hoursSpinner.validate() && this.minutesSpinner.validate() && this.secondsSpinner.validate();
    }
});