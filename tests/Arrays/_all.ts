///<reference path="../../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>

import Utility from './Utility';
import Procedure from './Procedure';
import Compare from './Compare';

export default function run() {
    Utility();
    Procedure();
    Compare();
}
