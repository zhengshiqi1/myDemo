/**
 * Created by zhengshiqi on 2018/10/23.
 */
Ext.define('demo.view.order.search.OrderSearchController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.demo.order.search',

    requires: [
        'Cxt.util.Window',
        'Cxt.window.BatchProcessor'
    ],

    //跳转新建页面
    onCreate: function () {
        Cxt.util.Window.moduleRedirectTo(demo.view.order.Order.moduleId, 'create');
    },

    //列点击处理
    onGridRowClick: function (grid, record, tr, rowIndex, event) {
        var cellContext = event.position;
        if (cellContext.column && cellContext.column.dataIndex == 'code') {
            Cxt.util.Window.moduleRedirectTo(demo.view.order.Order.moduleId, 'view', {
                uuid: record.get('uuid')
            });
        }
    },

    doBatchAction: function (action, actionText, records) {
        var me = this,
            batchprocessor = Ext.create({
                xtype: 'batchprocessor',
                actionText: actionText,
                records: records,
                belongTo: me.getView(),
                labelTpl: '{data.name}[{data.code}]',
                executeFn: function (record, callback) {
                    var fun;

                    if (action == 'delete') {
                        if (!(record.get('state') == 'using')) {
                            callback.onSkip();
                        } else {
                            fun = OrderService.doDelete;
                        }
                    } else if (action == 'undelete') {
                        if (record.get('state') == 'using') {
                            callback.onSkip();
                        } else {
                            fun = OrderService.doUndelete;
                        }
                    }

                    if (fun) {
                        fun(record.getData(), false).then(function (response) {
                            callback.onSuccess(response);
                        }).otherwise(function (response) {
                            callback.onFailure(response);
                        });
                    }
                },
                listeners: {
                    complete: function () {
                        me.getView().down("#searchGrid").doSearch();
                    }
                }
            });
        batchprocessor.batchProcess();
    },

    doItemAction: function (action, actionText, record) {
        var me = this,
            entity = record.getData();
        if (action === 'edit') {
            Cxt.util.Window.moduleRedirectTo(Order.moduleId, 'edit', {
                uuid: record.get('uuid')
            });
        }else if(action === 'delete') {
            demo.view.order.OrderService['delete'](entity).then(function () {
                me.getView().down('#searchGrid').doSearch();
            });
        }else if(action === 'undelete') {
            demo.view.order.OrderService.undelete(entity).then(function () {
                me.getView().down('#searchGrid').doSearch();
            });
        }
    }

});