/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on code from: https://github.com/kriskowal/q
 */
System.register(["../Types", "../Collections/LinkedNodeList", "../Collections/Queue"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Types_1, LinkedNodeList_1, Queue_1;
    var requestTick, isNodeJS, flushing, immediateQueue, laterQueue, channel, requestPortTick;
    function flush() {
        var entry;
        while (entry = immediateQueue.first) {
            var task_1 = entry.task, domain = entry.domain;
            immediateQueue.removeNode(entry);
            if (domain)
                domain.enter();
            runSingle(task_1, domain);
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
    function deferImmediate(task) {
        var _this = this;
        var entry = {
            task: task,
            domain: isNodeJS && process['domain']
        };
        immediateQueue.addNode(entry);
        requestFlush();
        return {
            cancel: function () { return !!immediateQueue.removeNode(entry); },
            dispose: function () { _this.cancel(); }
        };
    }
    exports_1("default", deferImmediate);
    function runAfterDeferred(task) {
        laterQueue.enqueue(task);
        requestFlush();
    }
    exports_1("runAfterDeferred", runAfterDeferred);
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (LinkedNodeList_1_1) {
                LinkedNodeList_1 = LinkedNodeList_1_1;
            },
            function (Queue_1_1) {
                Queue_1 = Queue_1_1;
            }],
        execute: function() {
            isNodeJS = false;
            flushing = false;
            immediateQueue = new LinkedNodeList_1.LinkedNodeList();
            laterQueue = new Queue_1.Queue();
            if (Types_1.Type.isObject(process)
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
        }
    }
});
//# sourceMappingURL=deferImmediate.js.map