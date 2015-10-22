var assert = require('../../node_modules/assert/assert');

const Uri = require('../../dist/commonjs/System/Uri/Uri');

describe('es6.babel',function(){

	describe('Uri',function(){

		var path = '/one/two/three.html';
		var query = '?four=five&six=seven';
		var u = Uri.from(path+query);

		describe('.path',function() {
			it('should equal ' + path, function() {

				assert.equal(u.path, path);

			});
		});

		describe('.query',function() {
			it('should equal ' + query, function() {

				assert.equal(u.query, query);

			});
		});


	});

});

