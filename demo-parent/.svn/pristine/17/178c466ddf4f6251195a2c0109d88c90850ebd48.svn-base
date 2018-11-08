/**
 * Created by cRazy on 2016/6/16.
 */
Ext.define('demo.view.product.search.ProductSearchController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.demo.product.search',

    requires: [
        'Cxt.util.Window',
        'Cxt.window.BatchProcessor'
    ],

    onCreate: function () {
        Cxt.util.Window.moduleRedirectTo(demo.view.product.Product.moduleId, 'create');
    },

    onTagChange: function (selector, tags) {
        var me = this,
            view = me.getView();

        me.getViewModel().set('conditions.filter.state', tags);
        view.doSearch();
    },

    onSearch: function () {
        this.getView().doSearch();
    },

    onClearConditions: function () {
        var me = this,
            conditions = me.getViewModel().get('conditions.filter');

        for (var condition in conditions) {
            if (conditions.hasOwnProperty(condition)) {
                conditions[condition] = null;
            }
        }
        me.getViewModel().set('conditions.filter', conditions);
    },

    onBatchDelete: function () {
        var me = this,
            records = me.getView().down('#grid').getSelection(),
            batchprocessor = Ext.create({
                xtype: 'batchprocessor',
                actionText: '删除',
                records: records,
                labelTpl: '{data.name}[{data.code}]',
                executeFn: function (record, callback) {
                    demo.view.product.ProductService.doDelete(record.getData()).then(function (response) {
                        callback.onSuccess(response);
                    }).otherwise(function (response) {
                        callback.onFailure(response);
                    });
                },
                listeners: {
                    complete: function () {
                        me.getView().doSearch();
                    }
                }
            });
        batchprocessor.batchProcess();
    },

    onBatchUndelete: function () {
        var me = this,
            records = me.getView().down('#grid').getSelection(),
            batchprocessor = Ext.create({
                xtype: 'batchprocessor',
                actionText: '回复删除',
                records: records,
                labelTpl: '{data.name}[{data.code}]',
                executeFn: function (record, callback) {
                    demo.view.product.ProductService.doUndelete(record.getData()).then(function (response) {
                        callback.onSuccess(response);
                    }).otherwise(function (response) {
                        callback.onFailure(response);
                    });
                },
                listeners: {
                    complete: function () {
                        me.getView().doSearch();
                    }
                }
            });
        batchprocessor.batchProcess();
    },

    onItemContextMenu: function (gridView, record, item, index, e) {
        e.preventDefault();
        var me = this,
            entity = record.getData();

        var contextMenu = Ext.widget('menu', {
            viewModel: {},
            closeAction: 'destroy',
            items: [{
                text: '编辑',
                hidden: entity.state != 'using',
                handler: function () {
                    Cxt.util.Window.moduleRedirectTo(demo.view.product.Product.moduleId, 'edit', {
                        uuid: entity.uuid
                    });
                }
            }, {
                text: '删除',
                hidden: entity.state != 'using',
                handler: function () {
                    demo.view.product.ProductService['delete'](entity).then(function () {
                        me.getView().doSearch();
                    });
                }
            }, {
                text: '恢复删除',
                hidden: entity.state == 'using',
                handler: function () {
                    demo.view.product.ProductService.undelete(entity).then(function () {
                        me.getView().doSearch();
                    });
                }
            }]
        });
        contextMenu.showAt(e.getXY());
    },

    onGridRowClick: function (grid, record, tr, rowIndex, event) {
        var cellContext = event.position;
        if (cellContext.column && cellContext.column.dataIndex == 'code') {
            Cxt.util.Window.moduleRedirectTo(demo.view.product.Product.moduleId, 'view', {
                uuid: record.get('uuid')
            });
        }
    }
});