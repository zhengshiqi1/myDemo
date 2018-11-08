/**
 * Created by zhengshiqi on 2018/10/26.
 */
Ext.define('demo.view.order.edit.OrderEdit', {
    extend: 'demo.view.order.create.OrderCreate',
    xtype: 'demo.order.edit',

    requires: [
        'Cxt.form.field.BizStateLabel',
        'Ext.form.Label'
    ],

    createTitlebar : function () {
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
                bind: '订单：'+'{entity.code}'
            }]
        };
    },

    loadEntity: function () {
        var me = this;
        OrderService.load(me.urlParams).then(function (entity) {
            me.getViewModel().setData({
                entity: entity
            });
            var supplier = me.down('#supplier');
            supplier.readOnly=true;
            if (entity.orderType == "yi"){
                var yi = me.down('#yi');
                yi.setValue(true);
            }else if (entity.orderType == "shi"){
                var shi = me.down('#shi');
                shi.setValue(true);
            }else if (entity.orderType == "zhu"){
                var zhu = me.down('#zhu');
                zhu.setValue(true);
            }else if (entity.orderType == "xing"){
                var xing = me.down('#xing');
                xing.setValue(true);
            }
        });

    }
});