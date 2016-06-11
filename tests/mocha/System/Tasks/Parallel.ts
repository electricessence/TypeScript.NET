///<reference path="../../import.d.ts"/>

import Parallel from "../../../../dist/commonjs/System/Threading/Tasks/Parallel";
import Stopwatch from "../../../../dist/commonjs/System/Diagnostics/Stopwatch";
import * as assert from "assert";

it("should return the expected concatenation", ()=>
{
	return Parallel
		.startNew("there", x=>"hello: " + x)
		.then(
			result=>assert.equal(result, "hello: there"),
			error=>assert.ok(false)
		);

});

function test(start:number):number
{
	const max = 30000000;
	for(let i = start, stop = start + max; i<stop; i++)
	{
		start += i;
	}
	return start;
}

var synchronousResult = 0;
var data:number[] = [];
it("should work synchronously",()=>{
	// console.log("\nSynchronous time (ms):",
		Stopwatch.measure(
			()=>
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

function setup(maxCon:number):void
{
	it(`should return the expected sum (concurrency ${maxCon})`, function()
	{
		//this.timeout(3000);
		//var sw = Stopwatch.startNew();
		return Parallel
			.maxConcurrency(maxCon)
			.map(data, test)
			.thenThis(result=>assert.ok(true),
				error=>assert.ok(false,"mapping failed!"))
			.reduce((p,c)=>p+c,0)
			.then(
				result=>assert.equal(result, synchronousResult),
				error=>assert.ok(false,error)
			)
			// .finallyThis(
			// 	()=>console.log(`\n(${maxCon}) Parallel time (ms):`, sw.elapsedMilliseconds))
			;

	});
}

// setup(15);
// setup(10);
//setup(7);
setup(1);
setup(2);
setup(3);
