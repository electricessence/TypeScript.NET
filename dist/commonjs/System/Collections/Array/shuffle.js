"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffle(target) {
    var i = target.length;
    while (--i) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = target[i];
        target[i] = target[j];
        target[j] = temp;
    }
    return target;
}
exports.shuffle = shuffle;
//# sourceMappingURL=shuffle.js.map