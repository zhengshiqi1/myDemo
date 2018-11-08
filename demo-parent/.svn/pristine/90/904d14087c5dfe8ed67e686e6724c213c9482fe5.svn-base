/**
 * 日期范围控件
 * Created by cRazy on 2016/8/26.
 */
Ext.define('Cxt.form.field.DateRange', {
    extend: 'Ext.form.FieldContainer',
    xtype: 'daterangefield',

    requires: [
        'Ext.form.field.Date',
        'Ext.form.field.Display',
        'Ext.layout.container.HBox'
    ],

    width: '100%',
    layout: 'hbox',

    config: {

        /**
         * @cfg {Date} beginDate
         * 起始日期
         */
        beginDate: undefined,

        /**
         * @cfg {Date} endDate
         * 截止日期
         */
        endDate: undefined
    },

    /**
     * @cfg {Object} beginConfig
     * 起始日期的绑定
     */

    /**
     * @cfg {Object} endConfig
     * 截止日期的绑定
     */

    /**
     * @private
     */
    initComponent: function () {
        var me = this;

        me.beginDateField = Ext.create(Ext.apply({
            xtype: 'datefield',
            flex: 1
        }, me.beginConfig));
        me.dateSeparator = Ext.create({
            xtype: 'displayfield',
            value: '&nbsp;至&nbsp;',
            showTip: false
        });
        me.endDateField = Ext.create(Ext.apply({
            xtype: 'datefield',
            flex: 1,
            validator: function (value) {
                var beginDate = me.beginDateField.getValue(),
                    endDate = me.endDateField.parseDate(value);
                if (Ext.isDate(endDate) && Ext.isDate(beginDate) && endDate < beginDate) {
                    return '该输入项不能小于起始值';
                }
                return true;
            }
        }, me.endConfig));

        Ext.apply(me, {
            items: [me.beginDateField, me.dateSeparator, me.endDateField]
        });

        me.callParent(arguments);
    },

    afterRender: function () {
        var me = this;
        me.callParent(arguments);
        me.beginFieldListeners = me.beginDateField.on({
            destroyable: true,
            blur: function (item) {
                me.setBeginDate(Ext.isDate(item.getValue()) ? item.getValue() : null);
                me.fireEvent('blur', me);
            },
            change: function (c, value) {
                if (Ext.isDate(me.getEndDate())) {
                    me.endDateField.validate();
                }
            }
        });

        me.endFieldListeners = me.endDateField.on({
            destroyable: true,
            blur: function (item) {
                me.setEndDate(Ext.isDate(item.getValue()) ? item.getValue() : null);
                me.fireEvent('blur', me);
            },
            change: function (c, value) {
                // me.setEndDate(Ext.isDate(value) ? value : null);
            }
        });

        me.setValue(me.getValue());
    },

    /**
     * Returns the raw String value of the field,
     */
    getRawValue: function () {
        var me = this;
        return me.valueToRaw(me.getValue());
    },

    getValue: function () {
        var me = this;
        return me.value;
    },

    /**
     * Sets the field's raw value directly
     */
    setRawValue: function (rawValue) {
        var me = this;
        rawValue = Ext.valueFrom(rawValue, '');

        if (rawValue === me.getRawValue()) {
            me.doSetValue(me.rawToValue(rawValue));

            if (me.rendered && me.reference) {
                me.publishState('rawValue', value);
            }
        }

        return rawValue;
    },

    setValue: function (value) {
        var me = this;
        value = Ext.valueFrom(value, {});
        if (value === me.value)
            return;
        me.value = value;
        me.doSetValue(value);

        if (me.rendered) {
            me.publishState('value', value);
        }
    },

    /**
     * @private
     */
    doSetValue: function (value) {
        var me = this;
        value = Ext.valueFrom(value, {});

        me.beginDateField.setValue(value.beginDate);
        me.endDateField.setValue(value.endDate);
    },

    updateBeginDate: function (beginDate, old) {
        var me = this;
        if (beginDate === old)
            return;

        me.setValue(Ext.apply({}, {
            beginDate: beginDate
        }, me.getValue()));

        if (me.rendered) {
            me.publishState('beginDate', beginDate);
        }
    },

    updateEndDate: function (endDate, old) {
        var me = this;
        if (endDate === old)
            return;

        me.setValue(Ext.apply({}, {
            endDate: endDate
        }, me.getValue()));

        if (me.rendered) {
            me.publishState('endDate', endDate);
        }
    },

    valueToRaw: function (value) {
        var me = this,
            rawValue = "";
        if (!value.beginDate && !value.endDate)
            return rawValue;

        value = Ext.valueFrom(value, {});
        if (value.beginDate) {
            rawValue += me.beginDateField.formatDate(value.beginDate);
        }
        rawValue += '～';
        if (value.endDate) {
            rawValue += me.endDateField.formatDate(value.endDate);
        }
        return rawValue;
    },

    rawToValue: function (rawValue) {
        var me = this,
            dates;
        rawValue = Ext.valueFrom(rawValue, '');
        dates = rawValue.split('～');

        return {
            beginDate: me.beginDateField.parseDate(dates[0]),
            endDate: me.endDateField.parseDate(dates[1])
        };
    },

    /**
     * @private
     * @inheritdoc
     */
    beforeDestroy: function () {
        var me = this;

        if (me.rendered) {
            delete me.beginConfig;
            Ext.destroy(
                me.beginDateField,
                me.beginFieldListeners,
                me.dateSeparator,
                me.endDateField,
                me.endFieldListeners
            );
            delete me.endConfig;
        }
        me.callParent(arguments);
    }
});