///<reference path="../../import.d.ts"/>

import {Promise, PromiseBase} from "../../../../source/System/Promises/Promise";
import * as AU from "../../../../source/System/Collections/Array/Utility";
import Stopwatch from "../../../../source/System/Diagnostics/Stopwatch";
import {defer} from "../../../../source/System/Threading/defer";
import {LazyPromise} from "../../../../source/System/Promises/LazyPromise";
import {ObjectDisposedException} from "../../../../source/System/Disposable/ObjectDisposedException";
var assert = require('../../../../node_modules/assert/assert');


var REASON = "this is not an error, but it might show up in the console";

// In browsers that support strict mode, it'll be `undefined`; otherwise, the global.
var calledAsFunctionThis = (function() { return this; }());

afterEach(function()
{
	//Q.onerror = null;
});

describe("computing sum of integers using promises", ()=>
{
	// Use triangular numbers...
	var count = 1000;
	var array = AU.range(1, count);
	var swA = Stopwatch.startNew();
	var answer = array.reduce((currentVal, nextVal)=>currentVal + nextVal, 0);
	swA.stop();

	it("should compute correct result without blowing stack (Synchronous) (lambda only)", ()=>
	{
		let sw = Stopwatch.startNew();
		return array
			.reduce((promise:PromiseBase<number>, nextVal:number) =>
				promise.thenSynchronous(currentVal=>currentVal + nextVal), Promise.resolve(0))
			.thenSynchronous(value=>
			{
				sw.stop();
				//console.log("");
				//console.log("Synchronous Promise Compute Milliseconds: ", sw.elapsedMilliseconds);
				assert.equal(value, answer);
			});
	});

	it("should compute correct result without blowing stack (lambda only)", ()=>
	{
		let sw = Stopwatch.startNew();
		return array
			.reduce((promise:PromiseBase<number>, nextVal:number) =>
				promise.then(currentVal=>currentVal + nextVal), Promise.resolve(0))
			.then(value=>
			{
				sw.stop();
				//console.log("");
				//console.log("Deferred Promise Compute Milliseconds: ", sw.elapsedMilliseconds);
				assert.equal(value, answer);
			});
	});

	// it("should compute correct result without blowing stack (All Deferred) (lambda only)", ()=>
	// {
	// 	let sw = Stopwatch.startNew();
	// 	return array
	// 		.reduce((promise:PromiseBase<number>, nextVal:number) =>
	// 			promise.then(
	// 				currentVal=>currentVal + nextVal).deferAll(), Promise.resolve(0).deferAll())
	// 		.then(value=>
	// 		{
	// 			sw.stop();
	// 			//console.log("");
	// 			//console.log("All Deferred Promise Compute Milliseconds: ", sw.elapsedMilliseconds);
	// 			assert.equal(value, answer);
	// 		});
	// });

	it("should be deferring fulfillment", ()=>
	{

		let wasRun = false;
		var r = Promise.resolve(true).then(()=>
		{
			wasRun = true;
		});
		assert.ok(!wasRun, "The promise should have deferred until after closure completed.");
		return r;
	});

});


