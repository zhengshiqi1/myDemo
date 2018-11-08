/**
 * Created by cRazy on 2016/7/7.
 */
Ext.define('Cxt.util.Format', function () {
    var me; // holds our singleton instance

    return {
        singleton: true,

        constructor: function () {
            me = this; // we are a singleton, so cache our this pointer in scope
        },

        ucn: function (value, emptyText) {
            if (Ext.isEmpty(emptyText)) {
                emptyText = "";
            }
            if (Ext.isEmpty(value)) {
                return emptyText;
            }
            if (Ext.isEmpty(value.code)) {
                return value.name
            }
            if (Ext.isEmpty(value.name)) {
                return '-[' + value.code + ']';
            }
            return value.name + '[' + value.code + ']';
        },

        /**
         * Returns a ucn rendering function that can be reused to apply a ucn format multiple
         *
         * @return {Function} The ucn formatting function
         */
        ucnRenderer: function () {
            return function (v) {
                return me.ucn(v);
            };
        },

        lastModifyRenderer: function () {
            return function (v) {
                return me.lastModify(v);
            }
        },

        lastModify: function (value, emptyText) {
            if (Ext.isEmpty(emptyText)) {
                emptyText = "";
            }
            if (Ext.isEmpty(value)) {
                return emptyText;
            }
            if (Ext.isEmpty(value.time)) {
                // return Ext.util.Format.date(value.time);
                return value.time;
            }
            if (Ext.isEmpty(value.operator.fullName)) {
                return '-[' + value.operator.fullName + ']';
            }
            // return Ext.util.Format.date(value.time) + '[' + value.operator.fullName + ']';
            return value.time + '[' + value.operator.fullName + ']';
        },

        /**将Total(total,tax)渲染成total（tax）*/
        total: function (total, taxRender) {
            if (!total) {
                return '';
            }
            var text = Ext.util.Format.number(total.total, ',##0.00');
            if (taxRender !== false) {
                text += '(' + Ext.util.Format.number(total.tax, ',##0.00') + ')';
            }
            return text;
        },

        /**将Total(total,tax)渲染成total（tax）*/
        totalRenderer: function (taxRender) {
            return function (v) {
                return me.total(v, taxRender);
            };
        },

        taxRate: function (taxRate) {
            if (!taxRate)
                return;

            if (taxRate.name)
                return taxRate.name;

            var caption;
            if (taxRate.taxType == 'excludePrice')caption = '价外税';
            if (taxRate.taxType == 'includePrice')caption = '价内税';

            if (taxRate.rate)
                caption += ' ' + Ext.util.Format.percent(taxRate.rate);
            return caption;
        },

        taxRateRenderer: function () {
            return function (v) {
                return me.taxRate(v);
            };
        },

        direction: function (direction) {
            if (direction < 0 || direction === false)
                return '付';
            if (direction > 0 || direction === true)
                return '收';
            return '未知';
        },

        directionRenderer: function () {
            return function (v) {
                return me.direction(v);
            };
        },

        bizState: function (value) {
            if (Ext.isEmpty(value))
                return value;
            if (value === 'ineffect')
                return "未生效";
            else if (value === 'submit')
                return "已提交";
            else if (value === 'reject')
                return "已驳回";
            else if (value === 'effect')
                return "已生效";
            else if (value === 'finish')
                return "已完成";
            else if (value === 'aborted')
                return "已作废";
            else if (value === 'processing')
                return "进行中";
            else if (value === 'dealing')
                return "处理中";
            else if (value === 'solved')
                return "已解决";
            else if (value === 'repairing')
                return "维修中";
            else if (value === 'audited')
                return "已审核";
            return value;
        },

        /**
         * Returns a bizState rendering function that can be reused to apply a bizState format multiple
         *
         * @return {Function} The bizState formatting function
         */
        bizStateRenderer: function () {
            return function (v) {
                return me.bizState(v);
            };
        },

        usingState: function (value) {
            if (Ext.isEmpty(value))
                return value;
            if (value === 'using')
                return '使用中';
            else if (value === 'block')
                return '已冻结';
            else if (value === 'disabled')
                return '已禁用';
            else if (value === 'deleted')
                return '已删除';
            return value;
        },

        usingStateRenderer: function () {
            return function (v) {
                return me.usingState(v);
            };
        },

        property: function (value, property) {
            if (Ext.isEmpty(value))
                return value;
            return value[property];
        },

        propertyRenderer: function () {
            return function (v, property) {
                return me.property(v, property);
            };
        },

        bool: function (value, emptyText) {
            if (Ext.isEmpty(emptyText)) {
                emptyText = '';
            }
            if (Ext.isEmpty(value)) {
                return emptyText;
            }
            return !!value ? '是' : '否';
        },

        boolRenderer: function (emptyText) {
            return function (v) {
                return me.bool(v, emptyText);
            };
        },

        operateInfo: function (operateInfo) {
            if (operateInfo == undefined) {
                return '';
            }
            var operator = operateInfo.operator;
            return operateInfo.time + '[' + operator.fullName + ']';
        },

        operateInfoRenderer: function () {
            return function (v) {
                return me.operateInfo(v);
            };
        },

        link: function (value) {
            var linkCls = Ext.baseCSSPrefix + 'label-link';
            return '<span class=' + linkCls + '>' + value + '</span>';
        },

        linkRenderer: function (renderer) {
            if (Ext.isFunction(renderer)) {
                return function (v, metaData, record, rowIndex, colIndex, store, view) {
                    return me.link(renderer(v, metaData, record, rowIndex, colIndex, store, view));
                };
            }
            return function (v) {
                return me.link(v);
            };
        },

        /**
         * @param size
         * 文件大小，字节。
         */
        size: function (size) {
            if (!Ext.isNumeric(size)) {
                return size;
            }
            if (size < 1024) {
                return size + ' B';
            }
            size = size.divide(1024, 2);
            if (size < 1024) {
                return size + ' KB';
            }
            size = size.divide(1024, 2);
            if (size < 1024) {
                return size + ' MB';
            }
            size = size.divide(1024, 2);
            if (size < 1024) {
                return size + ' GB';
            }
        },

        sizeRenderer: function () {
            return function (v) {
                return me.size(v);
            };
        },

        /**
         * 将list转义成一个字符串。
         * @param {Object[]}value
         *          数组，如果是对象，可以使用tpl进行设置。若干对象是null,将被跳过。
         * @param separator
         *          分隔符
         * @param tpl
         * @returns {string}
         */
        list: function (value, separator, tpl) {
            if (Ext.isEmpty(value))
                return '';
            if (Ext.isEmpty(separator)) {
                separator = ',';
            }

            var text = '',
                textTpl = new Ext.Template(tpl);
            Ext.Array.each(value, function (item) {
                if (text.length > 0) {
                    text += (separator);
                }
                if (Ext.isEmpty(item)) {
                    return;
                }
                if (Ext.isEmpty(tpl)) {
                    text += item;
                } else {
                    text += textTpl.apply(item);
                }
            });
            return text;
        }
    }
});