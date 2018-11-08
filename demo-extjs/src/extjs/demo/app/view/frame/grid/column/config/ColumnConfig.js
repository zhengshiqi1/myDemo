/**
 * 列显示设置对话框
 * Created by cRazy on 2016/7/15.
 */
Ext.define('Cpnt.grid.column.config.ColumnConfig', {
    extend: 'Ext.window.Window',
    alias: 'widget.columnconfig',

    requires: [
        'Cpnt.grid.column.config.ColumnConfigTag',
        'Cxt.util.Toast',
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.dd.DDProxy',
        'Ext.dd.DDTarget',
        'Ext.dd.DragDropManager',
        'Ext.form.FieldContainer',
        'Ext.form.FieldSet',
        'Ext.form.Label',
        'Ext.layout.container.Column',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill'
    ],

    modal: true,
    title: '列显示设置',
    width: 800, // 宽度
    layout: 'vbox',// 默认布局，使用者不应该修改
    closable: false,

    /**
     * @cfg {String} filterGroupId
     * 列设置分组id
     */
    filterGroupId: undefined,

    /**
     * @cfg {boolean}用户是否有列显示设置全局配置权限
     * 默认使用多选
     */
    columnSystemConfig: false,

    /**
     * @cfg {Object[]} defaultsColumns
     * 默认列显示配置
     */
    defaultColumns: undefined,

    /**
     * @cfg {Object[]} columns
     * 当前列显示配置
     */
    columns: undefined,

    value: {
        locked: [],
        unlocked: [],
        hidden: []
    },

    initComponent: function () {
        var me = this,
            cfg = me.setupConfig();

        Ext.apply(me, cfg);
        me.callParent(arguments);
        me.setColumns(me.columns);
    },

    setupConfig: function () {
        var me = this;
        return {
            items: [{
                xtype: 'fieldset',
                title: '显示列',
                width: '100%',
                layout: 'vbox',
                items: [{
                    xtype: 'fieldcontainer',
                    itemId: 'lockedContainer',
                    fieldLabel: '固定列',
                    labelWidth: 80,
                    border: true,
                    style: 'border: 1px solid transparent',
                    width: '100%',
                    minHeight: 34,
                    layout: 'column',
                    flex: 1,
                    columnConfig: {
                        hidden: false,
                        locked: true
                    },
                    defaults: {
                        margin: 3
                    }
                }, {
                    xtype: 'fieldcontainer',
                    itemId: 'unlockedContainer',
                    fieldLabel: '非固定列',
                    labelWidth: 80,
                    minHeight: 34,
                    border: true,
                    style: 'border: 1px solid transparent',
                    width: '100%',
                    layout: 'column',
                    flex: 1,
                    margin: '5 0 15 0',
                    columnConfig: {
                        hidden: false,
                        locked: false
                    },
                    defaults: {
                        margin: 3
                    }
                }]
            }, {
                xtype: 'fieldset',
                itemId: 'hiddenSet',
                title: '隐藏列',
                width: '100%',
                layout: 'vbox',
                items: [{
                    xtype: 'fieldcontainer',
                    itemId: 'hiddenContainer',
                    fieldLabel: '&nbsp;',
                    labelSeparator: '&nbsp;',
                    labelWidth: 80,
                    border: true,
                    style: 'border: 1px solid transparent',
                    width: '100%',
                    layout: 'column',
                    columnConfig: {
                        hidden: true
                    },
                    defaults: {
                        margin: 3
                    }
                }, {
                    xtype: 'fieldcontainer',
                    itemId: 'tempContainer',
                    margin: '0 0 0 85px',
                    width: '100%',
                    hidden: true,
                    layout: 'column',
                    defaults: {
                        margin: 3
                    }
                }, {
                    xtype: 'panel',
                    itemId: 'hideTip',
                    width: '100%',
                    layout: {
                        type: 'hbox',
                        align: 'middle ',
                        pack: 'center'
                    },
                    items: [{
                        xtype: 'label',
                        html: '暂无隐藏列，您可以通过点击<span class="fa fa-minus-circle"></span>将不需要显示的表格列隐藏起来。'
                    }]
                }]
            }, {
                xtype: 'toolbar',
                width: '100%',
                items: ['->', {
                    xtype: 'button',
                    text: '保存为系统预设',
                    ui: 'primary',
                    hidden: !me.columnSystemConfig,
                    handler: Ext.bind(me.doSaveGlobal, me)
                }, {
                    xtype: 'button',
                    text: '保存',
                    ui: 'primary',
                    handler: Ext.bind(me.doSave, me)
                }, {
                    xtype: 'button',
                    text: '恢复默认设置',
                    ui: 'link',
                    handler: Ext.bind(me.resetDefault, me)
                }, {
                    xtype: 'button',
                    text: '取消',
                    ui: 'link',
                    handler: Ext.bind(me.doCancel, me)
                }]
            }]
        }
    },

    afterLayout: function () {
        var me = this;
        me.callParent(arguments);

        me.initDD(me.down('#lockedContainer'));
        me.initDD(me.down('#unlockedContainer'));
        me.initDD(me.down('#hiddenContainer'));

        Ext.dd.DragDropManager.notifyOccluded = true;
    },

    onHide: function () {
        var me = this;
        me.callParent(arguments);
        //还原成默认的false
        Ext.dd.DragDropManager.notifyOccluded = false;
    },

    getColumns: function () {
        var me = this;
        return Ext.Array.merge(me.value.locked, me.value.unlocked, me.value.hidden)
    },

    setColumns: function (columns) {
        var me = this;
        me.columns = [];
        Ext.Array.each(columns, function (column) {
            me.columns.push({
                dataIndex: column.dataIndex,
                width: column.width,
                minWidth: column.minWidth,
                text: column.text,
                locked: column.locked,
                hidden: column.hidden,
                hideable: column.hideable
            })
        });

        me.value.locked = Ext.Array.filter(me.columns, function (column) {
            return !Ext.isEmpty(column.dataIndex) && column.locked && !column.hidden;
        });
        me.updateColumns(me.down('#lockedContainer'), me.value.locked);

        me.value.unlocked = Ext.Array.filter(me.columns, function (column) {
            return !Ext.isEmpty(column.dataIndex) && !column.locked && !column.hidden;
        });
        me.updateColumns(me.down('#unlockedContainer'), me.value.unlocked);

        me.value.hidden = Ext.Array.filter(me.columns, function (column) {
            return !Ext.isEmpty(column.dataIndex) && column.hidden;
        });
        me.updateColumns(me.down('#hiddenContainer'), me.value.hidden);
        me.down('#hideTip').setHidden(me.value.hidden.length > 0);
    },

    updateColumns: function (container, columns) {
        var me = this,
            items = [];

        container.columns = columns;
        container.removeAll();
        if (Ext.isEmpty(columns))return;

        Ext.Array.each(columns, function (column) {
            column.hidden = !!column.hidden;
            column.locked = !!column.locked;
            items.push({
                xtype: 'columnconfigtag',
                itemId: column.dataIndex,
                column: column,
                listeners: {
                    columnchange: function (tag, column) {
                        me.columnChange(column);
                    }
                }
            })
        });
        container.add(items);
    },

    doSaveGlobal: function () {
        var me = this;

        Ext.Ajax.request({
            url: 'commons/search/columnConfig/save.hd?globe=true&filterGroupId=' + me.filterGroupId,
            jsonData: me.getColumns(),
            success: function () {
                Cxt.util.Toast.success('成功保存列显示设置为系统预设', true);
            },
            failure: function (response) {
                Cxt.util.Toast.failure(response.responseText, true);
            }
        });
    },

    doSave: function () {
        var me = this;

        Ext.Ajax.request({
            url: 'commons/search/columnConfig/save.hd?filterGroupId=' + me.filterGroupId,
            jsonData: me.getColumns(),
            success: function () {
                Cxt.util.Toast.success('成功保存列显示设置', true);
                me.fireEvent('complete', me, me.getColumns());
                me.hide();
            },
            failure: function (response) {
                Cxt.util.Toast.failure(response.responseText, true);
            }
        });
    },

    resetDefault: function () {
        var me = this;
        me.setColumns(me.defaultColumns);
    },

    doCancel: function () {
        var me = this;
        me.hide();
    },

    columnChange: function (column) {
        var me = this,
            value = me.value,
            columnTag = me.down('#' + column.dataIndex);

        Ext.Array.remove(value.locked, column);
        Ext.Array.remove(value.unlocked, column);
        Ext.Array.remove(value.hidden, column);

        columnTag.up().remove(columnTag, false);
        if (column.hidden) {
            Ext.Array.push(value.hidden, column);
            me.down('#hiddenContainer').add(columnTag);
        } else if (column.locked) {
            Ext.Array.push(value.locked, column);
            me.down('#lockedContainer').add(columnTag);
        } else {
            Ext.Array.push(value.unlocked, column);
            me.down('#unlockedContainer').add(columnTag);
        }
        me.down('#hideTip').setHidden(value.hidden.length > 0);
    },


    //------------------------------------------------------------
    // Drag and Drop
    //------------------------------------------------------------
    initDD: function (fieldset) {
        var me = this;

        new Ext.dd.DDTarget(fieldset.id, 'fieldset', {});

        fieldset.items.each(function (item) {
            new Ext.dd.DDTarget(item.id, 'fieldset', {});
            // var ddproxy = item.el.initDDProxy('fieldset', {}, {

            var ddproxy = new Ext.dd.DDProxy(item.id, 'fieldset', {});
            Ext.apply(ddproxy, {
                ddp: item,
                fieldset: fieldset,
                column: item.column,
                ddpIndex: fieldset.items.indexOf(item),

                startDrag: function () {
                    this.ddp.up().remove(this.ddp, false);
                    me.down('#tempContainer').add(this.ddp);
                    me.down('#hiddenContainer').show();
                    me.down('#hideTip').hide();

                    this.getDragEl().innerHTML =
                        '<span style="display:inline-block;width: 150px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;;">' + this.column.text + '</span>';
                    Ext.Array.remove(this.fieldset.columns, this.column);

                    this.dragHolder = Ext.create({
                        xtype: 'columnconfigtag',
                        cls: 'drag-frame',
                        column: '&nbsp;'
                    });
                    this.fieldset.insert(this.ddpIndex, this.dragHolder);
                    this.dragHolderDDT = new Ext.dd.DDTarget(this.dragHolder.id, 'fieldset', {});
                },
                onDragEnter: function (e, targetId) {
                    var target = Ext.get(targetId);
                    var component = target.component;
                    if (this.column.hideable === false && component.up().getItemId() === 'hiddenSet')
                        return;
                    Ext.get(targetId).addCls('drag-enter');
                    if (component.xtype == 'columnconfigtag') {
                        if (component == this.dragHolder) {
                            this.fieldset.insert(this.ddpIndex, this.dragHolder);
                        } else if (this.fieldset.items.indexOf(component) >= this.ddpIndex) {
                            component.up().moveAfter(this.dragHolder, component);
                        } else {
                            component.up().moveBefore(this.dragHolder, component);
                        }
                    } else if (component instanceof Ext.container.Container) {
                        component.add(this.dragHolder);
                        this.dragHolder.setMargin(3);
                        if (this.lastTarget && this.lastTarget != target)
                            this.lastTarget.removeCls('drag-enter');
                        this.lastTarget = target;
                    }
                },
                onDragOut: function (e, targetId) {
                    var target = Ext.get(targetId);
                    var component = target.component;
                    if (component.xtype == 'columnconfigtag') {
                        target.removeCls('drag-enter');
                    }
                },
                endDrag: function () {
                    this.lastTarget.removeCls('drag-enter');

                    var component = this.dragHolder.up(),
                        columns = component.columns;
                    component.moveBefore(this.ddp, this.dragHolder);
                    component.remove(this.dragHolder);
                    this.dragHolderDDT.destroy();

                    Ext.apply(this.column, component.columnConfig);
                    Ext.Array.insert(columns, component.items.indexOf(this.ddp), [this.column]);
                    this.ddp.setColumn(this.column);
                    me.down('#hideTip').setHidden(me.down('#hiddenContainer').items.items.length > 0);
                }
            });
            ddproxy.constrainTo(me.id);
        });
    }
});