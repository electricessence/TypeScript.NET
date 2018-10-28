///<reference types="node"/>
import * as assert from "assert";
import Stopwatch from "../../../../dist/commonjs/System/Diagnostics/Stopwatch";
import Parallel from "../../../../dist/commonjs/System/Threading/Tasks/Parallel";

it("should return the expected concatenation", () =>
{
	return Parallel
		.startNew("there", x => "hello: " + x)
		.then(
			result => assert.equal(result, "hello: there"),
			error => assert.ok(false)
		);
});

function test(start:number):number
{
	const max = 3000000;
	for(let i = start, stop = start + max; i<stop; i++)
	{
		start += i;
	}
	return start;
}

let synchronousResult = 0;
const data:number[] = [];
it("should work synchronously", () =>
{
	// console.log("\nSynchronous time (ms):",
	Stopwatch.measure(
		() =>
		{
			for(let i = 0; i<20; i++)
			{
				data.push(i);
				synchronousResult += test(i);
			}
		})
	// .total.milliseconds)
	;
});

function setupMap(maxCon:number):void
{
	it(`should return the expected mapped sum (concurrency ${maxCon})`, function()
	{
		//this.timeout(3000);
		// var sw = Stopwatch.startNew();
		return Parallel
			.maxConcurrency(maxCon)
			.map(data, test)
			.thenThis(result => assert.ok(true),
				error => assert.ok(false, "mapping failed!"))
			.reduce((p, c) => p + c, 0)
			.then(
				result => assert.equal(result, synchronousResult),
				error => assert.ok(false, error)
			)
			// .finallyThis(
			// 	()=>console.log(`\n(${maxCon}) Parallel map time (ms):`, sw.elapsedMilliseconds))
			;

	});
}


function setupPipe(maxCon:number):void
{
	it(`should return the expected sum (concurrency ${maxCon})`, function()
	{
		//this.timeout(3000);
		// var sw = Stopwatch.startNew();
		return Parallel
			.maxConcurrency(maxCon)
			.pipe(data, test)
			.reduce((p, c) => p + c, 0)
			.then(
				result => assert.equal(result, synchronousResult),
				error => assert.ok(false, error)
			)
			// .finallyThis(
			// 	()=>console.log(`\n(${maxCon}) Parallel pipe time (ms):`, sw.elapsedMilliseconds))
			;

	});
}

setupPipe(1);
setupPipe(2);
// setupPipe(3);

// setup(15);
// setup(10);
//setup(7);
setupMap(1);
setupMap(2);
// setupMap(3);