///<reference path="../../import.d.ts"/>

import RegexMatchEnumerator from "../../../../source/System/Text/RegexMatchEnumerator";
import Regex, {Match} from "../../../../source/System/Text/RegularExpressions";
const assert = require('../../../../node_modules/assert/assert');

const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const regex = new Regex("(?<first>[A-E]+)", ["i"]);
const regex2 = new Regex(/([A-E]+)/im);
const regex3 = new Regex(/([A-E]+)/);
const pattern = "([A-E]+)";

describe("Regex", ()=>
{

	describe("new", ()=>
	{
		it("should throw", ()=>
		{
			assert.throws(()=>new Regex(null));
		});
	});

	describe(".isMatch(input)", ()=>
	{

		it("should indicate true for match", ()=>
		{
			assert.ok(regex.isMatch(str));
			assert.ok(Regex.isMatch(str, pattern, ["i"]));
		});

		it("should indicate false for non-match", ()=>
		{
			assert.ok(!regex.isMatch("ZYXWV"));
			assert.ok(!Regex.isMatch("ZYXWV", pattern, ["i"]));
		});

	});

	describe(".match(input)", ()=>
	{

		it("should match correctly", ()=>
		{

			var m = regex.match(str);
			assert.equal(m.value, "ABCDE");
			assert.equal(m.index, 0);
			assert.equal(m.namedGroups["first"].value, "ABCDE");

			m = regex.match(str, 20);
			assert.equal(m.value, "abcde");
			assert.equal(m.index, 26);
			assert.equal(m.namedGroups["first"].value, "abcde");
		});

	});

	describe(".matches(input)", ()=>
	{

		it("should capture all instances", ()=>
		{

			var m = regex.matches(str);
			assert.equal(m.length, 2);
			assert.equal(m[0].value, "ABCDE");
			assert.equal(m[0].index, 0);
			assert.equal(m[0].namedGroups["first"].value, "ABCDE");
			assert.equal(m[1].value, "abcde");
			assert.equal(m[1].index, 26);
			assert.equal(m[1].namedGroups["first"].value, "abcde");
		});

	});

	describe(".replace(input, x)", ()=>
	{

		it("should replace requested instances", ()=>
		{
			//noinspection SpellCheckingInspection
			assert.equal(regex.replace(str, "XXX"), "XXXFGHIJKLMNOPQRSTUVWXYZXXXfghijklmnopqrstuvwxyz");
			assert.equal(Regex.replace(str, pattern, "XXX",['i']), "XXXFGHIJKLMNOPQRSTUVWXYZXXXfghijklmnopqrstuvwxyz");
			//noinspection SpellCheckingInspection
			assert.equal(regex.replace(str, ""), "FGHIJKLMNOPQRSTUVWXYZfghijklmnopqrstuvwxyz");
			assert.equal(regex.replace(str, null), str);
			//noinspection SpellCheckingInspection
			assert.equal(regex.replace(str, (x,i)=>i), "0FGHIJKLMNOPQRSTUVWXYZ1fghijklmnopqrstuvwxyz");
		});

	});

});

describe("RegexMatchEnumerator",()=>{
	it("should enumerate properly",()=>{
		var m = RegexMatchEnumerator(str,regex);
		function check(v:Match, value:string, index:number):void{
			assert.equal(v.value, value);
			assert.equal(v.index, index);
		}
		check(m.nextValue(),"ABCDE",0);
		check(m.nextValue(),"abcde",26);
		assert.ok(!m.moveNext());
	})
});
