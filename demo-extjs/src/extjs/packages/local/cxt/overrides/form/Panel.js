/**
 * 为设置了必填的表单字段，添加<span style='color: red'>*</span>。
 * Created by cRazy on 2016/8/26.
 */
Ext.define('overrides.form.Panel', {
    override: 'Ext.form.Panel',

    requires: [
        'Ext.form.field.Display',
        'Ext.layout.container.Column'
    ],

    ui: 'form',
    width: '100%',
    layout: 'column',
    bodyPadding: 10,

    initComponent: function () {
        var me = this;

        Ext.Array.each(me.items, function (item) {
            Ext.applyIf(item, {
                columnWidth: .33,
                labelAlign: 'right',
                margin: 3,
                showTip: true,
                xtype: 'displayfield'
            });
        });
        me.callParent(arguments);
    }
});