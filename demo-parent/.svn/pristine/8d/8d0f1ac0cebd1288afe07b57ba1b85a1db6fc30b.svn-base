/**
 * 允许提交中断
 * Created by cRazy on 2016-8-9-0009.
 */
Ext.define('overrides.data.request.Ajax', {
    override: 'Ext.data.request.Ajax',

    requires: [
        'Cxt.util.LoadMark'
    ],

    start: function (data) {
        var me = this,
            options = me.options,
            requestOptions = me.requestOptions,
            isXdr = me.isXdr,
            xhr, headers;

        xhr = me.xhr = me.openRequest(options, requestOptions, me.async, me.username, me.password);

        // XDR doesn't support setting any headers
        if (!isXdr) {
            headers = me.setupHeaders(xhr, options, requestOptions.data, requestOptions.params);
        }

        if (me.async) {
            if (!isXdr) {
                xhr.onreadystatechange = Ext.Function.bind(me.onStateChange, me);
            }
        }

        if (isXdr) {
            me.processXdrRequest(me, xhr);
        }

        // Parent will set the timeout if needed
        // 直接调用父类的方法
        if (me.getTimeout() && me.async) {
            me.timer = Ext.defer(me.onTimeout, me.getTimeout(), me);
        }

        // start the request!
        xhr.send(data);

        if (!me.async) {
            return me.onComplete();
        }

        if (options.waitMsg) {
            if (options.waitMsgTarget) {
                me.loadMask = new Ext.LoadMask({
                    msg: options.waitMsg,
                    target: options.waitMsgTarget
                });
                me.loadMask.show();
            } else {
                Cxt.util.LoadMark.show(options.waitMsg);
            }
        }

        return me;
    },


    /**
     * To be called when the request has come back from the server
     * @param {Object} request
     * @return {Object} The response
     * @private
     */
    onComplete: function (xdrResult) {
        var me = this,
            owner = me.owner,
            options = me.options,
            xhr = me.xhr,
            failure = {
                success: false,
                isException: false
            },
            result, success, response;

        if (options.waitMsg) {
            if (me.loadMask) {
                me.loadMask.destroy();
            } else {
                Cxt.util.LoadMark.hide();
            }
        }

        if (!xhr || me.destroyed) {
            return me.result = failure;
        }
        try {
            result = me.parseStatus(xhr.status);
            if (result.success) {
                // This is quite difficult to reproduce, however if we abort a request
                // just before it returns from the server, occasionally the status will be
                // returned correctly but the request is still yet to be complete.
                result.success = xhr.readyState === 4;
            }
        } catch (e) {
            // In some browsers we can't access the status if the readyState is not 4,
            // so the request has failed
            result = failure;
        }
        success = me.success = me.isXdr ? xdrResult : result.success;
        if (success) {
            response = me.createResponse(xhr);
            owner.fireEvent('requestcomplete', owner, response, options);
            Ext.callback(options.success, options.scope, [
                response,
                options
            ]);
        } else {
            if (result.isException || me.aborted || me.timedout) {
                response = me.createException(xhr);
            } else {
                response = me.createResponse(xhr);
            }
            if (response.status != 0) {
                owner.fireEvent('requestexception', owner, response, options);
                Ext.callback(options.failure, options.scope, [
                    response,
                    options
                ]);
            }
        }
        me.result = response;
        Ext.callback(options.callback, options.scope, [
            options,
            success,
            response
        ]);
        owner.onRequestComplete(me);

        me.clearTimer();
        if (me.deferred) {
            if (me.success) {
                me.deferred.resolve(me.result);
            }
            else {
                me.deferred.reject(me.result);
            }
        }
        return response;
    }
});