///<reference path="../../../import"/>

import dispatch from "../../../../../source/System/Collections/Array/Dispatch";
var assert = require('../../../../../node_modules/assert/assert');

var result = 0;
var a = [
	(p:number)=>
	{
		result += p;
	},
	(p:number)=>
	{
		result *= p;
	}
];

dispatch(a, 10);
assert.equal(result,100);

dispatch(a, 20);
assert.equal(result,2400);
