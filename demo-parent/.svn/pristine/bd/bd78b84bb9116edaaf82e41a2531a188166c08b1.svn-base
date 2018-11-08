/**
 * 月份选择器。
 * 增加年禁用，月禁用功能。
 * 禁用后，对应部分将隐藏。
 * Created by cRazy on 2016/9/20.
 */
Ext.define('overrides.picker.Month', {
    override: 'Ext.picker.Month',

    monthSelectable: true,

    renderTpl: [
        '<div id="{id}-bodyEl" data-ref="bodyEl" class="{baseCls}-body">',
        '<div id="{id}-monthEl" data-ref="monthEl" class="{baseCls}-months">',
        '<tpl for="months">',
        '<div class="{parent.baseCls}-item {parent.baseCls}-month">',
        '<a style="{parent.monthStyle}" role="button" hidefocus="on" class="{parent.baseCls}-item-inner">{.}</a>',
        '</div>',
        '</tpl>',
        '</div>',
        '<div id="{id}-yearEl" data-ref="yearEl" class="{baseCls}-years">',
        '<div class="{baseCls}-yearnav">',
        '<div class="{baseCls}-yearnav-button-ct">',
        '<a id="{id}-prevEl" data-ref="prevEl" class="{baseCls}-yearnav-button {baseCls}-yearnav-prev" hidefocus="on" role="button"></a>',
        '</div>',
        '<div class="{baseCls}-yearnav-button-ct" style="float:right">',
        '<a id="{id}-nextEl" data-ref="nextEl" class="{baseCls}-yearnav-button {baseCls}-yearnav-next" hidefocus="on" role="button"></a>',
        '</div>',
        '</div>',
        '<tpl for="years">',
        '<div class="{parent.baseCls}-item {parent.baseCls}-year">',
        '<a hidefocus="on" class="{parent.baseCls}-item-inner" role="button">{.}</a>',
        '</div>',
        '</tpl>',
        '</div>',
        '<div class="' + Ext.baseCSSPrefix + 'clear"></div>',
        '<tpl if="showButtons">',
        '<div class="{baseCls}-buttons">{%',
        'var me=values.$comp, okBtn=me.okBtn, cancelBtn=me.cancelBtn;',
        'okBtn.ownerLayout = cancelBtn.ownerLayout = me.componentLayout;',
        'okBtn.ownerCt = cancelBtn.ownerCt = me;',
        'Ext.DomHelper.generateMarkup(okBtn.getRenderTree(), out);',
        'Ext.DomHelper.generateMarkup(cancelBtn.getRenderTree(), out);',
        '%}</div>',
        '</tpl>',
        '</div>'
    ],

    initComponent: function () {
        var me = this;
        if (me.monthSelectable === false) {
            me.yearOffset = 6;
            me.totalYears = 12;
        }
        me.callParent(arguments);
    },

    afterRender: function () {
        var me = this;
        me.callParent(arguments);

        if (me.monthSelectable === false) {
            // me.setWidth(me.getWidth()-me.monthEl.getWidth());
            me.monthEl.setDisplayed('none');
            me.yearEl.setWidth('100%');
            me.bodyEl.select('.' + me.baseCls + '-buttons').setDisplayed('none');
        }
    },

    /**
     * Get an array of years to be pushed in the template. It is not in strict
     * numerical order because we want to show them in columns.
     * @private
     * @return {Number[]} An array of years
     */
    getYears: function () {
        var me = this,
            offset = me.yearOffset,
            start = me.activeYear, // put the "active" year on the left
            end = start + offset,
            i = start,
            years = [];

        if (me.monthSelectable === false) {
            for (i = 0; i < offset; i++) {
                years.push(start + i * 2, start + i * 2 + 1);
            }
        } else {
            for (i = 0; i < offset; i++) {
                years.push(start + i, start + i + offset);
            }
        }

        return years;
    },

    /**
     * React to a year being clicked
     * @private
     * @param {HTMLElement} target The element that was clicked
     * @param {Boolean} isDouble True if the event was a doubleclick
     */
    onYearClick: function (target, isDouble) {
        var me = this;
        if (me.monthSelectable) {
            me.value[1] = me.activeYear + me.resolveOffset(me.years.indexOf(target), me.yearOffset);
        } else {
            me.value[1] = me.activeYear + me.years.indexOf(target);
        }
        me.updateBody();
        me.fireEvent('year' + (isDouble ? 'dbl' : '') + 'click', me, me.value);
        me.fireEvent('select', me, me.value);
        if (!me.monthSelectable) {
            me.value[0] = undefined;
            me.fireEvent('okclick', this, this.value);
        }
    }
});