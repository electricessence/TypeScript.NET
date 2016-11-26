///<reference types="node"/>
import * as assert from "assert";
import RegexMatchEnumerator from "../../../../dist/commonjs/System/Text/RegexMatchEnumerator";
import Regex, {Match} from "../../../../dist/commonjs/System/Text/RegularExpressions";

const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const regex = new Regex("(?<"+"first>[A-E]+)", ["i"]);
//noinspection JSUnusedLocalSymbols
const regex2 = new Regex(/([A-E]+)/im);
//noinspection JSUnusedLocalSymbols
const regex3 = new Regex(/([A-E]+)/);
const regex4 = new Regex(/A	B C D  E/,"i","w");
const pattern = "([A-E]+)";

describe("Regex", ()=>
{

	describe("new", ()=>
	{
		it("should throw", ()=>
		{
			assert.throws(()=>new Regex(<any>null));
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

			let m = regex.match(str);
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
			function check(m:Match[]):void {
				assert.equal(m.length, 2);
				assert.equal(m[0].value, "ABCDE");
				assert.equal(m[0].index, 0);
				assert.equal(m[1].value, "abcde");
				assert.equal(m[1].index, 26);
			}
			check(regex.matches(str));
			check(regex4.matches(str));
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
			assert.equal(regex.replace(str, <any>null), str);
			//noinspection SpellCheckingInspection
			assert.equal(regex.replace(str, ()=>"*"), "*FGHIJKLMNOPQRSTUVWXYZ*fghijklmnopqrstuvwxyz");
			assert.equal(regex.replace(str, (x)=>x.value+"*"), "ABCDE*FGHIJKLMNOPQRSTUVWXYZabcde*fghijklmnopqrstuvwxyz");
			assert.equal(regex.replace(str, (x,i)=>i), "0FGHIJKLMNOPQRSTUVWXYZ1fghijklmnopqrstuvwxyz");
		});

	});

});

describe("RegexMatchEnumerator",()=>{
	it("should enumerate properly",()=>{
		const m = RegexMatchEnumerator(str, regex);
		function check(v:Match, value:string, index:number):void{
			assert.equal(v.value, value);
			assert.equal(v.index, index);
		}
		//noinspection SpellCheckingInspection
		check(m.nextValue()!,"ABCDE",0);
		//noinspection SpellCheckingInspection
		check(m.nextValue()!,"abcde",26);
		assert.ok(!m.moveNext());
	})
});
