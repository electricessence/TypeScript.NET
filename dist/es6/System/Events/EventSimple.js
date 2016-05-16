/*!
 * @author electricessence / https://github.com/electricessence/
 * Based on Netjs mscorlib.ts
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export default class EventSimple {
    constructor() {
        this._listeners = [];
    }
    add(listener) {
        this._listeners.push(listener);
    }
    remove(listener) {
        var index = this._listeners.indexOf(listener);
        if (index < 0)
            return;
        this._listeners.splice(index, 1);
    }
    dispatch(...params) {
        var listeners = this._listeners;
        for (var f of listeners) {
            f.call(params);
        }
    }
    toMulticastFunction() {
        var listeners = this._listeners;
        return function () {
            for (var f of listeners) {
                f.call(arguments);
            }
        };
    }
    dispose() {
        this._listeners.length = 0;
    }
}
//# sourceMappingURL=EventSimple.js.map