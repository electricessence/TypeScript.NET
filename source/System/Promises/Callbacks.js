(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Disposable/ObjectPool"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ObjectPool_1 = require("../Disposable/ObjectPool");
    var pool;
    function factory() {
        return {
            onFulfilled: null,
            onRejected: null
        };
    }
    function init(onFulfilled, onRejected, promise) {
        if (!pool)
            pool = new ObjectPool_1.ObjectPool(40, factory);
        var c = pool.take();
        c.onFulfilled = onFulfilled;
        c.onRejected = onRejected;
        c.promise = promise;
        return c;
    }
    exports.init = init;
    function release(to, c) {
        var onFulfilled = c.onFulfilled, onRejected = c.onRejected;
        recycle(c);
        to.then(onFulfilled, onRejected);
    }
    exports.release = release;
    function recycle(c) {
        c.onFulfilled = null;
        c.onRejected = null;
        c.promise = null;
        pool.add(c);
    }
    exports.recycle = recycle;
});
//# sourceMappingURL=Callbacks.js.map