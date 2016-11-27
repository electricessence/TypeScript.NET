System.register(["../Types", "../Collections/LinkedNodeList", "../Collections/Queue", "../Disposable/ObjectPool", "../Environment"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    // Use the fastest possible means to execute a task in a future turn
    // of the event loop.
    function flush() {
        /* jshint loopfunc: true */
        var entry;
        while (entry = immediateQueue.first) {
            var task = entry.task, domain = entry.domain, context_2 = entry.context, args = entry.args;
            entry.canceller();
            if (domain)
                domain.enter();
            runSingle(task, domain, context_2, args);
        }
        while (laterQueue.tryDequeue(function (task) {
            runSingle(task);
        })) { }
        flushing = false;
    }
    function runSingle(task, domain, context, params) {
        try {
            task.apply(context, params);
        }
        catch (e) {
            if (Environment_1.isNodeJS) {
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
    //noinspection JSValidateJSDoc
    /**
     *
     * @param task
     * @param context
     * @param args
     * @returns {{cancel: (()=>boolean), dispose: (()=>undefined)}}
     */
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
    // runs a task after all other tasks have been run
    // this is useful for unhandled rejection tracking that needs to happen
    // after all `then`d tasks have been run.
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
            // linked list of tasks.  Using a real linked list to allow for removal.
            immediateQueue = new LinkedNodeList_1.LinkedNodeList();
            // queue for late tasks, used by unhandled rejection tracking
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
                // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
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
                // modern browsers
                // http://www.nonblocking.io/2011/06/windownexttick.html
                var channel_1 = new MessageChannel();
                // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
                // working message ports the first time a page loads.
                channel_1.port1.onmessage = function () {
                    requestTick = requestPortTick_1;
                    channel_1.port1.onmessage = flush;
                    flush();
                };
                var requestPortTick_1 = function () {
                    // Opera requires us to provide a message payload, regardless of
                    // whether we use it.
                    channel_1.port2.postMessage(0);
                };
                requestTick = function () {
                    setTimeout(flush, 0);
                    requestPortTick_1();
                };
            }
            else {
                // old browsers
                requestTick = function () {
                    setTimeout(flush, 0);
                };
            }
            exports_1("default", deferImmediate);
        }
    };
});
//# sourceMappingURL=deferImmediate.js.map