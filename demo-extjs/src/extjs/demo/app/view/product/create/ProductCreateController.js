/**
 * Created by libin on 2016/9/1.
 */
Ext.define('demo.view.product.create.ProductCreateController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.demo.product.create',

    requires: [
        'Cxt.util.Window'
    ],

    backToSearch: function () {
        Cxt.util.Window.moduleRedirectTo(demo.view.product.Product.moduleId, 'search');
    },

    onSave: function () {
        var me = this,
            entity = me.getView().getViewModel().get('entity');

        if (!me.getView().isValid()) {
            return;
        }

        ProductService.save(entity);
    },

    onCancel: function () {
        Ext.Msg.confirm("提示", "确定要取消新建吗？", function (success) {
            if (success == 'yes') {
                Cxt.util.Window.back();
            }
        })
    }
});