/**
 纵向显示状态变化图

 @example
 Ext.syncRequire('Cxt.panel.LogTrace');
 Ext.create({
		renderTo: document.body,
		xtype: 'logtracepanel',
		width: 300,
		height: 150,
		value: {
			data: [
				{text: '已确认'},
				{text: '已预处理'},
				{text: '已审核'},
				{text: '已发货'},
				{text: '已揽收'},
				{text: '已妥投'}
			],
			tpl: '状态: {text}',
			highlight: 0
		}
	});
 */
Ext.define('Cxt.panel.LogTrace', {
    extend: 'Ext.draw.Container',
    alias: 'widget.logtracepanel',

    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.refreshLogTrace();
    },

    /**
     * @cfg {boolean} lineHeight
     * 行高
     */
    lineHeight: 20,

    /**
     * @cfg {boolean} autoHeight
     * 启动autoHeight后，加载数据之后会自动设置高度。
     */
    autoHeight: true,

    /**
     * @cfg {number} height
     * 如果需要固定高度，需要将autoHeight设置为false。
     */
    height: 300,

    highlightColor: '#333',

    normalColor: '#333',

    /**
     @cfg {Object} value
     @param {Array} data 对象数组
     @param {String} tpl 用作格式化data[i]的tpl
     @param {number} highlight 0-based, 此元素前的icon高亮
     */
    value: {
        data: undefined,
        tpl: undefined,
        highlight: 0
    },

    /**
     设置数据.
     @param {Object} value
     数据结构参见value. 如果value中tpl和highlight是undefined, 则使用上次调用setValue()或初始化定义的值.
     */
    setValue: function (value) {
        var me = this;
        Ext.apply(me.value, value);
        me.refreshLogTrace();
    },

    refreshLogTrace: function () {
        var me = this;
        if (me.destroyed) {
            return;
        }
        var surface = me.getSurface(),
            sprites;

        if (me.rendered) {
            sprites = me.createSprites();
            surface.removeAll();
            surface.add(sprites);
            surface.renderFrame();
            me.refreshHeight();
        }
    },

    createSprites: function () {
        var me = this,
            ox = 20,
            oy = 20,
            iconX = 0,
            textX = 22,
            lineHeight = me.lineHeight,
            big = {
                type: 'circle',
                fillStyle: '#5FA2DD',
                r: 6
            },
            small = {
                type: 'circle',
                fillStyle: '#9F9D91',
                r: 4
            },
            line = {
                type: 'line',
                strokeStyle: '#9F9D91',
                lineWidth: 1
            },
            text = {
                type: 'text',
                fontSize: 12,
                fontFamily: 'Microsoft Yahei'
            },
            i,
            icon,
            data = me.value.data,
            tpl = new Ext.Template(me.value.tpl),
            highlight = me.value.highlight,
            sprites = [];

        if (!data)
            return sprites;

        for (i = 0; i < data.length; ++i) {
            // line
            if (i > 0) {
                sprites.push(Ext.apply({
                    fromX: iconX + ox,
                    toX: iconX + ox,
                    fromY: (i - 1) * lineHeight + oy,
                    toY: i * lineHeight + oy
                }, line));
            }
        }

        for (i = 0; i < data.length; ++i) {
            // icon
            icon = i == highlight ? big : small;
            sprites.push(Ext.apply({
                x: iconX + ox,
                y: i * lineHeight + oy
            }, icon));

            // text
            sprites.push(Ext.apply({
                x: textX + ox,
                y: i * lineHeight + oy + 4,
                text: tpl.apply(data[i])
            }, text, {
                fillStyle: i == highlight ? me.highlightColor : me.normalColor
            }));
        }

        return sprites;
    },

    refreshHeight: function () {
        var me = this,
            headerHeight = 0;
        if (!me.autoHeight || !me.value.data || me.value.data.length == 0) {
            return;
        }
        if (me.getHeader()) {
            headerHeight = me.getHeader().getHeight();
        }
        me.setHeight(me.lineHeight * me.value.data.length + headerHeight + 10);
    }
});