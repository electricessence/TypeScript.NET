System.register(["../Types", "../Collections/LinkedNodeList", "../Collections/Queue", "../Disposable/ObjectPool", "../Environment"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function flush() {
        var entry;
        while (entry = immediateQueue.first) {
            var task_1 = entry.task, domain = entry.domain, context_2 = entry.context, args = entry.args;
            entry.canceller();
            if (domain)
                domain.enter();
            runSingle(task_1, domain, context_2, args);
        }
        var task;
        while (task = laterQueue.dequeue()) {
            runSingle(task);
        }
        flushing = false;
    }
    function runSingle(task, domain, context, params) {
        try {
            task.apply(context, params);
        }
        catch (e) {
            if (Environment_1.isNodeJS) {
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
    function deferImmediate(task, context, args) {
        var entry = entryPool.take();
        entry.task = task;
        entry.domain = Environment_1.isNodeJS && process['domain'];
        entry.context = context;
        entry.args = args && args.slice();
        entry.canceller = function () {
            if (!entry)
                return false;
            var r = Boolean(immediateQueue.removeNode(entry));
            entryPool.add(entry);
            return r;
        };
        immediateQueue.addNode(entry);
        requestFlush();
        return {
            cancel: entry.canceller,
            dispose: function () { entry && entry.canceller(); }
        };
    }
    function runAfterDeferred(task) {
        laterQueue.enqueue(task);
        requestFlush();
    }
    var Types_1, LinkedNodeList_1, Queue_1, ObjectPool_1, Environment_1, requestTick, flushing, immediateQueue, laterQueue, entryPool;
    exports_1("deferImmediate", deferImmediate);
    exports_1("runAfterDeferred", runAfterDeferred);
    return {
        setters: [
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (LinkedNodeList_1_1) {
                LinkedNodeList_1 = LinkedNodeList_1_1;
            },
            function (Queue_1_1) {
                Queue_1 = Queue_1_1;
            },
            function (ObjectPool_1_1) {
                ObjectPool_1 = ObjectPool_1_1;
            },
            function (Environment_1_1) {
                Environment_1 = Environment_1_1;
            }
        ],
        execute: function () {
            flushing = false;
            immediateQueue = new LinkedNodeList_1.LinkedNodeList();
            laterQueue = new Queue_1.Queue();
            entryPool = new ObjectPool_1.ObjectPool(40, function () { return ({}); }, function (o) {
                o.task = null;
                o.domain = null;
                o.context = null;
                if (o.args)
                    o.args.length = 0;
                o.args = null;
                o.canceller = null;
            });
            if (Environment_1.isNodeJS) {
                requestTick = function () {
                    process.nextTick(flush);
                };
            }
            else if (typeof setImmediate === Types_1.Type.FUNCTION) {
                if (typeof window !== Types_1.Type.UNDEFINED) {
                    requestTick = setImmediate.bind(window, flush);
                }
                else {
                    requestTick = function () {
                        setImmediate(flush);
                    };
                }
            }
            else if (typeof MessageChannel !== Types_1.Type.UNDEFINED) {
                var channel_1 = new MessageChannel();
                channel_1.port1.onmessage = function () {
                    requestTick = requestPortTick_1;
                    channel_1.port1.onmessage = flush;
                    flush();
                };
                var requestPortTick_1 = function () {
                    channel_1.port2.postMessage(0);
                };
                requestTick = function () {
                    setTimeout(flush, 0);
                    requestPortTick_1();
                };
            }
            else {
                requestTick = function () {
                    setTimeout(flush, 0);
                };
            }
            exports_1("default", deferImmediate);
        }
    };
});
//# sourceMappingURL=deferImmediate.js.map