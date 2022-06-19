"use strict";
exports.__esModule = true;
exports.validateEntries = void 0;
function validateEntries() {
    var allFields = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        allFields[_i] = arguments[_i];
    }
    var missingField;
    allFields.forEach(function (el) {
        if (typeof (el) === "string" && el.replace(/\s/g, "") === "") {
            missingField = true;
        }
    });
    return missingField === true ? false : true;
}
exports.validateEntries = validateEntries;
