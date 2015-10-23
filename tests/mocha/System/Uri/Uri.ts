///<reference path="../../import.d.ts"/>

import Uri from '../../../../source/System/Uri/Uri';
var assert = require('../../../../node_modules/assert/assert');

const path = '/one/two/three.html';
const params = [['four','five'],['six','seven']];
const query = '?'+params[0].join('=')+'&' + params[1].join('=');


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

describe('.queryParams', ()=>
{
	it('should equal contain correct values', ()=>
	{
		assert.equal(u.queryParams[params[0][0]], params[0][1]);
		assert.equal(u.queryParams[params[1][0]], params[1][1]);
	});
});



describe('es6 > babel > commonjs', ()=>
{
	const Uri2 = require('../../../../dist/commonjs/System/Uri/Uri');

	var u2 = Uri2.from(path + query);

	describe('.path', ()=>
	{
		it('should equal ' + path, ()=>
		{
			assert.equal(u2.path, path);
		});
	});

	describe('.query', ()=>
	{
		it('should equal ' + query, ()=>
		{
			assert.equal(u2.query, query);
		});
	});
});
