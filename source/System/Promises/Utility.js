(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../Types'], function (require, exports) {
    var Types_1 = require('../Types');
    function isPromiseLike(object) {
        return Types_1.default.hasMemberOfType(object, 'then', Types_1.default.FUNCTION);
    }
    exports.isPromiseLike = isPromiseLike;
    function fulfill(value) {
        return Promise({
            "when": function () {
                return value;
            },
            "get": function (name) {
                return value[name];
            },
            "set": function (name, rhs) {
                value[name] = rhs;
            },
            "delete": function (name) {
                delete value[name];
            },
            "post": function (name, args) {
                if (name === null || name === VOID0) {
                    return value.apply(void 0, args);
                }
                else {
                    return value[name].apply(value, args);
                }
            },
            "apply": function (thisp, args) {
                return value.apply(thisp, args);
            },
            "keys": function () {
                return Object.keys(value);
            }
        }, void 0, function inspect() {
            return { state: "fulfilled", value: value };
        });
    }
    exports.fulfill = fulfill;
    function reject(reason) {
        var rejection = Promise({
            "when": function (rejected) {
                if (rejected) {
                    untrackRejection(this);
                }
                return rejected ? rejected(reason) : this;
            }
        }, function fallback() {
            return this;
        }, function inspect() {
            return { state: "rejected", reason: reason };
        });
        trackRejection(rejection, reason);
        return rejection;
    }
    exports.reject = reject;
});
//# sourceMappingURL=Utility.js.map