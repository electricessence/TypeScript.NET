///<reference path="../../import.d.ts"/>

import * as HowMany from '../../../../source/System/Time/HowMany';
import ClockTime from '../../../../source/System/Time/ClockTime';
import Integer from '../../../../source/System/Integer';
var assert = require('../../../../node_modules/assert/assert');

const
days        = Integer.random.under(365),
hour        = Integer.random.under(24),
minute      = Integer.random.under(60),
second      = Integer.random.under(60),
millisecond = Integer.random.under(1000);

var c1 = new ClockTime(hour, minute, second, millisecond);
var c2 = new ClockTime(
	days*HowMany.Milliseconds.Per.Day
	+ hour*HowMany.Milliseconds.Per.Hour
	+ minute*HowMany.Milliseconds.Per.Minute
	+ second*HowMany.Milliseconds.Per.Second
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
