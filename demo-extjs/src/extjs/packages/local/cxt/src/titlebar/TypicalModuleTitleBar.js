/**
 * 典型的模块标题栏。提供了左侧的搜索处理方案
 * Created by cRazy on 2016/7/1.
 */
Ext.define('Cxt.titlebar.TypicalModuleTitleBar', {
    extend: 'Cxt.titlebar.ModuleTitleBar',
    xtype: 'typicalmoduletitlebar',

    requires: [
        'Cxt.util.Window',
        'Ext.button.Button'
    ],

    viewModel: {},
    /**
     * @cfg {String} router (required)
     * 返回搜索的路由节点。对应模块应该支持{router}.search与{router}.view的hash
     */

    /**
     * @cfg {String} searchXtype (required)
     * 用于提供搜索的下拉型控件
     */

    initComponent: function () {
        var me = this;
        me.leftItems = Ext.Array.merge([{
            xtype: 'button',
            text: '返回列表',
            ui: 'bulge',
            iconCls: 'fa fa-level-up fa-flip-horizontal',
            listeners: {
                click: function () {
                    Cxt.util.Window.moduleRedirectTo(me.router, 'search', {
                        localSearch: true
                    });
                },
                scope: me
            }
        }, {
            xtype: 'button',
            ui: 'bulge',
            iconCls: 'fa fa-search',
            listeners: {
                click: function () {
                    var viewModel = me.getViewModel();
                    viewModel.set('showSearch', !viewModel.get('showSearch'));
                },
                scope: me
            }
        }, {
            xtype: me.searchXtype,
            width: 100,
            hidden: true,
            bind: {
                hidden: '{!showSearch}'
            },
            listeners: {
                select: function (combo, record) {
                    Cxt.util.Window.moduleRedirectTo(me.router, 'view', {
                        uuid: record.get('uuid')
                    });
                },
                scope: me
            }
        }], me.leftItems);
        me.callParent(arguments);
    }
});