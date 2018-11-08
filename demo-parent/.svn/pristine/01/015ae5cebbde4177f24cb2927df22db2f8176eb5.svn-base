/**
 * 针对表格的分组功能做了修改。
 * Created by cRazy on 2016/8/26.
 */
Ext.define('overrides.grid.feature.Grouping', {
    override: 'Ext.grid.feature.Grouping',

    requires: [
        'Ext.data.BufferedStore',
        'Ext.grid.header.Container',
        'Ext.menu.Separator'
    ],

    cancelGroupText: '取消分组',

    groupHeaderTpl: '{columnName}: {name} (数量 {rows.length})',
    hideGroupedHeader: true,
    startCollapsed: true,

    init: function () {
        var me = this,
            groupings = {};
        me.callParent(arguments);

        Ext.Array.each(me.grid.columns, function (column) {
            groupings[column.dataIndex] = me;
        });
        if (!me.view.ownerGrid.groupings) {
            me.view.ownerGrid.groupings = {};
        }
        Ext.apply(me.view.ownerGrid.groupings, groupings);
    },

    getMenuItems: function () {
        var me = this,
            groupByText = me.groupByText,
            disabled = me.disabled || !me.getGroupField(),
            cancelGroupText = me.cancelGroupText,
            enableNoGroups = me.enableNoGroups,
            getMenuItems = me.view.headerCt.getMenuItems;

        // runs in the scope of headerCt
        return function () {

            // We cannot use the method from HeaderContainer's prototype here
            // because other plugins or features may already have injected an implementation
            var o = getMenuItems.call(this);
            o.push({
                itemId: 'groupItemSeparator',
                xtype: 'menuseparator'
            }, {
                iconCls: Ext.baseCSSPrefix + 'group-by-icon',
                itemId: 'groupMenuItem',
                text: groupByText,
                handler: me.onGroupMenuItemClick,
                scope: me
            });
            if (enableNoGroups) {
                o.push({
                    itemId: 'groupToggleMenuItem',
                    text: cancelGroupText,
                    hidden: disabled,
                    handler: me.onGroupToggleMenuItemClick,
                    scope: me
                });
            }
            return o;
        };
    },

    onGroupMenuItemClick: function (menuItem, e) {
        var me = this,
            menu = menuItem.parentMenu,
            column = menu.activeHeader,
            grouping = me.grid.ownerGrid.groupings[column.dataIndex];
        grouping.columnGroup(column);
    },

    /**
     * Turn on and off grouping via the menu
     * @private
     */
    onGroupToggleMenuItemClick: function () {
        var me = this;
        me.view.ownerGrid.grouping.cancelGroup();
    },

    /**
     * 按指定列进行分组
     */
    columnGroup: function (column) {
        var me = this,
            view = me.view,
            store = me.getGridStore();

        if (store instanceof Ext.data.BufferedStore) {
            me.fireEvent('menuclick', me, column.stateId);
            return;
        }
        if (me.disabled) {
            me.lastGrouper = null;
            me.block();
            me.enable();
            me.unblock();
        }
        view.isGrouping = true;

        // First check if there is a grouper defined for the feature. This is
        // necessary
        // when the value is a complex type.
        // 配置groupIndex，寻找group
        var grouper = {};
        if (column.groupFn) {
            grouper = {
                property: column.dataIndex,
                groupFn: column.groupFn
            }
        } else {
            grouper = me.getGrouper(column.dataIndex);
        }

        view.ownerGrid.grouping = me;

        // Override分组不能使用远程排序
        me.storeRemoteSort = store.getRemoteSort();
        store.setRemoteSort(false);
        store.group(grouper || column.dataIndex);
        me.pruneGroupedHeader();
    },

    /**
     * 取消分组
     */
    cancelGroup: function () {
        var me = this,
            store = me.getGridStore();
        // Override取消分组的时候，需要还原排序方案。
        store.setRemoteSort(me.storeRemoteSort);
        me.disable();
    },

    /**
     * @Override
     *  重写该方法，取消groupToggleMenuItem的勾选
     */
    showMenuBy: function (clickEvent, t, header) {
        var me = this,
            menu = me.getMenu(),
            groupMenuItem = menu.down('#groupMenuItem'),
            groupItemSeparator = menu.down('#groupItemSeparator'),
            groupToggleMenuItem = menu.down('#groupToggleMenuItem'),
            isGrouped = me.grid.getStore().isGrouped();

        groupMenuItem.setHidden(header.groupable === false);
        if (header.groupable === false || !header.dataIndex || header.ownerCt.items.items.length < 2) {
            groupMenuItem.disable();
        } else if (Ext.Array.filter(header.ownerCt.items.items, function (item) {
                return !!item.dataIndex;
            }).length <= 1) {
            groupMenuItem.disable();
        } else {
            groupMenuItem.enable();
        }
        if (groupToggleMenuItem) {
            groupToggleMenuItem.setHidden(!isGrouped, true);
            groupToggleMenuItem[isGrouped ? 'enable' : 'disable']();
        }
        groupItemSeparator.setHidden(groupMenuItem.hidden && groupToggleMenuItem.hidden);
        Ext.grid.header.Container.prototype.showMenuBy.apply(me, arguments);
    },

    /**
     * @Override
     *  重写该方法，取消groupToggleMenuItem的勾选
     */
    enable: function () {
        var me = this,
            view = me.view,
            store = me.getGridStore(),
            currentGroupedHeader = me.hideGroupedHeader && me.getGroupedHeader(),
            groupToggleMenuItem;

        view.isGrouping = true;
        if (view.lockingPartner) {
            view.lockingPartner.isGrouping = true;
        }

        me.disabled = false;

        if (me.lastGrouper) {
            store.group(me.lastGrouper);
            me.lastGrouper = null;
        }

        // Update the UI.
        if (currentGroupedHeader) {
            currentGroupedHeader.hide();
        }

        groupToggleMenuItem = me.view.headerCt.getMenu().down('#groupToggleMenuItem');
        if (groupToggleMenuItem) {
            groupToggleMenuItem.show();
        }
    },

    /**
     * @Override
     *  重写该方法，取消groupToggleMenuItem的勾选
     */
    disable: function () {
        var me = this,
            view = me.view,
            store = me.getGridStore(),
            currentGroupedHeader = me.hideGroupedHeader && me.getGroupedHeader(),
            lastGrouper = store.getGrouper(),
            groupToggleMenuItem;


        view.isGrouping = false;
        if (view.lockingPartner) {
            view.lockingPartner.isGrouping = false;
        }

        me.disabled = true;

        if (lastGrouper) {
            me.lastGrouper = lastGrouper;
            store.clearGrouping();
        }

        // Update the UI.
        if (currentGroupedHeader) {
            currentGroupedHeader.show();
        }

        groupToggleMenuItem = me.view.headerCt.getMenu().down('#groupToggleMenuItem');
        if (groupToggleMenuItem) {
            groupToggleMenuItem.hide();
        }
    },

    /** @Override
     *
     * @param record
     * @param idx
     * @param rowValues
     */
    setupRowData: function (record, idx, rowValues) {
        var me = this,
            grid = me.grid;
        grid = grid.ownerLockable || grid;
        var recordIndex = rowValues.recordIndex,
            data = me.refreshData,
            metaGroupCache = me.getCache(),
            header = data.header,
            groupField = data.groupField,
            store = me.getGridStore(),
            dataSource = me.view.dataSource,
            isBufferedStore = dataSource.isBufferedStore,
            group = record.group,
            column = grid.columnManager.getHeaderByDataIndex(groupField), // Override此处应该是Ext的bug。
            hasRenderer = !!(column && column.renderer),
            grouper, groupName, prev, next, items;

        rowValues.isCollapsedGroup = false;
        rowValues.summaryRecord = rowValues.groupHeaderCls = null;

        if (data.doGrouping) {
            grouper = store.getGrouper();

            // This is a placeholder record which represents a whole collapsed group
            // It is a special case.
            if (record.isCollapsedPlaceholder) {
                groupName = group.getGroupKey();
                items = group.items;

                rowValues.isFirstRow = rowValues.isLastRow = true;
                rowValues.groupHeaderCls = me.hdCollapsedCls;
                rowValues.isCollapsedGroup = rowValues.needsWrap = true;
                rowValues.groupName = groupName;
                rowValues.metaGroupCache = metaGroupCache;
                metaGroupCache.groupField = groupField;
                metaGroupCache.name = metaGroupCache.renderedGroupValue = hasRenderer ? column.renderer(group.getAt(0).get(groupField), {}, record) : groupName;
                metaGroupCache.groupValue = items[0].get(groupField);
                metaGroupCache.columnName = header ? header.text : groupField;
                rowValues.collapsibleCls = me.collapsible ? me.collapsibleCls : me.hdNotCollapsibleCls;
                metaGroupCache.rows = metaGroupCache.children = items;
                if (me.showSummaryRow) {
                    rowValues.summaryRecord = data.summaryData[groupName];
                }
                return;
            }

            groupName = grouper.getGroupString(record);

            // If caused by an update event on the first or last records of a group fired by a GroupStore, the record's group will be attached.
            if (group) {
                items = group.items;
                rowValues.isFirstRow = record === items[0];
                rowValues.isLastRow = record === items[items.length - 1];
            }

            else {
                // See if the current record is the last in the group
                rowValues.isFirstRow = recordIndex === 0;
                if (!rowValues.isFirstRow) {
                    prev = store.getAt(recordIndex - 1);
                    // If the previous row is of a different group, then we're at the first for a new group
                    if (prev) {
                        // Must use Model's comparison because Date objects are never equal
                        rowValues.isFirstRow = !prev.isEqual(grouper.getGroupString(prev), groupName);
                    }
                }

                // See if the current record is the last in the group
                rowValues.isLastRow = recordIndex === (isBufferedStore ? store.getTotalCount() : store.getCount()) - 1;
                if (!rowValues.isLastRow) {
                    next = store.getAt(recordIndex + 1);
                    if (next) {
                        // Must use Model's comparison because Date objects are never equal
                        rowValues.isLastRow = !next.isEqual(grouper.getGroupString(next), groupName);
                    }
                }
            }

            if (rowValues.isFirstRow) {
                metaGroupCache.groupField = groupField;
                metaGroupCache.name = metaGroupCache.renderedGroupValue = hasRenderer ? column.renderer(record.get(groupField), {}, record) : groupName;
                metaGroupCache.groupValue = record.get(groupField);
                metaGroupCache.columnName = header ? header.text : groupField;
                rowValues.collapsibleCls = me.collapsible ? me.collapsibleCls : me.hdNotCollapsibleCls;
                rowValues.groupName = groupName;

                if (!me.isExpanded(groupName)) {
                    rowValues.itemClasses.push(me.hdCollapsedCls);
                    rowValues.isCollapsedGroup = true;
                }

                // We only get passed a GroupStore if the store is not buffered.
                if (isBufferedStore) {
                    metaGroupCache.rows = metaGroupCache.children = [];
                } else {
                    metaGroupCache.rows = metaGroupCache.children = me.getRecordGroup(record).items;
                }

                rowValues.metaGroupCache = metaGroupCache;
            }

            if (rowValues.isLastRow) {
                // Add the group's summary record to the last record in the group
                if (me.showSummaryRow) {
                    rowValues.summaryRecord = data.summaryData[groupName];
                    rowValues.itemClasses.push(Ext.baseCSSPrefix + 'grid-group-last');
                }
            }
            rowValues.needsWrap = (rowValues.isFirstRow || rowValues.summaryRecord);
        }
    }
});