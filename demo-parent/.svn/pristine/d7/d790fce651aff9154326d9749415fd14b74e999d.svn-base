/**
 * Created by cRazy on 2016/8/1.
 */
Ext.define('Cpnt.grid.field.SearchTag', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.searchtag',

    ui: 'searchtag',
    editable: false,
    matchFieldWidth: false,

    triggers: {
        picker: {
            hidden: true
        },
        close: {
            itemId: 'close',
            handler: function (btn) {
                btn.fireEvent('close', btn);
            }
        }
    },

    tagLabel: undefined,

    fieldStyle: {
        'textOverflow': 'ellipsis',
        'overflow': 'hidden',
        'whiteSpace': 'nowrap',
        'padding': '3px'
    },

    fieldSubTpl: [
        '<div id="{id}" data-ref="inputEl" tabindex="-1" role="textbox" aria-readonly="true"',
        ' aria-labelledby="{cmpId}-labelEl" {inputAttrTpl}',
        '<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',
        ' class="{fieldCls} {fieldCls}-{ui}">{value}</div>',
        {
            compiled: true,
            disableFormats: true
        }
    ],

    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    
    setRawValue: function (value) {
        var me = this;
        me.callParent(arguments);
        if (me.inputEl) {
            me.inputEl.setHtml(me.tagLabel ? (me.tagLabel + '：' + value) : value);
        }
        // Register the new tip with an element's ID
        Ext.tip.QuickTipManager.register({
            target: me.getId(), // Target button's ID
            text: me.tagLabel ? (me.tagLabel + '：' + value) : value
        });
    },

    afterRender: function () {
        var me = this;
        me.callParent(arguments);
        if (me.inputEl) {
            me.inputEl.setWidth(me.getWidth() - 25);
            me.inputEl.setHtml(me.tagLabel ? (me.tagLabel + '：' + me.rawValue) : me.rawValue);
        }
        // Register the new tip with an element's ID
        Ext.tip.QuickTipManager.register({
            target: me.getId(), // Target button's ID
            text: me.tagLabel ? (me.tagLabel + '：' + me.rawValue) : me.rawValue
        });
    },

    destroy: function () {
        var me = this;
        // Register the new tip with an element's ID
        Ext.tip.QuickTipManager.unregister(me.getId());
        me.callParent(arguments);
    }
});