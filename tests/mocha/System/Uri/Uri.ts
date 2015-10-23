///<reference path="../../import.d.ts"/>

import Integer from '../../../../source/System/Uri/Uri';
var assert = require('../../../../node_modules/assert/assert');


describe('es6 > babel > commonjs', ()=>
{
	const Uri = require('../../../../dist/commonjs/System/Uri/Uri');

	var path = '/one/two/three.html';
	var query = '?four=five&' + 'six=seven';
	var u = Uri.from(path + query);

	describe('.path', ()=>
	{
		it('should equal ' + path, ()=>
		{

			assert.equal(u.path, path);

		});
	});

	describe('.query', ()=>
	{
		it('should equal ' + query, ()=>
		{

			assert.equal(u.query, query);

		});
	});
});
