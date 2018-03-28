///<reference types="node"/>
import * as assert from "assert";
import Stopwatch from "../../../../../source/Diagnostics/Stopwatch";
import initializeArray from "../../../../../source/Collections/Array/initializeArray";
import removeElement from "../../../../../source/Collections/Array/removeElement";
import removeElementByIndex from "../../../../../source/Collections/Array/removeElementByIndex";
import copyArray from "../../../../../source/Collections/Array/copyArray";
import areArraysEqual from "../../../../../source/Collections/Array/areArraysEqual";
import copyArrayTo from "../../../../../source/Collections/Array/copyArrayTo";
import containsElement from "../../../../../source/Collections/Array/containsElement";
import replaceElement from "../../../../../source/Collections/Array/replaceElement";
import findElementIndex from "../../../../../source/Collections/Array/findElementIndex";
import registerElement from "../../../../../source/Collections/Array/registerElement";
import indexOfElement from "../../../../../source/Collections/Array/indexOfElement";
import updateRange from "../../../../../source/Collections/Array/updateRange";
import clearElements from "../../../../../source/Collections/Array/clearElements";
import forEachElement from "../../../../../source/Collections/Array/forEachElement";
import {repeatElement} from "../../../../../source/Collections/Array/repeatElement";
import applyToElements from "../../../../../source/Collections/Array/applyToElements";
import rangeOfNumbers from "../../../../../source/Collections/Array/rangeOfNumbers";
import rangeOfNumbersUntil from "../../../../../source/Collections/Array/rangeOfNumbersUntil";
import flatten from "../../../../../source/Collections/Array/flatten";


// Min/Max tests...
const minA = -10, maxA = 2000;

function initTestArray()
{
	return [5, minA, -1, maxA, -2, NaN, 20]
}

describe(".initializeArray(length)", ()=>
{
	function testLength(len:number):void
	{
		it("should be length " + len, ()=>
		{
			const a = initializeArray(len);
			assert.equal(a.length, len, ".length should be " + len);
		});
	}

	testLength(100);
	testLength(100000);
});


describe(".arrayCopy(source) & .equals(old,new)", ()=>
{
	it("should equal", ()=>
	{
		const s1 = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3],
		      s2 = copyArray(s1);
		let s3 = copyArray(s1, 1),
		    s4 = copyArray(s1, 1, 3);
		assert.ok(areArraysEqual(s1, s2));
		const s5 = copyArray(<any>null);
		assert.ok(areArraysEqual(s3, s1.slice(1)));
		assert.ok(areArraysEqual(s4, s1.slice(1,4)));
		assert.equal(s5, <any>null);
	});

});

describe(".copyTo(source,destination)", ()=>
{
	it("should throw for invalid parameter", ()=>
	{
		assert.throws(()=> {copyArrayTo(<any>null, <any>null);},"Both null");
		assert.throws(()=> {copyArrayTo([], <any>null);},"destination null");
		assert.throws(()=> {copyArrayTo([1], [], -1);},"-1 source index");
		assert.throws(()=> {copyArrayTo([1], [], 2);},"2 is greater than source length");
		assert.throws(()=> {copyArrayTo([1], [], 0, 0, 5);},"length exceeds source array");
	});
});

describe(".indexOf(source,value)", ()=>
{
	const a = initTestArray();
	it("should return true for a value contained", ()=>
	{
		assert.notEqual(indexOfElement(a, -1), -1);
	});
});


describe(".contains(source,value)", ()=>
{
	const a = initTestArray();
	it("should return true for a value contained", ()=>
	{
		assert.ok(containsElement(a, -1));
	});
	it("should return false for a value that is not present", ()=>
	{
		assert.ok(!containsElement(a, -9876));
	});
});


