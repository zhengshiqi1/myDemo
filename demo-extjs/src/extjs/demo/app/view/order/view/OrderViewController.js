/**
 * Created by zhengshiqi on 2018/10/22.
 */
Ext.define('demo.view.order.view.OrderViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.demo.order.view',

    requires: [
        'Cxt.util.Window'
    ],

    //跳转搜索界面
    backToSearch: function () {
        Cxt.util.Window.moduleRedirectTo(demo.view.order.Order.moduleId, 'search');
    },

    //跳转新建页面
    onCreate: function () {
        Cxt.util.Window.moduleRedirectTo(demo.view.order.Order.moduleId, 'create');
    },
    onEdit: function () {
        var me = this,
            entity = me.getViewModel().get('entity');
        Cxt.util.Window.moduleRedirectTo(demo.view.order.Order.moduleId, 'edit', {
            uuid: entity.uuid
        });
    },

    onDelete: function () {
        var me = this;

        demo.view.order.OrderService.delete(me.getViewModel().get('entity')).then(function () {
            me.getView().loadEntity();
        });
    },

    onUndelete: function () {
        var me = this;

        demo.view.order.OrderService.undelete(me.getViewModel().get('entity')).then(function () {
            me.getView().loadEntity();
        });
    }
});