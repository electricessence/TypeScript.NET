/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on code from: https://github.com/kriskowal/q
 */
import { Type } from "../Types";
import { LinkedNodeList } from "../Collections/LinkedNodeList";
import { Queue } from "../Collections/Queue";
import { ObjectPool } from "../Disposable/ObjectPool";
import { isNodeJS } from "../Environment";
var requestTick;
var flushing = false;
// Use the fastest possible means to execute a task in a future turn
// of the event loop.
function flush() {
    /* jshint loopfunc: true */
    var entry;
    while (entry = immediateQueue.first) {
        var task = entry.task, domain = entry.domain, context_1 = entry.context, args = entry.args;
        entry.canceller();
        if (domain)
            domain.enter();
        runSingle(task, domain, context_1, args);
    }
    while (laterQueue.tryDequeue(function (task) {
        runSingle(task);
    })) { }
    flushing = false;
}
// linked list of tasks.  Using a real linked list to allow for removal.
var immediateQueue = new LinkedNodeList();
// queue for late tasks, used by unhandled rejection tracking
var laterQueue = new Queue();
var entryPool = new ObjectPool(40, function () { return ({}); }, function (o) {
    o.task = null;
    o.domain = null;
    o.context = null;
    if (o.args)
        o.args.length = 0;
    o.args = null;
    o.canceller = null;
});
function runSingle(task, domain, context, params) {
    try {
        task.apply(context, params);
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
//noinspection JSValidateJSDoc
/**
 *
 * @param task
 * @param context
 * @param args
 * @returns ICancellable
 */
export function deferImmediate(task, context, args) {
    var entry = entryPool.take();
    entry.task = task;
    entry.domain = isNodeJS && process['domain'];
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
export function runAfterDeferred(task) {
    laterQueue.enqueue(task);
    requestFlush();
}
if (isNodeJS) {
    requestTick = function () {
        process.nextTick(flush);
    };
}
else if (typeof setImmediate === TypeOfValue.Function) {
    // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
    if (typeof window !== Type.UNDEFINED) {
        requestTick = setImmediate.bind(window, flush);
    }
    else {
        requestTick = function () {
            setImmediate(flush);
        };
    }
}
else if (typeof MessageChannel !== Type.UNDEFINED) {
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
export default deferImmediate;
//# sourceMappingURL=deferImmediate.js.map