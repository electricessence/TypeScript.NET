///<reference types="node"/>
import * as assert from "assert";
import * as ArrayCompare from "../../../../../dist/commonjs/System/Collections/Array/Compare";

const a1 = [1,2,3];
const a2 = [1,2,3];
const b = [4,5,6];
const c = [7,8,9,10];
const d = b.slice();
const e = c.slice();
d.length = e.length = 200000;

describe(".areEqual()",()=>{

	it("should be equal",()=>{
		assert.ok(ArrayCompare.areEqual([],[]));
		assert.ok(ArrayCompare.areEqual(a1,a1));
		assert.ok(ArrayCompare.areEqual(a1,a2));
	});

	it("should not be equal",()=>{
		assert.ok(!ArrayCompare.areEqual(<any>null,a1));
		assert.ok(!ArrayCompare.areEqual(a1,<any>null));
		assert.ok(!ArrayCompare.areEqual(a1,b));
		assert.ok(!ArrayCompare.areEqual(b,c));
	});

});

describe(".areAllEqual()",()=>{

	it("should be equal",()=>{
		assert.ok(ArrayCompare.areAllEqual([[],[],[]]));
		assert.ok(ArrayCompare.areAllEqual([a1,a1,a2]));
	});

	it("should not be equal",()=>{
		assert.ok(!ArrayCompare.areAllEqual([a1,<any>null]));
		assert.ok(!ArrayCompare.areAllEqual([a1,b,c]));
		assert.ok(!ArrayCompare.areAllEqual([a1,b],true,()=>false));
	});

	it("should error for invalid",()=>{
		assert.throws(()=>ArrayCompare.areAllEqual(<any>null));
		assert.throws(()=>ArrayCompare.areAllEqual([]));
		assert.throws(()=>ArrayCompare.areAllEqual([a1]));
	});

});

describe(".areEquivalent()",()=>{

	it("should be equivalent",()=>{
		assert.ok(ArrayCompare.areEquivalent([1],[1]));
		assert.ok(ArrayCompare.areEquivalent(a1,a1));
		assert.ok(ArrayCompare.areEquivalent(a1,a2));
		assert.ok(ArrayCompare.areEquivalent(a1,a1.slice().reverse()));
	});

	it("should not be equivalent",()=>{
		assert.ok(!ArrayCompare.areEquivalent([1],[2]));
		assert.ok(!ArrayCompare.areEquivalent(a1,b,()=>1));
		assert.ok(!ArrayCompare.areEquivalent(a1,b));
		assert.ok(!ArrayCompare.areEquivalent(d,e));
	});

});