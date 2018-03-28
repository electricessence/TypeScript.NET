// @ts-ignore
declare var require: any;
require("ts-node");
require("./_gulp/tests");
require("./_gulp/dist");
require("./_gulp/bumpVersion");
require("./_gulp/typedoc");