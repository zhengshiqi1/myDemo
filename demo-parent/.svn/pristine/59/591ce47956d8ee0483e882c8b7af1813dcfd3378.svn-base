/**
 * Created by cRazy on 2016/11/16.
 */
Ext.define('Cxt.overrides.ux.grid.SubTable', {
    override: 'Ext.ux.grid.SubTable',

    requires: [
        'Ext.data.Model'
    ],

    init: function (grid) {
        var me = this;

        me.callParent(arguments);
        Ext.Array.each(me.columns, function (column) {
            if (!column.align)column.align = 'left';
        })
    },

    renderTable: function (out, rowValues) {
        var me = this,
            columns = me.getVisibleColumns(me.columns),
            numColumns = columns.length,
            associatedRecords = me.getAssociatedRecords(rowValues.record),
            recCount = associatedRecords.length,
            rec, column, i, j, value;

        out.push('<thead>');
        for (j = 0; j < numColumns; j++) {
            out.push('<th class="' +
                Ext.baseCSSPrefix + 'grid-subtable-header ' +
                Ext.baseCSSPrefix + 'column-header-align-' + columns[j].align +
                '">', columns[j].text, '</th>');
        }
        out.push('</thead>');
        for (i = 0; i < recCount; i++) {
            rec = associatedRecords[i];
            if (Ext.isObject(rec)) {
                rec = Ext.create('Ext.data.Model', rec);
            }
            out.push('<tr>');
            for (j = 0; j < numColumns; j++) {
                column = columns[j];
                value = rec.get(column.dataIndex);
                if (column.renderer && column.renderer.call) {
                    value = column.renderer.call(column.scope || me, value, {}, rec);
                }
                out.push('<td class="' + Ext.baseCSSPrefix + 'grid-subtable-cell"');
                if (column.width != null) {
                    out.push(' style="width:' + column.width + 'px"');
                }
                out.push('><div class="' +
                    Ext.baseCSSPrefix + 'grid-cell-inner ' +
                    Ext.baseCSSPrefix + 'column-header-align-' + column.align +
                    '">', value, '</div></td>');
            }
            out.push('</tr>');
        }
    },

    getVisibleColumns: function (columns) {
        return Ext.Array.filter(columns, function (column) {
            return !column.hidden;
        });
    },

    getAssociatedRecords: function (record) {
        return record.get(this.association);
    }
});