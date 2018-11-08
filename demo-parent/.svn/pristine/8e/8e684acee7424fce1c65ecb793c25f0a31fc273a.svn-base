/**
 * 支持缩略的文本显示控件
 * Created by cRazy on 2016/6/24.
 */
Ext.define('overrides.form.field.Display', {
    override: 'Ext.form.field.Display',

    requires: [
        'Ext.dom.Helper',
        'Ext.tip.QuickTipManager'
    ],

    /**
     * @cfg {boolean} ellipsis
     * 超宽省略
     */
    ellipsis: true,
    /**
     * @cfg {boolean} showTip
     * 是否冒泡显示，默认为false.
     */
    showTip: false,

    /**
     * @cfg {String} defaultDisplay
     * 为空时的显示内容
     */

    /**
     * @cfg {boolean} linkable
     * 是否链接，启用后将会触发点击事件
     */
    linkable: false,

    initComponent: function () {
        var me = this;
        if (me.fieldLabel && me.defaultDisplay == undefined) {
            me.defaultDisplay = '-';
        }

        if (me.ellipsis) {
            var style = this.fieldStyle,
                fieldStyle = Ext.isObject(style) ? Ext.DomHelper.generateStyles(style, null, true) : style || '';
            fieldStyle += ";text-overflow:ellipsis;overflow:hidden;white-space:nowrap;";
            me.fieldStyle = fieldStyle;
        }

        if (me.linkable) {
            me.ui = 'link';
        }
        me.callParent(arguments);
    },

    setRawValue: function (value) {
        var me = this,
            displayValue;

        value = Ext.valueFrom(value, '');
        me.rawValue = value;
        if (me.rendered) {
            displayValue = me.getDisplayValue();
            me.inputEl.dom.innerHTML = displayValue ? displayValue : me.defaultDisplay;
            me.updateLayout();
        }
        return value;
    },

    afterRender: function () {
        var me = this;
        me.callParent(arguments);

        if (me.linkable) {
            me.clickListener = Ext.fly(me.bodyEl).on('click', function () {
                me.fireEvent('click', me);
            });
        }

        if (me.showTip) {
            if (!me.getValue()) {
                Ext.tip.QuickTipManager.unregister(me.getId());
            } else {
                Ext.tip.QuickTipManager.register({
                    target: me.getId(),
                    text: me.getDisplayValue()
                })
            }
        }

        if (me.defaultDisplay && !me.getDisplayValue()) {
            me.inputEl.dom.innerHTML = me.defaultDisplay ? me.defaultDisplay : me.defaultDisplay;
        }
    },

    /**
     * @private
     * Called when the field's value changes. Performs validation if the {@link #validateOnChange}
     * config is enabled, and invokes the dirty check.
     */
    onChange: function (newVal) {
        var me = this;
        me.callParent(arguments);

        if (!newVal) {
            Ext.tip.QuickTipManager.unregister(me.getId());
        } else {
            Ext.tip.QuickTipManager.register({
                target: me.getId(),
                text: me.getDisplayValue()
            });
        }
    },

    beforeDestroy: function () {
        var me = this;
        if (me.rendered) {
            Ext.destroy(
                me.clickListener
            );
            if (me.showTip) {
                Ext.tip.QuickTipManager.unregister(me.getId());
            }
        }

        me.callParent(arguments);
    }
});