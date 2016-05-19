///<reference path="../../../import.d.ts"/>

import {TypeInfo} from "../../../../../source/System/Types";
import Queue from "../../../../../source/System/Collections/Queue";
import * as Enumerator from "../../../../../source/System/Collections/Enumeration/Enumerator";
import {IArray} from "../../../../../source/System/Collections/Array/IArray";
var assert = require('../../../../../node_modules/assert/assert');

const VOID0:any = void(0);

describe(".from(source)",()=>{

	it("null should use an empty enumerator",()=>{
		var test = Enumerator.from(null), count = 0;
		while(test.moveNext()) {
			count++;
		}
		assert.equal(test.current,VOID0);
		assert.equal(test.nextValue(),VOID0);
		assert.equal(test.next().done,true);
		assert.equal(count,0);
		test.reset();
		test.dispose();
	});

	it("primitive values should throw",()=>{
		assert.throws(()=>Enumerator.from(<any>1));
	});

	it("non enumerable objects should throw",()=>{
		assert.throws(()=>Enumerator.from(<any>{}));
		assert.throws(()=>Enumerator.from(<any>(()=>true)));
	});

	it("IEnumerable should enumerate",()=>{
		var a = [0,1,2,3,4];
		var len = a.length, count = 0;
		var q = new Queue(a);
		var type = new TypeInfo(q);
		type.member("getEnumerator");
		// Creates an enumerable.
		var test = Enumerator.from({getEnumerator:()=>Enumerator.from(a)});
		while(test.moveNext()) {
			count++;
		}
		assert.equal(count,len);
	});

	it("arrays should enumerate",()=>{
		var a = [0,1,2,3,4];
		var type = new TypeInfo(a);
		type.member("length");
		var len = a.length, count = 0;
		var test = Enumerator.from(a);
		while(test.moveNext()) {
			count++;
		}
		assert.equal(count,len);
	});

	it("strings should enumerate",()=>{
		var a = "01234";
		var type = new TypeInfo(a);
		type.member("length");
		var len = a.length, count = 0;
		var test = Enumerator.from(a);
		while(test.moveNext()) {
			count++;
		}
		assert.equal(count,len);
	});

	it("array like objects should enumerate",()=>{
		var a:IArray<number> = {0:0,1:1,2:2,3:3,4:4,length:5};
		var type = new TypeInfo(a);
		type.member("length");
		var len = a.length, count = 0;
		var test = Enumerator.from(a);
		while(test.moveNext()) {
			count++;
		}
		assert.equal(count,len);
	});

});


describe(".forEach(source)",()=>
{
	const blankAction:(n:any,i:number)=>void = (n,i)=>{};

	it("null values ignored", ()=>
	{
		assert.doesNotThrow(()=>Enumerator.forEach(null,blankAction));
	});

	it("non-enumerable values ignored", ()=>
	{
		assert.doesNotThrow(()=>Enumerator.forEach(<any>{},blankAction));
		assert.doesNotThrow(()=>Enumerator.forEach(<any>1,blankAction));
	});

});
