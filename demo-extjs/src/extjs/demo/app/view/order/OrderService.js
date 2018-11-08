/**
 * Created by zhengshiqi on 2018/10/22.
 */
Ext.define('demo.view.order.OrderService', {
    extend: 'Ext.Container',
    alias: 'demo.order.service',

    requires: [
        'Cxt.util.Format',
        'Cxt.util.Toast',
        'Cxt.util.Window'
    ],
    singleton: true,
    alternateClassName: 'OrderService',

    save: function (entity) {
        //????????????????????
        var deferred = Ext.create('Ext.Deferred');

        Ext.Ajax.request({
            url: demo.view.order.Order.servicePath + '/save.hd',
            waitMsg: '正在保存...',
            jsonData: entity
        }).then(function (response) {
            var entity = Ext.decode(response.responseText);
            Cxt.util.Toast.success('保存成功');
            Cxt.util.Window.moduleRedirectTo(demo.view.order.Order.moduleId, 'view', {
                uuid: entity.uuid
            });
            deferred.resolve(entity);
        }).otherwise(function (response) {
            Cxt.util.Toast.failure(response.responseText);
            deferred.reject();
        });

        return deferred.promise;
    },

    delete: function (entity) {
        var me = this,
            deferred = Ext.create('Ext.Deferred');

        if (entity.submitExpense){
            entity.submitExpense = 1;
        }else {
            entity.submitExpense = 0;
        }
        Ext.Msg.confirm('提示', '确认要删除商品' + Cxt.util.Format.ucn(entity) + '吗?',
            function (btn) {
                if (btn === 'yes') {
                    me.doDelete(entity).then(function () {
                        Cxt.util.Toast.success('删除成功');
                        deferred.resolve();
                    }).otherwise(function (response) {
                        Cxt.util.Toast.failure(response.responseText);
                        deferred.reject(response);
                    });
                }
            });

        return deferred.promise;
    },
    

    doDelete: function (entity) {
        var deferred = Ext.create('Ext.Deferred');

        Ext.Ajax.request({
            url: demo.view.order.Order.servicePath + '/delete.hd',
            waitMsg: '正在删除...',
            jsonData: entity
        }).then(function () {
            deferred.resolve();
        }).otherwise(function (response) {
            deferred.reject(response);
        });

        return deferred.promise;
    },

    undelete: function (entity) {
        var me = this,
            deferred = Ext.create('Ext.Deferred');

        if (entity.submitExpense){
            entity.submitExpense = 1;
        }else {
            entity.submitExpense = 0;
        }

        Ext.Msg.confirm('提示', '确认要恢复删除订单' + Cxt.util.Format.ucn(entity) + '吗?',
            function (btn) {
                if (btn === 'yes') {
                    me.doUndelete(entity).then(function () {
                        Cxt.util.Toast.success('恢复删除成功');
                        deferred.resolve();
                    }).otherwise(function (response) {
                        Cxt.util.Toast.failure(response.responseText);
                        deferred.reject(response);
                    });
                }
            });

        return deferred.promise;
    },

    doUndelete: function (entity) {
        var deferred = Ext.create('Ext.Deferred');

        Ext.Ajax.request({
            url: demo.view.order.Order.servicePath + '/undelete.hd',
            waitMsg: '正在恢复删除...',
            jsonData: entity
        }).then(function () {
            deferred.resolve();
        }).otherwise(function (response) {
            deferred.reject(response);
        });

        return deferred.promise;
    },


    load: function (urlParams) {
        var deferred = Ext.create('Ext.Deferred');

        if (!urlParams || !urlParams.uuid) {
            Ext.Msg.alert("提示", "缺少必要的url参数", function () {
                window.top.history.go(-1);// 后退
            });
        } else {
            Ext.Ajax.request({
                url: demo.view.order.Order.servicePath + '/get.hd',
                method: 'GET',
                waitMsg: '正在加载...',
                params: {
                    uuid: urlParams.uuid
                }
            }).then(function (response) {
                if (Ext.isEmpty(response.responseText)) {
                    Cxt.util.Toast.warning('指定标识的订单不存在或已删除');
                    Cxt.util.Window.moduleRedirectTo(demo.view.order.Order.moduleId, 'search');
                    deferred.reject();
                } else {
                    var entity = Ext.decode(response.responseText);
                    if (entity.submitExpense==1){
                        entity.submitExpense=true;
                    }else {
                        entity.submitExpense=false;
                    }
                    orderProducts = entity.orderProducts;
                    Ext.Array.each(orderProducts, function (orderProduct) {
                        orderProduct.qty= orderProduct.product.qty;
                    });
                    deferred.resolve(entity);
                }
            }).otherwise(function (response) {
                Cxt.util.Toast.failure(response.responseText);
                deferred.reject();
            });
        }

        return deferred.promise;
    },


});