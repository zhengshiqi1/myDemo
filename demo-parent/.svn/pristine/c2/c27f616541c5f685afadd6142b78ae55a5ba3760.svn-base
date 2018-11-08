/**
 * Created by cRazy on 2016/8/4.
 */
Ext.define('Cxt.panel.TextArea', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.textareapanel',

    requires: [
        'Ext.form.field.TextArea'
    ],

    /**
     * @cfg {Object} textareaConfig
     * 文本框的属性
     */
    textareaConfig: {},

    initComponent: function () {
        var me = this,
            textareaConfig = {
                xtype: 'textareafield',
                ui: 'plain',
                width: '100%'
            };
        Ext.apply(me, {
            bodyPadding: 5
        });
        me.callParent(arguments);


        Ext.apply(textareaConfig, me.textareaConfig);
        me.textarea = Ext.widget(textareaConfig);
        me.add(me.textarea);
    },

    getErrors: function () {
        var me = this,
            errors = [];

        Ext.Array.each(me.textarea.getErrors(), function (error) {
            var message = {
                text: error,
                source: me.textarea
            };
            if (!Ext.isEmpty(me.title)) {
                message.text = me.title + "：" + error;
            }
            errors.push(message);
        });
        return errors;
    }

});