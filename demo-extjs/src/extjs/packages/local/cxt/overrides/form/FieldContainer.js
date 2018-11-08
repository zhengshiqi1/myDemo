/**
 * 为设置了必填的表单字段，添加<span style="color: red">*</span>。
 */
Ext.define('overrides.form.FieldContainer', {
    override: 'Ext.form.FieldContainer',

    /**
     * @cfg {boolean} fieldborder
     * 用于表单中时，可设置field部分带边框。
     */
    fieldBorder: false,

    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            fieldSubTpl: [
                '<div id="{id}-containerEl" data-ref="containerEl" class="' + (me.fieldBorder ? Ext.baseCSSPrefix + 'form-fieldcontainer-container-border' : ''),
                '<tpl if="ariaAttributes">',
                '<tpl foreach="ariaAttributes"> {$}="{.}"</tpl>',
                '<tpl else>',
                ' role="presentation"',
                '</tpl>',
                '>',
                '{%this.renderContainer(out,values)%}',
                '</div>'
            ]
        });

        me.fieldCaption = me.fieldLabel;
        if (me.allowBlank !== undefined && !me.allowBlank) {
            if (me.fieldLabel && me.fieldLabel.indexOf('<span style="color: red">*</span>') < 0) {
                me.fieldLabel = '<span style="color: red"> * </span>' + me.fieldLabel;
            }
        }

        me.callParent(arguments);
    }
});