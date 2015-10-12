///<reference path='../../typings/qunit/qunit'/>
///<amd-dependency path='QUnit'/>

import Uri = require('../../source/System/Uri/Uri');


function run()
{

	var validUri:IUri = {
		scheme:'http',
		userInfo:'username:password',
		host:'domain.com',
		port:1234,
		path:'/tree/node/index.html',
		query:'?param=hello%20there&flag=false&blah',
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

	QUnit.test('Uri: parse valid', (assert:QUnitAssert)=>{

		assert.equal(
			Uri.from(validUrl).absoluteUri,
			validUrl,
			'Uri.from(string) should parse correctly.');

	});

	QUnit.test('Uri: parse equality', (assert:QUnitAssert)=>{

		assert.equal(
			Uri.from(validUrl).equals(validUri),
			true,
			'Uri.from(string) should equal derived values.');

	});

	QUnit.test('Uri: valid', (assert:QUnitAssert)=>
	{

		assert.equal(
			Uri.toString(validUri),
			validUrl,
			'Uri.toString(uri) must match source values.');


		var uri = Uri.from(validUri);
		assert.equal(
			uri.toString(),
			validUrl,
			'Uri.toString() must match source values.');

		assert.equal(
			uri.absoluteUri,
			validUrl,
			'Uri.absoluteUri must match source values.');

		assert.equal(
			uri.pathAndQuery,
			uri.path+uri.query,
			'Uri path and query must equal expected.');

		assert.equal(
			uri.queryParams['param'],
			'hello there',
			'Uri must decode the query params correctly.');

		assert.equal(
			uri.queryParams['flag'],
			false,
			'Uri must parse and deserialize the query params correctly.');

		assert.equal(
			uri.queryParams['blah'],
			undefined,
			'Uri must ignore invalid query params.');


	});

	QUnit.test('Uri: invalid scheme', (assert:QUnitAssert)=>
	{

		assert.throws(()=>{
			Uri.from({
				scheme:'x y z'
			});
		});

		assert.throws(()=>{
			Uri.from('http//');
		});


		assert.throws(()=>{
			Uri.from({
				scheme:'https:s'
			});
		});

	});

	QUnit.test('Uri: invalid authority', (assert:QUnitAssert)=>
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
