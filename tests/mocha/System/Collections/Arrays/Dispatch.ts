import * as assert from "assert";
import {
	dispatch,
	mapped,
	unsafe
} from "../../../../../dist/commonjs/System/Collections/Array/Dispatch";
import {Action} from "../../../../../source/System/FunctionTypes";

it("should apply closures in order", ()=>
{
	let result = 0;
	const a:Action<number>[] = [
		(p:number) =>
		{
			result += p;
		},
		(p:number) =>
		{
			result *= p;
		},
		<any>null
	];


	dispatch(a, 10);
	assert.equal(result, 100);

	assert.equal(mapped(<any>null, 20), null);
	assert.equal(mapped([], 20).length, 0);
	assert.equal(mapped(a, 20).length, 3);
	unsafe(<any>null,10);
	assert.equal(result, 2400);
});

const b = [
	() =>
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