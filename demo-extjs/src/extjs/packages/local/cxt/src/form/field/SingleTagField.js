/**
 * tagfield的定制版。
 * 限定单选。
 * Created by cRazy on 2016/7/23.
 */
Ext.define('Cxt.form.field.SingleTagField', {
    extend: 'Ext.form.field.Tag',
    alias: 'widget.singletagfield',

    requires: [
        'Ext.form.field.Tag'
    ],

    ui: 'singletag',

    /**
     * @cfg {boolean} clearable
     * 允许清除选项值
     */
    clearable: true,

    /**
     * @cfg {boolean} clearable
     * 允许清除选项值
     */
    queryAsValue: false,

    triggers: {
        picker: {
            weight: 999
        },
        clear: {
            id: 'clear',
            hidden: true,
            cls: 'fa fa-times-circle',
            handler: function (me) {
                me.valueCollection.remove(me.selectionModel.getSelection());
                me.selectionModel.clearSelections();
                me.pickerSelectionModel.deselectAll();
                if (me.picker) {
                    me.picker.getSelectionModel().lastSelected = 0;
                }
                me.getTrigger('clear').hide();
                me.fireEvent('select', me, me.getValueRecord());
            }
        }
    },

    /**
     * 对象查询。
     * 查询的目标是object。考虑到基本为对象查询，默认为true
     */
    objectQuery: true,

    singleTagItemCls: Ext.baseCSSPrefix + 'singletag-item',
    tagItemTextCls: Ext.baseCSSPrefix + 'singletag-item-text',

    /**
     * @private
     * @cfg
     */
    fieldSubTpl: [
        '<div id="{cmpId}-listWrapper" data-ref="listWrapper" class="' + Ext.baseCSSPrefix + 'tagfield {fieldCls} {typeCls} {typeCls}-{ui}" style="{wrapperStyle}">',
        '<ul id="{cmpId}-itemList" data-ref="itemList" class="' + Ext.baseCSSPrefix + 'tagfield-list{itemListCls}">',
        '<li id="{cmpId}-inputElCt" data-ref="inputElCt" class="' + Ext.baseCSSPrefix + 'tagfield-input ',
        Ext.baseCSSPrefix + 'singletag-input">',
        '<input id="{cmpId}-inputEl" data-ref="inputEl" type="{type}" ',
        '<tpl if="name">name="{name}" </tpl>',
        '<tpl if="value"> value="{[Ext.util.Format.htmlEncode(values.value)]}"</tpl>',
        '<tpl if="size">size="{size}" </tpl>',
        '<tpl if="tabIdx != null">tabindex="{tabIdx}" </tpl>',
        '<tpl if="disabled"> disabled="disabled"</tpl>',
        'class="' + Ext.baseCSSPrefix + 'tagfield-input-field {inputElCls}" autocomplete="off">',
        '</li>',
        '</ul>',
        '</div>',
        {
            disableFormats: true
        }
    ],

    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            stacked: false,
            multiSelect: false,
            clearValueOnEmpty: true,
            selectOnFocus: false,
            tipTpl: me.labelTpl ? me.labelTpl : ( '{' + me.displayField + '}')
        });

        me.callParent(arguments);
    },

    onValueCollectionEndUpdate: function () {
        var me = this;
        me.callParent(arguments);
        if (me.rendered) {
            me.inputEl.dom.value = '';
            var tagItems = me.listWrapper.query(me.tagItemSelector);
            if (!Ext.isEmpty(tagItems)) {
                me.itemEl = tagItems[0];
            } else {
                me.itemEl = undefined;
            }
            me.collapse();
            me.applyEmptyText();
        }
    },

    /** 选择的必然是取值的*/
    getSelection: function () {
        return this.getValueRecord();
    },

    /**
     * Intercept calls to onBlur to remove focusCls, because the base field
     * classes assume this should be applied to inputEl
     */
    onBlur: function () {
        var me = this,
            rec = me.itemEl ? me.getRecordByListItemNode(me.itemEl) : undefined,
            selModel = me.selectionModel;

        if (rec && selModel.isSelected(rec)) {
            selModel.deselect(rec);
        }
        me.callParent(arguments);

    },
    /**
     * Returns the records for the field's current value
     * @return {Object} The records for the field's current value
     */
    getValueRecord: function () {
        var me = this,
            valueRecords = me.getValueRecords();
        if (Ext.isEmpty(valueRecords))
            return undefined;
        return valueRecords[0];
    },

    getQueryString: function () {
        var me = this;
        if (me.rendered)
            return me.inputEl.dom.value;
    },

    setQueryString: function (query) {
        var me = this;
        if (me.rendered) {
            me.inputEl.dom.value = query;
        }
    },

    afterComponentLayout: function () {
        var me = this;

        me.callParent(arguments);

        if (me.itemList && me.listWrapper) {
            me.itemList.setWidth(me.listWrapper.getWidth() - 10);
            me.itemListResize = true;
        }
        if (me.inputted) {
            me.getTrigger('clear').setVisible(me.clearable);
            if (me.inputEl)
                me.inputEl.setWidth(10);
        } else {
            me.getTrigger('clear').hide();
            if (me.inputEl)
                me.inputEl.setWidth(me.itemList.getWidth());
        }
    },

    // Private internal setting of value when records are added to the valueCollection
    // setValue itself adds to the valueCollection.
    updateValue: function () {
        var me = this;
        me.inputted = !Ext.isEmpty(me.getValueRecords());

        if (me.itemList && me.listWrapper) {
            me.itemList.setWidth(me.listWrapper.getWidth() - 20);
            me.itemListResize = true;
        }
        if (me.inputted) {
            me.getTrigger('clear').setVisible(me.clearable);
            if (me.inputEl)
                me.inputEl.setWidth(10);
        } else {
            me.getTrigger('clear').hide();
            if (me.inputEl)
                me.inputEl.setWidth(me.itemList.getWidth());
        }
        me.callParent(arguments);
    },

    /**
     * Removal of labelled item by node reference
     */
    removeByListItemNode: function (itemEl) {
        var me = this,
            valueCollection = me.valueCollection,
            selModel = me.selectionModel,
            record = itemEl ? me.getRecordByListItemNode(itemEl) : undefined;

        if (record) {
            me.pickerSelectionModel.deselect(record);
            valueCollection.remove(selModel.getSelection());
            selModel.clearSelections();
            me.setSelection();// selection也要清掉
            if (me.picker) {
                me.picker.getSelectionModel().lastSelected = 0;
            }
        }
        delete me.lastQuery;
    },

    onTriggerClick: function (e) {
        var me = this;
        if (e && e.currentTarget) {// 异常的bug。itemList点击会触发该事件
            return;
        }
        if (!me.readOnly && !me.disabled) {
            if (me.isExpanded) {
                me.collapse();
            } else {
                if (me.triggerAction === 'all') {
                    me.doQuery(me.getQueryString(), true);
                } else if (me.triggerAction === 'last') {
                    me.doQuery(me.lastQuery, true);
                } else {
                    me.doQuery(me.getRawValue(), false, true);
                }
            }
        }
    },

    /**
     * Delegation control for selecting and removing labeled items or triggering list collapse/expansion
     * @protected
     */
    onItemListClick: function (e) {
        var me = this,
            selectionModel = me.selectionModel,
            itemEl = e.getTarget(me.tagItemSelector),
            closeEl = itemEl ? e.getTarget(me.tagItemCloseSelector) : false;

        if (me.readOnly || me.disabled) {
            return;
        }

        e.stopPropagation();

        if (itemEl) {
            if (closeEl) {
                me.removeByListItemNode(itemEl);
                me.fireEvent('select', me, me.getValueRecord());
            } else {
                // me.toggleSelectionByListItemNode(itemEl, e.shiftKey);
            }
            // If not using touch interactions, focus the input
            if (!Ext.supports.TouchEvents) {
                me.inputEl.focus();
            }
        } else {
            if (selectionModel.getCount() > 0) {
                selectionModel.deselectAll();
            }
            me.inputEl.focus();
            if (me.triggerOnClick) {
                me.onTriggerClick();
            }
        }
    },

    /**
     * Handles keyDown processing of key-based selection of labeled items.
     * Supported keyboard controls:
     *
     * - If pick list is expanded
     *
     *     - `CTRL-A` will select all the items in the pick list
     *
     * - If the cursor is at the beginning of the input field and there are values present
     *
     *     - `CTRL-A` will highlight all the currently selected values
     *     - `BACKSPACE` and `DELETE` will remove any currently highlighted selected values
     *     - `RIGHT` and `LEFT` will move the current highlight in the appropriate direction
     *     - `SHIFT-RIGHT` and `SHIFT-LEFT` will add to the current highlight in the appropriate direction
     *
     * @protected
     */
    onKeyDown: function (e) {
        var me = this,
            key = e.getKey(),
            inputEl = me.inputEl,
            rawValue = inputEl.dom.value,
            valueCollection = me.valueCollection,
            selModel = me.selectionModel,
            record = me.itemEl ? me.getRecordByListItemNode(me.itemEl) : undefined,
            stopEvent = false,
            lastSelectionIndex;

        if (me.readOnly || me.disabled) {
            e.stopEvent();
            return;
        }

        if (valueCollection.getCount() > 0 && (rawValue === '' || (me.getCursorPosition() === 0 && !me.hasSelectedText()))) {
            // Keyboard navigation of current values
            lastSelectionIndex = (selModel.getCount() > 0) ? valueCollection.indexOf(selModel.getLastSelected()) : -1;

            if (key === e.BACKSPACE) {
                if (me.clearable) {
                    me.removeByListItemNode(me.itemEl);
                    me.fireEvent('select', me, me.valueStore.getRange());
                }
                stopEvent = true;
            } else if (key === e.DELETE) {
                // Delete token
                if (selModel.isSelected(record) && me.clearable) {
                    me.removeByListItemNode(me.itemEl);
                    me.fireEvent('select', me, me.valueStore.getRange());
                }
                stopEvent = true;
            } else if (key === e.RIGHT || key === e.LEFT) {
                // Navigate and select tokens
                if (lastSelectionIndex === -1 && key === e.LEFT) {
                    selModel.select(valueCollection.last());
                    stopEvent = true;
                } else if (lastSelectionIndex > -1) {
                    if (key === e.RIGHT) {
                        if (lastSelectionIndex < (valueCollection.getCount() - 1)) {
                            selModel.select(lastSelectionIndex + 1, e.shiftKey);
                            stopEvent = true;
                        } else if (!e.shiftKey) {
                            selModel.deselectAll();
                            stopEvent = true;
                        }
                    } else if (key === e.LEFT && (lastSelectionIndex > 0)) {
                        selModel.select(lastSelectionIndex - 1, e.shiftKey);
                        stopEvent = true;
                    }
                }
            } else if (key === e.A && e.ctrlKey) {
                // Select all tokens
                selModel.selectAll();
                stopEvent = e.A;
            } else {
                stopEvent = true;
            }
        }

        if (stopEvent) {
            me.preventKeyUpEvent = stopEvent;
            e.stopEvent();
            return;
        }

        // Prevent key up processing for enter if it is being handled by the picker
        if (me.isExpanded && key === e.ENTER && me.picker.highlightedItem) {
            me.preventKeyUpEvent = true;
        }

        if (me.enableKeyEvents) {
            this.fireEvent('keydown', this, e);
        }

        if (!e.isSpecialKey() && !e.hasModifier()) {
            selModel.deselectAll();
        }
    },

    onFieldMutation: function (e) {
        var me = this,
            key = e.getKey(),
            isDelete = key === e.BACKSPACE || key === e.DELETE,
            rawValue = me.inputEl.dom.value,
            len = rawValue.length;

        // Do not process two events for the same mutation.
        // For example an input event followed by the keyup that caused it.
        // We must process delete keyups.
        // Also, do not process TAB event which fires on arrival.
        if (!me.readOnly && (rawValue !== me.lastMutatedValue || isDelete) && key !== e.TAB) {
            me.lastMutatedValue = rawValue;
            me.lastKey = key;
            if (len && (e.type !== 'keyup' || (!e.isSpecialKey() || isDelete))) {
                me.doQueryTask.delay(me.queryDelay);
            } else {
                // We have *erased* back to empty if key is a delete, or it is a non-key event (cut/copy)
                if (!len && (!key || isDelete)) {
                    if (me.itemEl) {//当有itemEl的时候，交由keyDown来处理
                        return;
                    }
                    if (!me.clearable) {// 不允许清除的时候不允许删除
                        return;
                    }
                    // Essentially a silent setValue.
                    // Clear our value, and the tplData used to construct a mathing raw value.
                    if (!me.multiSelect) {
                        me.value = null;
                        me.displayTplData = undefined;
                    }
                    // If the value is blank we can't have a value
                    if (me.clearValueOnEmpty) {
                        me.valueCollection.removeAll();
                    }

                    // Just erased back to empty. Hide the dropdown.
                    me.collapse();

                    // There may have been a local filter if we were querying locally.
                    // Clear the query filter and suppress the consequences (we do not want a list refresh).
                    if (me.queryFilter) {
                        // Must set changingFilters flag for this.checkValueOnChange.
                        // the suppressEvents flag does not affect the filterchange event
                        me.changingFilters = true;
                        me.store.removeFilter(me.queryFilter, true);
                        me.changingFilters = false;
                    }
                }
            }
        }

        if (me.queryAsValue) {
            var task = me.checkChangeTask;
            if (!me.readOnly && !(e.type === 'propertychange' && me.ignoreChangeRe.test(e.browserEvent.propertyName))) {
                if (!task) {
                    me.checkChangeTask = task = new Ext.util.DelayedTask(me.doCheckQueryChangeTask, me);
                }
                task.delay(me.checkChangeBuffer);
            }
        }
    },

    doCheckQueryChangeTask: function () {
        var me = this,
            newVal, oldVal;

        if (!me.suspendCheckChange) {
            newVal = me.getQueryString();
            oldVal = me.lastQuery;

            var errors = me.getQueryErrors(),
                isValid = Ext.isEmpty(errors);
            if (!me.preventMark) {
                if (isValid) {
                    me.clearInvalid();
                } else {
                    me.markInvalid(errors);
                }
            }

            if (!me.destroyed && isValid && me.didValueChange(newVal, oldVal)) {
                me.fireEvent('querychange', me, newVal, oldVal);
                me.publishState('queryString', newVal);
            }
        }
    },

    checkValueOnChange: function () {
        var me = this;

        // Will be triggered by removal of filters upon destroy
        if (!me.destroying && me.getStore().isLoaded()) {
            // If multiselecting and the base store is modified, we may have to remove records from the valueCollection
            // if they have gone from the base store, or update the rawValue if selected records are mutated.
            // TODO: 5.1.1: Use a ChainedStore for multiSelect so that selected records are not filtered out of the
            // base store and are able to be removed.
            // See https://sencha.jira.com/browse/EXTJS-16096
            if (me.multiSelect) {
                // TODO: Implement in 5.1.1 when selected records are available for modification and not filtered out.
                // valueCollection must be in sync with what's available in the base store, and rendered rawValue/tags
                // must match any updated data.
            }
            else {
                if (me.forceSelection && !me.changingFilters && !me.findRecordByValue(me.value)) {
                    // 解决翻页选择的问题。仅对数据不正确时做清空处理
                    if (!me.getValueRecord() || me.getValueRecord().get(me.valueField) != me.value)
                        me.setValue(null);
                }
            }
        }
    },

    createPicker: function () {
        var me = this,
            picker = me.callParent(arguments);
        Ext.apply(picker, {
            // invoked by the selection model to maintain visual UI cues
            onItemDeselect: function (record) {
                var node = this.getNode(record);

                if (node) {
                    Ext.fly(node).removeCls(this.selectedItemCls);
                    Ext.fly(node).removeCls(this.overItemCls);// over 也要去掉
                }
            }
        });
        return picker;
    },

    /**
     * @private
     * If the autoSelect config is true, and the picker is open, highlights the first item.
     */
    doAutoSelect: function () {
        var me = this,
            picker = me.picker;
        if (!picker)
            return;

        if (me.autoSelect && me.store.getCount() > 0) {
            if (me.getValueRecord()) {
            }
            // Highlight the last selected item and scroll it into view
            picker.getNavigationModel().setPosition(me.picker.getSelectionModel().lastSelected || 0);
        } else {
            picker.getNavigationModel().setPosition(0);
        }
    },

    /**
     * Overridden to handle partial-input selections more directly
     */
    assertValue: function () {
        var me = this;
        // 作为一个单选控件，只需要清空输入框的值就可以了
        if (!me.queryAsValue) {
            me.inputEl.dom.value = '';
        }
        me.collapse();
    },

    getValueData: function () {
        var me = this;
        return me.getValueRecord() ? me.getValueRecord().getData() : null;
    },

    setValueData: function (valueData) {
        var me = this;
        if (Ext.encode(me.getValueData()) == Ext.encode(valueData)) {
            return;
        }
        me.setValue(valueData);
    },

    setValue: function (value, /* private */ add, skipLoad) {
        var me = this,
            valueStore = me.valueStore,
            valueField = me.valueField,
            unknownValues = [],
            store = me.store,
            record, len, i, valueRecord, cls, params;

        if (Ext.isEmpty(value)) {
            value = null;
        }
        if (Ext.isString(value) && me.multiSelect) {
            value = value.split(me.delimiter);
        }
        if (me.queryAsValue) {
            skipLoad = true
        }
        value = Ext.Array.from(value, true);

        for (i = 0, len = value.length; i < len; i++) {
            record = value[i];
            if (me.objectQuery && record && record[me.valueField]) { // 修改了这里
                cls = me.valueStore.getModel();
                valueRecord = new cls(record);
                value[i] = valueRecord;
            } else if (!record || !record.isModel) {
                valueRecord = !valueStore ? -1 : valueStore.findExact(valueField, record);
                if (valueRecord > -1) {
                    value[i] = valueStore.getAt(valueRecord);
                } else {
                    valueRecord = me.findRecord(valueField, record);
                    if (!valueRecord) { // 简化该处
                        unknownValues.push(record);
                    } else {
                        value[i] = valueRecord;
                    }
                }
            }
        }

        if (!store.isEmptyStore && skipLoad !== true && unknownValues.length > 0 && me.queryMode === 'remote') {
            params = {};
            params[me.valueParam || me.valueField] = unknownValues.join(me.delimiter);
            store.load({
                params: params,
                callback: function () {
                    if (me.itemList) {
                        me.itemList.unmask();
                    }
                    me.setValue(value, add, true);
                    me.autoSize();
                    me.lastQuery = false;
                }
            });
            return false;
        }
        if (unknownValues.length > 0 && skipLoad) {
            me.suspendEvent('select');
            me.valueCollection.beginUpdate();
            me.pickerSelectionModel.deselectAll();
            me.valueCollection.endUpdate();
            me.lastSelectedRecords = null;
            delete me.lastQuery;
            me.inputEl.dom.value = unknownValues.join('');
            me.resumeEvent('select');
            return;
        }

        // For single-select boxes, use the last good (formal record) value if possible
        if (!me.multiSelect && value.length > 0) {
            for (i = value.length - 1; i >= 0; i--) {
                if (value[i].isModel) {
                    value = value[i];
                    break;
                }
            }
            if (Ext.isArray(value)) {
                value = value[value.length - 1];
            }
        }

        // Value needs matching and record(s) need selecting.
        if (value != null) {
            return me.doSetValue(value);
        } else // Clearing is a special, simpler case.
        {
            me.suspendEvent('select');
            me.valueCollection.beginUpdate();
            me.pickerSelectionModel.deselectAll();
            me.valueCollection.endUpdate();
            me.lastSelectedRecords = null;
            me.resumeEvent('select');
        }
    },

    /**
     * @private
     * Sets or adds a value/values
     */
    doSetValue: function (value, /* private for use by addValue */
                          add) {
        var me = this,
            store = me.getStore(),
            Model = store.getModel(),
            matchedRecords = [],
            valueArray = [],
            autoLoadOnValue = me.autoLoadOnValue,
            isLoaded = store.getCount() > 0 || store.isLoaded(),
            pendingLoad = store.hasPendingLoad(),
            unloaded = autoLoadOnValue && !isLoaded && !pendingLoad,
            forceSelection = me.forceSelection,
            selModel = me.pickerSelectionModel,
            displayIsValue = me.displayField === me.valueField,
            isEmptyStore = store.isEmptyStore,
            lastSelection = me.lastSelection,
            i, len, record, dataObj, valueChanged, key;
        if (add && !me.multiSelect) {
            Ext.raise('Cannot add values to non multiSelect ComboBox');
        }
        // Called while the Store is loading or we don't have the real store bound yet.
        // Ensure it is processed by the onLoad/bindStore.
        // Even if displayField === valueField, we still MUST kick off a load because even though
        // the value may be correct as the raw value, we must still load the store, and
        // upon load, match the value and select a record sop we can publish the *selection* to
        // a ViewModel.
        if (pendingLoad || unloaded || !isLoaded || isEmptyStore) {
            // If they are setting the value to a record instance, we can
            // just add it to the valueCollection and continue with the setValue.
            // We MUST do this before kicking off the load in case the load is synchronous;
            // this.value must be available to the onLoad handler.
            if (!value.isModel) {
                if (add) {
                    me.value = Ext.Array.from(me.value).concat(value);
                } else {
                    me.value = value;
                }
                me.setHiddenValue(me.value);
                // If we know that the display value is the same as the value, then show it.
                // A store load is still scheduled so that the matching record can be published.
                me.setRawValue(displayIsValue ? value : '');
            }
            // Kick off a load. Doesn't matter whether proxy is remote - it needs loading
            // so we can select the correct record for the value.
            //
            // Must do this *after* setting the value above in case the store loads synchronously
            // and fires the load event, and therefore calls onLoad inline.
            //
            // If it is still the default empty store, then the real store must be arriving
            // in a tick through binding. bindStore will call setValueOnData.
            if (unloaded && !isEmptyStore) {
                store.load();
            }
            // If they had set a string value, another setValue call is scheduled in the onLoad handler.
            // If the store is the defauilt empty one, the setValueOnData call will be made in bindStore
            // when the real store arrives.
            // if (!value.isModel || isEmptyStore) { // 判断isModel就可能会干扰到clearValue
            if (isEmptyStore) { // 判断isModel就可能会干扰到clearValue
                return me;
            }
        }
        // This method processes multi-values, so ensure value is an array.
        value = add ? Ext.Array.from(me.value).concat(value) : Ext.Array.from(value);
        // Loop through values, matching each from the Store, and collecting matched records
        for (i = 0 , len = value.length; i < len; i++) {
            record = value[i];
            // Set value was a key, look up in the store by that key
            if (!record || !record.isModel) {
                record = me.findRecordByValue(key = record);
                // The value might be in a new record created from an unknown value (if !me.forceSelection).
                // Or it could be a picked record which is filtered out of the main store.
                // Or it could be a setValue(record) passed to an empty store with autoLoadOnValue and aded above.
                if (!record) {
                    record = me.valueCollection.find(me.valueField, key);
                }
            }
            // record was not found, this could happen because
            // store is not loaded or they set a value not in the store
            if (!record) {
                // If we are allowing insertion of values not represented in the Store, then push the value and
                // create a new record to push as a display value for use by the displayTpl
                if (!forceSelection) {
                    // We are allowing added values to create their own records.
                    // Only if the value is not empty.
                    if (!record && value[i]) {
                        dataObj = {};
                        dataObj[me.displayField] = value[i];
                        if (me.valueField && me.displayField !== me.valueField) {
                            dataObj[me.valueField] = value[i];
                        }
                        record = new Model(dataObj);
                    }
                }
                // Else, if valueNotFoundText is defined, display it, otherwise display nothing for this value
                else if (me.valueNotFoundRecord) {
                    record = me.valueNotFoundRecord;
                }
            }
            // record found, select it.
            if (record) {
                matchedRecords.push(record);
                valueArray.push(record.get(me.valueField));
            }
        }
        // If the same set of records are selected, this setValue has been a no-op
        if (lastSelection) {
            len = lastSelection.length;
            if (len === matchedRecords.length) {
                for (i = 0; !valueChanged && i < len; i++) {
                    if (Ext.Array.indexOf(me.lastSelection, matchedRecords[i]) === -1) {
                        valueChanged = true;
                    }
                }
            } else {
                valueChanged = true;
            }
        } else {
            valueChanged = matchedRecords.length;
        }
        if (valueChanged) {
            // beginUpdate which means we only want to notify this.onValueCollectionEndUpdate after it's all changed.
            me.suspendEvent('select');
            me.valueCollection.beginUpdate();
            if (matchedRecords.length) {
                selModel.select(matchedRecords, false);
            } else {
                selModel.deselectAll();
            }
            me.valueCollection.endUpdate();
            me.resumeEvent('select');
        } else {
            me.updateValue();
        }
        return me;
    },

    clearValue: function () {
        var me = this;
        me.callParent(arguments);
        if (me.rendered) {
            me.inputEl.dom.value = '';
        }
    },

    publishValue: function () {
        var me = this;

        if (me.rendered && !me.getErrors().length) {
            me.publishState('value', me.getValue());
            me.publishState('valueData', me.getValueData());
        }
    },

    /**
     * @inheritdoc
     * Intercept calls to getRawValue to pretend there is no inputEl for rawValue handling,
     * so that we can use inputEl for user input of just the current value.
     */
    getRawValue: function () {
        var me = this,
            records = me.getValueRecords(),
            values = [],
            i, len;

        if (!me.labelTpl) {
            me.labelTpl = '{' + me.displayField + '}';
        }
        me.labelTpl = me.getTpl('labelTpl');

        for (i = 0, len = records.length; i < len; i++) {
            values.push(me.labelTpl.apply(records[i].data));
        }

        return values.join(',');
    },

    getSubTplData: function (fieldData) {
        var me = this,
            data = me.callParent(arguments);
        data.itemListCls += ' ' + Ext.baseCSSPrefix + 'singletag-singleselect';

        return data;
    },

    /**
     * Build the markup for the labeled items. Template must be built on demand due to ComboBox initComponent
     * life cycle for the creation of on-demand stores (to account for automatic valueField/displayField setting)
     * @private
     */
    getMultiSelectItemMarkup: function () {
        var me = this,
            childElCls = (me._getChildElCls && me._getChildElCls()) || ''; // hook for rtl cls

        if (!me.multiSelectItemTpl) {
            if (!me.labelTpl) {
                me.labelTpl = '{' + me.displayField + '}';
            }
            me.labelTpl = me.getTpl('labelTpl');

            if (me.tipTpl) {
                me.tipTpl = me.getTpl('tipTpl');
            }

            me.multiSelectItemTpl = new Ext.XTemplate([
                '<tpl for=".">',
                '<li data-selectionIndex="{[xindex - 1]}" data-recordId="{internalId}" class="' + me.tagItemCls + childElCls,
                ' ' + me.singleTagItemCls,
                '{%',// 取消了tagSelectCls
                'values = values.data;',
                '%}',
                me.tipTpl ? '" data-qtip="{[this.getTip(values)]}">' : '">',
                '<div class="' + me.tagItemTextCls + '">{[this.getItemLabel(values)]}</div>',
                '</li>',
                '</tpl>',
                {
                    getItemLabel: function (values) {
                        return Ext.String.htmlEncode(me.labelTpl.apply(values));
                    },
                    getTip: function (values) {
                        return Ext.String.htmlEncode(me.tipTpl.apply(values));
                    },
                    strict: true
                }
            ]);
        }
        if (!me.multiSelectItemTpl.isTemplate) {
            me.multiSelectItemTpl = this.getTpl('multiSelectItemTpl');
        }

        return me.multiSelectItemTpl.apply(me.valueCollection.getRange());
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

    doRemoteQuery: function (queryPlan) {
        var me = this;
        var filter = me.buildFilter();
        Ext.apply(me.getStore().getProxy().getExtraParams(), {
            keyword: queryPlan.query,
            filter: filter
        });
        me.callParent(arguments);
    },

    getErrors: function (value) {
        // Ext-form-field-Field-method-getErrors
        var me = this,
            errors = [],
            validation = this.getValidation();

        if (validation && validation !== true) {
            errors.push(validation);
        }

        //Ext-form-field-Text-method-getErrors
        var validator = me.validator,
            msg;

        if (!me.allowBlank && !me.getValueRecord() && Ext.isEmpty(me.getQueryString())) {
            errors.push(me.blankText);
        }

        if (me.queryAsValue) {
            errors = Ext.Array.merge(errors, me.getQueryErrors());
        }

        if (Ext.isFunction(validator)) {
            msg = validator.call(me, me.getValueRecord());
            if (msg !== true) {
                errors.push(msg);
            }
        }

        return errors;
    },

    getQueryErrors: function () {
        var me = this,
            errors = [],
            query = me.getQueryString();

        if (query) {
            if (query.length < me.minLength) {
                errors.push(Ext.String.format(me.minLengthText, me.minLength));
            }

            if (query.length > me.maxLength) {
                errors.push(Ext.String.format(me.maxLengthText, me.maxLength));
            }
        }

        return errors;
    },

// 构建搜索条件，使用者根据实际情况进行处理
    buildFilter: function () {
        return {};
    }
});