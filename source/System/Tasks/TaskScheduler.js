/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on code from: https://github.com/kriskowal/q
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../Types', "../Collections/LinkedList", "../Collections/Queue"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require('../Types');
    var LinkedList_1 = require("../Collections/LinkedList");
    var Queue_1 = require("../Collections/Queue");
    "use strict";
    var requestTick;
    var isNodeJS = false;
    var flushing = false;
    // Use the fastest possible means to execute a task in a future turn
    // of the event loop.
    function flush() {
        /* jshint loopfunc: true */
        var entry;
        while (entry = immediateQueue.first) {
            var e = entry.value, domain = e.domain;
            entry.remove();
            if (domain)
                domain.enter();
            runSingle(e.task, domain);
        }
        var task;
        while (task = laterQueue.dequeue()) {
            runSingle(task);
        }
        flushing = false;
    }
    // linked list of tasks.  Using a real linked list to allow for removal.
    var immediateQueue = new LinkedList_1.default();
    // queue for late tasks, used by unhandled rejection tracking
    var laterQueue = new Queue_1.default();
    function runSingle(task, domain) {
        try {
            task();
        }
        catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them synchronously to interrupt flushing!
                // Ensure continuation if the uncaught exception is suppressed
                // listening "uncaughtException" events (as domains does).
                // Continue in next event to avoid tick recursion.
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
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }
        if (domain) {
            domain.exit();
        }
    }
    function requestFlush() {
        if (!flushing) {
            flushing = true;
            requestTick();
        }
    }
    var TaskScheduler;
    (function (TaskScheduler) {
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
        TaskScheduler.defer = defer;
        // runs a task after all other tasks have been run
        // this is useful for unhandled rejection tracking that needs to happen
        // after all `then`d tasks have been run.
        function runAfterDeferred(task) {
            laterQueue.enqueue(task);
            requestFlush();
        }
        TaskScheduler.runAfterDeferred = runAfterDeferred;
    })(TaskScheduler || (TaskScheduler = {}));
    if (Types_1.default.isObject(process)
        && process.toString() === "[object process]"
        && process.nextTick) {
        // Ensure Q is in a real Node environment, with a `process.nextTick`.
        // To see through fake Node environments:
        // * Mocha test runner - exposes a `process` global without a `nextTick`
        // * Browserify - exposes a `process.nexTick` function that uses
        //   `setTimeout`. In this case `setImmediate` is preferred because
        //    it is faster. Browserify's `process.toString()` yields
        //   "[object Object]", while in a real Node environment
        //   `process.nextTick()` yields "[object process]".
        isNodeJS = true;
        requestTick = function () {
            process.nextTick(flush);
        };
    }
    else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
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
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };
    }
    else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TaskScheduler;
});
//# sourceMappingURL=TaskScheduler.js.map