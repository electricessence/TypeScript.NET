import {Target, Module} from "gulp-typescript-helper";

const
	DIST_ = 'dist.';

const
	TYPESCRIPT = 'typescript';

export const
	//SOURCE           = `source (${Module.UMD})`,
	DIST             = 'dist',
	DIST_ES6         = DIST_ + Target.ES6,
	DIST_AMD         = DIST_ + Module.AMD,
	DIST_UMD         = DIST_ + Module.UMD + '.min',
	DIST_COMMONJS    = DIST_ + Module.COMMONJS,
	DIST_SYSTEMJS    = DIST_ + Module.SYSTEMJS,
	TYPESCRIPT_QUNIT = TYPESCRIPT + '.qunit',
	TYPESCRIPT_MOCHA = TYPESCRIPT + '.mocha',
	TYPEDOC          = 'typedoc',
	NUGET_PACK       = 'nuget-pack',
	DEFAULT          = 'default';
