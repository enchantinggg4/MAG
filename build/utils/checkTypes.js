"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNumber = exports.checkTypes = void 0;
function checkTypes(v, type, name) {
    if (typeof v !== type) {
        throw new Error(`${name} needs to be a ${type}, recieved: ${typeof v}`);
    }
}
exports.checkTypes = checkTypes;
function checkNumber(v, name) {
    if (isNaN(v))
        throw new Error(`${name} needs to be a number, recieved: ${typeof v}`);
    if (v <= 0)
        throw new Error(`${v} needs to be a number greater than 0`);
}
exports.checkNumber = checkNumber;
