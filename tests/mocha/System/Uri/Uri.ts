///<reference types="node"/>
import * as assert from "assert";
import "mocha";
import Uri from "../../../../dist/commonjs/System/Uri/Uri";
import Scheme from "../../../../dist/commonjs/System/Uri/Scheme";
import Functions from "../../../../dist/commonjs/System/Functions";


const pathAfterRoot = 'one/two/three.html';
const path = '/' + pathAfterRoot;
const params = [['four', 'five'], ['six', 'seven']];
const query = '?' + params[0].join('=') + '&' + params[1].join('=');


const u = Uri.from(path + query);

describe('.scheme', ()=>
{
	it('should equal', ()=>
	{
		assert.equal((new Uri(null, '', '', null, '')).scheme, null);
		assert.equal((new Uri("http", '', '', null, '')).scheme, "http");
		assert.equal((new Uri(Scheme.HTTP, '', '', null, '')).scheme, "http");
	});

	it('should throw', ()=>
	{
		assert.throws(()=> {new Uri(<any>64, '', '', null, '', <any>null);});
	});
});

describe('.port', ()=>
{
	it('should equal', ()=>
	{
		const d = 'x.com', port = 80;
		assert.equal((new Uri(null, '', d, 0, '')).port, 0);
		assert.equal((new Uri(null, '', d, null, '')).port, null);
		assert.equal((new Uri(null, '', d, <any>'', '')).port, null);
		assert.equal((new Uri(null, '', d, NaN, '')).port, null);
		assert.equal((new Uri(null, '', d, port, '')).port, port);
		assert.equal((new Uri(null, '', d, <any>(port + ''), '')).port, port);
	});
	it('should throw', ()=>
	{
		assert.throws(()=> {new Uri(null, '', '', <any>'foo', '');});
		assert.throws(()=> {new Uri(null, '', '', <any>{}, '');});
		assert.throws(()=> {new Uri(null, '', '', -1, '');});
		assert.throws(()=> {new Uri(null, '', '', Infinity, '');});
	});

});

describe('.path', ()=>
{
	it('should equal ' + path, ()=>
	{
		assert.equal(u.path, path);
		assert.equal((new Uri(null, null, null, null, pathAfterRoot)).path, pathAfterRoot);
		assert.equal(Uri.toString({
			path: pathAfterRoot,
			fragment: '#x'
		}), pathAfterRoot + "#x");
	});

	it('should allow null', ()=>
	{
		assert.equal((new Uri(null, '', '', null, '')).path, null);
		assert.equal((new Uri(Scheme.HTTP, '', '', null, '')).path, null);
		assert.equal((new Uri('http', '', '', null, '')).path, null);
	});
});

describe('.fragment', ()=>
{
	it('should equal', ()=>
	{
		assert.equal(u.path, path);
	});

	it('should allow null', ()=>
	{
		assert.equal((new Uri(null, '', '', null, '')).path, null);
		assert.equal((new Uri(Scheme.HTTP, '', '', null, '')).path, null);
		assert.equal((new Uri('http', '', '', null, '')).path, null);
	});
});

describe('.from(uri)', ()=>
{
	it('should be equal', ()=>
	{
		const c1 = Uri.from(u);
		assert.ok(u.equals(c1));

		const c2 = Uri.from({}, u);
		assert.ok(u.equals(c2));

	});
});

describe('.updateQuery(query)', ()=>
{
	it('should be equal', ()=>
	{
		const c = u.updateQuery("x=y");
		assert.equal(c.queryParams["x"], "y");
	});
});

describe('.pathSegments', ()=>
{
	it('should be equal', ()=>
	{
		assert.equal(u.pathSegments.join(''), u.path);
	});
});

describe('.getAuthority(uri)', ()=>
{
	it('should be equal', ()=>
	{
		assert.equal(Uri.getAuthority({
			host: 'a',
			port: 80,
			userInfo: 'b',
			path: 'xxx'
		}), "//b@a:80");
		assert.equal(Uri.getAuthority({host: 'a', port: 80, path: 'xxx'}), "//a:80");
		assert.equal(Uri.getAuthority({host: 'a', userInfo: 'b', path: 'xxx'}), "//b@a");
		assert.equal(Uri.getAuthority({host: 'a'}), "//a");
	});

	it('should throw', ()=>
	{
		assert.throws(()=>
		{
			Uri.getAuthority({userInfo: 'b'});
		});
		assert.throws(()=>
		{
			Uri.getAuthority({port: 80});
		});
	});

});

