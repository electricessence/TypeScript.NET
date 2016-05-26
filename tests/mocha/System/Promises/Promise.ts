///<reference path="../../import.d.ts"/>

import {Promise, PromiseBase} from "../../../../source/System/Promises/Promise";
import * as AU from "../../../../source/System/Collections/Array/Utility";
import Stopwatch from "../../../../source/System/Diagnostics/Stopwatch";
import {defer} from "../../../../source/System/Threading/defer";
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

	it("should be deferring fulfillment", ()=>{

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
		var pending = Promise.pending<any>();
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
		var pending = Promise.pending();
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
		var pending = Promise.pending();
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
			.then(null,null) // ensure pass through
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
		var p = Promise.pending<boolean>();
		assert.ok(p.isPending);
		p.resolve(true);
		return testPromiseFlow(p);
	});


	it("should be able to use a then-able", ()=>
	{
		var p:any = Promise.createFrom((r:Promise.Fulfill<boolean,boolean>)=>{
			r(true);
			return Promise.resolve(true);
		});
		return testPromiseFlow(p);
	});


	it("should be able to use lazy pending", ()=>
	{
		var p = Promise.lazy<boolean>(resolve=>{
			defer(()=> resolve(true));
		});
		assert.ok(p.isPending);
		return testPromiseFlow(p);
	});

	it("should be able to use promise as a resolution", ()=>
	{
		var s = Promise.pending<boolean>();
		var p = Promise.pending<boolean>(resolve=>{
			defer(()=> resolve(s));
		});
		assert.ok(s.isPending);
		assert.ok(p.isPending);
		s.resolve(true);
		return testPromiseFlow(p);
	});

	it("should be able to resolve all", ()=>
	{
		var other = Promise.lazy<number>(resolve=>{
			resolve(4);
		});
		return Promise.all(
			other,
			Promise.resolve(3),
			Promise.resolve(2),
			Promise.resolve(1)
		).thenSynchronous(r=>{
			assert.equal(r[0],4);
			assert.equal(r[1],3);
			assert.equal(r[2],2);
			assert.equal(r[3],1);
		});
	});

	it("should resolve as rejected", ()=>
	{
		var other = Promise.lazy<number>(resolve=>{
			resolve(4);
		});
		return Promise.all(
			other,
			Promise.resolve(3),
			Promise.resolve(2),
			Promise.resolve(1),
			Promise.reject(-1)
		).thenSynchronous(()=>{
			assert.ok(false);
		},e=>{
			assert.equal(e,-1);
		});
	});

	it("should be resolve the first to win the race", ()=>
	{
		var other = Promise.lazy<number>((resolve,reject)=>{
			reject(4);
		});
		return Promise.race(
			other,
			Promise.resolve(3),
			Promise.resolve(2),
			Promise.resolve(1)
		).thenSynchronous(r=>{
			assert.equal(r,3);
		});
	});

	it("should be resolve the rejection", ()=>
	{
		return Promise.race(
			Promise.resolve(3).delayFromNow(20),
			Promise.resolve(2).delayAfterResolve(10),
			Promise.reject(1)
		).thenSynchronous(()=>{
			assert.ok(false);
		},e=>{
			assert.equal(e,1);
		});
	});


});