describe(".replace(source,oldValue,newValue)", ()=>
{
	const a = initTestArray();
	a.push(5);
	it("should properly replace items with max", ()=>
	{
		assert.equal(replaceElement(<any>null, 5, 6), 0);
		assert.equal(replaceElement(<number[]>[], 5, 6), 0);
		assert.equal(replaceElement(a, 5, 6), 2);
		assert.ok(containsElement(a, 6));
		assert.equal(replaceElement(a, 6, 5, 1), 1);
		assert.ok(containsElement(a, 6));
		assert.ok(containsElement(a, 5));

	});
});

describe(".findIndex(source,of)", ()=>
{
	const a = initTestArray(), b:ArrayLike<number> = {0: 3, 1: 1, 2: 2, length: 3};
	it("should find and return the correct index", ()=>
	{
		assert.equal(findElementIndex(a, (v:number)=>v== -1), 2);
	});
	it("should find and return the correct index", ()=>
	{
		assert.equal(findElementIndex(b, (v:number)=>v==1), 1);
	});
	it("should return -1 when the value is not present", ()=>
	{
		assert.equal(findElementIndex(a, (v:number)=> v== -9876), -1);
	});

	it("should throw for invalid parameter", ()=>
	{
		assert.throws(()=> {findElementIndex(<any>null, ()=>true)});
		assert.throws(()=> {findElementIndex(a, <any>null)});
	});
});

describe(".register(target,value)", ()=>
{
	it("should add a value that isn't present", ()=>
	{
		const a = initTestArray();
		const len = a.length;
		assert.ok(registerElement(a, -9876));
		assert.equal(a.length, len + 1);
	});

	it("should not add a value that is present", ()=>
	{
		const a = initTestArray();
		const len = a.length;
		assert.ok(!registerElement(a, -1));
		assert.equal(a.length, len);
	});

	it("should throw for invalid parameter", ()=>
	{
		assert.throws(()=> {registerElement(<any>null, -1, ()=>true)});
	});

});


describe(".remove(target,value)", ()=>
{
	it("should remove the item/value request and return the number of instances removed", ()=>
	{
		const s = [10, 9, 9, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 3];
		let len = s.length;

		assert.equal(removeElement(s, 9, 1), 1, "Only 9 removed once");
		assert.equal(s.length, len - 1, ".length should be less by one");
		assert.equal(removeElement(s, 9, 3), 2, "Remaining 9s removed.");
		assert.equal(s[1], 8, "Index [1] is now 8");
		len = s.length;

		assert.equal(removeElement(s, 2), 2, "2 removed twice");
		assert.equal(s.length, len - 2, ".length should be less by two");
		assert.equal(s[7], 1, "Index [7] is now 1");
		assert.equal(s[10], 3, "Index [10] is now 3");
		len = s.length;

		assert.equal(removeElement(s, 15), 0, "15 does not exist");
		assert.equal(s.length, len, ".length should be the same");
		len = s.length;

		assert.ok(removeElementByIndex(s, 5), "Index [5] removed");
		assert.equal(s.length, len - 1, ".length should be less by one");
		len = s.length;

		assert.equal(removeElement(s, 3, <any>null), 3, "All 3s removed.");
		assert.equal(s.length, len - 3, ".length should be the same");
		len = s.length;

		assert.ok(!removeElementByIndex(s, 15), "Index [15] doesn't exist");
		assert.equal(s.length, len, ".length should be the same");
	});

	it("should assert invalid parameters", ()=>
	{
		assert.throws(()=>
		{
			removeElementByIndex(<any>null, 0);
		},"Null source.");
		assert.throws(()=>
		{
			removeElementByIndex([1, 2], -1);
		},"Negative index.");
	});

});

/*	Utility.applyTo skipped.
 It has too many permutations while being a straight forward function. */


