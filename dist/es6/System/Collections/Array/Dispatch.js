/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Type } from "../../Types";
import { copy } from "./Utility";
const VOID0 = void (0);
export function unsafe(listeners, payload, trap) {
    if (listeners && listeners.length) {
        for (let i = 0, len = listeners.length; i < len; i++) {
            let fn = listeners[i];
            if (!fn)
                continue;
            try {
                fn(payload);
            }
            catch (ex) {
                if (!trap)
                    throw ex;
                else if (Type.isFunction(trap))
                    trap(ex, i);
            }
        }
    }
}
export function mapped(listeners, payload, trap) {
    if (!listeners)
        return null;
    var result = copy(listeners);
    if (listeners.length) {
        for (let i = 0, len = result.length; i < len; i++) {
            let fn = result[i];
            try {
                result[i] = fn
                    ? fn(payload)
                    : VOID0;
            }
            catch (ex) {
                result[i] = VOID0;
                if (!trap)
                    throw ex;
                else if (Type.isFunction(trap))
                    trap(ex, i);
            }
        }
    }
    return result;
}
export function dispatch(listeners, payload, trap) {
    unsafe(copy(listeners), payload, trap);
}
export default dispatch;
//# sourceMappingURL=Dispatch.js.map