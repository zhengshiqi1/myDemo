/**
 * Created by cRazy on 2016/11/26.
 */
Ext.define('demo.view.product.view.ProductView', {
    extend: 'Cpnt.frame.BaseContentPanel',
    xtype: 'demo.product.view',

    requires: [
        'Cxt.form.field.BizStateLabel',
        'Cxt.panel.TextArea',
        'Cxt.util.Format',
        'Ext.form.Label',
        'Ext.form.Panel',
        'Ext.layout.container.Column',
        'Ext.util.Format'
    ],

    controller: 'demo.product.view',
    viewModel: {
        formulas: {
            using: function (get) {
                return get('entity.state') === 'using';
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
                bind: '{entity.name}'
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
                fieldLabel: '代码',
                bind: '{entity.code}'
            }, {
                fieldLabel: '名称',
                bind: '{entity.name}'
            }, {
                fieldLabel: '数量',
                bind: '{entity.qty}',
                renderer: Ext.util.Format.numberRenderer('#,0.###')
            }, {
                fieldLabel: '银行',
                bind: '{entity.bank}',
                renderer: Cxt.util.Format.ucnRenderer()
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
                readOnly: true,
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

        ProductService.load(me.urlParams).then(function (entity) {
            me.getViewModel().setData({
                entity: entity
            });
        });
    }
});