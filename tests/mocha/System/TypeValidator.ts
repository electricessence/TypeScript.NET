///<reference path="../import.d.ts"/>

import {TypeInfoHelper, TypeValidator} from "../../../source/System/TypeValidator";
var assert = require('../../../node_modules/assert/assert');

const example = new TypeInfoHelper({
	a: {},
	b: "hello",
	c: 1,
	d: true,
	e: {
		f: "whatever",
		g: false,
		h: [
			0,
			1,
			"2"
		]
	},
	i: "noise"
});

describe('.contains(descriptor)', ()=>
{
	it('should detect a positive match', ()=>
	{
		assert.ok(example.contains({
			a: Object,
			b: String,
			c: Number,
			d: Boolean,
			e: {
				f: String,
				g: Boolean,
				h: Array
			}
		}));

		assert.ok(example.contains({
			a: Object,
			b: String,
			c: Number,
			d: Boolean,
			e: {
				f: String,
				g: Boolean,
				h: [
					Number,
					Number,
					String
				]
			}
		}));

		assert.ok(example.contains({
			a: Object,
			b: String,
			c: Number,
			d: Boolean,
			e: {
				f: String,
				g: Boolean,
				h: [
					Number,
					Number,
					String
				]
			},
			i: "noise"
		}));

		assert.ok(example.contains({
			a: Object,
			b: String,
			c: Number,
			d: Boolean,
			e: {
				f: String,
				g: Boolean,
				h: [
					Number
				]
			}
		}))
	});

	it('should detect a negative match', ()=>
	{
		assert.ok(!example.contains({
			a: Object,
			b: String,
			c: Number,
			d: Boolean,
			e: {
				f: String,
				g: Boolean,
				h: [
					Number,
					Boolean,
					String
				]
			}
		}));

		assert.ok(!example.contains({
			a: Object,
			b: String,
			c: Number,
			d: Boolean,
			e: {
				f: String,
				g: Boolean,
				h: [
					String
				]
			}
		}));


		assert.ok(!example.contains({
			a: Object,
			b: String,
			c: Number,
			d: Boolean,
			e: {
				f: String,
				g: Boolean,
				h: [
					Number
				]
			},
			i: "goo"
		}));

		assert.ok(!example.contains({
			a: Object,
			b: String,
			c: Number,
			d: Boolean,
			e: {
				f: String,
				g: Boolean,
				h: [
					Number
				]
			},
			i: Boolean
		}));
	});
});

describe("Example", ()=>
		it("should work", ()=>
		{

			// Step 1: Declare the expected type/interface.
			interface MyType
			{
				a:Object,
				b:String,
				c:Number,
				d:Boolean,
				e:{
					f:String,
					g:Boolean,
					h:[
						Number,
						Boolean,
						String
						]
				}
			}

			// Step 2: Copy the interface as an actual object and <type> the validator
			const MyTypeValidator
				      = new TypeValidator<MyType>(
				{
					a: Object,
					b: String,
					c: Number,
					d: Boolean,
					e: {
						f: String,
						g: Boolean,
						h: [
							Number,
							Boolean,
							String
						]
					}
				}
			);

			// Step 3: validate as many times as you want:
			var myItem = {
				a: {},
				b: "hello",
				c: 1,
				d: true,
				e: {
					f: "whatever",
					g: false,
					h: [
						0,
						true,
						"2"
					]
				},
				i: "noise"
			};

			// no compile-time type errors!
			if(MyTypeValidator.isSubsetOf(myItem))
			{
				assert.equal(myItem.e.h.length, 3);
				assert.equal(myItem.b, "hello");
			}
			else
			{
				assert.ok(false, "Should have validated ok.");
			}

			assert.ok(!MyTypeValidator.isSubsetOf(true));
			assert.ok(!MyTypeValidator.isSubsetOf("no"));
			assert.ok(!MyTypeValidator.isSubsetOf({
				a:{},
				b:"hello"
			}));

		})
);
