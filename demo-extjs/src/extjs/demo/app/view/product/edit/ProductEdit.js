/**
 * Created by cRazy on 2016/11/26.
 */
Ext.define('demo.view.product.edit.ProductEdit', {
    extend: 'demo.view.product.create.ProductCreate',
    xtype: 'demo.product.edit',

    requires: [
        'Cxt.form.field.BizStateLabel',
        'Ext.form.Label'
    ],


    createTitlebar: function () {
        return {
            xtype: 'moduletitlebar',
            titleItems: [{
                xtype: 'bizstatelabel',
                width: 60,
                styleMapping: {
                    using: 'cre-state-available',
                    deleted: 'cre-state-danger'
                },
                captionMapping: {
                    using: '使用中',
                    deleted: '已删除'
                },
                bind: {
                    value: '{entity.state}'
                }
            }, {
                xtype: 'label',
                width: 320,
                cls: 'topTitle',
                bind: '{entity.name}'
            }]
        };
    },

    loadEntity: function () {
        var me = this;

        ProductService.load(me.urlParams).then(function (entity) {
            me.getViewModel().setData({
                entity: entity
            });
        });
    }
});