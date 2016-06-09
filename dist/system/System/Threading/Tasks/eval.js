/*!
 * From: https://github.com/adambom/parallel.js/blob/master/lib/eval.js
 */
var isNode = typeof module !== 'undefined' && module.exports;
if (isNode) {
    process.once('message', function (code) {
        eval(JSON.parse(code).data);
    });
}
else {
    self.onmessage = function (code) {
        eval(code.data);
    };
}
//# sourceMappingURL=eval.js.map