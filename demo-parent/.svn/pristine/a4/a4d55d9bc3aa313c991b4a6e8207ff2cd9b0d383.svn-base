/**
 * Created by cRazy on 2016/10/11.
 */
Ext.define('demo.view.frame.example.order.View', {
    extend: 'Cpnt.frame.BaseContentPanel',
    xtype: 'demo.example.order.view',

    requires: [
        'Cxt.util.Window',
        'Ext.data.Store',
        'Ext.form.FieldContainer',
        'Ext.form.Label',
        'Ext.form.Panel',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Radio',
        'Ext.grid.Panel',
        'Ext.grid.column.RowNumberer',
        'Ext.grid.feature.Summary',
        'Ext.layout.container.HBox',
        'Ext.toolbar.Fill',
        'Ext.util.Format'
    ],

    ui: 'frame',

    viewModel: {},

    module: {
        caption: '订单'
    },

    titlebar: {
        xtype: 'toolbar',

        height: 45,
        width: '100%',
        style: 'background-color: white',
        defaults: {
            scale: 'medium'
        },
        items: [{
            xtype: 'button',
            text: '返回列表',
            ui: 'bulge',
            iconCls: 'fa fa-level-up fa-flip-horizontal',
            handler: function () {
                Cxt.util.Window.moduleRedirectTo(demo.view.order.Order.moduleId, 'search');
            }
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'label',
            width: 80,
            cls: 'cre-state-available',
            text: '未提交',
        }, {
            xtype: 'label',
            width: 320,
            cls: 'topTitle',
            text: '订单：10000000000',
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            text: '新建',
            ui: 'primary',
            iconCls: 'fa fa-plus',
            handler: function () {
                Cxt.util.Window.moduleRedirectTo(demo.view.order.Order.moduleId, 'create');
            }
        }],
    },

    toolbar: {
        items: [{
            xtype: 'button',
            text: '编辑',
            ui: 'primary',
            handler: function () {
                Cxt.util.Window.moduleRedirectTo(demo.view.order.Order.moduleId, 'edit');
            }
        }, {
            xtype: 'button',
            text: '提交',
            ui: 'primary',
        }, {
            xtype: 'button',
            text: '审核',
            ui: 'primary',
        }, {
            xtype: 'button',
            text: '删除',
            ui: 'danger',
        }, {
            xtype: 'button',
            text: '作废',
            ui: 'primary',
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'label',
            bind: '<span style="font-size: 15px;font-weight: 700;">销售总金额：</span>' +
            '<span style="font-weight: 700;font-size: 22px;color: #5FA2DD;line-height: 30px;">500</span>'
        }]
    },

    items: [{
        xtype: 'form',
        width: '100%',
        items: [{
            fieldLabel: '供应商',
            allowBlank: false,
            value: '知名的[0001]'
        }, {
            fieldLabel: '订货日期',
            allowBlank: false,
            value: Ext.util.Format.date(new Date())
        }, {
            xtype: 'checkbox',
            fieldLabel: '报销',
            value: true,
            readOnly: true,
        }, {
            xtype: 'fieldcontainer',
            fieldLabel: '类型',
            defaultType: 'radiofield',
            defaults: {
                flex: 1,
                readOnly: true,
            },
            layout: 'hbox',
            items: [{
                xtype: 'radiofield',
                boxLabel: '衣',
                name: 'size',
                inputValue: 'm',
                value: true
            }, {
                boxLabel: '食',
                name: 'size',
                inputValue: 'l',
            }, {
                boxLabel: '住',
                name: 'size',
                inputValue: 'xl',
            }, {
                boxLabel: '行',
                name: 'size',
                inputValue: 'xl',
            }]
        }, {
            fieldLabel: '发货库区',
        }, {
            fieldLabel: '送货方式',

        }]
    }, {
        xtype: 'grid',
        title: '订单明细',
        width: '100%',
        store: {
            type: 'store',
            data: [{}, {}, {}, {}]
        },
        columns: [{
            xtype: 'rownumberer'
        }, {
            dataIndex: 'beginDate',
            text: '商品',
            width: 140,
            allowBlank: false,
        }, {
            dataIndex: 'beginDate',
            text: '库存',
            width: 140,
        }, {
            dataIndex: 'endDate',
            text: '采购数量',
            align: 'right',
            allowBlank: false,
            width: 140,
            defaultValue: 0,
            renderer: Ext.util.Format.numberRenderer(',##0.###'),
            summaryType: 'sum',
            summaryRenderer: function (val) {
                return '<b>' + Ext.util.Format.number(val, ',##0.###') + '</b>';
            },
        }, {
            dataIndex: 'total',
            text: '金额',
            width: 120,
            align: 'right',
            defaultValue: 0,
            renderer: Ext.util.Format.numberRenderer(',##0.00'),
            summaryType: 'sum',
            summaryRenderer: function (val) {
                return '<b>' + Ext.util.Format.number(val, ',#0.00') + '</b>';
            },
        }, {
            dataIndex: 'total',
            text: '税率',
            width: 120,
            align: 'right',
            allowBlank: false,
            defaultValue: 0,
            renderer: Ext.util.Format.numberRenderer(',##0.00%'),
        }, {
            dataIndex: 'promTotal',
            text: '税额',
            width: 120,
            align: 'right',
            defaultValue: 0,
            renderer: Ext.util.Format.numberRenderer(',##0.00'),
            summaryType: 'sum',
            summaryRenderer: function (val) {
                return '<b>' + Ext.util.Format.number(val, ',#0.00') + '</b>';
            },
        }, {
            dataIndex: 'remark',
            text: '说明',
            minWidth: 100,
            flex: 1,
        }],
        features: [{
            ftype: 'summary'
        }]
    }]
});