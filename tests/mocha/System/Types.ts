///<reference types="node"/>
import * as assert from "assert";
import "mocha";
import hasMember from "../../../dist/umd/Reflection/hasMember";

describe('.hasMember()', ()=>
{
	it('should detect a positive match for prototype functions', ()=>
	{
		class A extends Array {}
		assert.ok(hasMember(new A(),'push'));
	});

	it('should detect a positive match', ()=>
	{
		assert.ok(hasMember({
			a:'hello',
			b:undefined
		},'b'));
	});
});
