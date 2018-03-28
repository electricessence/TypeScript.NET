///<reference types="node"/>
import * as assert from "assert";
import Stopwatch from "../../../../source/Diagnostics/Stopwatch";
import {defer} from "../../../../source/Threading/defer";
import LazyPromise from "../../../../source/Promises/LazyPromise";
import rangeOfNumbers from "../../../../source/Collections/Array/rangeOfNumbers";
import PromiseBase from "../../../../source/Promises/PromiseBase";
import Promise, {Fulfilled} from "../../../../source/Promises/Promise";
import PromiseCollection from "../../../../source/Promises/PromiseCollection";
import resolve from "../../../../source/Promises/Functions/resolve";
import reject from "../../../../source/Promises/Functions/reject";
import createFrom from "../../../../source/Promises/Functions/createFrom";
import {Fulfill} from "../../../../source/Promises/PromiseTypes";
import waitAll from "../../../../source/Promises/Functions/waitAll";
import all from "../../../../source/Promises/Functions/all";
import race from "../../../../source/Promises/Functions/race";
import ObjectDisposedException from "../../../../source/Disposable/ObjectDisposedException";

const REASON = "this is not an error, but it might show up in the console";

// In browsers that support strict mode, it'll be `undefined`; otherwise, the global.
// let calledAsFunctionThis = (function() { return this; }());

afterEach(function()
{
	//Q.onerror = null;
});

