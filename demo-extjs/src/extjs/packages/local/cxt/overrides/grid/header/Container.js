/**
 * Created by cRazy on 2016/10/24.
 */
Ext.define('overrides.grid.header.Container', {
    override: 'Ext.grid.header.Container',

    /**
     * @private
     *
     * Shows the column menu under the target element passed. This method is used when the trigger element on the column
     * header is clicked on and rarely should be used otherwise.
     *
     * @param {Ext.event.Event} [clickEvent] The event which triggered the current handler. If omitted
     * or a key event, the menu autofocuses its first item.
     * @param {HTMLElement/Ext.dom.Element} t The target to show the menu by
     * @param {Ext.grid.header.Container} header The header container that the trigger was clicked on.
     */
    showMenuBy: function (clickEvent, t, header) {
        var menu = this.getMenu(),
            ascItem = menu.down('#ascItem'),
            descItem = menu.down('#descItem'),
            columnItemSeparator = menu.down('#columnItemSeparator'),
            sortableMth;

        // Use ownerCmp as the upward link. Menus *must have no ownerCt* - they are global floaters.
        // Upward navigation is done using the up() method.
        menu.activeHeader = menu.ownerCmp = header;
        header.setMenuActive(menu);

        // enable or disable asc & desc menu items based on header being sortable
        sortableMth = header.sortable ? 'show' : 'hide';
        if (ascItem) {
            ascItem[sortableMth]();
        }
        if (descItem) {
            descItem[sortableMth]();
        }
        if (columnItemSeparator) {
            columnItemSeparator[sortableMth]();
        }


        // Pointer-invoked menus do not auto focus, key invoked ones do.
        menu.autoFocus = !clickEvent || !clickEvent.pointerType;
        menu.showBy(t, 'tl-bl?');

        // Menu show was vetoed by event handler - clear context
        if (!menu.isVisible()) {
            this.onMenuHide(menu);
        }
    }
});