/**
 * 对表格进行了扩展，增加tip显示与错误验证
 * Created by cRazy on 2016/8/26.
 */
Ext.define('overrides.grid.Panel', {
    override: 'Ext.grid.Panel',

    requires: [
        'Ext.grid.column.RowNumberer',
        'Ext.grid.plugin.CellEditing',
        'Ext.tip.ToolTip'
    ],

    // 默认显示竖线
    columnLines: true,

    /**
     * @cfg {boolean} showTip
     */
    showTip: true,

    /**
     * @cfg {Function} validator
     * A custom validation function to be called during field validation ({@link #getErrors}).
     * If specified, this function will be called first, allowing the developer to override the default validation
     * process.
     */
    validator: undefined,

    /**
     * @cfg {boolean} necessary
     * 表格数据是否必须。
     */
    necessary: false,

    /**
     * @cfg {String} blankText
     * The error text to display if the **{@link #allowBlank}** validation fails
     */
    blankText: '该输入项为必输项',

    /**
     * @cfg {String} blankText
     * The error text to display if the **{@link #allowBlank}** validation fails
     */
    necessaryText: '该列表为必输项',

    /**
     * @cfg {boolean} autoAppend
     *  适用于可编辑时，最后一个单元格回车后，自动添加新行
     */
    autoAppend: true,

    initComponent: function () {
        var me = this;
        me.viewConfig = Ext.apply({
            loadingHeight: 70
        }, me.viewConfig);

        me.callParent(arguments);
    },

    /**
     * 根据dataIndex找到第一个column
     * @param dataIndex
     */
    getColumnByName: function (dataIndex) {

    },

    /**
     * @return {Boolean} True if the value is valid, else false
     */
    isValid: function () {
        var me = this,
            errors = me.getErrors();
        return Ext.isEmpty(errors);
    },

    /**
     * @return {String[]} Array of any validation errors
     */
    getErrors: function () {
        var me = this,
            columns = me.getVisibleColumns(),
            store = me.getStore(),
            errors = [], empty = true;

        for (var rowIndex = 0; rowIndex < store.getCount(); rowIndex++) {
            var record = store.getAt(rowIndex),//遍历每一行
                emptyRecord = true;

            Ext.Array.each(columns, function (column) {
                if (column instanceof Ext.grid.column.RowNumberer)return;// 行号列不需要验证

                if (Ext.isEmpty(column.defaultValue)) {// 未设置默认值时，若record中有对应值，则该行不为空。
                    if (!Ext.isEmpty(record.get(column.dataIndex))) {
                        emptyRecord = false;
                    }
                } else if (!record.get(column.dataIndex) === column.defaultValue) {// 设置默认值时，若record中的值与默认值不等，则该行不为空
                    emptyRecord = false;
                }
                return emptyRecord
            });
            if (emptyRecord) {// 整行为空的时候，该行不验证
                continue;
            }

            empty = false;
            Ext.Array.each(columns, function (column) {
                if (column instanceof Ext.grid.column.RowNumberer)return;// 行号列不需要验证

                if (Ext.isEmpty(record.get(column.dataIndex))) {
                    if (column.allowBlank === false) {
                        errors.push(me.createMessage(me.blankText, rowIndex, column));
                    }
                } else if (Ext.isFunction(me.validator)) {
                    var msg = me.validator.call(me, record.get(column.dataIndex), column, rowIndex, record);
                    if (msg !== true) {
                        Ext.Array.each(msg, function (error) {
                            errors.push(me.createMessage(error, rowIndex, column));
                        });
                    }
                }
            });
        }
        if (me.necessary && empty) {
            errors.push(me.createMessage(me.necessaryText));
        }
        return errors;
    },
    /**
     * 创建一个错误消息
     * @param error
     * 错误内容
     * @param rowIndex
     * 错误所在行
     * @param column
     * 错误对应列，若该列为可编辑，则
     */
    createMessage: function (error, rowIndex, column) {
        var me = this,
            message = {
                text: error,
                source: {
                    grid: me,
                    rowIndex: rowIndex ? rowIndex : 0,
                    column: column,
                    focus: function () {
                        var me = this;
                        if (Ext.isEmpty(me.grid) || me.grid.getStore().getTotalCount() == 0) {
                            return;
                        }

                        var record = me.grid.getStore().getAt(me.rowIndex);
                        if (Ext.isEmpty(me.column)) {
                            Ext.Array.each(me.grid.getVisibleColumns(), function (column) {
                                if (!Ext.isEmpty(column.getEditor(record))) {
                                    me.column = column;
                                    return false;
                                }
                            });
                        }
                        if (Ext.isEmpty(me.column)) {
                            me.grid.focus();
                        }
                        var plugins = Ext.Array.filter(me.grid.plugins, function (plugin) {
                            return plugin instanceof Ext.grid.plugin.CellEditing
                        });
                        if (!Ext.isEmpty(plugins)) {
                            plugins[0].startEdit(record, me.column);
                        }
                    }
                }
            };

        if (!Ext.isEmpty(column) && !Ext.isEmpty(column.text)) {
            message.text = '第' + (rowIndex + 1) + '行/' + column.text + "：" + error;
            if (!Ext.isEmpty(me.title)) {
                message.text = me.title + "/" + message.text;
            }
        } else if (!Ext.isEmpty(me.title)) {
            message.text = me.title + "：" + error;
        }
        return message;
    },

    afterRender: function () {
        var me = this;
        me.callParent(arguments);

        if (!me.tip && me.showTip) {
            me.tip = Ext.create('Ext.tip.ToolTip', {
                target: me.getView().el, // 所有的目标元素
                delegate: me.getView().cellSelector, // 每个网格格导致其自己单独的显示和隐藏。
                trackMouse: true,// 在行上移动不能隐藏提示框
                renderTo: Ext.getBody(),// 立即呈现，tip.body可参照首秀前。
                listeners: {
                    beforeshow: function updateTipBody(tip) {// 当元素被显示时动态改变内容.
                        if (me.isDestroyed) {// 当前表格已经别销毁时，不冒泡
                            return false;
                        }
                        if (me.actionableMode || me.view.actionableMode) {// 表格处于编辑状态时，不冒泡
                            return false;
                        }
                        if (!tip.triggerElement || !tip.triggerElement.outerText.trim()) {
                            return false;
                        }
                        tip.update(tip.triggerElement.outerText);//获取节点上内容更新提示
                    }
                }
            });
        }
    },

    onHide: function (animateTarget, cb, scope) {
        var me = this;
        me.callParent(arguments);
        if (me.tip) {
            me.tip.hide();
        }
    },

    /**
     * @private
     * @inheritdoc
     */
    beforeDestroy: function () {
        var me = this;

        if (me.rendered) {
            Ext.destroy(
                me.tip
            );
        }
        me.callParent(arguments);
    }
});