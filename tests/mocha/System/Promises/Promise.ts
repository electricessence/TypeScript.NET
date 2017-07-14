///<reference types="node"/>
import * as assert from "assert";
import {
	Fulfilled,
	PromiseBase,
	PromiseCollection,
	TSDNPromise
} from "../../../../dist/commonjs/System/Promises/Promise";
import * as AU from "../../../../dist/commonjs/System/Collections/Array/Utility";
import Stopwatch from "../../../../dist/commonjs/System/Diagnostics/Stopwatch";
import {defer} from "../../../../dist/commonjs/System/Threading/defer";
import {LazyPromise} from "../../../../dist/commonjs/System/Promises/LazyPromise";
import {ObjectDisposedException} from "../../../../dist/commonjs/System/Disposable/ObjectDisposedException";


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
	const array = AU.range(1, count);
	const swA = Stopwatch.startNew();
	const answer = array.reduce((currentVal, nextVal) => currentVal + nextVal, 0);
	swA.stop();

	it("should compute correct result without blowing stack (Synchronous) (lambda only)", ()=>
	{
		let sw = Stopwatch.startNew();
		return array
			.reduce((promise:PromiseBase<number>, nextVal:number) =>
				promise.thenSynchronous(currentVal=>currentVal + nextVal), TSDNPromise.resolve(0))
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
				promise.then(currentVal=>currentVal + nextVal), TSDNPromise.resolve(0))
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
		const r = TSDNPromise.resolve(true).then(() =>
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
		const f = TSDNPromise.resolve(5);
		assert.equal(f.result, 5);
		assert.equal(f.isSettled, true);
		assert.equal(f.isFulfilled, true);
		assert.equal(f.isRejected, false);
	});

	it("should result in a rejected promise when requesting rejected", ()=>
	{
		const f = TSDNPromise.reject("err");
		assert.equal(f.error, "err");
		assert.equal(f.isSettled, true);
		assert.equal(f.isFulfilled, false);
		assert.equal(f.isRejected, true);
	});

	it("resolves multiple observers", done=>
	{
		let nextTurn = false;

		const resolution = "Ta-ram pam param!";
		const pending = new TSDNPromise<any>();
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
		const pending = new TSDNPromise();
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
		let threw = false;
		const pending = new TSDNPromise();
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
		return testPromiseFlow(TSDNPromise.resolve(true));
	});


	it("should follow expected promise behavior flow for a rejected promise", ()=>
	{
		return testPromiseFlow(
			TSDNPromise
				.reject(BREAK)
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
		return TSDNPromise.resolve(true)
			.thenAllowFatal<void>(()=>{
				// throw "BAM!";
			});
	});

	it("should follow expected promise behavior flow for a pending then resolved promise", ()=>
	{
		const p = new TSDNPromise<boolean>();
		assert.ok(p.isPending);
		p.resolve(true);
		return testPromiseFlow(p);
	});


	it("should be able to use a then-able", ()=>
	{
		const p:any = TSDNPromise.createFrom((r:TSDNPromise.Fulfill<boolean,boolean>) =>
		{
			r(true);
			return TSDNPromise.resolve(true);
		});
		return testPromiseFlow(p);
	});


	it("should be able to use a lazy", ()=>
	{
		it(".deferFromNow", ()=>
		{
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
		const s = new TSDNPromise<boolean>();
		const p = new TSDNPromise<boolean>(resolve =>
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
		return TSDNPromise.waitAll<any>(
			other,
			TSDNPromise.resolve(3),
			TSDNPromise.resolve(2),
			TSDNPromise.reject(BREAK),
			TSDNPromise.resolve(1)
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
		return TSDNPromise.all(
			other.delayFromNow(10).delayAfterResolve(10),
			TSDNPromise.resolve(3),
			TSDNPromise.resolve(2),
			TSDNPromise.resolve(1)
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
		return TSDNPromise.all(
			other,
			TSDNPromise.resolve(3),
			TSDNPromise.resolve(2),
			TSDNPromise.resolve(1),
			TSDNPromise.reject(-1)
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
		return TSDNPromise.race(
			other.delayAfterResolve(40),
			TSDNPromise.resolve(3).delayFromNow(10),
			TSDNPromise.resolve(2).delayFromNow(20),
			TSDNPromise.resolve(1).delayFromNow(30)
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
		return TSDNPromise.race(
			TSDNPromise.resolve(3).delayFromNow(20),
			TSDNPromise.resolve(2).delayAfterResolve(10),
			TSDNPromise.reject(1)
		).thenSynchronous(()=>
		{
			assert.ok(false);
		}, e=>
		{
			assert.equal(e, 1);
		});
	});

	it("should resolve the chain fulfilled promise result.", ()=>
		new TSDNPromise((resolve=>resolve(new TSDNPromise((resolve=>resolve(TSDNPromise.resolve(1)))))))
			.thenSynchronous(
				v=>assert.equal(v, 1),
				()=>assert.ok(false))
	);

	it("should resolve the rejected promise result.", ()=>
		new TSDNPromise((resolve=>resolve(TSDNPromise.reject(BREAK))))
			.thenSynchronous(
				()=>assert.ok(false),
				e=>assert.equal(e, BREAK))
	);

	it("should rejected a disposed promise-result..", ()=>
		new TSDNPromise((resolve=>
		{
			const r = TSDNPromise.resolve(1);
			r.dispose();
			resolve(r)
		}))
			.thenSynchronous(
				()=>assert.ok(false),
				e=>assert.ok(e instanceof ObjectDisposedException))
	);

});
