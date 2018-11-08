/**
 * 支持带状态的搜索条件的表格
 * 用户只需要进行搜索条件设置，列显示设置，动作设置即可有表格处理剩余事情。
 * 更多可设置内容查看config注释。
 *
 * Created by cRazy on 2016/6/26.
 */
Ext.define('Cpnt.grid.StatefulGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'grid.stateful',

    requires: [
        'Cpnt.grid.column.config.ColumnConfig',
        'Cpnt.grid.field.SearchTag',
        'Cpnt.grid.field.SearchTagPicker',
        'Cxt.data.reader.QueryResultReader',
        'Cxt.form.field.TagSelector',
        'Cxt.menu.AuthorItem',
        'Cxt.util.LocalStorage',
        'Cxt.util.Toast',
        'Ext.button.Button',
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.form.FieldContainer',
        'Ext.form.Label',
        'Ext.form.Panel',
        'Ext.grid.feature.Grouping',
        'Ext.layout.container.Column',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'Ext.toolbar.Separator',
        'Ext.menu.Item'
    ],


    //<locale>
    /**
     * 默认不显示竖线
     */
    columnLines: false,
    /**
     * vbox
     */
    layout: 'vbox',
    /**
     * 表格遮罩
     */
    maskElement: 'body',
    viewModel: {
        data: {
            conditions: {collapse: false}
        },
        formulas: {}
    },

    defaults: {
        // 默认高度，实现行间距
        margin: 1
    },
    //</locale>

    config: {
        /**
         * @cfg {boolean}columnSystemConfig
         * 用户是否有列显示设置全局配置权限
         */
        columnSystemConfig: false
    },

    /**
     * @cfg {String} filterGroupId
     * 搜索分组id。用户保存用户默认搜索条件与列显示设置
     */
    filterGroupId: undefined,

    /**
     * @cfg {String} userId
     * 用于搜索之后进行本地搜索缓存
     */
    userId: undefined,

    /**
     * @cfg {boolean} localStorage
     * 每次搜索之后，是否本地保存搜索条件
     */
    localStorage: true,

    /**
     * @cfg {Object/Object[]} tagSelectors
     * tag选择方案
     *     @example
     *     tagSelectors: [{
     *          selector:'bizState',// 选择的查询字段
     *          caption:'状态'// 字段标题
     *          mode:'DEFAULT',// 选择方案。
     *          tags:[{
     *              tag: 'ineffect',
     *              tagCaption: '未生效',
     *              main: true
     *          }, {
     *              tag: 'effect',
     *              tagCaption: '已生效',
     *              main: true
     *          }],
     *     }]
     */
    tagSelectors: undefined,

    /**
     * @cfg {String} queryUrl
     * 查询数据对应的queryUrl。也可以直接定义store
     */
    queryUrl: undefined,

    /**
     * @cfg {Object[]} conditions
     * 搜索条件列表。每个搜索条件都是一个表单控件。通过fieldName来进行条件搜索
     * 可设置exclude=true，时，将跳过该条件
     *     @example
     *     operations: [{
         *             xtype: 'textfield',
         *             fieldName: 'billNumber',
         *             fieldLabel: '单号',
         *             hidden: false，
         *             exclude: true/'ineffect'/['ineffect','effect']
         *        }],
     */
    conditions: undefined,

    /**
     * @cfg {Object[]/Ext.panel.Tool[]} tools
     *
     */
    auxiliaryTools: undefined,

    /**
     * @cfg {Object[]} operations
     * 定义的动作控件列表。
     *     @example
     *     operations: [{
     *            xtype: 'button', // 默认设置为button，可覆盖
     *            action: 'effect', // 按钮动作
     *            text: '生效', // 按钮标题
     *            batchable: true, // 是否批处理
     *            actionLimits:[{ // 限制。
     *                limitedTo:'bizState'// 显示状态受tag选择
     *                srcStates: ['ineffect'], // 来源状态。当搜索的状态不匹配时，将自动隐藏。设置了limitedTo之后有效
     *            }]
     *            ui: 'primary'// 按钮ui。
     *        }],
     */
    operations: undefined,

    /**
     * @cfg {Object[]} defaultSort
     * 默认排序字段
     *     @example
     *     defaultSort: {
     *          property:billNumber,
     *          direction:DESC,
     *     }
     */
    defaultSort: undefined,


    /**
     * @cfg {String} defaultGroup
     * 默认分组字段
     */
    defaultGroup: undefined,

    /**
     * @cfg {boolean} columnConfigable
     * 允许进行列显示的编辑
     */
    columnConfigable: true,

    /**
     * @cfg {boolean} enableLocking
     * 允许进行列锁定设置
     */
    enableLocking: true,

    /**
     * @cfg {Ext.selection.Model/Object/String} [selModel=rowmodel]
     * 默认使用多选
     */
    selModel: {
        selType: 'checkboxmodel',
        width: 50
    },

    /**
     *
     * @cfg {Ext.grid.feature.Feature[]/Object[]/Ext.enums.Feature[]} features
     * 提供默认的分组方案
     */
    features: [{
        ftype: 'grouping',
        groupHeaderTpl: '{columnName}: {name} (数量 {rows.length})',
        startCollapsed: false//默认展开折叠面板
    }],

    /**
     * @cfg {Function} supplyFilter
     * 搜索前队filter的处理，允许外部调用者增加新的搜索条件而不影响viewModel
     */
    supplyFilter: undefined,

    /**
     * @cfg {Function} raiseContextMenuItems
     * 调用者可以重写该方法来增加右键菜单
     */
    raiseContextMenuItems: Ext.emptyFn,

    /**
     * @cfg {Function} applyBatchAction
     * 调用者可以重写该方法来觉得按钮是否适配。
     */
    applyBatchAction: Ext.emptyFn,

    /**
     * @cfg {Function} applyContextMenu
     * 调用者可以重写该方法来觉得按钮是否适配
     */
    applyContextMenu: Ext.emptyFn,

    /**
     * 初始化
     */
    initComponent: function () {
        var me = this,
            store = me.createStore(),
            dockedItems = Ext.Array.from(me.dockedItems),
            filterPanel = me.createFilter(),
            conditionTagPanel = me.createConditionTagPanel(),
            operationBar = me.createOperationBar();

        me.initColumns();

        dockedItems.push(Ext.apply(filterPanel, {
            sequence: 100,
            dock: 'top',
            width: '100%'
        }));
        dockedItems.push(Ext.apply(conditionTagPanel, {
            sequence: 200,
            dock: 'top',
            width: '100%'
        }));
        dockedItems.push(Ext.apply(operationBar, {
            sequence: 300,
            dock: 'top',
            width: '100%'
        }));
        dockedItems.push({
            xtype: 'pagingtoolbar',
            store: store,
            dock: 'bottom',
            displayInfo: true
        });

        Ext.apply(me, {
            store: store,
            dockedItems: dockedItems,
            width: '100%'
        });

        me.callParent(arguments);

        me.on('itemcontextmenu', me.onItemContextMenu);
        me.on('headercontextmenu', me.onHeaderContextMenu);
    },
    
    /** 对列进行初始化设置*/
    initColumns: function () {
        var me = this,
            total = 0;
        Ext.Array.each(me.columns, function (column) {
            if (!column.minWidth && column.width) {// 兼容
                column.minWidth = column.width;
                delete column.width;
            }
            total = total.add(column.minWidth);
            if (column.menuDisabled == undefined) {// 只有明确禁用了菜单项的，才禁用，否则由于默认禁用，该处需要启用
                column.menuDisabled = false;
            }
        });

        Ext.Array.each(me.columns, function (column) {
            if (column.minWidth) {
                column.flex = column.minWidth.divide(total, 2);
            }
        });
        // 备份列设置
        me.backups = {
            columns: Ext.clone(me.columns)
        };
    },
    
    loadLocalSearch: function () {
        var me = this;
        if (!me.localStorage)
            return me.doSearch();

        var searchConfig = Ext.decode(Cxt.util.LocalStorage.get(me.userId + "@" + me.filterGroupId), true);
        if (!searchConfig) {
            me.loadUserHabit();
        } else {
            me.doSearch(searchConfig);
            me.getViewModel().set('conditions.collapse', false);
        }
    },

    /**
     * 加载用户默认搜索条件与列显示配置
     */
    loadUserHabit: function () {
        var me = this;

        // 加载用户习惯
        // var searchConfig = Ext.isEmpty(response.responseText) ? undefined : Ext.decode(response.responseText);
        var searchConfig = undefined;
        me.doSearch(searchConfig);

        // Ext.Ajax.request({
        //     url: 'commons/search/habit.hd',
        //     method: 'GET',
        //     params: {
        //         filterGroupId: me.filterGroupId
        //     }
        // }).then(function (response) {
        //     var searchConfig = Ext.isEmpty(response.responseText) ? undefined : Ext.decode(response.responseText);
        //
        //     if (searchConfig) {
        //         if (!Ext.isEmpty(searchConfig['filterHabit'])) {
        //             searchConfig.conditions = Ext.decode(searchConfig['filterHabit']);
        //             // me.getViewModel().set('conditions', Ext.decode(searchConfig['filterHabit']));
        //         }
        //         if (!Ext.isEmpty(searchConfig['columnConfig'])) {
        //             searchConfig.columnConfig = Ext.decode(searchConfig['columnConfig']);
        //             // me.updateColumns(Ext.decode(searchConfig['columnConfig']));
        //         }
        //     }
        //     me.doSearch(searchConfig);
        // }).otherwise(function (response) {
        //     Cxt.util.Toast.failure(response.responseText, true);
        // });
    },

    /**
     * 执行查询操作
     */
    doSearch: function (searchConfig) {
        var me = this,
            filter;
        if (!me.rendered) {
            return;
        }
        if (me.getStore().isLoading()) {
            console.log('需要重新加载');
            // 正在加载的话，需要记录，然后在加载完成后，重新加载。
            me.needReSearch = true;
            return;
        }
        if (!!searchConfig) {
            if (!!searchConfig.conditions) {
                me.getViewModel().set('conditions', searchConfig.conditions);
            }
            if (!!searchConfig.columnConfig) {
                me.updateColumns(searchConfig.columnConfig);
            }
        } else if (!me.down('#filter').isValid()) {
            return;
        }
        filter = Ext.apply({}, me.getViewModel().get('conditions.filter'));
        if (Ext.isFunction(me.supplyFilter)) {
            filter = me.supplyFilter(filter);
        }

        me.getStore().getProxy().setExtraParams({
            filter: filter
        });

        me.getStore().load();
        me.localStoreSearch();
    },

    /**
     *  搜索条件本地缓存
     *
     */
    localStoreSearch: function () {
        var me = this,
            columns = [],
            conditions = me.getViewModel().get('conditions');

        if (!me.localStorage)
            return;

        Ext.Array.each(me.getColumns(), function (column) {
            columns.push({
                dataIndex: column.dataIndex,
                width: column.width,
                text: column.text,
                locked: column.locked,
                hidden: column.hidden,
                hideable: column.hideable
            })
        });

        Cxt.util.LocalStorage.set(me.userId + "@" + me.filterGroupId, Ext.encode({
            conditions: conditions,
            columnConfig: columns
        }));
    },

    /**
     * 刷新总数
     */
    refreshTakeCount: function () {
        if (this.destroyed)
            return;

        var me = this,
            selectCount = me.getSelection().length;
        if (selectCount) {
            me.down('#takeCount').setHtml('已选 <span style="color:#5FA2DD;">' + selectCount + '</span> 条');
        } else {
            var totalCount = me.getStore().totalCount;
            me.down('#takeCount').setHtml('共 <span style="color:#5FA2DD;">' + totalCount + '</span> 条');
        }
    },

    /**
     *  刷新动作按钮显示隐藏
     */
    refreshBatchAction: function () {
        var me = this;

        Ext.Array.each(me.batchActions, function (operation) {
            var actionBtn = me.down('#btn' + operation.action),
                records = me.getSelection(),
                hide = false;
            if (Ext.isEmpty(actionBtn)) {
                return;
            }
            Ext.Array.each(actionBtn.actionLimits, function (item) {
                if (Ext.isEmpty(item.limitedTo)) {
                    return;
                }

                Ext.Array.each(records, function (record) {
                    if (!Ext.Array.contains(item.srcStates, record.get(item.limitedTo))) {
                        return hide = true;
                    }
                });
            });

            if (me.applyBatchAction(actionBtn, records) === false) {
                hide = true;
            }
            actionBtn.setHidden(hide);
        });
    },

    /** 增加批处理按钮*/
    raiseBatchActions: function (actions) {
        var me = this,
            additionalToolbar = me.down('#additionalToolbar');
        additionalToolbar.removeAll();
        if (Ext.isEmpty(actions))
            return;

        additionalToolbar.add('-');
        additionalToolbar.add(actions);
    },

    /**
     *  清除条件
     */
    clearConditions: function () {
        var me = this;
        var conditions = me.getViewModel().get('conditions.filter');
        for (var condition in conditions) {
            if (conditions.hasOwnProperty(condition)) {
                conditions[condition] = null;
            }
        }
        me.getViewModel().set('conditions.filter', conditions);
        me.getViewModel().set('conditions.rawValue', {});
        me.down('#filter').clearInvalid();
    },

    /** 展开*/
    conditionsExpand: function () {
        var me = this;
        me.getViewModel().set('conditions.collapse', false);
    },

    /** 收起*/
    conditionsCollapse: function () {
        var me = this,
            buttons = [];
        me.getViewModel().set('conditions.collapse', true);
        // 构建tag搜索的条件标签
        Ext.Array.each(me.tagSelectors, function (tagSelector) {
            var tags = me.getViewModel().get('conditions.filter.' + tagSelector.selector);
            buttons.push({
                xtype: 'searchtagpicker',
                width: 150,
                tagSelector: tagSelector,
                selection: tags,
                listeners: {
                    close: function () {
                        me.getViewModel().set('conditions.filter.' + tagSelector.selector, null);
                        me.conditionsExpand();
                        me.doSearch();
                    },
                    select: function (picker, selections) {
                        me.getViewModel().set('conditions.filter.' + tagSelector.selector, selections);
                        me.excludeConditions();
                        me.doSearch();
                    }
                }
            });
        });
        // 构建条件标签
        Ext.Array.each(me.conditions, function (condition) {
            var rawValue = me.getViewModel().get('conditions.rawValue.' + condition.fieldName);
            if (!Ext.isEmpty(rawValue)) {
                buttons.push({
                    xtype: 'searchtag',
                    tagLabel: condition.fieldLabel,
                    value: rawValue,
                    itemId: 'searchtag' + condition.fieldName,
                    listeners: {
                        close: function () {
                            me.getViewModel().set('conditions.filter.' + condition.fieldName, null);
                            me.getViewModel().set('conditions.rawValue.' + condition.fieldName, null);
                            me.conditionsExpand();
                            me.doSearch();
                        }
                    }
                });
            }
        });

        buttons.push({
            xtype: 'button',
            iconCls: 'fa fa-close',
            ui: 'bulge',
            text: '清空',
            handler: function () {
                me.clearConditions();
                me.conditionsExpand();
                me.doSearch();
            }
        });

        me.suspendLayouts(); //挂起渲染
        me.down('#filterTagToolbar').removeAll();
        me.down('#filterTagToolbar').add(buttons);
        me.resumeLayouts(true); //布局配置刷新完毕后再恢复统一构造
    },

    excludeConditions: function () {
        var me = this;

        Ext.Array.each(me.conditions, function (condition) {
            if (condition.exclude && condition.exclude !== true) {
                var list = Ext.Array.from(condition.exclude),
                    visible = true;
                Ext.Array.each(me.tagSelectors, function (tagSelector) {
                    var tags = me.getViewModel().get('conditions.filter.' + tagSelector.selector);
                    return visible = Ext.Array.intersect(list, tags).length == 0;
                });

                if (visible) {
                    if (me.down('#conditionMenu' + condition.fieldName).isHidden()) {
                        me.down('#conditionMenu' + condition.fieldName).show();
                        me.getViewModel().set('conditions.visible.' + condition.fieldName,
                            me.getViewModel().get('conditions.backup.visible.' + condition.fieldName) != false);
                    }
                } else {
                    me.down('#conditionMenu' + condition.fieldName).hide();
                    if (me.down('#searchtag' + condition.fieldName))
                        me.down('#searchtag' + condition.fieldName).hide();
                    // 记录一下原状态，用于支持的时候的显隐设置
                    me.getViewModel().set('conditions.backup.visible.' + condition.fieldName,
                        me.getViewModel().get('conditions.visible.' + condition.fieldName));
                    me.getViewModel().set('conditions.visible.' + condition.fieldName, false);
                    me.getViewModel().set('conditions.filter.' + condition.fieldName, null);
                    me.getViewModel().set('conditions.rawValue.' + condition.fieldName, null);
                }
            }
        });
    },

    /** 保存为默认搜索*/
    saveDefaultConditions: function () {
        var me = this,
            conditions = me.getViewModel().get('conditions');
        if (!me.down('#filter').isValid()) {
            return;
        }
        Ext.Ajax.request({
            url: 'commons/search/filterHabit/save.hd?filterGroupId=' + me.filterGroupId,
            jsonData: !conditions ? [] : conditions,
            success: function () {
                Cxt.util.Toast.success('成功保存为默认搜索条件');
            },
            failure: function (response) {
                Cxt.util.Toast.failure(response.responseText, true);
            }
        });
    },

    columnConfig: function () {
        var me = this,
            config = Ext.create({
                xtype: 'columnconfig',
                columns: me.getColumns(),
                filterGroupId: me.filterGroupId,
                columnSystemConfig: me.columnSystemConfig,
                defaultColumns: me.backups.columns,
                listeners: {
                    complete: function (config, columns) {
                        me.updateColumns(columns);
                    }
                }
            });
        config.show();
    },

    updateColumns: function (columns) {
        var me = this,
            list = [];
        if (!columns)
            return;

        Ext.Array.each(columns, function (column) {
            var v = Ext.Array.findBy(me.backups.columns, function (item) {
                return item.dataIndex === column.dataIndex;
            });
            if (Ext.isEmpty(v)) return;//未找到现有配置中的列设置，返回

            var target = Ext.clone(v);
            Ext.apply(target, {
                text: v.text,
                hideable: v.hideable !== false
            }, column);

            list.push(target);
        });
        Ext.Array.each(me.backups.columns, function (column) {
            var v = Ext.Array.findBy(columns, function (item) {
                return item.dataIndex === column.dataIndex;
            });
            if (!Ext.isEmpty(v)) return;//已添加，返回
            list.push(Ext.clone(column));
        });

        me.reconfigure(list);
        Cxt.util.LocalStorage.set(me.userId + "@" + me.filterGroupId, Ext.encode({
            conditions: me.getViewModel().get('conditions'),
            columnConfig: list
        }));
    },

    createStore: function () {
        var me = this,
            store = me.store;
        if (Ext.isEmpty(store)) {
            store = {
                proxy: {
                    type: 'ajax',
                    url: me.queryUrl,
                    actionMethods: {
                        read: 'POST'
                    },
                    limitParam: 'pageSize',
                    pageParam: 'page',
                    paramsAsJson: true,
                    reader: 'queryResult'
                },
                groupField: Ext.isEmpty(me.defaultGroup) ? undefined : me.defaultGroup,
                sorters: Ext.isEmpty(me.defaultSort) ? undefined : [me.defaultSort],
                remoteSort: true,
                remoteFilter: true,
                autoLoad: false,
                pageSize: 100,
                listeners: {
                    load: function (store, records, successful, operation) {
                        if (me.needReSearch) {
                            console.log('重新加载');
                            me.needReSearch = false;
                            return Ext.defer(me.doSearch, 50, me);
                        }
                        if (!Ext.isEmpty(operation.getResultSet())) {
                            me.getViewModel().set('tagExtras', operation.getResultSet().summary);
                        }
                        me.refreshTakeCount();
                        me.fireEvent('storeload', me, records, successful, operation);
                    },
                    scope: me
                }
            };
        }
        return Ext.create('Ext.data.Store', store);
    },

    /**
     *  创建过滤栏
     */
    createFilter: function () {
        var me = this,
            tagSelectorFields = [],
            conditionMenu = [];

        Ext.Array.each(me.tagSelectors, function (tagSelector) {
            tagSelector = Ext.apply({}, tagSelector, {
                xtype: 'tagselector',
                tagWidth: (tagSelector.tags.length + 1) * 120,
                listeners: {
                    tagChange: function (selector, tags) {
                        me.getViewModel().set('conditions.filter.' + tagSelector.selector, tags);
                        me.excludeConditions();
                        me.doSearch();
                    }
                },
                bind: {
                    value: '{conditions.filter.' + tagSelector.selector + '}',
                    tagExtras: '{tagExtras}'
                }
            });

            tagSelectorFields.push(Ext.apply(tagSelector, {
                columnWidth: 1,
                fieldLabel: tagSelector.caption,
                labelAlign: 'right'
            }));
        });

        Ext.Array.each(me.conditions, function (condition) {
            if (Ext.isEmpty(condition) || condition.exclude === true)
                return;

            var bind = Ext.apply({}, {
                    hidden: '{!conditions.visible.' + condition.fieldName + '}',
                    value: '{conditions.filter.' + condition.fieldName + '}',
                    rawValue: '{conditions.rawValue.' + condition.fieldName + '}'
                }, condition.bind),
                listeners = Ext.apply({}, {
                    blur: function (field) {
                        me.getViewModel().set('conditions.rawValue.' + condition.fieldName, field.getRawValue());
                    },
                    hide: function () {
                        me.getViewModel().set('conditions.filter.' + condition.fieldName, null);
                        me.getViewModel().set('conditions.rawValue.' + condition.fieldName, null);
                    }
                }, condition.listeners);

            Ext.apply(condition, {
                itemId: 'condition' + condition.fieldName,
                columnWidth: .33,
                bind: bind,
                listeners: listeners
            });
            conditionMenu.push({
                checked: !condition.hidden,
                hideOnClick: false,
                text: condition.fieldLabel,
                fieldName: condition.fieldName,
                itemId: 'conditionMenu' + condition.fieldName,
                bind: {
                    checked: '{conditions.visible.' + condition.fieldName + '}'
                },
                listeners: {
                    checkchange: function (checkItem, checked) {
                        var me = this;
                        me.getViewModel().set('conditions.visible.' + condition.fieldName, checked);
                    },
                    scope: me
                }
            });
        });

        var tools = {
            xtype: 'fieldcontainer',
            columnWidth: 1,
            fieldLabel: '&nbsp;',
            labelSeparator: '&nbsp;',
            items: [{
                xtype: 'toolbar',
                ui: 'embed',
                items: Ext.Array.union([{
                    iconCls: 'fa fa-search',
                    text: ' 搜索',
                    ui: 'primary',
                    listeners: {
                        click: function () {
                            me.doSearch();
                        },
                        scope: me
                    }
                }, {
                    iconCls: 'fa fa-close',
                    text: '清除',
                    listeners: {
                        click: me.clearConditions,
                        scope: me
                    }
                }, '-', {
                    iconCls: 'fa fa-plus',
                    menu: conditionMenu
                }], me.auxiliaryTools, ['->', {
                    text: '保存为默认搜索条件',
                    listeners: {
                        click: me.saveDefaultConditions,
                        scope: me
                    }
                }, {
                    text: '收起',
                    iconCls: 'fa fa-angle-double-up',
                    ui: 'bulge',
                    listeners: {
                        click: me.conditionsCollapse,
                        scope: me
                    }
                }])
            }]
        };

        return {
            xtype: 'form',
            itemId: 'filter',
            bind: {hidden: '{conditions.collapse}'},
            items: Ext.Array.merge(
                tagSelectorFields,// 选择器
                me.conditions,// 条件
                tools)
        }
    },

    createConditionTagPanel: function () {
        var me = this;

        return {
            xtype: 'toolbar',
            width: '100%',
            padding: '0 0 0 100',
            bind: {hidden: '{!conditions.collapse}'},
            items: [{
                xtype: 'toolbar',
                width: '80%',
                layout: 'column',
                itemId: 'filterTagToolbar',
                ui: 'embed',
                defaults: {
                    margin: '2 3 2 3'
                }
            }, '->', {
                text: '展开',
                iconCls: 'fa fa-angle-double-down',
                ui: 'bulge',
                listeners: {
                    click: me.conditionsExpand,
                    scope: me
                }
            }]
        }
    },

    /**
     * 创建工具栏
     */
    createOperationBar: function () {
        var me = this,
            batchActions = [];

        Ext.Array.each(me.operations, function (operation) {
            if (operation.batchable != true)
                return;

            batchActions.push(Ext.apply({
                itemId: 'btn' + operation.action,
                listeners: {
                    click: function (button) {
                        me.fireEvent('batchaction', button.action, button.text, me.getSelection());
                    },
                    scope: me
                }
            }, operation));
        });

        me.batchActions = batchActions;
        return {
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
                xtype: 'toolbar',
                itemId: 'batchToolbar',
                ui: 'embed',
                items: me.batchActions
            }, {
                xtype: 'toolbar',
                itemId: 'additionalToolbar',
                ui: 'embed'
            }, '->', {
                xtype: 'button',
                text: '列显示设置',
                iconCls: 'fa fa-wrench',
                hidden: !me.columnConfigable,
                listeners: {
                    click: me.columnConfig,
                    scope: me
                }
            }]
        }
    },

    updateBindSelection: function () {
        var me = this;
        me.callParent(arguments);

        me.refreshTakeCount();
        me.refreshBatchAction();
    },

    /**
     * Called when the component is resized.
     *
     * This method is not called on components that use {@link #liquidLayout}, such as
     * {@link Ext.button.Button Buttons} and {@link Ext.form.field.Base Form Fields}.
     *
     * @method
     * @template
     * @protected
     */
    onResize: function (width, height, oldWidth, oldHeight) {
        var me = this;
        me.callParent(arguments);
        me.resizeHeight();
    },

    resizeHeight: function () {
        var me = this,
            exceptHeight = 0;
        Ext.Array.each(me.up().items.items, function (item) {
            if (item !== me) {
                exceptHeight += item.getHeight();
            }
        });
        var maxHeight = document.body.clientHeight - 80;
        me.setHeight(maxHeight - exceptHeight);
    },

    onHeaderContextMenu: function (ct, column, e) {
        e.preventDefault();
        if (column.menuDisabled)
            return;

        var menu = ct.getMenu(),
            ascItem = menu.down('#ascItem'),
            descItem = menu.down('#descItem'),
            sortableMth;

        // Use ownerCmp as the upward link. Menus *must have no ownerCt* - they are global floaters.
        // Upward navigation is done using the up() method.
        menu.activeHeader = menu.ownerCmp = column;
        column.setMenuActive(menu);

        // enable or disable asc & desc menu items based on header being sortable
        sortableMth = column.sortable ? 'enable' : 'disable';
        if (ascItem) {
            ascItem[sortableMth]();
        }
        if (descItem) {
            descItem[sortableMth]();
        }

        ct.showMenuBy(e, column.triggerEl, column);

        // Pointer-invoked menus do not auto focus, key invoked ones do.
        menu.showAt(e.getXY());

        // Menu show was vetoed by event handler - clear context
        if (!menu.isVisible()) {
            ct.onMenuHide(menu);
        }
    },

    onItemContextMenu: function (gridView, record, item, index, e) {
        e.preventDefault();

        var me = this,
            items = [];
        Ext.Array.each(me.operations, function (operation) {
            if (!operation.action)
                return;

            var use = true;
            if (!Ext.isEmpty(operation.actionLimits)) {
                Ext.Array.each(operation.actionLimits, function (actionLimit) {
                    var state = record.get(actionLimit.limitedTo);
                    if (!Ext.Array.contains(actionLimit.srcStates, state)) {
                        use = false;
                    }
                });
            }
            if (use == false)
                return;

            var item = Ext.apply({}, {
                xtype: 'menuitem',
                listeners: {
                    click: function (button) {
                        me.fireEvent('itemaction', button.action, button.text, record);//发起一个方法
                    },
                    scope: me
                }
            }, operation);

            delete item.ui;// 右键菜单不需要ui
            if (me.applyContextMenu(item, record) !== false) {
                items.push(item);
            }
        });

        me.raiseContextMenuItems(items, record);
        if (Ext.isEmpty(items))
            return;

        var contextMenu = Ext.widget('menu', {
            viewModel: {},
            closeAction: 'destroy',
            items: items
        });
        contextMenu.getViewModel().set('authorize', me.getViewModel().get('authorize'));
        contextMenu.showAt(e.getXY());
    }

});