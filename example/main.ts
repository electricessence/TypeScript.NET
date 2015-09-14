///<reference path="../typings/requirejs/require.d.ts"/>

requirejs.config(
	{
		baseUrl: '../',
	}
);

require(
	[
		'System/Collections/Arrays/Utility'
	], (ArrayUtil)=> {
		var a = ArrayUtil.initialize(50);
		alert(a.length);
	}
);