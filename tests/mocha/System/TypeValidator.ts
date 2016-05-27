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
		g:false,
		h:[
			0,
			1,
			"2"
		]
	},
	i:"noise"
});

describe('.contains(descriptor)', ()=>
{
	it('should detect a positive match', ()=>
	{
		assert.ok(example.contains({
			a:Object,
			b:String,
			c:Number,
			d:Boolean,
			e: {
				f:String,
				g:Boolean,
				h:[
					Number,
					Number,
					String
				]
			}
		}));

		assert.ok(example.contains({
			a:Object,
			b:String,
			c:Number,
			d:Boolean,
			e: {
				f:String,
				g:Boolean,
				h:[
					Number,
					Number,
					String
				]
			},
			i:"noise"
		}));

		assert.ok(example.contains({
			a:Object,
			b:String,
			c:Number,
			d:Boolean,
			e: {
				f:String,
				g:Boolean,
				h:[
					Number
				]
			}
		}))
	});

	it('should detect a negative match', ()=>
	{
		assert.ok(!example.contains({
			a:Object,
			b:String,
			c:Number,
			d:Boolean,
			e: {
				f:String,
				g:Boolean,
				h:[
					Number,
					Boolean,
					String
				]
			}
		}));

		assert.ok(!example.contains({
			a:Object,
			b:String,
			c:Number,
			d:Boolean,
			e: {
				f:String,
				g:Boolean,
				h:[
					String
				]
			}
		}));


		assert.ok(!example.contains({
			a:Object,
			b:String,
			c:Number,
			d:Boolean,
			e: {
				f:String,
				g:Boolean,
				h:[
					Number
				]
			},
			i:"goo"
		}));

		assert.ok(!example.contains({
			a:Object,
			b:String,
			c:Number,
			d:Boolean,
			e: {
				f:String,
				g:Boolean,
				h:[
					Number
				]
			},
			i:Boolean
		}));
	});
});
