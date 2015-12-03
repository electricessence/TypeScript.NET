/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on code from: https://github.com/kriskowal/q
 */
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../Types', "../Collections/LinkedList", "../Collections/Queue"], function (require, exports) {
    var Types_1 = require('../Types');
    var LinkedList_1 = require("../Collections/LinkedList");
    var Queue_1 = require("../Collections/Queue");
    "use strict";
    var requestTick;
    var flushing = false;
    var isNodeJS = false;
    function flush() {
        // Since it's possible to trigger promises/events that add more during a flush:
        // Snapshot the contents first.
        var entries = immediateQueue.toArray();
        immediateQueue.clear();
        for (var _i = 0; _i < entries.length; _i++) {
            var e = entries[_i];
            var domain = e.domain;
            if (domain)
                domain.enter();
            runSingle(e.task, domain);
        }
        for (var _a = 0, _b = laterQueue.dump(); _a < _b.length; _a++) {
            var task = _b[_a];
            runSingle(task);
        }
        if (immediateQueue.count || laterQueue.count) {
            requestTick();
        }
        else {
            flushing = false;
        }
    }
    function requestFlush() {
        if (!flushing) {
            flushing = true;
            requestTick();
        }
    }
    var immediateQueue = new LinkedList_1.default();
    var laterQueue = new Queue_1.default();
    function runSingle(task, domain) {
        try {
            task();
        }
        catch (e) {
            if (isNodeJS) {
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }
                throw e;
            }
            else {
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }
        if (domain) {
            domain.exit();
        }
    }
    var TaskManager;
    (function (TaskManager) {
        function defer(task, delay) {
            if (Types_1.default.isNumber(delay, false) && delay >= 0) {
                var timeout = 0;
                var cancel = function () {
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = 0;
                        return true;
                    }
                    return false;
                };
                timeout = setTimeout(function () {
                    cancel();
                    task();
                }, delay);
                return cancel;
            }
            var entry = {
                task: task,
                domain: isNodeJS && process['domain']
            };
            immediateQueue.add(entry);
            requestFlush();
            return function () { return !!immediateQueue.remove(entry); };
        }
        TaskManager.defer = defer;
        function runAfterDeferred(task) {
            laterQueue.enqueue(task);
            requestFlush();
        }
        TaskManager.runAfterDeferred = runAfterDeferred;
    })(TaskManager || (TaskManager = {}));
    if (Types_1.default.isObject(process)
        && process.toString() === "[object process]"
        && process.nextTick) {
        isNodeJS = true;
        requestTick = function () {
            process.nextTick(flush);
        };
    }
    else if (typeof setImmediate === "function") {
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        }
        else {
            requestTick = function () {
                setImmediate(flush);
            };
        }
    }
    else if (typeof MessageChannel !== "undefined") {
        var channel = new MessageChannel();
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };
    }
    else {
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TaskManager;
});
//# sourceMappingURL=TaskManager.js.map