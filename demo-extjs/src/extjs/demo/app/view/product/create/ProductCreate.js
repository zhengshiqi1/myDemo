/**
 * Created by cRazy on 2016/11/26.
 */
Ext.define('demo.view.product.create.ProductCreate', {
    extend: 'Cpnt.frame.BaseContentPanel',
    xtype: 'demo.product.create',

    requires: [
        'Cxt.Regex',
        'Cxt.form.field.SingleTagField',
        'Cxt.panel.TextArea',
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.form.Panel',
        'Ext.form.field.Number',
        'Ext.form.field.Text',
        'Ext.layout.container.Column'
    ],

    controller: 'demo.product.create',
    viewModel: {},

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
            title: '新建商品',
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
                iconCls: 'fa fa-remove',
                listeners: {
                    click: 'onCancel'
                }
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
                xtype: 'textfield',
                fieldLabel: '代码',
                allowBlank: false,
                regex: Cxt.Regex.code.regex,
                regexText: Cxt.Regex.code.regexText,
                maxLength: 32,
                bind: '{entity.code}'
            }, {
                xtype: 'textfield',
                fieldLabel: '名称',
                maxLength: 64,
                allowBlank: false,
                bind: '{entity.name}'
            }, {
                xtype: 'numberfield',
                fieldLabel: '数量',
                minValue: 0,
                bind: '{entity.qty}'
            }, {
                xtype: 'numberfield',
                fieldName: 'basicInfo_price',
                decimalPrecision: '2',
                fieldLabel: '商品单价',
                minValue: 0,
                bind: '{entity.price}'
            }, {
                xtype: 'singletagfield',
                fieldLabel: '银行',
                queryMode: 'remote',
                minChars: 1,
                queryParam: 'keyword',
                valueField: 'uuid',
                valueParam: 'id',
                bind: {
                    valueData: '{entity.bank}'
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
                        url: 'product/queryBanks.hd',
                        actionMethods: {
                            read: 'POST'
                        },
                        limitParam: 'pageSize',
                        pageParam: 'page',
                        startParam: ''
                    }
                }
            }]
        };
    },

    createRemarkPanel: function () {
        return {
            xtype: 'textareapanel',
            width: '100%',
            title: '说明',
            ui: 'primary',
            textareaConfig: {
                maxLength: 128,
                bind: {
                    value: '{entity.remark}'
                }
            }
        }
    },

    onRefresh: function () {
        var me = this;
        me.callParent(arguments);
        me.loadEntity();
    },

    loadEntity: function () {
        var me = this;
        me.getViewModel().setData({
            entity: {
                state: 'using'
            }
        });
    }
});