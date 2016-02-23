/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on code from: https://github.com/kriskowal/q
 */

import Type from '../Types';
import LinkedList from "../Collections/LinkedList";
import Queue from "../Collections/Queue";

declare module process
{
	export function nextTick(callback:Function):void;
	export function toString():string;
}

interface IDomain
{
	enter():void;
	exit():void;
}

interface TaskQueueEntry
{
	task:Function;
	domain?:IDomain;
}


"use strict";

var requestTick:()=>void;
var isNodeJS:boolean = false;
var flushing:boolean = false;

// Use the fastest possible means to execute a task in a future turn
// of the event loop.



function flush():void
{
	/* jshint loopfunc: true */
	var entry:ILinkedListNode<TaskQueueEntry>;

	while(entry = immediateQueue.first)
	{
		let e = entry.value, domain = e.domain;
		entry.remove();
		if(domain) domain.enter();
		runSingle(e.task, domain);
	}

	var task:Function;
	while(task = laterQueue.dequeue())
	{
		runSingle(task);
	}

	flushing = false;
}


// linked list of tasks.  Using a real linked list to allow for removal.
var immediateQueue:LinkedList<TaskQueueEntry> = new LinkedList<TaskQueueEntry>();

// queue for late tasks, used by unhandled rejection tracking
var laterQueue:Queue<Function> = new Queue<Function>();

function runSingle(task:Function, domain?:IDomain):void
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

function requestFlush():void {
	if(!flushing)
	{
		flushing = true;
		requestTick();
	}
}

module TaskScheduler {


	export function defer(task:Function, delay?:number):()=>boolean
	{
		if(Type.isNumber(delay,false) && delay>=0) {

			var timeout:number = 0;

			var cancel = ()=>{
				if(timeout) {
					clearTimeout(timeout);
					timeout = 0;
					return true;
				}
				return false;
			};

			timeout = setTimeout(()=>{
				cancel();
				task();
			},delay);

			return cancel;
		}

		var entry = {
			task:task,
			domain:isNodeJS && (<any>process)['domain']
		};

		immediateQueue.add(entry);

		requestFlush();

		return ()=>!!immediateQueue.remove(entry)
	}


	// runs a task after all other tasks have been run
	// this is useful for unhandled rejection tracking that needs to happen
	// after all `then`d tasks have been run.
	export function runAfterDeferred(task:Function):void
	{
		laterQueue.enqueue(task);
		requestFlush();
	}

}



if(Type.isObject(process)
	&& process.toString()==="[object process]"
	&& process.nextTick)
{
	// Ensure Q is in a real Node environment, with a `process.nextTick`.
	// To see through fake Node environments:
	// * Mocha test runner - exposes a `process` global without a `nextTick`
	// * Browserify - exposes a `process.nexTick` function that uses
	//   `setTimeout`. In this case `setImmediate` is preferred because
	//    it is faster. Browserify's `process.toString()` yields
	//   "[object Object]", while in a real Node environment
	//   `process.nextTick()` yields "[object process]".
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

export default TaskScheduler;
