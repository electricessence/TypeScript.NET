(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../source/System/TypeValidator"], factory);
    }
})(function (require, exports) {
    "use strict";
    var TypeValidator_1 = require("../../../source/System/TypeValidator");
    var assert = require('../../../node_modules/assert/assert');
    var example = new TypeValidator_1.TypeValidator({
        a: {},
        b: "hello",
        c: 1,
        d: true,
        e: {
            f: "whatever",
            g: false,
            h: [
                0,
                1,
                "2"
            ]
        },
        i: "noise"
    });
    describe('.contains(descriptor)', function () {
        it('should detect a positive match', function () {
            assert.ok(example.contains({
                a: Object,
                b: String,
                c: Number,
                d: Boolean,
                e: {
                    f: String,
                    g: Boolean,
                    h: Array
                }
            }));
            assert.ok(example.contains({
                a: Object,
                b: String,
                c: Number,
                d: Boolean,
                e: {
                    f: String,
                    g: Boolean,
                    h: [
                        Number,
                        Number,
                        String
                    ]
                }
            }));
            assert.ok(example.contains({
                a: Object,
                b: String,
                c: Number,
                d: Boolean,
                e: {
                    f: String,
                    g: Boolean,
                    h: [
                        Number,
                        Number,
                        String
                    ]
                },
                i: "noise"
            }));
            assert.ok(example.contains({
                a: Object,
                b: String,
                c: Number,
                d: Boolean,
                e: {
                    f: String,
                    g: Boolean,
                    h: [
                        Number
                    ]
                }
            }));
        });
        it('should detect a negative match', function () {
            assert.ok(!example.contains({
                a: Object,
                b: String,
                c: Number,
                d: Boolean,
                e: {
                    f: String,
                    g: Boolean,
                    h: [
                        Number,
                        Boolean,
                        String
                    ]
                }
            }));
            assert.ok(!example.contains({
                a: Object,
                b: String,
                c: Number,
                d: Boolean,
                e: {
                    f: String,
                    g: Boolean,
                    h: [
                        String
                    ]
                }
            }));
            assert.ok(!example.contains({
                a: Object,
                b: String,
                c: Number,
                d: Boolean,
                e: {
                    f: String,
                    g: Boolean,
                    h: [
                        Number
                    ]
                },
                i: "goo"
            }));
            assert.ok(!example.contains({
                a: Object,
                b: String,
                c: Number,
                d: Boolean,
                e: {
                    f: String,
                    g: Boolean,
                    h: [
                        Number
                    ]
                },
                i: Boolean
            }));
        });
    });
});

//# sourceMappingURL=TypeValidator.js.map
