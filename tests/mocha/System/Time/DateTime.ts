///<reference types="node"/>
import * as assert from "assert";
import "mocha";
import DateTime from "../../../../dist/commonjs/System/Time/DateTime";


describe(".daysInMonth(year,month) & .isLeapYear(year)",()=>{


	const startYear = 2000;
	const daysPerMonth = [
		31, //January,
		28,//February,
		31,//March,
		30,//April,
		31,//May,
		30,//June,
		31,//July,
		31,//August,
		30,//September,
		31,//October,
		30,//November,
		31//December
	];

	it('should match actual Gregorian values.', ()=>
	{
		for(let y=startYear;y<2004;y++) {
			for(let m=0;m<12;m++) {
				if(m===1 && DateTime.isLeapYear(y)) {
					assert.equal(DateTime.daysInMonth(y,m),29);
				} else {
					assert.equal(DateTime.daysInMonth(y,m),daysPerMonth[m]);
				}
			}
		}
	});

});

describe(".between(first,last)",()=>{
	it("should return a positive delta for proper dates",()=>{
		assert.ok(DateTime.between(new Date("2016-06-06"),new Date("2016-07-06")).total.milliseconds>0);
	});
});

describe(".equals",()=>{
	const d1 = "2016-06-06", d2 = "2016-06-07";
	it("should match",()=>{
		const x = new DateTime(d1), y = new DateTime(d1);
		assert.ok(x.equals(y));
	});

	it("should not match",()=>{
		const x = new DateTime(d1), y = new DateTime(d2);
		assert.ok(!x.equals(<any>null));
		assert.ok(!x.equals(y));
	});

	it("should compare correctly",()=>{
		const x = new DateTime(d1), y = new DateTime(d2), z = new DateTime(d2);
		assert.ok(x.compareTo(y)<0);
		assert.ok(y.compareTo(x)>0);
		assert.ok(y.compareTo(z)===0);
	});


});
