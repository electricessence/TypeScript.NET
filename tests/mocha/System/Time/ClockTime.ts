///<reference path="../../import.d.ts"/>

import ClockTime from '../../../../source/System/Time/ClockTime';
var assert = require('../../../../node_modules/assert/assert');

const hour = 23, minute = 36, second = 15, millisecond = 876;

var c = new ClockTime(hour,minute,second,millisecond);


it('should match time values', ()=>
{
	assert.equal(c.hours, hour);
	assert.equal(c.minutes, minute);
	assert.equal(c.seconds, second);
	assert.equal(c.milliseconds, millisecond);
});