describe("computing sum of integers using promises", ()=>
{
	// Use triangular numbers...
	const count = 1000;
	const array = rangeOfNumbers(1, count);
	const swA = Stopwatch.startNew();
	const answer = array.reduce((currentVal, nextVal) => currentVal + nextVal, 0);
	swA.stop();

	it("should compute correct result without blowing stack (Synchronous) (lambda only)", ()=>
	{
		let sw = Stopwatch.startNew();
		return array
			.reduce((promise:PromiseBase<number>, nextVal:number) =>
				promise.thenSynchronous(currentVal=>currentVal + nextVal), resolve(0))
			.thenSynchronous(value=>
			{
				sw.stop();
				// console.log("");
				// console.log("Synchronous Promise Compute Milliseconds: ", sw.elapsedMilliseconds);
				assert.equal(value, answer);
			});
	});

	it("should compute correct result without blowing stack (Synchronous) (lambda only)", ()=>
	{
		const source = new PromiseCollection(array.map(v => new Fulfilled(v)));
		let sw = Stopwatch.startNew();
		return source
			.reduce((previousValue:number, currentValue:number) =>previousValue+currentValue,0)
			.then(value=>
			{
				sw.stop();
				// console.log("");
				// console.log("PromiseCollection Compute Milliseconds: ", sw.elapsedMilliseconds);
				assert.equal(value, answer);
			});
	});

	it("should compute correct result without blowing stack (lambda only)", ()=>
	{
		let sw = Stopwatch.startNew();
		return array
			.reduce((promise:PromiseBase<number>, nextVal:number) =>
				promise.then(currentVal=>currentVal + nextVal), resolve(0))
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
		const r = resolve(true).then(() =>
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
		const f = resolve(5);
		assert.equal(f.result, 5);
		assert.equal(f.isSettled, true);
		assert.equal(f.isFulfilled, true);
		assert.equal(f.isRejected, false);
	});

	it("should result in a rejected promise when requesting rejected", ()=>
	{
		const f = reject("err");
		assert.equal(f.error, "err");
		assert.equal(f.isSettled, true);
		assert.equal(f.isFulfilled, false);
		assert.equal(f.isRejected, true);
	});

	it("resolves multiple observers", done=>
	{
		let nextTurn = false;

		const resolution = "Ta-ram pam param!";
		const pending = new Promise<any>();
		const count = 10;
		let i = 0;

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
		let threw = false;
		const pending = new Promise();
		// noinspection JSIgnoredPromiseFromCall
		pending.thenSynchronous(()=>
		{
			threw = true;
			throw new Error(REASON);
		});

		// noinspection JSIgnoredPromiseFromCall
		pending.thenSynchronous(
			value=>assert.equal(value, 10),
			()=>assert.equal("not", "here")
		);

		pending.resolve(10);
		return pending;
	});

	it("observers called even after throw (asynchronous)", ()=>
	{
		let threw = false;
		const pending = new Promise();
		// noinspection JSIgnoredPromiseFromCall
		pending.thenSynchronous(()=>
		{
			threw = true;
			throw new Error(REASON);
		});

		// noinspection JSIgnoredPromiseFromCall
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
			.then(<any>null) // ensure pass through
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
			.then(v=>
			{
				assert.ok(v);
				throw BREAK; // *
			}, ()=>
			{
				assert.ok(false);
				return NO;
			})
			.then(<any>null, <any>null) // ensure pass through
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
			}, ()=>
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
				throw "force catch"
			})
			.catch(()=>{
				throw BREAK; // Make sure throws inside reject are captured.
			})
			.catch(e=>
			{
				assert.equal(e, BREAK);
			})
	}

	it("should follow expected promise behavior flow for a resolved promise", ()=>
	{
		return testPromiseFlow(resolve(true));
	});


	it("should follow expected promise behavior flow for a rejected promise", ()=>
	{
		return testPromiseFlow(
				reject(BREAK)
				.then(v=>
				{
					assert.ok(false,"Fulfilled when it should have been rejected.");
				},v=>
				{
					assert.equal(v, BREAK);
				})
				.finally(()=>true)
		);
	});

	it("should pass through",()=>{
		return resolve(true)
			.thenAllowFatal<void>(()=>{
				// throw "BAM!";
			});
	});

	it("should follow expected promise behavior flow for a pending then resolved promise", ()=>
	{
		const p = new Promise<boolean>();
		assert.ok(p.isPending);
		p.resolve(true);
		return testPromiseFlow(p);
	});


	it("should be able to use a then-able", ()=>
	{
		const p:any = createFrom((r:Fulfill<boolean,boolean>) =>
		{
			r(true);
			return resolve(true);
		});
		return testPromiseFlow(p);
	});


	it("should be able to use a lazy", ()=>
	{
		it(".deferFromNow", ()=>
		{
			// noinspection JSIgnoredPromiseFromCall
			new LazyPromise<boolean>(()=>
			{
				assert.ok(false, "Should not have triggered the resolution.");
			}).delayFromNow(1000);

			const elapsed = Stopwatch.startNew();

			return testPromiseFlow(
				new LazyPromise<boolean>(resolve=>defer(()=>resolve(true), 1000))
					.delayFromNow(1000)
					.thenThis(()=>
					{
						const ms = elapsed.elapsedMilliseconds;
						assert.ok(ms>1000 && ms<2000);
					})
			);
		});

		it(".deferFromNow", ()=>
		{
			// noinspection JSIgnoredPromiseFromCall
			new LazyPromise<boolean>(()=>
			{
				assert.ok(false, "Should not have triggered the resolution.");
			}).delayAfterResolve(1000);

			const elapsed = Stopwatch.startNew();

			return testPromiseFlow(
				new LazyPromise<boolean>(resolve=>defer(()=>resolve(true), 1000))
					.delayAfterResolve(1000)
					.thenThis(()=>
					{
						const ms = elapsed.elapsedMilliseconds;
						assert.ok(ms>2000 && ms<3000);
					})
			);
		});

	});

	it("should be able to use promise as a resolution", ()=>
	{
		const s = new Promise<boolean>();
		const p = new Promise<boolean>(resolve =>
		{
			defer(() => resolve(s));
		});
		assert.ok(s.isPending);
		assert.ok(p.isPending);
		s.resolve(true);
		return testPromiseFlow(p);
	});

	it("should be able to wait for all", ()=>
	{
		const other = new LazyPromise<number>(resolve =>
		{
			resolve(4);
		});
		return waitAll<any>(
			other,
			resolve(3),
			resolve(2),
			reject(BREAK),
			resolve(1)
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
		const other = new LazyPromise<number>(resolve =>
		{
			resolve(4);
		});
		return all(
			other.delayFromNow(10).delayAfterResolve(10),
			resolve(3),
			resolve(2),
			resolve(1)
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
		const other = new LazyPromise<number>(resolve =>
		{
			resolve(4);
		});
		return all(
			other,
			resolve(3),
			resolve(2),
			resolve(1),
			reject(-1)
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
		const other = new LazyPromise<number>((resolve, reject) =>
		{
			reject(4);
		});
		return race(
			other.delayAfterResolve(40),
			resolve(3).delayFromNow(10),
			resolve(2).delayFromNow(20),
			resolve(1).delayFromNow(30)
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
		return race(
			resolve(3).delayFromNow(20),
			resolve(2).delayAfterResolve(10),
			reject(1)
		).thenSynchronous(()=>
		{
			assert.ok(false);
		}, e=>
		{
			assert.equal(e, 1);
		});
	});

	it("should resolve the chain fulfilled promise result.", ()=>
		new Promise((r=>r(new Promise((r=>r(resolve(1)))))))
			.thenSynchronous(
				v=>assert.equal(v, 1),
				()=>assert.ok(false))
	);

	it("should resolve the rejected promise result.", ()=>
		new Promise((r=>r(reject(BREAK))))
			.thenSynchronous(
				()=>assert.ok(false),
				e=>assert.equal(e, BREAK))
	);

	it("should rejected a disposed promise-result..", ()=>
		new Promise((r=>
		{
			const p = resolve(1);
			p.dispose();
			r(p)
		}))
			.thenSynchronous(
				()=>assert.ok(false),
				e=>assert.ok(e instanceof ObjectDisposedException))
	);

});
