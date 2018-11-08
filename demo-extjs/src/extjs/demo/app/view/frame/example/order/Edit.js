/**
 * Created by cRazy on 2016/10/11.
 */
Ext.define('demo.view.frame.example.order.Edit', {
    extend: 'demo.view.frame.example.order.Create',
    xtype: 'demo.example.order.edit',

    ui: 'frame',

    viewModel: {},

    module: {
        caption: '订单'
    },

    titlebar: {
        xtype: 'toolbar',

        height: 45,
        width: '100%',
        style: 'background-color: white',
        defaults: {
            scale: 'medium'
        },
        items: [{
            xtype: 'button',
            text: '返回列表',
            ui: 'bulge',
            iconCls: 'fa fa-level-up fa-flip-horizontal',
            handler: function () {
                Cxt.util.Window.moduleRedirectTo(demo.view.order.Order.moduleId, 'search');
            }
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'label',
            width: 80,
            cls: 'cre-state-available',
            text: '未提交'
        }, {
            xtype: 'label',
            width: 320,
            cls: 'topTitle',
            text: '订单：10000000000'
        }, {
            xtype: 'tbfill'
        }],
    }
});