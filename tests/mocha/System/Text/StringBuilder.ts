/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
///<reference types="node"/>
import * as assert from "assert";
import StringBuilder from "../../../../dist/commonjs/System/Text/StringBuilder";

it("should match expected value",()=>{
	const sb = new StringBuilder();
	sb.append("a","b","c");
	sb.append("1","2","3");
	assert.equal(sb.toString(),"abc123");
});
