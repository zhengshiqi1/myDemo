/**
 * 年月选择框
 * Created by cRazy on 2016/9/20.
 */
Ext.define('Cxt.form.field.YearMonth', {
    extend: 'Ext.form.field.Picker',
    alias: 'widget.monthfield',

    requires: [
        'Ext.form.field.Picker',
        'Ext.picker.Month',
        'Ext.util.Format'
    ],

    triggers: {
        clear: {
            id: 'clear',
            cls: 'fa fa-times-circle',
            weight: -1,
            handler: 'clearValue',
            scope: 'this'
        },
        picker: {
            cls: Ext.baseCSSPrefix + 'form-date-trigger',
            handler: 'onTriggerClick',
            scope: 'this'
        }
    },

    config: {
        /**
         * @cfg {boolean} monthSelectable
         * 月份选择
         *
         */
        monthSelectable: true,

        /**
         * @cfg {String} month
         * 月份
         */
        month: undefined,

        /**
         * @cfg {String} year
         * 年份
         */
        year: undefined
    },

    /**
     * @cfg {String} value
     * 年月
     */

    /**
     * @cfg {String} rawValue
     * 显示文本
     */

    /**
     * @cfg {String} formatTpl
     * 显示格式，
     */

    /**
     * @cfg {String} clearable
     * 可清空，
     */

    /**
     * @cfg {Date/String} minValue
     * The minimum allowed date. Can be either a Javascript date object or a string date in a valid format.
     */
    /**
     * @cfg {Date/String} maxValue
     * The maximum allowed date. Can be either a Javascript date object or a string date in a valid format.
     */

    /**
     * @cfg {String} [triggerCls='x-form-date-trigger']
     * An additional CSS class used to style the trigger button. The trigger will always get the class 'x-form-trigger'
     * and triggerCls will be **appended** if specified (default class displays a calendar icon).
     */
    triggerCls: Ext.baseCSSPrefix + 'form-date-trigger',

    matchFieldWidth: false,

    editable: false,

    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },

    afterRender: function () {
        var me = this;
        me.callParent(arguments);

        me.getTrigger('clear').setVisible(me.clearable);

        if (!me.monthSelectable) {
            me.setMonthSelectable(me.monthSelectable);
        }
    },

    createPicker: function () {
        var me = this,
            picker;

        // Create floating Picker BoundList. It will acquire a floatParent by looking up
        // its ancestor hierarchy (Pickers use their pickerField property as an upward link)
        // for a floating component.
        picker = Ext.widget({
            xtype: 'monthpicker',
            // We need to set the ownerCmp so that owns() can correctly
            // match up the component hierarchy so that focus does not leave
            // an owning picker field if/when this gets focus.
            ownerCmp: me,
            floating: true,
            padding: me.padding,
            shadow: false,
            monthSelectable: me.monthSelectable,
            listeners: {
                cancelclick: me.onCancelClick,
                okclick: me.onOkClick,
                yeardblclick: me.onOkClick,
                monthdblclick: me.onOkClick,
                scope: me
            }
        });

        return picker;
    },

    // When focus leaves the picker component, if it's to outside of this
    // Component's hierarchy
    onFocusLeave: function (e) {
        var me = this;
        // me.callParent(arguments); // 取消动作，使下拉不收回
    },

    onExpand: function () {
        var me = this,
            value;
        if (me.getValue()) {
            value = Ext.Date.parse(me.getValue(), 'Ym');
        } else {
            value = new Date();
        }

        me.getPicker().setValue(value);
    },

    getValue: function () {
        var me = this,
            year = me.year ? me.year : '',
            month = me.month ? me.month : '';
        return year + '' + month;
    },

    /**
     * Sets a data value into the field and runs the change detection and validation. Also applies any configured
     * {@link #emptyText} for text fields. To set the value directly without these inspections see {@link #setRawValue}.
     * @param value
     *  设置为日期或者格式文本
     * @return {Ext.form.field.Text} this
     */
    setValue: function (value) {
        var me = this;

        try {
            value = Ext.Data.parse(value, 'Ym');
            me.year = Ext.util.Format.date(value, 'Y');
            me.month = Ext.util.Format.date(value, 'm');
        } catch (e) {
        }
        me.refreshDisplay();
    },

    clearValue: function () {

    },

    setYear: function (year) {
        var me = this;
        if (me.year == year)
            return;

        me.year = year;
        me.refreshDisplay();
        if (me.rendered && !me.getErrors().length) {
            me.publishState('year', year);
        }
    },

    setMonth: function (month) {
        var me = this;
        if (me.month == month)
            return;

        me.month = month;
        if (me.month) {// 月份补零
            me.month = Ext.String.leftPad(me.month, 2, '0');
        }
        me.refreshDisplay();
        if (me.rendered && !me.getErrors().length) {
            me.publishState('month', month);
        }
    },

    setMonthSelectable: function (monthSelectable) {
        var me = this;
        if (me.monthSelectable == monthSelectable)
            return;

        me.monthSelectable = monthSelectable;

        if (me.formatTpl) {
            me.formatTpl.destroy();
            delete me.formatTpl;
        }
        if (me.getValue()) {
            me.refreshDisplay();
        }
        if (me.rendered && me.picker) {
            me.picker.destroy();
            delete me.picker;
        }
    },

    /**
     * Respond to an ok click on the month picker
     * @private
     */
    onOkClick: function (picker, value) {
        var me = this;
        me.setMonth(value[0] + 1);
        me.setYear(value[1]);
        if (me.rendered && !me.getErrors().length) {
            me.publishState('value', me.getValue());
        }
        me.fireEvent('select', me, me.getValue(), me.getYear(), me.getMonth());
        me.collapse();
    },

    /**
     *  刷新显示文本
     */
    refreshDisplay: function () {
        var me = this,
            rawValue = me.getFormatTpl().apply({
                year: me.year ? me.year : ' ',
                month: me.month ? me.month : ' '
            });
        me.setRawValue(rawValue);
        if (me.rendered && !me.getErrors().length) {
            me.publishState('rawValue', rawValue);
        }
    },

    getFormatTpl: function () {
        var me = this;

        if (!me.formatTpl) {
            if (!me.monthSelectable) {
                me.formatTpl = '{year}年';
            } else {
                me.formatTpl = '{year}年{month}月';
            }
        }
        if (!me.formatTpl.isTemplate) {
            me.formatTpl = this.getTpl('formatTpl');
        }
        return me.formatTpl;
    },

    /**
     * Respond to a cancel click on the month picker
     * @private
     */
    onCancelClick: function () {
        var me = this;
        me.collapse();
    },

    getErrors: function (text) {
        var me = this,
            errors = me.callParent(arguments),
            rawValue;

        if (!Ext.isEmpty(text)) {
            try {
                rawValue = me.getFormatTpl().apply({
                    year: me.year ? me.year : ' ',
                    month: me.month ? me.month : ' '
                });
            } catch (e) {
            }
            if (rawValue != text) {
                errors.push(text + ' 是无效的格式 - 必须符合格式Ym');
            }
        }

        return errors;

    }
});