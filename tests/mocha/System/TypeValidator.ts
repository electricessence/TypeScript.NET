///<reference path="../import.d.ts"/>

import {TypeValidator} from "../../../source/System/TypeValidator";
var assert = require('../../../node_modules/assert/assert');

const example = new TypeValidator({
	a:{},
	b:"hello",
	c:1,
	d:true,
	e: {
		f:"whatever",
		g:false
	},
	h:"noise"
});

describe('.contains(descriptor)', ()=>
{
	it('should convert float number to integer without rounding', ()=>
	{
		assert.ok(example.contains({
			a:Object,
			b:String,
			c:Number,
			d:Boolean,
			e: {
				f:String,
				g:Boolean
			}
		}))
	});
});
