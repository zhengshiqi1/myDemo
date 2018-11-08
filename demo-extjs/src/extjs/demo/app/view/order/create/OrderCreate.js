/**
 * Created by zhengshiqi on 2018/10/23.
 */
Ext.define('demo.view.order.create.OrderCreate', {
    extend: 'Cpnt.frame.BaseContentPanel',
    xtype: 'demo.order.create',

    requires: [
        'Cxt.form.field.SingleTagField',
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.form.Panel',
        'Ext.form.field.Number',
        'Ext.form.field.Text',
        'Ext.layout.container.Column',
        'Cxt.util.Format',
        'Ext.grid.Panel',
        'Ext.grid.column.RowNumberer',
        'Ext.grid.plugin.CellEditing',
        'Ext.util.Format'
    ],

    controller: 'demo.order.create',

    viewModel: {
        formulas:{
            sumPrice:function (get) {
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
                me.createDetailsGrid()
            ]
        });
        me.callParent(arguments);
    },
    
    createTitlebar: function () {
        return {
            xtype: 'moduletitlebar',
            title: '新建订单',
            leftItems: [{
                xtype: 'button',
                text: '返回列表',
                ui: 'bulge',
                iconCls: 'fa fa-level-up fa-flip-horizontal',
                handler: 'backToSearch'
            }]
        };
    },

    createToolbar: function () {
        return {
            items: [{
                xtype: 'button',
                text: '保存',
                iconCls: 'fa fa-save',
                ui: 'primary',
                listeners: {
                    click: 'onSave'
                }
            }, {
                xtype: 'button',
                text: '取消',
                iconCls: 'fa fa-remove',//按钮样式
                listeners: {//监听
                    click: 'onCancel'
                }
            },{
                xtype: 'tbfill'//作用占位
            }, {
                xtype: 'label',
                bind:'<span style="font-size: 15px;font-weight: 700;">销售总金额：</span>' +
                '<span style="font-weight: 700;font-size: 22px;color: #5FA2DD;line-height: 30px;">{sumPrice}</span>'
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
                    xtype: 'singletagfield',//自定义类型：限定单选
                    fieldLabel: '供应商',  //组件名
                    itemId: 'supplier',
                    allowBlank: false,  //不允许为空
                    queryMode: 'remote',//remote请求服务器获取数据，local本地获取数据
                    minChars: 1,
                    queryParam: 'keyword',//查询参数
                    valueField: 'uuid',
                    bind: {//绑定
                        valueData: '{entity.supplier}'
                    },
                    labelTpl: new Ext.XTemplate(
                        '<tpl if="code">',
                        '{name}[{code}]',
                        '<tpl else>',
                        '{name}',
                        '</tpl>'
                    ),
                    tpl: new Ext.XTemplate(
                        '<tpl for=".">',
                        '<li role="option" unselectable="on" class="', Ext.baseCSSPrefix, 'boundlist-item ', Ext.baseCSSPrefix + 'overflow-ellipsis">{name}[{code}]</li>',
                        '</tpl>'
                    ),
                    store: {//存储数据
                        type: 'store',
                        remoteFilter: true,//true过滤操作在服务端，false过滤本地数据
                        proxy: {
                            type: 'ajax',
                            url: 'order/querySuppliers.hd',
                            actionMethods: {
                                read: 'POST'
                            },
                            limitParam: 'pageSize',
                            pageParam: 'page',
                            startParam: ''
                        }
                    }
                }, {
                xtype: 'datefield',//日期控件
                fieldLabel: '订货日期',
                allowBlank: false,
                itemId:'orderDate',
                bind: '{entity.orderDate}'
            }, {
                xtype: 'checkbox',
                fieldLabel: '报销',
                fieldName: 'submitExpense',//控件名字
                bind: '{entity.submitExpense}'
            },{
                xtype: 'radiogroup',
                fieldLabel: '类型',
                defaultType: 'radiofield',
                defaults: {
                    flex: 1
                },
                layout: 'hbox',//布局横布局
                items: [
                    {
                        // xtype: 'radiofield',
                        boxLabel  : '衣',
                        name      : 'orderType',
                        inputValue: 'yi',
                        itemId:'yi'
                    }, {
                        boxLabel  : '食',
                        name      : 'orderType',
                        inputValue: 'shi',
                        itemId:'shi'
                    }, {
                        boxLabel  : '住',
                        name      : 'orderType',
                        inputValue: 'zhu',
                        itemId:'zhu'
                    }, {
                        boxLabel  : '行',
                        name      : 'orderType',
                        inputValue: 'xing',
                        itemId:'xing'
                    }
                ],
                listeners: {
                    change: 'typeChange'
                }
            },
                {
                xtype: 'singletagfield',
                fieldLabel: '发货库区',
                queryMode: 'remote',
                minChars: 1,
                queryParam: 'keyword',
                valueField: 'uuid',
                bind: {
                    valueData: '{entity.address}'
                },
                labelTpl: new Ext.XTemplate(
                    '<tpl if="code">',
                    '{name}[{code}]',
                    '<tpl else>',
                    '{name}',
                    '</tpl>'
                ),
                tpl: new Ext.XTemplate(
                    '<tpl for=".">',
                    '<li role="option" unselectable="on" class="', Ext.baseCSSPrefix, 'boundlist-item ', Ext.baseCSSPrefix + 'overflow-ellipsis">{name}[{code}]</li>',
                    '</tpl>'
                ),
                store: {
                    type: 'store',
                    remoteFilter: true,
                    proxy: {
                        type: 'ajax',
                        url: 'order/queryAddress.hd',
                        actionMethods: {
                            read: 'POST'
                        },
                        limitParam: 'pageSize',
                        pageParam: 'page',
                        startParam: ''
                    }
                }
            },{
                    xtype: 'singletagfield',
                    fieldLabel: '送货方式',
                    queryMode: 'local',
                    minChars: 1,
                    queryParam: 'keyword',
                    valueField: 'uuid',
                    bind: {
                        valueData: '{entity.deliveryMode}'
                    },
                    labelTpl: new Ext.XTemplate(
                        '<tpl if="code">',
                        '{name}[{code}]',
                        '<tpl else>',
                        '{name}',
                        '</tpl>'
                    ),
                    tpl: new Ext.XTemplate(
                        '<tpl for=".">',
                        '<li role="option" unselectable="on" class="', Ext.baseCSSPrefix, 'boundlist-item ', Ext.baseCSSPrefix + 'overflow-ellipsis">{name}[{code}]</li>',
                        '</tpl>'
                    ),
                    store: {
                        type: 'store',
                        data: [{
                            uuid: '0001',
                            code: '0001',
                            name: '1号方式'
                        }, {
                            uuid: '0002',
                            code: '0002',
                            name: '2号方式'
                        }, {
                            uuid: '0003',
                            code: '0003',
                            name: '3号方式'
                        }, {
                            uuid: '0004',
                            code: '0004',
                            name: '4号方式'
                        }, {
                            uuid: '0005',
                            code: '0005',
                            name: '5号方式'
                        }]
                    }
                }]
        };
    },

    createDetailsGrid: function () {
        return {
            xtype: 'grid',//组件类型
            title: '订单明细',
            width: '100%',
            ui: 'primary',
            columnLines: true,//表中的线是否显示
            sortableColumns: false,//列表不可排序
            autoAppend: true,//enter回车添加一行
            store: {
                type: 'store'
            },
            bind: {
                store: {
                    data: '{entity.orderProducts}'
                }
            },
            columns: [{
                xtype: 'rownumberer'//行号
            }, {
                dataIndex: 'product',//相当于列的标识
                allowBlank: false,
                text: '商品',
                width: 140,
                renderer:function (value) {
                    if (value ==undefined) {
                        return null;
                    }
                    if (Ext.isEmpty(value.code)) {
                        return value.name
                    }
                    if (Ext.isEmpty(value.name)) {
                        return '-[' + value.code + ']';
                    }
                    return value.name + '[' + value.code + ']';
                },
                validator: function (val, rowIndex, record) {
                    var errors = true;
                    record.store.getData().each(function (detail, index) {
                        if (index != rowIndex && detail.get('product') && val && detail.get('product').uuid == val.uuid) {
                            errors = '与第' + (index + 1) + '行重复';
                            return false;
                        }
                    });
                    return errors;
                },
                editor: {//表格可编辑
                    xtype: 'singletagfield',
                    queryMode: 'remote',
                    labelTpl: new Ext.XTemplate(
                        '<tpl if="code">',
                        '{name}[{code}]',
                        '<tpl else>',
                        '{name}',
                        '</tpl>'
                    ),
                    tpl: new Ext.XTemplate(
                        '<tpl for=".">',
                        '<li role="option" unselectable="on" class="', Ext.baseCSSPrefix, 'boundlist-item ', Ext.baseCSSPrefix + 'overflow-ellipsis">{name}[{code}]</li>',
                        '</tpl>'
                    ),
                    store: {
                        type: 'store',
                        remoteFilter: true,
                        proxy: {
                            type: 'ajax',
                            url: 'product/query.hd',
                            contentType: 'application/json',
                            actionMethods: {
                                read: 'POST'
                            },
                            limitParam: 'pageSize',
                            pageParam: 'page',
                            startParam: '',
                            paramsAsJson: true,
                            reader: {
                                type: 'queryResult',
                                rootProperty: 'records',
                                totalProperty: 'recordCount'
                            }
                        }
                    }
                }
            }, {
                dataIndex: 'qty',
                text: '库存',
                width: 140
            },{
                dataIndex: 'buyQty',
                text: '采购数量',
                align: 'right',
                width: 140,
                defaultValue: 0,
                allowBlank: false,
                renderer: Ext.util.Format.numberRenderer(',##0.###'),
                summaryType: 'sum',//该列支持相加
                summaryRenderer: function (val) {
                    return '<b>' + Ext.util.Format.number(val, ',##0.###') + '</b>';
                },
                editor: {
                    xtype: 'numberfield',
                    decimalPrecision: 3,
                    minValue:0,//最小值
                    fieldStyle: 'text-align:right'
                }
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
            },  {
                dataIndex: 'remark',
                text: '说明',
                minWidth: 100,
                flex: 1,//与minWidth配合使用
                editor: {
                    xtype: 'textfield',
                    maxLength: 2048//最大长度
                }
            }, {
                dataIndex: 'row',
                xtype: 'widgetcolumn',
                text: '操作',
                width: 80,
                tdCls: 'x-grid-cell-inner-no-padding',
                widget: {
                    xtype: 'fieldcontainer',
                    items: [{
                        xtype: 'button',
                        width: 30,
                        ui: 'removeItem',
                        cls: 'removeItem',
                        iconCls: 'fa fa-minus-circle '
                    }, {
                        xtype: 'button',
                        width: 30,
                        ui: 'appendItem',
                        cls: 'appendItem',
                        iconCls: 'fa fa-plus-circle '
                    }]
                }
            }],
            features: [{
                ftype: 'summary'
            }],
            plugins: {
                ptype: 'cellediting',//表格编辑
                clicksToEdit: 1,
                listeners: {
                    // beforeedit: 'onBeforeEdit',
                    edit: 'onCellEdit'
                }
            },
            renderTo: Ext.getBody(),//类似html中的<body></body>
            listeners: {
                cellClick: 'onCellClick'//对操作的监听
            }
        }

    },

    
    onRefresh: function () {//刷新页面
        var me = this;
        me.callParent(arguments);//调父类
        me.loadEntity();//加载数据
    },


    loadEntity: function () {
        var me = this;
        me.getViewModel().setData({
            entity: {
                orderDate: Ext.util.Format.date(new Date(), 'Y-m-d'),//订货日期默认当前日期
                orderProducts: [{}],
                state: 'using',//新增时数据默认为using
                submitExpense:true,//报销默认为true
                sumPrice:0
            }
        });
        me.down('#yi').setValue(true);
    }


});