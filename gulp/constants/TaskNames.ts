import * as TARGET from "./Targets";
import * as MODULE from "./ModuleTypes";

const
	DIST_ = 'dist.';

const
	TYPESCRIPT = 'typescript';

export const
	SOURCE           = `source (${MODULE.UMD})`,
	DIST             = 'dist',
	DIST_ES6         = DIST_ + TARGET.ES6,
	DIST_AMD         = DIST_ + MODULE.AMD,
	DIST_UMD         = DIST_ + MODULE.UMD + '.min',
	DIST_COMMONJS    = DIST_ + MODULE.COMMONJS,
	DIST_SYSTEMJS    = DIST_ + MODULE.SYSTEMJS,
	TYPESCRIPT_QUNIT = TYPESCRIPT + '.qunit',
	TYPESCRIPT_MOCHA = TYPESCRIPT + '.mocha',
	BUILD            = 'build',
	TYPEDOC          = 'typedoc',
	NUGET_PACK       = 'nuget-pack',
	DEFAULT          = 'default';
