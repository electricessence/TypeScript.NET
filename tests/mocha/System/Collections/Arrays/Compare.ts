///<reference types="node"/>
import * as assert from "assert";
import areArraysEqual from "../../../../../build/umd/dist/Collections/Array/areArraysEqual";
import areArraysAllEqual from "../../../../../build/umd/dist/Collections/Array/areArraysAllEqual";
import areArraysEquivalent from "../../../../../build/umd/dist/Collections/Array/areArraysEquivalent";

const a1 = [1,2,3];
const a2 = [1,2,3];
const b = [4,5,6];
const c = [7,8,9,10];
const d = b.slice();
const e = c.slice();
d.length = e.length = 200000;

describe(".areEqual()",()=>{

	it("should be equal",()=>{
		assert.ok(areArraysEqual([],[]));
		assert.ok(areArraysEqual(a1,a1));
		assert.ok(areArraysEqual(a1,a2));
	});

	it("should not be equal",()=>{
		assert.ok(!areArraysEqual(<any>null,a1));
		assert.ok(!areArraysEqual(a1,<any>null));
		assert.ok(!areArraysEqual(a1,b));
		assert.ok(!areArraysEqual(b,c));
	});

});

describe(".areAllEqual()",()=>{

	it("should be equal",()=>{
		assert.ok(areArraysAllEqual([[],[],[]]));
		assert.ok(areArraysAllEqual([a1,a1,a2]));
	});

	it("should not be equal",()=>{
		assert.ok(!areArraysAllEqual([a1,<any>null]));
		assert.ok(!areArraysAllEqual([a1,b,c]));
		assert.ok(!areArraysAllEqual([a1,b],true,()=>false));
	});

	it("should error for invalid",()=>{
		assert.throws(()=>areArraysAllEqual(<any>null));
		assert.throws(()=>areArraysAllEqual([]));
		assert.throws(()=>areArraysAllEqual([a1]));
	});

});

describe(".areEquivalent()",()=>{

	it("should be equivalent",()=>{
		assert.ok(areArraysEquivalent([1],[1]));
		assert.ok(areArraysEquivalent(a1,a1));
		assert.ok(areArraysEquivalent(a1,a2));
		assert.ok(areArraysEquivalent(a1,a1.slice().reverse()));
	});

	it("should not be equivalent",()=>{
		assert.ok(!areArraysEquivalent([1],[2]));
		assert.ok(!areArraysEquivalent(a1,b,()=>1));
		assert.ok(!areArraysEquivalent(a1,b));
		assert.ok(!areArraysEquivalent(d,e));
	});

});