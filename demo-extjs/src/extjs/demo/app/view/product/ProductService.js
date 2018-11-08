/**
 * Created by lzy on 2016/10/11.
 */
Ext.define('demo.view.product.ProductService', {
    alias: 'demo.product.service',

    requires: [
        'Cxt.util.Format',
        'Cxt.util.Toast',
        'Cxt.util.Window'
    ],

    singleton: true,
    alternateClassName: 'ProductService',

    load: function (urlParams) {
        var deferred = Ext.create('Ext.Deferred');

        if (!urlParams || !urlParams.uuid) {
            if (!urlParams.bpm_taskuuid) {
                Ext.Msg.alert("提示", "缺少必要的url参数", function () {
                    window.top.history.go(-1);// 后退
                });
                deferred.reject();
            } else {
                deferred.resolve();
            }
        } else {
            Ext.Ajax.request({
                url: demo.view.product.Product.servicePath + '/load.hd',
                method: 'GET',
                waitMsg: '正在加载...',
                params: {
                    uuid: urlParams.uuid
                }
            }).then(function (response) {
                if (Ext.isEmpty(response.responseText)) {
                    Cxt.util.Toast.warning('指定标识的商品不存在或已删除');
                    Cxt.util.Window.moduleRedirectTo(demo.view.product.Product.moduleId, 'search');
                    deferred.reject();
                } else {
                    var entity = Ext.decode(response.responseText);
                    deferred.resolve(entity);
                }
            }).otherwise(function (response) {
                Cxt.util.Toast.failure(response.responseText);
                deferred.reject();
            });
        }

        return deferred.promise;
    },

    save: function (entity) {
        var deferred = Ext.create('Ext.Deferred');

        Ext.Ajax.request({
            url: demo.view.product.Product.servicePath + '/save.hd',
            waitMsg: '正在保存...',
            jsonData: entity
        }).then(function (response) {
            var entity = Ext.decode(response.responseText);
            Cxt.util.Toast.success('保存成功');
            Cxt.util.Window.moduleRedirectTo(demo.view.product.Product.moduleId, 'view', {
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
            url: demo.view.product.Product.servicePath + '/delete.hd',
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

        Ext.Msg.confirm('提示', '确认要恢复删除商品' + Cxt.util.Format.ucn(entity) + '吗?',
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
            url: demo.view.product.Product.servicePath + '/undelete.hd',
            waitMsg: '正在恢复删除...',
            jsonData: entity
        }).then(function () {
            deferred.resolve();
        }).otherwise(function (response) {
            deferred.reject(response);
        });

        return deferred.promise;
    }
});