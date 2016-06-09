/*!
 * From: https://github.com/adambom/parallel.js/blob/master/lib/eval.js
 */
const isNode = typeof module !== 'undefined' && module.exports;
if (isNode) {
    process.once('message', (code) => {
        eval(JSON.parse(code).data);
    });
}
else {
    self.onmessage = (code) => {
        eval(code.data);
    };
}
//# sourceMappingURL=eval.js.map