describe('.copyOf(), .copyTo() & .equals()', ()=>
{
	it('should equal the copy', ()=>
	{
		assert.ok(u.equals(Uri.copyOf(u)));
		assert.ok(u.equals(u.copyTo({})));
	});
});

describe('.parse(url)', ()=>
{
	it('should throw', ()=>
	{
		assert.throws(()=>Uri.parse(<any>null, true));
	});
});

describe('.toString(uri)', ()=>
{
	it('should throw', ()=>
	{
		assert.throws(()=>Uri.toString({
			scheme: "http", // Can't target a scheme when no authority is provided.
			path: pathAfterRoot,
			fragment: '#x'
		}));
	});

	it('should equal', ()=>
	{
		assert.equal(Uri.toString({
			scheme: "http",
			host: "x.com",
			path: pathAfterRoot,
			fragment: '#x',
		}), "http://x.com" + path + "#x");
	});
});

describe('.tryParse(uri)', ()=>
{
	it('should return false if invalid', ()=>
	{
		assert.ok(!Uri.tryParse(<any>null, Functions.Blank));
	});

	it('should parse correctly', ()=>
	{
		const fragment = "x##?y", full = "http://x.com/y/z#" + fragment;
		assert.ok(Uri.tryParse(full, out=>
		{
			assert.equal(out.fragment, fragment);
			assert.equal(Uri.toString(out), full);
		}));

		assert.ok(Uri.tryParse("http://x.com/y/z?#", out=>
		{
			assert.equal(out.query, undefined);
			assert.equal(out.fragment, undefined);
		}));

		assert.ok(!Uri.tryParse("hello//x.com/y/z#" + fragment, Functions.Blank));
		assert.ok(!Uri.tryParse("hello://x.com/y/z#" + fragment, Functions.Blank));
		assert.ok(Uri.tryParse(" ://x.com/y/z#" + fragment, Functions.Blank));
		assert.ok(Uri.tryParse("x.com", out=>
		{
			assert.equal(out.path, undefined);
		}));
		assert.ok(Uri.tryParse("x.com/", out=>
		{
			assert.equal(out.path, '/');
		}));
		assert.ok(Uri.tryParse("me@x.com/" + fragment, out=>
		{
			assert.equal(out.userInfo, 'me');
		}));
		assert.ok(Uri.tryParse("@x.com/" + fragment, out=>
		{
			assert.equal(out.userInfo, undefined);
		}));

		assert.ok(Uri.tryParse("@x.com:80" + fragment, out=>
		{
			assert.equal(out.port, 80);
		}));
		assert.ok(!Uri.tryParse("@x.com:" + fragment, Functions.Blank));

		assert.ok(!Uri.tryParse("", out=>
		{
			assert.equal(out.scheme, undefined);
			assert.equal(out.host, undefined);
			assert.equal(out.userInfo, undefined);
			assert.equal(out.port, undefined);
			assert.equal(out.path, undefined);
			assert.equal(out.query, undefined);
			assert.equal(out.fragment, undefined);
		}));
	});

});

describe('.baseUri', ()=>
{
	it('should equal ' + path, ()=>
	{
		assert.equal(u.baseUri, path);
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


describe('KVP versus Tuple', ()=>
{

	it('should be equal', ()=>
	{
		const uTuples = new Uri(u.scheme, u.userInfo, u.host, u.port, u.path, <any>params);
		const uKvp = new Uri(u.scheme, u.userInfo, u.host, u.port, u.path, u.queryParams);

		assert.equal(uTuples.toString(), uKvp.toString());
	});


});

// Disabled for code coverage report
// describe('es6 > babel > commonjs', ()=>
// {
// 	const Uri2 = require('../../../../dist/commonjs/System/Uri/Uri').default;
//
// 	var u2 = Uri2.from(path + query);
//
// 	describe('.path', ()=>
// 	{
// 		it('should equal ' + path, ()=>
// 		{
// 			assert.equal(u2.path, path);
// 		});
// 	});
//
// 	describe('.query', ()=>
// 	{
// 		it('should equal ' + query, ()=>
// 		{
// 			assert.equal(u2.query, query);
// 		});
// 	});
// });