describe(".updateRange(value,count)", ()=>
{
	it("should correctly overwrite the value requested", ()=>
	{

		const value = 10, count = 3, r = [1, 2, 3];
		assert.doesNotThrow(()=> {updateRange(<any>null, value)});
		updateRange(r, value);

		assert.equal(r.length, count, ".length should be 3");
		for(let i = 0; i<count; i++)
		{
			assert.equal(r[i], value);
		}

		clearElements(r);
		for(let i = 0; i<count; i++)
		{
			assert.equal(r[i], null);
		}
	});

	it("should throw for invalid parameter stop less than start", ()=>
	{
		assert.throws(()=> {updateRange([1, 2, 3], 4, 2, 1);})
	})
});

describe(".applyTo(source,action)", ()=>
{
	it("should correctly overwrite the values", ()=>
	{


		const count = 3, r = [1, 2, 3];
		assert.doesNotThrow(()=> {applyToElements(<any>null, ()=>null)});
		applyToElements(r, ()=>null);
		assert.equal(r.length, count, ".length should be 3");
		for(let i = 0; i<count; i++)
		{
			assert.equal(r[i], null);
		}
	});
});


describe(".applyTo(source,action)", ()=>
{
	it("should correctly overwrite the values", ()=>
	{

		let count = 0;
		const r = [1, 2, 3];
		assert.doesNotThrow(()=> {forEachElement(<any>null, ()=>true)});
		forEachElement(r, (n, i)=>
		{
			assert.equal(count, i, "count should be " + i);
			count++;
			return !i;
		});
		assert.equal(count, 2, "count should be 2");
	});
});

describe(".repeat(value,count)", ()=>
{
	it("should correctly repeat the value requested", ()=>
	{
		const value = 10, count = 3;
		const r = repeatElement(value, count);
		assert.equal(r.length, count, ".length should be 3");
		for(let i = 0; i<count; i++)
		{
			assert.equal(r[i], value);
		}
	});

	it("should throw for invalid parameter", ()=>
	{
		assert.throws(()=> {repeatElement(1, -2);})
	})
});

describe(".rangeUntil(first,until,step)", ()=>
{
	it("should correctly increase the value requested", ()=>
	{
		const first = 10, count = 3, step = 2, until = first + count*step;
		const r = rangeOfNumbersUntil(first, until, 2);
		assert.equal(r.length, count, ".length should be 3");
		for(let i = 0; i<count; i++)
		{
			assert.equal(r[i], first + i*2);
		}
	});

	it("should throw for invalid parameter", ()=>
	{
		assert.throws(()=> {rangeOfNumbersUntil(Infinity, 10);});
		assert.throws(()=> {rangeOfNumbersUntil(NaN, 10);});
		assert.throws(()=> {rangeOfNumbersUntil(1, NaN);});
		assert.throws(()=> {rangeOfNumbersUntil(1, Infinity);});
		assert.throws(()=> {rangeOfNumbers(1, -1);});
		assert.throws(()=> {rangeOfNumbersUntil(1, 5, 0);});
	});
});

describe(".flatten(source,recurseDepth)",()=>{
	it("should convert multi dimensional array tree to a flat one",()=>{
		const len = initTestArray().length;
		const a = [[initTestArray(), initTestArray()], initTestArray()];
		const b = flatten(a, 3);
		assert.equal(b.length,len*3);
	});

	it("should reduce multi dimensional array tree",()=>{
		const len = initTestArray().length;
		const a = [[initTestArray(), initTestArray()], initTestArray()];
		const b = flatten(a);
		assert.equal(b.length,len+2);
	})

});

function measureRepeated(closure:()=>void):number
{
	const repeat = 50;
	let ms = 0;

	for(let i = 0; i<repeat; i++)
	{
		ms += Stopwatch.measure(closure).total.milliseconds;
	}

	return ms;
}

//noinspection JSUnusedLocalSymbols
function outputMeasured(suffix:string, closure:()=>void):void
{
	it(measureRepeated(closure) + " milliseconds: " + suffix, ()=>
	{
		assert.ok(true);
	});
}

