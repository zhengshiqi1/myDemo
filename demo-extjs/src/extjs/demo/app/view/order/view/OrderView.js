/**
 * Created by zhengshiqi on 2018/10/22.
 */
Ext.define('demo.view.order.view.OrderView', {
    extend: 'Cpnt.frame.BaseContentPanel',
    xtype: 'demo.order.view',

    //在实例化该类前需要加载的
    requires: [
        'Cxt.form.field.BizStateLabel',
        'Cxt.util.Format',
        'Ext.form.Label',
        'Ext.form.Panel',
        'Ext.layout.container.Column',
        'Ext.util.Format'
    ],

    controller: 'demo.order.view',

    viewModel: {
        formulas: {
            using: function (get) {
                return get('entity.state') === 'using';
            },
            sumPrice: function (get) {
                var sumPrice = get('entity.sumPrice');
                if (Ext.isEmpty(sumPrice))
                    return '0';
                return Ext.util.Format.number(sumPrice, ',##0.00');
            }
        }
    },

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            titlebar: me.createTitlebar(),
            toolbar: me.createToolbar(),
            items: [
                me.createGeneralPanel(),
                me.createRemarkPanel()
            ]
        });
        me.callParent(arguments);
    },

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
                bind: '订单：' + '{entity.code}'
            }],
            leftItems: [{
                xtype: 'button',
                text: '返回列表',
                ui: 'bulge',
                iconCls: 'fa fa-level-up fa-flip-horizontal',
                handler: 'backToSearch'
            }],
            rightItems: [{
                xtype: 'button',
                text: '新建',
                ui: 'primary',
                iconCls: 'fa fa-plus',
                handler: 'onCreate'
            }]
        }
    },

    createToolbar: function () {
        return {
            items: [{
                xtype: 'button',
                text: '编辑',
                ui: 'primary',
                handler: 'onEdit',
                bind: {
                    hidden: '{!using}'
                }
            }, {
                xtype: 'button',
                text: '删除',
                ui: 'danger',
                handler: 'onDelete',
                bind: {
                    hidden: '{!using}'
                }
            }, {
                xtype: 'button',
                text: '恢复删除',
                ui: 'primary',
                handler: 'onUndelete',
                bind: {
                    hidden: '{using}'
                }
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'label',
                bind: '<span style="font-size: 15px;font-weight: 700;">销售总金额：</span>' +
                '<span style="font-weight: 700;font-size: 22px;color: #5FA2DD;line-height: 30px;">{sumPrice}</span>',
            }]
        };
    },

    //基本信息面板
    createGeneralPanel: function () {
        return {
            xtype: 'form',
            width: '100%',
            title: '基本信息',
            ui: 'primary',
            layout: 'column',
            items: [{
                fieldLabel: '供应商',
                bind: '{entity.supplier}',
                renderer: Cxt.util.Format.ucnRenderer()
            }, {
                fieldLabel: '订货日期',
                bind: '{entity.orderDate}',
                renderer: Ext.util.Format.dateRenderer('Y-m-d')
            }, {
                xtype: 'checkbox',
                fieldLabel: '报销',
                fieldName: 'submitExpense',
                readOnly: true,
                bind: '{entity.submitExpense}'
            }, {
                xtype: 'radiogroup',
                fieldLabel: '类型',
                defaultType: 'radiofield',
                defaults: {
                    flex: 1
                },
                layout: 'hbox',
                items: [{
                    id: 'yi',
                    xtype: 'radiofield',
                    readOnly: true,
                    boxLabel: '衣',
                    name: 'orderType',
                    inputValue: 'yi'
                }, {
                    id: 'shi',
                    readOnly: true,
                    boxLabel: '食',
                    name: 'orderType',
                    inputValue: 'shi'
                }, {
                    id: 'zhu',
                    readOnly: true,
                    boxLabel: '住',
                    name: 'orderType',
                    inputValue: 'zhu'
                }, {
                    id: 'xing',
                    readOnly: true,
                    boxLabel: '行',
                    name: 'orderType',
                    inputValue: 'xing'
                }],
            }, {
                fieldLabel: '发货库区',
                bind: '{entity.address}',
                renderer: Cxt.util.Format.ucnRenderer()
            }, {
                fieldLabel: '送货方式',
                bind: '{entity.deliveryMode}',
                renderer: Cxt.util.Format.ucnRenderer()
            }]
        };
    },
    //订单明细
    createRemarkPanel: function () {
        return {
            xtype: 'grid',
            title: '订单明细',
            width: '100%',
            sortableColumns: false,//列表不可排序
            store: {
                type: 'store'
            },
            bind: {
                store: {
                    data: '{entity.orderProducts}'
                }
            },
            columns: [{
                xtype: 'rownumberer'
            }, {
                dataIndex: 'product',
                text: '商品',
                width: 140,
                renderer: Cxt.util.Format.ucnRenderer(),//格式化结果
            }, {
                dataIndex: 'qty',
                text: '库存',
                width: 140
            }, {
                dataIndex: 'buyQty',
                text: '采购数量',
                align: 'right',
                width: 140,
                defaultValue: 0,
                renderer: Ext.util.Format.numberRenderer(',##0.###'),
                summaryType: 'sum',
                summaryRenderer: function (val) {
                    return '<b>' + Ext.util.Format.number(val, ',##0.###') + '</b>';
                },
            }, {
                dataIndex: 'allPrice',
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
                dataIndex: 'remark',
                text: '说明',
                minWidth: 100,
                flex: 1,
            }],
            features: [{
                ftype: 'summary'
            }]
        }
    },

    onRefresh: function () {
        var me = this;
        me.callParent(arguments);
        me.loadEntity();
    },

    loadEntity: function () {
        var me = this;
        OrderService.load(me.urlParams).then(function (entity) {
            me.getViewModel().setData({
                entity: entity
            });
            if (entity.orderType == "yi") {
                me.down('#yi').setValue(true);
            } else if (entity.orderType == "shi") {
                me.down('#shi').setValue(true);
            } else if (entity.orderType == "zhu") {
                me.down('#zhu').setValue(true);
            } else if (entity.orderType == "xing") {
                me.down('#xing').setValue(true);
            }
        });
    }

});