describe("Resolution and Rejection", ()=>
{
	it("should result in a fulfilled promise when given a value", ()=>
	{
		var f = Promise.resolve(5);
		assert.equal(f.result, 5);
		assert.equal(f.isSettled, true);
		assert.equal(f.isFulfilled, true);
		assert.equal(f.isRejected, false);
	});

	it("should result in a rejected promise when requesting rejected", ()=>
	{
		var f = Promise.reject("err");
		assert.equal(f.error, "err");
		assert.equal(f.isSettled, true);
		assert.equal(f.isFulfilled, false);
		assert.equal(f.isRejected, true);
	});

	it("resolves multiple observers", done=>
	{
		var nextTurn = false;

		var resolution = "Ta-ram pam param!";
		var pending = new Promise<any>();
		var count = 10;
		var i = 0;

		function resolve(value:any)
		{
			i++;
			assert.equal(value, resolution);
			assert.ok(nextTurn);
			if(!nextTurn) i = count;
			if(i===count)
			{
				done();
			}
		}

		while(++i<=count)
		{
			pending.then(resolve);
		}

		pending.resolve(resolution);
		i = 0;
		nextTurn = true;
	});

	it("observers called even after throw (synchronous)", ()=>
	{
		var threw = false;
		var pending = new Promise();
		pending.thenSynchronous(()=>
		{
			threw = true;
			throw new Error(REASON);
		});

		pending.thenSynchronous(
			value=>assert.equal(value, 10),
			()=>assert.equal("not", "here")
		);

		pending.resolve(10);
		return pending;
	});

	it("observers called even after throw (asynchronous)", ()=>
	{
		var threw = false;
		var pending = new Promise();
		pending.thenSynchronous(()=>
		{
			threw = true;
			throw new Error(REASON);
		});

		pending.thenSynchronous(
			value=>assert.equal(value, 10),
			()=>assert.equal("not", "here")
		);

		pending.resolve(10);
		return pending;
	});

	const BREAK = "break", NO = "NO!";

	function testPromiseFlow(p:PromiseBase<boolean>):PromiseBase<void>
	{
		return p
			.then(null) // ensure pass through
			.then(v=> // onFulfilled
			{
				assert.ok(v); // v === true
				return v; // *
			}, ()=> // onRejected
			{
				assert.ok(false);
				return true;
			})
			.then(v=>
			{
				assert.ok(v);
				return v; // *
			})
			.then(v=>
			{
				assert.ok(v);
				return false; // *
			})
			.then(v=>
			{
				assert.ok(!v);
				return true; // *
			})
			.then<string>(v=>
			{
				assert.ok(v);
				throw BREAK; // *
			}, e=>
			{
				assert.ok(false);
				return NO;
			})
			.then(null, null) // ensure pass through
			.then(v=>
			{
				// The previous promise threw/rejected so should never go here.
				assert.ok(false);
				return NO;
			}, e=>
			{
				assert.equal(e, BREAK);
				return BREAK; // *
			})
			.then(v=>
			{
				assert.equal(v, BREAK);
				return true; // *
			}, (e:any)=>
			{
				assert.ok(false);
				return false;
			})
			.then<boolean>(v=>
			{
				assert.ok(v);
				throw BREAK; // *
			})
			.catch(e=>
			{
				assert.equal(e, BREAK);
				return true; // *
			})
			.then(v=>
			{
				assert.ok(v);
				return 10;
			})
			.then(v=>
			{
				assert.equal(v, 10);
			});
	}

	it("should follow expected promise behavior flow for a resolved promise", ()=>
	{
		return testPromiseFlow(Promise.resolve(true));
	});


	it("should follow expected promise behavior flow for a rejected promise", ()=>
	{
		return testPromiseFlow(
			Promise
				.reject(BREAK)
				.catch(v=>
				{
					assert.equal(v, BREAK);
					return true;
				}));
	});


	it("should follow expected promise behavior flow for a pending then resolved promise", ()=>
	{
		var p = new Promise<boolean>();
		assert.ok(p.isPending);
		p.resolve(true);
		return testPromiseFlow(p);
	});


	it("should be able to use a then-able", ()=>
	{
		var p:any = Promise.createFrom((r:Promise.Fulfill<boolean,boolean>)=>
		{
			r(true);
			return Promise.resolve(true);
		});
		return testPromiseFlow(p);
	});


	it("should be able to use a lazy", ()=>
	{
		it(".deferFromNow", ()=>
		{
			new LazyPromise<boolean>(resolve=>
			{
				assert.ok(false, "Should not have triggered the resolution.");
			}).delayFromNow(1000);

			var elapsed = Stopwatch.startNew();

			return testPromiseFlow(
				new LazyPromise<boolean>(resolve=>defer(()=>resolve(true), 1000))
					.delayFromNow(1000)
					.thenThis(r=>
					{
						var ms = elapsed.elapsedMilliseconds;
						assert.ok(ms>1000 && ms<2000);
					})
			);
		});

		it(".deferFromNow", ()=>
		{
			new LazyPromise<boolean>(resolve=>
			{
				assert.ok(false, "Should not have triggered the resolution.");
			}).delayAfterResolve(1000);

			var elapsed = Stopwatch.startNew();

			return testPromiseFlow(
				new LazyPromise<boolean>(resolve=>defer(()=>resolve(true), 1000))
					.delayAfterResolve(1000)
					.thenThis(r=>
					{
						var ms = elapsed.elapsedMilliseconds;
						assert.ok(ms>2000 && ms<3000);
					})
			);
		});

	});

	it("should be able to use promise as a resolution", ()=>
	{
		var s = new Promise<boolean>();
		var p = new Promise<boolean>(resolve=>
		{
			defer(()=> resolve(s));
		});
		assert.ok(s.isPending);
		assert.ok(p.isPending);
		s.resolve(true);
		return testPromiseFlow(p);
	});

	it("should be able to wait for all", ()=>
	{
		var other = new LazyPromise<number>(resolve=>
		{
			resolve(4);
		});
		return Promise.waitAll<any>(
			other,
			Promise.resolve(3),
			Promise.resolve(2),
			Promise.reject(BREAK),
			Promise.resolve(1)
		).thenSynchronous((r:any[])=>
		{
			assert.equal(r[0].result, 4);
			assert.equal(r[1].result, 3);
			assert.equal(r[2].result, 2);
			assert.equal(r[3].result, void 0);
			assert.equal(r[3].error, BREAK);
			assert.equal(r[4].result, 1);
		}, ()=>assert.ok(false));
	});

	it("should be able to resolve all", ()=>
	{
		var other = new LazyPromise<number>(resolve=>
		{
			resolve(4);
		});
		return Promise.all(
			other.delayFromNow(10).delayAfterResolve(10),
			Promise.resolve(3),
			Promise.resolve(2),
			Promise.resolve(1)
		).thenSynchronous(r=>
		{
			assert.equal(r[0], 4);
			assert.equal(r[1], 3);
			assert.equal(r[2], 2);
			assert.equal(r[3], 1);
		});
	});

	it("should resolve as rejected", ()=>
	{
		var other = new LazyPromise<number>(resolve=>
		{
			resolve(4);
		});
		return Promise.all(
			other,
			Promise.resolve(3),
			Promise.resolve(2),
			Promise.resolve(1),
			Promise.reject(-1)
		).thenSynchronous(()=>
		{
			assert.ok(false);
		}, e=>
		{
			assert.equal(e, -1);
		});
	});

	it("should be resolve the first to win the race", ()=>
	{
		var other = new LazyPromise<number>((resolve, reject)=>
		{
			reject(4);
		});
		return Promise.race(
			other.delayAfterResolve(40),
			Promise.resolve(3).delayFromNow(10),
			Promise.resolve(2).delayFromNow(20),
			Promise.resolve(1).delayFromNow(30)
		).thenSynchronous(r=>
		{
			assert.equal(r, 3);
		}, ()=>
		{
			assert.ok(false);
		});
	});

	it("should be resolve the rejection", ()=>
	{
		return Promise.race(
			Promise.resolve(3).delayFromNow(20),
			Promise.resolve(2).delayAfterResolve(10),
			Promise.reject(1)
		).thenSynchronous(()=>
		{
			assert.ok(false);
		}, e=>
		{
			assert.equal(e, 1);
		});
	});

	it("should resolve the chain fulfilled promise result.", ()=>
		new Promise((resolve=>resolve(new Promise((resolve=>resolve(Promise.resolve(1)))))))
			.thenSynchronous(
				v=>assert.equal(v, 1),
				()=>assert.ok(false))
	);

	it("should resolve the rejected promise result.", ()=>
		new Promise((resolve=>resolve(Promise.reject(BREAK))))
			.thenSynchronous(
				()=>assert.ok(false),
				e=>assert.equal(e, BREAK))
	);

	it("should rejected a disposed promise-result..", ()=>
		new Promise((resolve=>
		{
			var r = Promise.resolve(1);
			r.dispose();
			resolve(r)
		}))
			.thenSynchronous(
				()=>assert.ok(false),
				e=>assert.ok(e instanceof ObjectDisposedException))
	);

});
