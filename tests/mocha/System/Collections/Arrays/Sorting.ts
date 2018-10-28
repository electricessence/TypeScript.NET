///<reference types="node"/>
import * as assert from "assert";
import {Selector} from "../../../../../dist/commonjs/System/FunctionTypes";
import {areEqual} from "../../../../../dist/commonjs/System/Collections/Array/Compare";
import {compare} from "../../../../../dist/commonjs/System/Compare";
import quickSort from "../../../../../dist/commonjs/System/Collections/Array/Sorting/quickSort";
import mergeSort from "../../../../../dist/commonjs/System/Collections/Array/Sorting/mergeSort";
import insertionSort
	from "../../../../../dist/commonjs/System/Collections/Array/Sorting/insertionSort";
import Random from "../../../../../dist/commonjs/System/Random";
import {ArraySort} from "../../../../../dist/commonjs/System/Collections/Array/Sort";

const performanceCheck = false;  // Change to true to performance test/log

function comparerSort(a:number[]):number[]
{
	return ArraySort.using(a, v => v);
}

function arraySort(a:number[]):number[]
{
	return a.sort(compare);
}

function nullSort(a:number[]):number[]
{
	return a;
}

const sourceCount = 4, sourceMax = 200;
const source:number[][] = [];
for(let i = 0; i<sourceCount; i++)
{
	source.push(<any>Object.freeze(Random.integers(sourceMax, sourceMax/2)));
}
Object.freeze(source);

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
		let ok = areEqual(arrayResults[i], result[i]);
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

const insertionResults:number[][] = [];
function insertion()
{
	test(insertionResults, insertionSort);
}

const comparerResults:number[][] = [];
function comparer()
{
	test(comparerResults, comparerSort);
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

const count = performanceCheck ? 100000 : 1;
function measure(fn:Function):number
{
	const time = Date.now();

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

if(count>1)
{
	console.log(count + " iterations running...");
}

report("Dummy Sort (copy only):", dummy);
report("Array Sort:", array);
array();


describe("ArraySort.using()", () =>
{
	it("should match array sort", () =>
	{
		comparer();
		assertResults(comparerResults);
	});
});

describe("Insertion Sort", () =>
{
	report("Insertion Sort:", insertion);
	it("should match array sort", () =>
	{
		insertion();
		assertResults(insertionResults);
	});
});

describe("Quick Sort", () =>
{
	report("Quick Sort:", quick);
	it("should match array sort", () =>
	{
		quick();
		assertResults(quickResults);
	});
});

describe("Merge Sort", () =>
{
	report("Merge Sort:", merge);
	it("should match array sort", () =>
	{
		merge();
		assertResults(mergeResults);
	});
});