/*
 * The below code proves (for Node.js and Mocha) that best practice with arrays is:
 * 1) Initialize them.  Set their capacity when constructed or set the length before iterating.
 * 2) Standard for loops are typically compiler optimized well and i++ may be compiler optimized as well (better than ++i).
 */
//
// describe("Array Performance", ()=>
// {
// 	const max = 1000000;
// 	outputMeasured("Array.push(i)", ()=>
// 	{
// 		let a:number[] = [];
// 		for(let i = 0; i<max; i++)
// 		{
// 			a.push(i);
// 		}
// 		// To ensure compiler doesn't dismiss the array, must consume the array at least once.
// 		return a[max-1];
// 	});
//
// 	outputMeasured("Array[i] = i", ()=>
// 	{
// 		let a:number[] = [];
// 		for(let i = 0; i<max; i++)
// 		{
// 			a[i] = i;
// 		}
// 		// To ensure compiler doesn't dismiss the array, must consume the array at least once.
// 		return a[max-1];
// 	});
//
// /*
// 	// Proven to be terrible!
// 	outputMeasured("Array.forEach (preset capacity ++i)", ()=>
// 	{
// 		let a:number[] = [];
// 		a.length = max;
// 		a.forEach((v,i)=>{
// 			a[i] = v;
// 		});
// 		// To ensure compiler doesn't dismiss the array, must consume the array at least once.
// 		return a[max-1];
// 	});*/
//
// 	outputMeasured("Array[i] = i (preset capacity i++)", ()=>
// 	{
// 		let a:number[] = new Array<number>(max);
// 		for(let i = 0; i<max; i++)
// 		{
// 			a[i] = i;
// 		}
// 		// To ensure compiler doesn't dismiss the array, must consume the array at least once.
// 		return a[max-1];
// 	});
//
// 	outputMeasured("Array[i] = i (preset length)", ()=>
// 	{
// 		let a:number[] = [];
// 		a.length = max;
// 		for(let i = 0; i<max; i++)
// 		{
// 			a[i] = i;
// 		}
// 		// To ensure compiler doesn't dismiss the array, must consume the array at least once.
// 		return a[max-1];
// 	});
//
// 	outputMeasured("Array[i] = i (for reverse no-init)", ()=>
// 	{
// 		let a:number[] = [];
// 		for(let i=max-1;i>=0; i--) {
// 			a[i] = i;
// 		}
// 		// To ensure compiler doesn't dismiss the array, must consume the array at least once.
// 		return a[max-1];
// 	});
//
// 	outputMeasured("Array[i] = i (for reverse)", ()=>
// 	{
// 		let a:number[] = new Array<number>(max);
// 		for(let i=max-1;i>=0; i--) {
// 			a[i] = i;
// 		}
// 		// To ensure compiler doesn't dismiss the array, must consume the array at least once.
// 		return a[max-1];
// 	});
//
// 	outputMeasured("Array[m] = m (while reverse)", ()=>
// 	{
// 		let a:number[] = new Array<number>(max);
// 		let m = max;
// 		while(m--) {
// 			a[m] = m;
// 		}
// 		// To ensure compiler doesn't dismiss the array, must consume the array at least once.
// 		return a[max-1];
// 	});
//
// 	outputMeasured("LinkedList.add(i)", ()=>
// 	{
// 		let a = new LinkedList<number>();
// 		for(let i = 0; i<max; i++)
// 		{
// 			a.add(i);
// 		}
// 	});
//
//
//
// 	outputMeasured("LinkedListNode.next = next", ()=>
// 	{
// 		let root:LinkedNextNode = { value: -1, next:null };
// 		let next = root;
// 		for(let i = 0; i<max; i++)
// 		{
// 			next = next.next = { value: i, next:null };
// 		}
// 		return root;
// 	});
//
//
// });
//
// interface LinkedNextNode {
// 	value:number;
// 	next:LinkedNextNode;
// }