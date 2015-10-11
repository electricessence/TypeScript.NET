///<reference path="../../typings/qunit/qunit"/>
///<amd-dependency path="QUnit"/>

import Uri = require('../../source/System/Uri/Uri');


function run()
{

	var validUri:IUri = {
		scheme:'http',
		userInfo:'username:password',
		host:'domain.com',
		port:1234,
		path:'/tree/node/index.html',
		query:'?param=value',
		fragment:'#home'
	};
	var validUrl:string = ''
		+ validUri.scheme + '://'
		+ validUri.userInfo + '@'
		+ validUri.host
		+ ':' + validUri.port
		+ validUri.path
		+ validUri.query
		+ validUri.fragment;



	QUnit.test("Valid Uri", (assert:QUnitAssert)=>
	{

		assert.equal(
			Uri.toString(validUri),
			validUrl,
			"Uri does not match source values.");


		var uri = Uri.from(validUri);
		assert.equal(
			uri.toString(),
			validUrl,
			"Uri does not match source values.");

		assert.equal(
			uri.absoluteUri,
			validUrl,
			"Uri does not match source values.");

		assert.equal(
			uri.pathAndQuery,
			uri.path+uri.query,
			"Uri path and query do not equal expected."
		)

	});

	QUnit.test("Invalid scheme", (assert:QUnitAssert)=>
	{

		assert.throws(()=>{
			Uri.from({
				scheme:'x y z'
			})
		});

		assert.throws(()=>{
			Uri.from({
				scheme:'https:s'
			})
		});

	});

	QUnit.test("Invalid authority", (assert:QUnitAssert)=>
	{

		assert.throws(()=>{
			Uri.from({
				userInfo:validUri.userInfo
			})
		});

		assert.throws(()=>{
			Uri.from({
				port:validUri.port
			})
		});


	});
}

export = run;
