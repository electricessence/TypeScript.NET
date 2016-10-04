///<reference path="../../../import"/>

import * as assert from "assert";
import {Selector} from "../../../../../dist/commonjs/System/FunctionTypes";
import {quickSort} from "../../../../../dist/commonjs/System/Collections/Array/Sorting/quickSort";
import {mergeSort} from "../../../../../dist/commonjs/System/Collections/Array/Sorting/mergeSort";
import {areEqual} from "../../../../../dist/commonjs/System/Collections/Array/Compare";
import {compare} from "../../../../../dist/commonjs/System/Compare";


function arraySort(a:number[]):number[]
{
	a.sort(compare);
	return a;
}

function nullSort(a:number[]):number[]
{
	return a;
}

const
	source:number[][] = Object.freeze([
		Object.freeze([2, 5, 4, 1, 3, 10, 20, 14, 7, 2, 5, 4, 1, 3, 10, 20, 14, 7]),
		Object.freeze([2, 18, 14, 37, 20, 33, 26, 21, 5, 31, 2, 18, 14, 37, 20, 33, 26, 21, 5, 31]),
		Object.freeze([9, 19, 5, 7, 38, 13, 20, 2, 12, 35, 9, 19, 5, 7, 38, 13, 20, 2, 12, 35])
	]),
	sourceCount       = source.length;

function test(target:number[][], fn:Selector<number[],number[]>):void
{
	for(let i = 0; i<sourceCount; i++)
	{
		target[i] = fn(source[i].slice());
	}

}

function assertResults(result:number[][]):void
{
	for(let i = 0; i<sourceCount; i++)
	{
		var ok = areEqual(arrayResults[i], result[i]);
		if(!ok) console.warn(result);
		assert.ok(ok);
	}
}


const arrayResults:number[][] = [];
function dummy()
{
	test(arrayResults, nullSort);
}
function array()
{
	test(arrayResults, arraySort);
}

const quickResults:number[][] = [];
function quick()
{
	test(quickResults, quickSort);
}

const mergeResults:number[][] = [];
function merge()
{
	test(mergeResults, mergeSort);
}

const performanceCheck = true;  // Change to true to performance test/log
const count = performanceCheck ? 500000 : 1;
function measure(fn:Function):number
{
	var time = Date.now();

	for(let i = 0; i<count; i++)
	{
		fn();
	}

	return Date.now() - time;
}

function report(name:string, fn:Function):void
{
	if(count>1)
		console.log(name, measure(fn), "milliseconds");
}

if(count>1) {
	console.log(count + " iterations running...");
}

report("Dummy Sort (copy only):", dummy);
report("Array Sort:", array);
array();

describe("Quick Sort", ()=>
{
	report("Quick Sort:", quick);
	it("should match array sort", ()=>
	{
		quick();
		assertResults(quickResults);
	});
});

describe("Merge Sort", ()=>
{
	report("Merge Sort:", merge);
	it("should match array sort", ()=>
	{
		merge();
		assertResults(mergeResults);
	});
});



