"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
var stream_to_promise_agnostic_1 = require("stream-to-promise-agnostic");
var create_1 = require("../source/System/Promises/Functions/create");
exports.streamToPromise = stream_to_promise_agnostic_1.streamToPromise(create_1.default);
exports.default = exports.streamToPromise;
