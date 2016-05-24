///<reference path="../../import.d.ts"/>

import {Promise} from "../../../../source/System/Promises/Promise";
import * as AU from "../../../../source/System/Collections/Array/Utility";
import Stopwatch from "../../../../source/System/Diagnostics/Stopwatch";
import {defer} from "../../../../source/System/Tasks/defer";
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
			.reduce((promise:Promise<number>, nextVal:number) =>
				promise.then(currentVal=>currentVal + nextVal), Promise.resolve(0))
			.then(value=>
			{
				sw.stop();
				//console.log("");
				//console.log("Synchronous Promise Compute Milliseconds: ", sw.elapsedMilliseconds);
				assert.equal(value, answer);
			});
	});

	it("should compute correct result without blowing stack (Deferred) (lambda only)", ()=>
	{
		let sw = Stopwatch.startNew();
		return array
			.reduce((promise:Promise<number>, nextVal:number) =>
				promise.then(currentVal=>currentVal + nextVal).defer(), Promise.resolve(0).defer())
			.then(value=>
			{
				sw.stop();
				//console.log("");
				//console.log("Deferred Promise Compute Milliseconds: ", sw.elapsedMilliseconds);
				assert.equal(value, answer);
			});
	});

	it("should compute correct result without blowing stack (All Deferred) (lambda only)", ()=>
	{
		let sw = Stopwatch.startNew();
		return array
			.reduce((promise:Promise<number>, nextVal:number) =>
				promise.then(
					currentVal=>currentVal + nextVal).deferAll(), Promise.resolve(0).deferAll())
			.then(value=>
			{
				sw.stop();
				//console.log("");
				//console.log("All Deferred Promise Compute Milliseconds: ", sw.elapsedMilliseconds);
				assert.equal(value, answer);
			});
	});

	it("should be deferring fulfillment", ()=>
		array
			.reduce((promise:Promise<number>, nextVal:number) =>
			{
				let wasRun = false;
				var r = promise.defer().then(currentVal=>
				{
					wasRun = true;
					return currentVal + nextVal;
				});
				assert.ok(!wasRun, "The promise should have deferred until after closure completed.");
				return r;
			}, Promise.resolve(0))
	);

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
		var deferred = pending.defer();
		var count = 10;
		var i = 0;

		function resolve(value:any)
		{
			i++;
			assert.equal(value, resolution);
			assert.equal(nextTurn, true);
			if(i===count)
			{
				done();
			}
		}

		while(++i<=count)
		{
			deferred.then(resolve);
		}

		pending.resolve(resolution);
		i = 0;
		nextTurn = true;
	});

	it("observers called even after throw (synchronous)", ()=>
	{
		var threw = false;
		var pending = Promise.pending();
		pending.then(()=>
		{
			threw = true;
			throw new Error(REASON);
		});

		pending.then(
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
		var deferred = pending.defer();
		deferred.then(()=>
		{
			threw = true;
			throw new Error(REASON);
		});

		deferred.then(
			value=>assert.equal(value, 10),
			()=>assert.equal("not", "here")
		);

		pending.resolve(10);
		return deferred;
	});
	
	const BREAK = "break", NO = "NO!";

	function testPromiseFlow(p:Promise<boolean>):Promise<void>
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
			.defer() // rejected!!! 
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
			.delay()
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

	it("should be able to use a lazy resolved", ()=>
	{
		var p = Promise.lazy.resolve(()=>true);
		assert.ok(p.isFulfilled);
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


	it("should be able to use a synchronous resolver", ()=>
	{
		var p = Promise.pending<boolean>(resolve=>{
			resolve(true);
		});
		assert.ok(p.isFulfilled);
		return testPromiseFlow(p);
	});

	it("should be able to use a synchronous rejection", ()=>
	{
		var p = Promise.pending<boolean>((resolve,reject)=>{
			reject(true);
		});
		assert.ok(p.isRejected);
		return testPromiseFlow(p.catch(()=>true));
	});


	it("should be able to use an async resolver", ()=>
	{
		var p = Promise.pending<boolean>(resolve=>{
			defer(()=> resolve(true));
		});
		assert.ok(p.isPending);
		return testPromiseFlow(p);
	});

	it("should be able to use lazy pending", ()=>
	{
		var p = Promise.lazy.pending<boolean>(resolve=>{
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
		return Promise.all(
			Promise.resolve(3).defer(),
			Promise.resolve(2).defer(),
			Promise.resolve(1).defer()
		).then(r=>{
			assert.equal(r[0],3);
			assert.equal(r[1],2);
			assert.equal(r[2],1);
		});
	});

	it("should resolve as rejected", ()=>
	{
		return Promise.all(
			Promise.resolve(3).defer(),
			Promise.resolve(2).defer(),
			Promise.resolve(1).defer(),
			Promise.reject(-1).defer()
		).then(()=>{
			assert.ok(false);
		},e=>{
			assert.equal(e,-1);
		});
	});

	it("should be resolve the first to win the race", ()=>
	{
		return Promise.race(
			Promise.reject(4).delay(),
			Promise.resolve(3).delay(),
			Promise.resolve(2).defer(),
			Promise.resolve(1)
		).then(r=>{
			assert.equal(r,1);
		});
	});

	it("should be resolve the rejection", ()=>
	{
		return Promise.race(
			Promise.resolve(3).delay(),
			Promise.resolve(2).defer(),
			Promise.reject(1)
		).then(()=>{
			assert.ok(false);
		},e=>{
			assert.equal(e,1);
		});
	});


});

