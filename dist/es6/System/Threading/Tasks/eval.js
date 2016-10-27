/*!
 * From: https://github.com/adambom/parallel.js/blob/master/lib/eval.js
 */
if (typeof module !== 'undefined' && module.exports) {
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