///<reference path="../../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>

import Utility = require('./Utility');
import Procedure = require('./Procedure');
import Compare = require('./Compare');

function run() {
    Utility();
    Procedure();
    Compare();
}

export = run;
