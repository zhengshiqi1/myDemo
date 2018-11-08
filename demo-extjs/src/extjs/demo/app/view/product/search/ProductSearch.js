/**
 * Created by cRazy on 2016/6/16.
 */
Ext.define('demo.view.product.search.ProductSearch', {
    extend: 'Cpnt.frame.BaseContentPanel',
    xtype: 'demo.product.search',

    requires: [
        'Cxt.Regex',
        'Cxt.data.reader.QueryResultReader',
        'Cxt.form.field.SingleTagField',
        'Cxt.form.field.TagSelector',
        'Cxt.util.Format',
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.form.Label',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Spacer'
    ],

    viewModel: {},

    controller: 'demo.product.search',

    titlebar: {
        xtype: 'moduletitlebar',
        title: '商品',
        rightItems: [{
            xtype: 'button',
            text: '新建',
            ui: 'primary',
            iconCls: 'fa fa-plus',
            handler: 'onCreate'
        }]
    },

    initComponent: function () {
        var me = this;
        me.store = me.createStore();
        me.grid = me.createGrid();

        Ext.apply(me, {
            items: [me.grid]
        });


        me.callParent(arguments);
    },

    createStore: function () {
        var me = this;
        return Ext.create('Ext.data.Store', {
            type: 'store',
            proxy: {
                type: 'ajax',
                url: 'product/query.hd',
                actionMethods: {
                    read: 'POST'
                },
                limitParam: 'pageSize',
                pageParam: 'page',
                startParam: '',
                paramsAsJson: true,
                extraParams: {},
                reader: {
                    type: 'queryResult',
                    rootProperty: 'records',
                    totalProperty: 'recordCount'
                }
            },
            sorters: {
                property: 'code',
                direction: 'ASC'
            },
            remoteSort: true,
            remoteFilter: true,
            autoLoad: false,
            pageSize: 100,
            listeners: {
                load: function () {
                    me.refreshTakeCount();
                }
            }
        })
    },

    createGrid: function () {
        var me = this;
        return Ext.widget({
            xtype: 'grid',
            width: '100%',
            itemId: 'grid',
            store: me.store,
            selModel: {
                selType: 'checkboxmodel'
            },

            dockedItems: [{
                xtype: 'toolbar',
                width: '100%',
                border: true,
                style: 'border:0px;border-top:1px solid #E8E8E8',
                items: [{
                    xtype: 'label',
                    itemId: 'takeCount',
                    margin: '0 15 0 25',
                    html: '共 <span style="color:#5FA2DD;"> 0 </span> 条'
                }, {
                    xtype: 'button',
                    ui: 'danger',
                    text: '删除',
                    handler: 'onBatchDelete'
                }, {
                    xtype: 'button',
                    ui: 'primary',
                    text: '恢复删除',
                    handler: 'onBatchUndelete'
                }]
            }, {
                xtype: 'form',
                dock: 'top',
                width: '100%',
                items: [{   xtype: 'tagselector',
                    fieldLabel: '状态',
                    selector: 'state',
                    columnWidth: 1,
                    listeners: {
                        tagChange: 'onTagChange'
                    },
                    tags: [{
                        tag: 'using',
                        tagCaption: '使用中'
                    }, {
                        tag: 'deleted',
                        tagCaption: '已删除'
                    }]

                }, {
                    xtype: 'textfield',
                    fieldLabel: '代码',
                    regex: Cxt.Regex.code.regex,
                    regexText: Cxt.Regex.code.regexText,
                    maxLength: 32,
                    bind: '{conditions.filter.code}'
                }, {
                    xtype: 'textfield',
                    fieldLabel: '名称',
                    maxLength: 64,
                    bind: '{conditions.filter.name}'
                }, {
                    xtype: 'singletagfield',
                    fieldLabel: '银行',
                    queryMode: 'remote',
                    minChars: 1,
                    queryParam: 'keyword',
                    valueField: 'uuid',
                    valueParam: 'id',
                    bind: {
                        value: '{conditions.filter.bank}'
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
                }, {
                    xtype: 'toolbar',
                    width: '100%',
                    ui: 'embed',
                    columnWidth: 1,
                    items: [{
                        xtype: 'tbspacer',
                        width: 100
                    }, {
                        iconCls: 'fa fa-search',
                        text: ' 搜索',
                        ui: 'primary',
                        handler: 'onSearch'
                    }, {
                        iconCls: 'fa fa-close',
                        text: '清除',
                        handler: 'onClearConditions'
                    }]
                }]
            }, {
                xtype: 'pagingtoolbar',
                store: me.store,
                dock: 'bottom',
                displayInfo: true
            }],
            columns: [{
                dataIndex: 'code',
                text: '代码',
                width: 160,
                renderer: Cxt.util.Format.linkRenderer()
            }, {
                dataIndex: 'name',
                text: '名称',
                width: 200
            }, {
                dataIndex: 'state',
                text: '状态',
                width: 80,
                renderer: function (value) {
                    if (value == 'using') return '使用中';
                    if (value == 'deleted') return '已删除';
                }
            }, {
                dataIndex: 'bank',
                text: '银行',
                width: 180,
                renderer: Cxt.util.Format.ucnRenderer()
            }, {
                dataIndex: 'remark',
                flex: 1,
                text: '说明'
            }],
            listeners: {
                rowclick: 'onGridRowClick',
                itemcontextmenu: 'onItemContextMenu'
            }
        })
    },

    afterRender: function () {
        var me = this;
        me.callParent(arguments);
        me.doSearch();
    },

    doSearch: function () {
        var me = this,
            grid = me.down('#grid'),
            filter;
        if (!me.rendered) {
            return;
        }

        grid.getStore().getProxy().setExtraParams({
            filter: me.getViewModel().get('conditions.filter')
        });

        grid.getStore().load();
    },

    /**
     * 刷新总数
     */
    refreshTakeCount: function () {
        if (this.destroyed)
            return;

        var me = this,
            grid = me.down('#grid'),
            selectCount = grid.getSelection().length;
        if (selectCount) {
            me.down('#takeCount').setHtml('已选 <span style="color:#5FA2DD;">' + selectCount + '</span> 条');
        } else {
            var totalCount = grid.getStore().totalCount;
            me.down('#takeCount').setHtml('共 <span style="color:#5FA2DD;">' + totalCount + '</span> 条');
        }
    },

    onResize: function (width, height, oldWidth, oldHeight) {
        var me = this;
        me.callParent(arguments);
        me.down('#grid').setHeight(document.body.clientHeight - 80);
    }
});
