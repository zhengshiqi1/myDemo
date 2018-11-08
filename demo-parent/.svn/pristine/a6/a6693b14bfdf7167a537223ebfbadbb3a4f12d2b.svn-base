/**
 * 为设置了必填的表单字段，添加<span style="color: red">*</span>。
 */
Ext.define('overrides.form.field.ComboBox', {
    override: 'Ext.form.field.ComboBox',

    /**
     * @cfg {boolean} queryOnExpand
     * 当展开的时候是否进行查询
     */
    queryOnExpand: false,

    initComponent: function () {
        var me = this;
        if (me.pageSize > 0) {
            Ext.apply(me.store, {pageSize: me.pageSize});
        }

        me.callParent(arguments);
    },


    /**
     * @private
     * Execute the query with the raw contents within the textfield.
     */
    doRawQuery: function () {
        var me = this,
            rawValue = me.inputEl.dom.value;
        // Use final bit after comma as query value if multiselecting
        if (me.multiSelect) {
            rawValue = rawValue.split(me.delimiter).pop();
        }
        if (rawValue && rawValue.trim() == me.lastQuery) {
            return;
        }
        me.doQuery(rawValue, false, true);
    },

    /**
     * Expands this field's picker dropdown.
     */
    expand: function () {
        var me = this;
        if (me.queryOnExpand === true) {
            delete me.lastQuery;
        }

        return me.callParent(arguments);
    },


    /**
     * @private
     * Sets or adds a value/values
     */
    doSetValue: function (value /* private for use by addValue */, add) {
        var me = this;
        me.callParent(arguments);
    },

    /**
     * @private
     * Internal setting of value when records are added to the valueCollection
     * setValue itself adds to the valueCollection.
     */
    updateValue: function () {
        var me = this,
            selectedRecords = me.valueCollection.getRange(),
            len = selectedRecords.length,
            valueArray = [],
            displayTplData = me.displayTplData || (me.displayTplData = []),
            inputEl = me.inputEl,
            i, record;

        // Loop through values, matching each from the Store, and collecting matched records
        displayTplData.length = 0;
        for (i = 0; i < len; i++) {
            record = selectedRecords[i];
            displayTplData.push(me.getRecordDisplayData(record));

            // There might be the bogus "value not found" record if forceSelect was set. Do not include this in the value.
            if (record !== me.valueNotFoundRecord) {
                if (me.valueField === '.') {
                    valueArray.push(record.getData());
                } else {
                    valueArray.push(record.get(me.valueField));
                }
            }
        }

        // Set the value of this field. If we are multiselecting, then that is an array.
        me.setHiddenValue(valueArray);
        me.value = me.multiSelect ? valueArray : valueArray[0];
        if (!Ext.isDefined(me.value)) {
            me.value = undefined;
        }
        me.displayTplData = displayTplData; //store for getDisplayValue method

        if (inputEl && me.emptyText && !Ext.isEmpty(me.value)) {
            inputEl.removeCls(me.emptyCls);
        }

        // Calculate raw value from the collection of Model data
        me.setRawValue(me.getDisplayValue());
        me.checkChange();

        me.applyEmptyText();
    }
});