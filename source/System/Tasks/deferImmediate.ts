/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on code from: https://github.com/kriskowal/q
 */


import {Type} from "../Types";
import {LinkedNodeList} from "../Collections/LinkedNodeList";
import {Queue} from "../Collections/Queue";
import {Closure} from "../FunctionTypes";
import {ILinkedNode} from "../Collections/ILinkedListNode";
import {ICancellable} from "./ICancellable";

declare module process
{
	export function nextTick(callback:Closure):void;

	export function toString():string;
}

interface IDomain
{
	enter():void;
	exit():void;
}

interface ITaskQueueEntry extends ILinkedNode<ITaskQueueEntry>
{
	task:Closure;
	domain?:IDomain;
}


var requestTick:()=>void;
var isNodeJS:boolean = false;
var flushing:boolean = false;

// Use the fastest possible means to execute a task in a future turn
// of the event loop.


function flush():void
{
	/* jshint loopfunc: true */
	var entry:ITaskQueueEntry;
	while(entry = immediateQueue.first)
	{
		let {task, domain} = entry;
		immediateQueue.removeNode(entry);
		if(domain) domain.enter();
		runSingle(task, domain);
	}

	let task:Closure;
	while(task = laterQueue.dequeue())
	{
		runSingle(task);
	}

	flushing = false;
}


// linked list of tasks.  Using a real linked list to allow for removal.
var immediateQueue = new LinkedNodeList<ITaskQueueEntry>();

// queue for late tasks, used by unhandled rejection tracking
var laterQueue:Queue<Closure> = new Queue<Closure>();

function runSingle(task:Closure, domain?:IDomain):void
{
	try
	{
		task();

	}
	catch(e)
	{
		if(isNodeJS)
		{
			// In node, uncaught exceptions are considered fatal errors.
			// Re-throw them synchronously to interrupt flushing!

			// Ensure continuation if the uncaught exception is suppressed
			// listening "uncaughtException" events (as domains does).
			// Continue in next event to avoid tick recursion.
			if(domain)
			{
				domain.exit();
			}
			setTimeout(flush, 0);
			if(domain)
			{
				domain.enter();
			}

			throw e;

		}
		else
		{
			// In browsers, uncaught exceptions are not fatal.
			// Re-throw them asynchronously to avoid slow-downs.
			setTimeout(()=>
			{
				throw e;
			}, 0);
		}
	}

	if(domain)
	{
		domain.exit();
	}
}

function requestFlush():void
{
	if(!flushing)
	{
		flushing = true;
		requestTick();
	}
}

export default function deferImmediate(task:Closure):ICancellable
{
	var entry:ITaskQueueEntry = {
		task: task,
		domain: isNodeJS && (<any>process)['domain']
	};

	immediateQueue.addNode(entry);

	requestFlush();

	return {
		cancel: ()=>!!immediateQueue.removeNode(entry),
		dispose: ()=> { this.cancel(); }
	}
}


// runs a task after all other tasks have been run
// this is useful for unhandled rejection tracking that needs to happen
// after all `then`d tasks have been run.
export function runAfterDeferred(task:Closure):void
{
	laterQueue.enqueue(task);
	requestFlush();
}


if(Type.isObject(process)
	&& process.toString()==="[object process]"
	&& process.nextTick)
{
	/*
	Ensure is in a real Node environment, with a `process.nextTick`.
	To see through fake Node environments:
	* Mocha test runner - exposes a `process` global without a `nextTick`
	* Browserify - exposes a `process.nexTick` function that uses
	  `setTimeout`. In this case `setImmediate` is preferred because
	   it is faster. Browserify's `process.toString()` yields
	  "[object Object]", while in a real Node environment
	  `process.nextTick()` yields "[object process]".
	*/
	isNodeJS = true;

	requestTick = ()=>
	{
		process.nextTick(flush);
	};

}
else if(typeof setImmediate==="function")
{
	// In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
	if(typeof window!=="undefined")
	{
		requestTick = setImmediate.bind(window, flush);
	}
	else
	{
		requestTick = ()=>
		{
			setImmediate(flush);
		};
	}

}
else if(typeof MessageChannel!=="undefined")
{
	// modern browsers
	// http://www.nonblocking.io/2011/06/windownexttick.html
	var channel = new MessageChannel();
	// At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
	// working message ports the first time a page loads.
	channel.port1.onmessage = function()
	{
		requestTick = requestPortTick;
		channel.port1.onmessage = flush;
		flush();
	};
	var requestPortTick = ()=>
	{
		// Opera requires us to provide a message payload, regardless of
		// whether we use it.
		channel.port2.postMessage(0);
	};
	requestTick = ()=>
	{
		setTimeout(flush, 0);
		requestPortTick();
	};

}
else
{
	// old browsers
	requestTick = ()=>
	{
		setTimeout(flush, 0);
	};
}
