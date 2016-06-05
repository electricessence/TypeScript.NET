/*!
 * @author electricessence / https://github.com/electricessence/
 * Based on Netjs mscorlib.ts
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../extends"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var extends_1;
    var __extends, EventSimple;
    return {
        setters:[
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }],
        execute: function() {
            __extends = extends_1.default;
            EventSimple = (function () {
                function EventSimple() {
                    this._listeners = [];
                }
                EventSimple.prototype.add = function (listener) {
                    this._listeners.push(listener);
                };
                EventSimple.prototype.remove = function (listener) {
                    var index = this._listeners.indexOf(listener);
                    if (index < 0)
                        return;
                    this._listeners.splice(index, 1);
                };
                EventSimple.prototype.dispatch = function () {
                    var params = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        params[_i - 0] = arguments[_i];
                    }
                    var listeners = this._listeners;
                    for (var _a = 0, listeners_1 = listeners; _a < listeners_1.length; _a++) {
                        var f = listeners_1[_a];
                        f.call(params);
                    }
                };
                EventSimple.prototype.toMulticastFunction = function () {
                    var listeners = this._listeners;
                    return function () {
                        for (var _i = 0, listeners_2 = listeners; _i < listeners_2.length; _i++) {
                            var f = listeners_2[_i];
                            f.call(arguments);
                        }
                    };
                };
                EventSimple.prototype.dispose = function () {
                    this._listeners.length = 0;
                };
                return EventSimple;
            }());
            exports_1("default", EventSimple);
        }
    }
});
//# sourceMappingURL=EventSimple.js.map