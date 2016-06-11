///<reference path="../../../import.d.ts"/>

import {TypeInfo} from "../../../../../dist/commonjs/System/Types";
import Queue from "../../../../../dist/commonjs/System/Collections/Queue";
import * as Enumerator from "../../../../../dist/commonjs/System/Collections/Enumeration/Enumerator";
import {IArray} from "../../../../../dist/commonjs/System/Collections/Array/IArray";
import {IEnumerator} from "../../../../../dist/commonjs/System/Collections/Enumeration/IEnumerator";
import * as assert from "assert";

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
	});

	it("functions should be treated as generators",()=>{
		var e = Enumerator.from((prev:number,i:number)=>(prev || 1)+i);
		function pass(e:IEnumerator<number>){
			assert.equal(e.nextValue(),1);
			assert.equal(e.nextValue(),2);
			assert.equal(e.nextValue(),4);
			assert.equal(e.nextValue(),7);
			assert.equal(e.nextValue(),11);
			assert.equal(e.nextValue(),16);
		}
		pass(e);
		e.reset();
		pass(e);
		e.dispose();
		assert.ok(!e.moveNext());
		assert.equal(e.nextValue(),void 0);
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
		assert.doesNotThrow(()=>{
			assert.equal(Enumerator.forEach(null,blankAction),-1);
		});
	});

	it("non-enumerable values ignored", ()=>
	{
		assert.doesNotThrow(()=>{
			assert.equal(Enumerator.forEach(<any>{},blankAction),-1);
		});
		assert.doesNotThrow(()=>{
			assert.equal(Enumerator.forEach(<any>1,blankAction),-1);
		});
	});

});
