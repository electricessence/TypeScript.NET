///<reference path="../../../import"/>

import {
	dispatch,
	mapped,
	unsafe
} from "../../../../../dist/commonjs/System/Collections/Array/Dispatch";
import * as assert from "assert";

it("should apply closures in order", ()=>
{
	var result = 0;
	var a = [
		(p:number)=>
		{
			result += p;
		},
		(p:number)=>
		{
			result *= p;
		},
		null
	];


	dispatch(a, 10);
	assert.equal(result, 100);

	assert.equal(mapped(null, 20), null);
	assert.equal(mapped([], 20).length, 0);
	assert.equal(mapped(a, 20).length, 3);
	unsafe(null,10);
	assert.equal(result, 2400);
});

var b = [
	(p:number)=>
	{
		throw "error";
	}
];

it("should propagate errors",()=>{
	assert.throws(()=>
	{
		dispatch(b, 10);
	});

	assert.throws(()=>
	{
		mapped(b, 10);
	});
});


it("should trap errors",()=>{
	assert.doesNotThrow(()=>
	{
		dispatch(b, 10, true);
		dispatch(b, 10,err=>assert.equal(err,'error'));
	});

	assert.doesNotThrow(()=>
	{
		mapped(b, 10, true);
		mapped(b, 10,err=>assert.equal(err,'error'));
	});
});