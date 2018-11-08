/**
 * Created by libin on 2016/9/1.
 */
Ext.define('demo.view.product.view.ProductViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.demo.product.view',

    requires: [
        'Cxt.util.Window'
    ],

    backToSearch: function () {
        Cxt.util.Window.moduleRedirectTo(demo.view.product.Product.moduleId, 'search');
    },

    onCreate: function () {
        Cxt.util.Window.moduleRedirectTo(demo.view.product.Product.moduleId, 'create');
    },

    onEdit: function () {
        var me = this,
            entity = me.getViewModel().get('entity');
        Cxt.util.Window.moduleRedirectTo(demo.view.product.Product.moduleId, 'edit', {
            uuid: entity.uuid
        });
    },

    onDelete: function () {
        var me = this;

        demo.view.product.ProductService['delete'](me.getViewModel().get('entity')).then(function () {
            me.getView().loadEntity();
        });
    },

    onUndelete: function () {
        var me = this;

        demo.view.product.ProductService.undelete(me.getViewModel().get('entity')).then(function () {
            me.getView().loadEntity();
        });
    }
});