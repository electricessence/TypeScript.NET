// @ts-ignore
declare var require: any;
require("ts-node/register");
require("./_gulp/tests");
require("./_gulp/dist");
require("./_gulp/bumpVersion");
require("./_gulp/typedoc");