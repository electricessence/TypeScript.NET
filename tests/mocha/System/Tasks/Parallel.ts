///<reference path="../../import.d.ts"/>

import Parallel from "../../../../dist/commonjs/System/Threading/Tasks/Parallel";
import Stopwatch from "../../../../dist/commonjs/System/Diagnostics/Stopwatch";
import Promise from "../../../../dist/commonjs/System/Promises/Promise";
import {sum} from "../../../../dist/commonjs/System/Collections/Array/Procedure";
import assert = require('assert');

it("should return the expected concatenation", ()=>
{
	function test(x:string):string
	{
		return "hello: " + x;
	}

	return Parallel
		.startNew("there", test)
		.then(
			result=>assert.equal(result, "hello: there"),
			error=>assert.ok(false)
		);

});

it("should return the expected sum", ()=>
{

	function test(start:number):number
	{
		const max = 100000000;
		for(let i = start, stop = start + max; i<stop; i++)
		{
			start += i;
		}
		return start;
	}

	var synchronousResult = 0;

	console.log("\nSynchronous time (ms):",
		Stopwatch.measure(
			()=>
			{
				for(let i = 0; i<4; i++)
				{
					synchronousResult += test(i);
				}
			})
			.total.milliseconds);

	var sw = Stopwatch.startNew();
	return Promise
		.all(
			Parallel.startNew(0, test),
			Parallel.startNew(1, test),
			Parallel.startNew(2, test),
			Parallel.startNew(3, test)
		)
		.then(
			results=>assert.equal(sum(results), synchronousResult),
			error=>assert.ok(false)
		)
		.finallyThis(
			()=>console.log("\nParallel time (ms):", sw.elapsedMilliseconds));

});