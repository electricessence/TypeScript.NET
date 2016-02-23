/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on code from: https://github.com/kriskowal/q
 */
System.register(['../Types', "../Collections/LinkedList", "../Collections/Queue"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Types_1, LinkedList_1, Queue_1;
    var requestTick, isNodeJS, flushing, immediateQueue, laterQueue, TaskScheduler, channel, requestPortTick;
    function flush() {
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
    function requestFlush() {
        if (!flushing) {
            flushing = true;
            requestTick();
        }
    }
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (LinkedList_1_1) {
                LinkedList_1 = LinkedList_1_1;
            },
            function (Queue_1_1) {
                Queue_1 = Queue_1_1;
            }],
        execute: function() {
            "use strict";
            isNodeJS = false;
            flushing = false;
            immediateQueue = new LinkedList_1.default();
            laterQueue = new Queue_1.default();
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
                function runAfterDeferred(task) {
                    laterQueue.enqueue(task);
                    requestFlush();
                }
                TaskScheduler.runAfterDeferred = runAfterDeferred;
            })(TaskScheduler || (TaskScheduler = {}));
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
                channel = new MessageChannel();
                channel.port1.onmessage = function () {
                    requestTick = requestPortTick;
                    channel.port1.onmessage = flush;
                    flush();
                };
                requestPortTick = function () {
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
            exports_1("default",TaskScheduler);
        }
    }
});
//# sourceMappingURL=TaskScheduler.js.map