/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../Types", "./Utility"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Types_1, Utility_1;
    var VOID0;
    function unsafe(listeners, payload, trap) {
        if (listeners && listeners.length) {
            for (var i = 0, len = listeners.length; i < len; i++) {
                var fn = listeners[i];
                if (!fn)
                    continue;
                try {
                    fn(payload);
                }
                catch (ex) {
                    if (!trap)
                        throw ex;
                    else if (Types_1.Type.isFunction(trap))
                        trap(ex, i);
                }
            }
        }
    }
    exports_1("unsafe", unsafe);
    function mapped(listeners, payload, trap) {
        if (!listeners)
            return null;
        var result = Utility_1.copy(listeners);
        if (listeners.length) {
            for (var i = 0, len = result.length; i < len; i++) {
                var fn = result[i];
                try {
                    result[i] = fn
                        ? fn(payload)
                        : VOID0;
                }
                catch (ex) {
                    result[i] = VOID0;
                    if (!trap)
                        throw ex;
                    else if (Types_1.Type.isFunction(trap))
                        trap(ex, i);
                }
            }
        }
        return result;
    }
    exports_1("mapped", mapped);
    function dispatch(listeners, payload, trap) {
        unsafe(Utility_1.copy(listeners), payload, trap);
    }
    exports_1("dispatch", dispatch);
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            }],
        execute: function() {
            VOID0 = void (0);
            exports_1("default",dispatch);
        }
    }
});
//# sourceMappingURL=Dispatch.js.map