export module types
{
	export type ES3 = 'es3'
	export type ES5 = 'es5'
	export type ES2015 = 'es2015'
	export type ES6 = 'es6'
}

export type EcmaTarget
	= types.ES3
	| types.ES5
	| types.ES2015
	| types.ES6;

export const
	ES3:types.ES3       = 'es3',
	ES5:types.ES5       = 'es5',
	ES2015:types.ES2015 = 'es2015',
	ES6:types.ES6       = 'es6';
