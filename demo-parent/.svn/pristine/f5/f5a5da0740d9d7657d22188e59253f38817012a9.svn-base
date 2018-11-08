/**
 * Created by cRazy on 2016/8/12.
 */
Ext.define('Cxt.form.field.MultiTagField', {
    extend: 'Ext.form.field.Tag',
    alias: 'widget.multitagfield',

    ui: 'multitag',

    keyword: '',

    /**
     * @cfg {Object[]} valueData
     * 取值数组
     */
    valueData: undefined,

    /**
     * 对象查询。
     * 查询的目标是object。考虑到基本为对象查询，默认为true
     */
    objectQuery: true,

    multiTagItemCls: Ext.baseCSSPrefix + 'multitag-item',
    multiTagItemCloseCls: Ext.baseCSSPrefix + 'multitag-item-close',
    tagItemTextCls: Ext.baseCSSPrefix + 'multitag-item-text',

    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            stacked: false,
            multiSelect: true/*,
             clearValueOnEmpty: true*/
        });

        me.callParent(arguments);
    },

    afterRender: function () {
        var me = this;

        me.callParent(arguments);
        me.on('select', function () {
            var valueData = [];
            Ext.Array.each(me.getValueRecords(), function (record) {
                valueData.push(record.data);
            });
            me.publishState('valueData', valueData);
        });
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
                me.fireEvent('select', me, me.valueStore.getRange());
            } else {
                me.toggleSelectionByListItemNode(itemEl, e.shiftKey);
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
        value = Ext.Array.from(value, true);

        for (i = 0, len = value.length; i < len; i++) {
            record = value[i];
            if (me.objectQuery && record && record[me.valueField]) { // 修改了这里
                cls = me.valueStore.getModel();
                valueRecord = new cls(record);
                value[i] = valueRecord;
            } else if (!record || !record.isModel) {
                valueRecord = valueStore.findExact(valueField, record);
                if (valueRecord > -1) {
                    value[i] = valueStore.getAt(valueRecord);
                } else {
                    valueRecord = me.findRecord(valueField, record);
                    if (!valueRecord) {
                        if (me.forceSelection) {
                            unknownValues.push(record);
                        } else {
                            valueRecord = {};
                            valueRecord[me.valueField] = record;
                            valueRecord[me.displayField] = record;

                            cls = me.valueStore.getModel();
                            valueRecord = new cls(valueRecord);
                        }
                    }
                    if (valueRecord) {
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
        // return me.callParent([value, add]);
    },


    /**
     * @private
     * Sets or adds a value/values
     */
    doSetValue: function (value /* private for use by addValue */, add) {
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
            i, len, record, dataObj,
            valueChanged, key;

        //<debug>
        if (add && !me.multiSelect) {
            Ext.raise('Cannot add values to non multiSelect ComboBox');
        }
        //</debug>

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
            if (Ext.isString(value) || isEmptyStore) {// 修改了这里，只有文本才返回
                return me;
            }
        }

        // This method processes multi-values, so ensure value is an array.
        value = add ? Ext.Array.from(me.value).concat(value) : Ext.Array.from(value);

        // Loop through values, matching each from the Store, and collecting matched records
        for (i = 0, len = value.length; i < len; i++) {
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

    getValueData: function () {
        var me = this,
            records = me.getValueRecords(),
            valueData = [];
        Ext.Array.each(records, function (record) {
            valueData.push(record.getData());
        });

        return valueData;
    },

    setValueData: function (valueData) {
        var me = this;
        if (Ext.encode(me.getValueData()) == Ext.encode(valueData)) {
            return;
        }
        me.setValue(valueData);
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
                ' ' + me.multiTagItemCls,
                '{%',
                'values = values.data;',
                '%}',
                me.tipTpl ? '" data-qtip="{[this.getTip(values)]}">' : '">',
                '<div class="' + me.tagItemTextCls + '">{[this.getItemLabel(values)]}</div>',
                '<div class="' + me.tagItemCloseCls + childElCls,
                ' ' + me.multiTagItemCloseCls,
                '"></div>',
                '</li>',
                '</tpl>',
                {
                    isSelected: function (rec) {
                        return me.selectionModel.isSelected(rec);
                    },
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

    beforeQuery: function (queryPlan) {
        var me = this;

        queryPlan = me.callParent(arguments);

        if (Ext.isEmpty(queryPlan.query) == false) {
            if ('' == queryPlan.query.trim() || me.keyword == queryPlan.query.trim()) {
                queryPlan.cancel = true;
            }
            me.keyword = queryPlan.query.trim();
        }
        return queryPlan;
    },

    doRemoteQuery: function (queryPlan) {
        var me = this;
        var filter = me.buildFilter();
        Ext.apply(me.getStore().getProxy().getExtraParams(), {
            filter: filter
        });
        me.callParent(arguments);
    },

// 构建搜索条件，使用者根据实际情况进行处理
    buildFilter: function () {
        return {};
    }
});