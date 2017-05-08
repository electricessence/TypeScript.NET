/*!
 * @author electricessence / https://github.com/electricessence/
 * Based on Netjs mscorlib.ts
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
// noinspection JSUnusedLocalSymbols
/**
 * A simple event dispatcher provided as an alternative to built-in event.
 * If just dispatching a payload to a uniform set of functions, it may be better to just use the utilities in System/Collections/Array/Dispatch.
 */
export default class EventSimple {
    constructor() {
        this._listeners = [];
    }
    add(listener) {
        this._listeners.push(listener);
    }
    remove(listener) {
        const index = this._listeners.indexOf(listener);
        if (index < 0)
            return;
        this._listeners.splice(index, 1);
    }
    dispatch(...params) {
        const listeners = this._listeners;
        for (let f of listeners) {
            f.call(params);
        }
    }
    toMulticastFunction() {
        const listeners = this._listeners;
        return function () {
            for (let f of listeners) {
                f.call(arguments);
            }
        };
    }
    dispose() {
        this._listeners.length = 0;
    }
}
//# sourceMappingURL=EventSimple.js.map