///<reference types="node"/>
import * as assert from "assert";
import Stopwatch from "../../../../dist/commonjs/System/Diagnostics/Stopwatch";


it("should measure a closure",()=>{
	assert.ok(Stopwatch.measure(()=>{
		for(let i = 0;i<100000;i++){
			new Array(100);
		}
	}).milliseconds>0);
});

it("should start, stop, and reset with isRunning correctly reflected",()=>
{
	assert.ok(Stopwatch.getTimestampMilliseconds()>0);
	let sw = new Stopwatch();
	assert.equal(sw.elapsed.milliseconds,0);
	assert.equal(sw.lap().milliseconds,0);
	assert.equal(sw.currentLap.milliseconds,0);
	assert.equal(sw.currentLapMilliseconds,0);
	sw = Stopwatch.startNew();
	sw.start();
	sw.lap();
	assert.ok(sw.elapsedMilliseconds>=0);
	assert.ok(sw.currentLap.milliseconds>=0);
	assert.ok(sw.isRunning);
	sw.stop();
	sw.stop();
	assert.ok(!sw.isRunning);
	sw.start();
	assert.ok(sw.isRunning);
	sw.reset();
	assert.ok(!sw.isRunning);
});
