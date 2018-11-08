/**
 * Created by lzy on 2016/10/14.
 */
Ext.define('Cxt.form.field.NumberRange', {
    extend: 'Ext.form.FieldContainer',
    xtype: 'numberrangefield',

    requires: [
        'Ext.form.field.Number',
        'Ext.layout.container.Column'
    ],

    layout: 'column',

    config: {
        /**
         * @cfg {number} begin
         * 起始值
         */
        begin: undefined,

        /**
         * @cfg {Object[]} end
         * 截止至
         */
        end: undefined
    },

    /**
     * @cfg {String} beginParam
     */
    beginParam: 'begin',

    /**
     * @cfg {String} endParam
     */
    endParam: 'end',

    /**
     * @cfg {Object} beginConfig
     * 起始配置
     */
    beginConfig: undefined,

    /**
     * @cfg {Object} endConfig
     * 截止配置
     */
    endConfig: undefined,

    initComponent: function () {
        var me = this,
            items = [];

        items.push(Ext.apply({
            columnWidth: 0.5,
            xtype: 'numberfield',
            itemId: 'begin',
            fieldCaption: me.fieldLabel + '起始',
            listeners: {
                change: function (field, newValue) {
                    me.begin = newValue;
                    me.down('#end').validate();
                    if (me.rendered && !me.getErrors().length) {
                        me.fireEvent('change', me, me.getValue());
                        me.publishState('begin', newValue);
                        me.publishState('value', me.getValue());
                    }
                },
                blur: function (e) {
                    me.fireEvent('blur', me, e);
                }
            }
        }, me.beginConfig, me.defaults));

        items.push({
            html: '<a style="margin: 8px;line-height:23px"> 至 </a>'
        });

        items.push(Ext.apply({
            columnWidth: 0.5,
            xtype: 'numberfield',
            itemId: 'end',
            fieldCaption: me.fieldLabel + '截止',
            validator: function (val) {
                var begin = me.down('#begin').getValue();
                if (begin && val && val < begin) {
                    return '起始值不能大于截止值';
                }
                return true;
            },
            listeners: {
                change: function (field, newValue) {
                    me.end = newValue;
                    if (me.rendered && !me.getErrors().length) {
                        me.fireEvent('change', me, me.getValue());
                        me.publishState('end', newValue);
                        me.publishState('value', me.getValue());
                    }
                },
                blur: function (e) {
                    me.fireEvent('blur', me, e);
                }
            }
        }, me.endConfig, me.defaults));

        Ext.apply(me, {
            items: items
        });
        me.callParent();
    },

    getValue: function () {
        var me = this,
            value = {};

        value[me.beginParam] = me.down('#begin').getValue();
        value[me.endParam] = me.down('#end').getValue();

        return me.value = value;
    },

    setValue: function (value) {
        var me = this;
        me.value = value;

        if (value) {
            me.setBegin(value[me.beginParam]);
            me.setEnd(value[me.endParam]);
        } else {
            me.setBegin();
            me.setEnd();
        }
    },

    /**
     * @private
     */
    doSetValue: function (value) {
        var me = this;
        value = Ext.valueFrom(value, {});

        me.down('#begin').setValue(value.begin);
        me.down('#end').setValue(value.end);
    },

    setBegin: function (begin) {
        var me = this;
        if (me.begin == begin)
            return;
        me.begin = begin;
        me.down('#begin').setValue(begin);
    },

    setEnd: function (end) {
        var me = this;
        if (me.end == end)
            return;
        me.end = end;
        me.down('#end').setValue(end);
    },

    clearValue: function () {
        var me = this;
        me.setValue();
    },

    getRawValue: function () {
        var me = this;
        return me.valueToRaw(me.getValue());
    },

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

    valueToRaw: function (value) {
        var rawValue = "";
        if (!value.begin && !value.end)
            return rawValue;

        value = Ext.valueFrom(value, {});
        if (value.begin) {
            rawValue += value.begin;
        }
        rawValue += '～';
        if (value.end) {
            rawValue += value.end;
        }
        return rawValue;
    },

    rawToValue: function (rawValue) {
        var value;
        rawValue = Ext.valueFrom(rawValue, '');
        value = rawValue.split('～');

        return {
            begin: value[0],
            end: value[1]
        };
    }
});