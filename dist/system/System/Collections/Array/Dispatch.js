System.register(["../../Types", "./Utility"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /**
     * Simply takes a payload and passes it to all the listeners.
     *
     * While dispatching:
     * * This is an unsafe method if by chance any of the listeners modify the array.
     * * It cannot prevent changes to the payload.
     *
     * Improving safety:
     * * Only use a local array that isn't exposed to the listeners.
     * * Use the dispatch method instead as it makes a copy of the listeners array.
     * * Freeze the listeners array so it can't be modified.
     * * Freeze the payload.
     *
     * Specifying trap will catch any errors and pass them along if trap is a function.
     * A payload is used instead of arguments for easy typing.
     *
     *
     * @param listeners
     * @param payload
     * @param trap
     */
    function unsafe(listeners, payload, trap) {
        if (listeners && listeners.length) {
            for (var i = 0, len = listeners.length; i < len; i++) {
                var fn = listeners[i];
                if (!fn)
                    continue; // Ignore null refs.
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
    /**
     * Simply takes a payload and passes it to all the listeners.
     * Returns the results in an array that matches the indexes of the listeners.
     *
     * @param listeners
     * @param payload
     * @param trap
     * @returns {any}
     */
    function mapped(listeners, payload, trap) {
        if (!listeners)
            return listeners;
        // Reuse the copy as the array result.
        var result = Utility_1.copy(listeners);
        if (listeners.length) {
            for (var i = 0, len = result.length; i < len; i++) {
                var fn = result[i];
                try {
                    result[i] = fn // Ignore null refs.
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
    /**
     * Simply takes a payload and passes it to all the listeners.
     * Makes a copy of the listeners before calling dispatchUnsafe.
     *
     * @param listeners
     * @param payload
     * @param trap
     */
    function dispatch(listeners, payload, trap) {
        unsafe(Utility_1.copy(listeners), payload, trap);
    }
    exports_1("dispatch", dispatch);
    var Types_1, Utility_1, VOID0;
    return {
        setters: [
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (Utility_1_1) {
                Utility_1 = Utility_1_1;
            }
        ],
        execute: function () {
            VOID0 = void 0;
            exports_1("default", dispatch);
        }
    };
});
//# sourceMappingURL=Dispatch.js.map