/**
 * Created by zhengshiqi on 2018/10/23.
 */
Ext.define('demo.view.order.search.OrderSearch', {
    extend: 'Cpnt.frame.BaseContentPanel',
    xtype: 'demo.order.search',//moduleId+".随意名字"

    requires: [
        'Cxt.Regex',
        'Cxt.data.reader.QueryResultReader',
        'Cxt.form.field.SingleTagField',
        'Cxt.util.Format',
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.form.field.Text',
        'Cpnt.grid.StatefulGrid'
    ],

    viewModel: {},

    controller: 'demo.order.search',

    //标题栏
    titlebar: {
        xtype: 'moduletitlebar',
        title: '订单',
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

        Ext.apply(me, {
            items: [{
                columnWidth: 1,
                xtype: 'grid.stateful',//组件类型
                itemId: 'searchGrid',
                columnLines: true,
                filterGroupId: demo.view.order.Order.moduleId,
                width: '100%',
                localStorage: false,
                queryUrl: demo.view.order.Order.servicePath + '/query.hd',
                tagSelectors: me.createTagSelectors(),  //tag选择方案  使用中  已删除
                conditions: me.createConditions(),//搜索条件列表
                operations: me.createOperations(),//动作控件列表  删除  恢复删除
                columns: me.createColumns(),//列表
                supplyFilter: Ext.bind(me.supplyFilter, me),
                applyBatchAction: Ext.bind(me.applyBatchAction, me),
                applyContextMenu: Ext.bind(me.applyContextMenu, me),
                defaultSort: {//默认排序
                    property: 'code',
                    direction: 'ASC'
                },
                listeners: {
                    batchaction: 'doBatchAction',
                    itemaction: 'doItemAction',  //接收方法
                    rowclick: 'onGridRowClick' //点击单号 跳转查看界面
                }
            }]
        });

        me.callParent(arguments);
    },

    /**
     * 默认查询条件处理
     * @param filter
     * @returns {*}
     */
    supplyFilter: function (filter) {
        var me = this;

        if (!filter) {
            filter = {};
        }

        return filter;
    },

    createTagSelectors: function () {
        return {
            selector: 'state',
            caption: '状态',
            tags: [{
                tag: 'using',
                tagCaption: '使用中'
            }, {
                tag: 'deleted',
                tagCaption: '已删除'
            }]
        };
    },

    createOperations: function () {
        return [{
            xtype: 'button',
            text: '编辑',
            ui: 'primary',
            batchable: false, //是否允许批量
            action: 'edit',
            actionText: '编辑'
        }, {
            xtype: 'button',
            text: '恢复删除',
            ui: 'primary',
            batchable: true,
            action: 'undelete',
            actionText: '恢复删除'
        }, {
            xtype: 'button',
            text: '删除',
            ui: 'danger',
            batchable: true,
            action: 'delete',
            actionText: '删除'
        }]
    },

    createConditions: function () {
        var conditiion = [];
        conditiion.push({
            xtype: 'textfield',
            fieldLabel: '单号',
            regex: Cxt.Regex.code.regex,//校验
            regexText: Cxt.Regex.code.regexText,
            hidden: false,
            maxLength: 32,
            fieldName: 'code'
        }, {
            xtype: 'singletagfield',
            fieldLabel: '供应商',
            queryMode: 'remote',
            hidden: false,
            minChars: 1,
            queryParam: 'keyword',
            valueParam:'id',
            valueField: 'uuid',
            fieldName: 'supplier',
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
            xtype: 'singletagfield',
            fieldLabel: '商品',
            queryMode: 'remote',
            hidden: false,
            minChars: 1,
            queryParam: 'keyword',
            fieldName: 'orderProducts',
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
        });
        conditiion.push({
            xtype: 'textfield',
            fieldName: 'createInfo_creator_code',
            fieldLabel: '创建人代码',
            hidden: true
        }, {
            xtype: 'textfield',
            fieldName: 'createInfo_creator_name',
            fieldLabel: '创建人名称',
            hidden: true
        }, {
            xtype: 'datefield',
            fieldName: 'createInfo_time',
            fieldLabel: '创建时间',
            hidden: true
        }, {
            xtype: 'textfield',
            fieldName: 'lastModifyInfo_creator_code',
            fieldLabel: '最后修改人代码',
            hidden: true
        }, {
            xtype: 'textfield',
            fieldName: 'lastModifyInfo_creator_name',
            fieldLabel: '最后修改人名称',
            hidden: true
        }, {
            xtype: 'datefield',
            fieldName: 'lastModifyInfo_time',
            fieldLabel: '最后修改时间',
            hidden: true
        });
        return conditiion;
    },

    createColumns: function () {
        var me = this;
        return [{
            dataIndex: 'code',
            text: '单号',
            locked: true,
            hideable: false,
            groupable: false,
            sortParam: 'code',
            width: 160,
            renderer: Cxt.util.Format.linkRenderer()
        }, {
            dataIndex: 'supplier',
            text: '供应商',
            width: 180,
            sortParam: 'supplier.code',
            renderer: Cxt.util.Format.ucnRenderer()
        }, {
            dataIndex: 'state',
            text: '状态',
            width: 80,
            sortable: true,
            groupable: false,
            renderer: function (value) {
                if (value == 'using') return '使用中';
                if (value == 'deleted') return '已删除';
            }
        }, {
            dataIndex: 'sumQty',
            text: '总数量',
            width: 160,
            align: 'right',
            renderer: Ext.util.Format.numberRenderer(',##0.###')
        }, {
            dataIndex: 'sumPrice',
            text: '总金额',
            width: 160,
            align: 'right',
            renderer: Ext.util.Format.numberRenderer(',##0.00')
        }, {
            dataIndex: 'lastModifyInfo',
            flex: 1,
            text: '最后修改信息',
            groupable: false,
            renderer: function (value) {
                return value.time + '[' + value.operator.fullName + ']';
            }
        }]
    },

    //批量按钮的显示和隐藏
    applyBatchAction: function (item, records) {
        return Ext.Array.every(records, function (record) {
            if (item.action === 'delete' && record.get('state') == 'using') {
                return true;
            } else if (item.action === 'undelete' && record.get('state') == 'deleted') {
                return true
            }
        });
    },

    //鼠标右键
    applyContextMenu: function (item, record) {
        if (item.action === 'edit' && (record.get('state') == 'using')) {
            return true;
        } else if (item.action === 'delete' && (record.get('state') == 'using')) {
            return true;
        } else if (item.action === 'undelete' && (record.get('state') == 'deleted')) {
            return true;
        }
        return false;
    },

    onRefresh: function () {
        var me = this;
        me.callParent(arguments);

        if (me.urlParams['localSearch']) {
            me.down('#searchGrid').loadLocalSearch();
        } else {
            me.down('#searchGrid').loadUserHabit();
        }
    }


});