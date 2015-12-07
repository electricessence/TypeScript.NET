///<reference path="../../../import.d.ts"/>

import {TypeInfo} from '../../../../../source/System/Types';
import Queue from '../../../../../source/System/Collections/Queue';
import * as Enumerator from '../../../../../source/System/Collections/Enumeration/Enumerator';
var assert = require('../../../../../node_modules/assert/assert');

it(".from(IEnumerable)",()=>{
	var a = [0,1,2,3,4];
	var len = a.length, count = 0;
	var q = new Queue(a);
	var type = new TypeInfo(q);
	type.member("getEnumerator");
	var test = Enumerator.from(q);
	while(test.moveNext()) {
		count++;
	}
	assert.equal(count,len);
});

it(".from(Array)",()=>{
	var a = [0,1,2,3,4];
	var type = new TypeInfo(a);
	type.member("length");
	var len = a.length, count = 0;
	var test = Enumerator.from({getEnumerator:()=>Enumerator.from(a)});
	while(test.moveNext()) {
		count++;
	}
	assert.equal(count,len);
});

it(".from(IArray)",()=>{
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

