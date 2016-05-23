///<reference path="../../import.d.ts"/>

import {Promise} from "../../../../source/System/Promises/Promise";
import * as AU from "../../../../source/System/Collections/Array/Utility";
import Stopwatch from "../../../../source/System/Diagnostics/Stopwatch";
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
	var count = 10000;
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
				promise.then(currentVal=>currentVal + nextVal).deferAll(), Promise.resolve(0).deferAll())
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
		assert.equal(f.isResolved, true);
		assert.equal(f.isFulfilled, true);
		assert.equal(f.isRejected, false);
	});

	it("should result in a rejected promise when requesting rejected", ()=>
	{
		var f = Promise.reject("err");
		assert.equal(f.error, "err");
		assert.equal(f.isResolved, true);
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

		pending.fulfill(resolution);
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

		pending.fulfill(10);
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

		pending.fulfill(10);
		return deferred;
	});

	it("follows expected promise behavior flow", ()=>
	{

		const BREAK = "break";

		Promise
			.resolve(true)
			.then(v=>
			{
				assert.ok(v);
				return v;
			}, e=>
			{
				assert.ok(false);
				return e;
			})
			.then(v=>
			{
				assert.ok(v);
				return v;
			})
			.then(v=>
			{
				assert.ok(v);
				return false;
			})
			.then(v=>
			{
				assert.ok(!v);
				return true;
			})
			.then<boolean>(v=>
			{
				assert.ok(v);
				throw BREAK;
			})
			.then((v:any)=>
			{
				assert.ok(false);
				return v;
			}, e=>
			{
				assert.equal(e, BREAK);
				return BREAK;
			})
			.then((v:any)=>
			{
				assert.equal(v, BREAK);
				return BREAK;
			}, (e:any)=>
			{
				assert.equal(e, BREAK);
				return BREAK;
			})
			.then(()=>{
				assert.ok(true);
				throw BREAK;
			})
			.catch(e=>{
				return true;
			})
			.then(v=>{
				assert.ok(v);
			});


	});

});
