export module types
{
	export type None = 'none'
	export type CommonJS = 'commonjs'
	export type SystemJS = 'system'
	export type AMD = 'amd'
	export type UMD = 'umd'
	export type ES6 = 'es6'
	export type ES2015 = 'es2015'
}

export type ModuleType
	= types.None
	| types.CommonJS
	| types.SystemJS
	| types.AMD
	| types.UMD
	| types.ES6
	| types.ES2015;

export const
	NONE:types.None         = 'none',
	COMMONJS:types.CommonJS = 'commonjs',
	SYSTEMJS:types.SystemJS = 'system',
	AMD:types.AMD           = 'amd',
	UMD:types.UMD           = 'umd',
	ES6:types.ES6           = 'es6',
	ES2015:types.ES2015     = 'es2015';
