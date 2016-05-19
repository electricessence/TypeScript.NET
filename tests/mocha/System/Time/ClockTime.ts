///<reference path="../../import.d.ts"/>
///<reference path="../../../../source/System/Time/HowMany.d.ts"/>

import ClockTime from "../../../../source/System/Time/ClockTime";
import {Milliseconds} from "../../../../source/System/Time/HowMany";
import Integer from "../../../../source/System/Integer";
var assert = require('../../../../node_modules/assert/assert');

const
days        = Integer.random(365),
hour        = Integer.random(24),
minute      = Integer.random(60),
second      = Integer.random(60),
millisecond = Integer.random(1000);

var c1 = new ClockTime(hour, minute, second, millisecond);
var c2 = new ClockTime(
	days*Milliseconds.Per.Day
	+ hour*Milliseconds.Per.Hour
	+ minute*Milliseconds.Per.Minute
	+ second*Milliseconds.Per.Second
	+ millisecond);

it('should match constructor values', ()=>
{
	assert.equal(c1.hour, hour);
	assert.equal(c1.minute, minute);
	assert.equal(c1.second, second);
	assert.equal(c1.millisecond, millisecond);
});

it('should match summed values', ()=>
{
	assert.equal(c2.days, days);
	assert.equal(c2.hour, hour);
	assert.equal(c2.minute, minute);
	assert.equal(c2.second, second);
	assert.equal(c2.millisecond, millisecond);
});
