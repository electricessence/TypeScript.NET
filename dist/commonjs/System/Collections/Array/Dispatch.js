/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var Types_1 = require("../../Types");
var Utility_1 = require("./Utility");
var VOID0 = void 0;
function unsafe(listeners, payload, trap) {
    if (listeners && listeners.length) {
        for (var i = 0, len = listeners.length; i < len; i++) {
            var fn = listeners[i];
            if (!fn) continue;
            try {
                fn(payload);
            } catch (ex) {
                if (!trap) throw ex;else if (Types_1.Type.isFunction(trap)) trap(ex, i);
            }
        }
    }
}
exports.unsafe = unsafe;
function mapped(listeners, payload, trap) {
    if (!listeners) return null;
    var result = Utility_1.copy(listeners);
    if (listeners.length) {
        for (var i = 0, len = result.length; i < len; i++) {
            var fn = result[i];
            try {
                result[i] = fn ? fn(payload) : VOID0;
            } catch (ex) {
                result[i] = VOID0;
                if (!trap) throw ex;else if (Types_1.Type.isFunction(trap)) trap(ex, i);
            }
        }
    }
    return result;
}
exports.mapped = mapped;
function dispatch(listeners, payload, trap) {
    unsafe(Utility_1.copy(listeners), payload, trap);
}
exports.dispatch = dispatch;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dispatch;
//# sourceMappingURL=Dispatch.js.map
