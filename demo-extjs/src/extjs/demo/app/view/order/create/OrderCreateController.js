/**
 * Created by zhengshiqi on 2018/10/23.
 */
Ext.define('demo.view.order.create.OrderCreateController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.demo.order.create',


    backToSearch: function () {
        //跳转搜索界面
        Cxt.util.Window.moduleRedirectTo(demo.view.order.Order.moduleId, 'search');
    },

    //保存订单信息
    onSave: function () {
        var me = this,
        //获取数据
            entity = me.getView().getViewModel().get('entity');
        if (entity.orderProducts.length==1 && entity.orderProducts[0].product==null){
            Cxt.util.Toast.warning('订单明细不能为空');
            return;
        }else {
            Ext.Array.each(entity.orderProducts, function (orderProduct) {
                if (orderProduct.product == null){
                    entity.orderProducts.pop(orderProduct);
                }
            });
            if (entity.submitExpense){
                entity.submitExpense=1;
            }else {
                entity.submitExpense=0;
            }

            if (!me.getView().isValid()) {
                return;
            }
            //调OrderService中的save方法
            OrderService.save(entity);
        }
    },

    typeChange: function (target, newValue) {
        var me = this,
        entity = me.getView().getViewModel().get('entity');
        entity.orderType =newValue.orderType;
    },

    onCancel: function () {
        var me = this,
            entity = me.getView().getViewModel().get('entity');
        var cancelMsg = "确定要取消新建吗？";
        if (!Ext.isEmpty(entity.uuid)) {
            cancelMsg = "确定要取消编辑吗？";
        }
        Ext.Msg.confirm("提示", cancelMsg, function (success) {
            if (success == 'yes') {
                //浏览器后退
                Cxt.util.Window.back();
            }
        })
    },

    //编辑订单明细
    onCellEdit:function (editor, context) {
        var me = this,
        field = context.field,
        record = context.record;
        //获取数据
        entity = me.getView().getViewModel().get('entity');
        if (field == 'product') {
            cellEditor = context.column.getEditor();
            var selectData = cellEditor.getSelection();
            if (typeof (selectData) == "undefined"){
                record.set('qty', null);
                return;
            }else {
                var a = 0;
                orderProducts = entity.orderProducts;
                if (orderProducts.length>1){
                    Ext.Array.each(orderProducts, function (orderProduct) {
                        if (orderProduct.product!=null){
                            if (selectData.getData().uuid == orderProduct.product.uuid){
                                a=1;
                                Cxt.util.Toast.warning('订单明细重复！');
                                return;
                            }
                        }
                    });
                }
                if (a==1){
                    return;
                }else {
                    if (selectData.getData().qty<record.getData().buyQty){
                        record.set('product', selectData.getData());
                        record.set('qty', selectData.getData().qty);
                        record.set('allPrice', null);
                        record.set('buyQty',null);
                        Cxt.util.Toast.warning('购买数量不能大于库存！');
                    }else {
                        record.set('product', selectData.getData());
                        record.set('qty', selectData.getData().qty);
                        record.set('allPrice', record.getData().buyQty*10);
                    }
                }
            }
        } else if (field == 'buyQty') {
            if (record.getData().product == null){
                record.set('allPrice', null);
            }else {
                if(record.getData().buyQty > record.getData().product.qty){
                    record.set('allPrice', null);
                    record.set('buyQty',null);
                    Cxt.util.Toast.warning('购买数量不能大于库存！');
                    return;
                }else{
                    var price = 10.00;
                    record.set('allPrice', record.getData().buyQty*price);
                    me.sum(entity);
                    me.updateViewModel();
                }
            }
        }
    },

    updateViewModel: function (entity) {
        var me = this,
            viewModel = me.getView().getViewModel();
        if (Ext.isEmpty(entity)) {
            entity = viewModel.get('entity');
        }
        viewModel.setData({
            entity: entity
        });
    },

    //操作按钮
    onCellClick: function (grid, td, cellIndex, record, tr, rowIndex, e) {
        var me = this, view = me.getView(), viewModel = view.getViewModel(),
            appendButton = e.getTarget('.appendItem'),
            removeButton = e.getTarget('.removeItem');
        if (!appendButton && !removeButton) {// 判断是否有效点击
            return;
        }
        var details = viewModel.get('entity.orderProducts');
        if (Ext.isEmpty(appendButton) == false) {
            Ext.Array.insert(details, rowIndex + 1, [{}]);
        } else if (Ext.isEmpty(removeButton) == false) {
            Ext.Array.remove(details, details[rowIndex]);
            if (details.length == 0) {
                details.push({});
            }
        }
        grid.getStore().load();
        me.sum(viewModel.get('entity'));
        me.updateViewModel();
    },

    //求总金额 总数量
    sum:function (entity) {
        orderProducts = entity.orderProducts;
        var sumPrice = 0.0;
        var sumQty = 0;
        Ext.Array.each(orderProducts, function (orderProduct) {
            if (orderProduct.allPrice!=null && orderProduct.buyQty!=null){
                sumPrice =sumPrice +orderProduct.allPrice;
                sumQty = sumQty + orderProduct.buyQty;
            }
        });
        entity.sumQty = sumQty;
        entity.sumPrice =sumPrice;
    }

});