/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
///<reference path="IEnumerable.d.ts"/>
///<reference path="../Array/IArray.d.ts"/>
var DU = require('../../Disposable/Utility');
var Enumerator = require('./Enumerator');
var using = DU.using;
function forEach(enumerable, action) {
    if (enumerable) {
        using(Enumerator.from(enumerable), function (e) {
            Enumerator.forEach(e, action);
        });
    }
}
module.exports = forEach;
