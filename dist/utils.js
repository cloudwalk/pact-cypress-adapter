"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileAsync = exports.constructPactFile = exports.omitHeaders = exports.writePact = exports.formatAlias = void 0;
var lodash_1 = require("lodash");
var pjson = require('../package.json');
var formatAlias = function (alias) {
    if (Array.isArray(alias)) {
        return __spreadArray([], alias, true).map(function (a) { return "@".concat(a); });
    }
    return ["@".concat(alias)];
};
exports.formatAlias = formatAlias;
var constructFilePath = function (_a) {
    var consumerName = _a.consumerName, providerName = _a.providerName;
    return "cypress/pacts/".concat(providerName, "-").concat(consumerName, ".json");
};
var writePact = function (_a) {
    var intercept = _a.intercept, testCaseTitle = _a.testCaseTitle, pactConfig = _a.pactConfig, blocklist = _a.blocklist, omitList = _a.omitList, autoMatching = _a.autoMatching;
    var filePath = constructFilePath(pactConfig);
    cy.task('readFile', filePath)
        .then(function (content) {
        if (content) {
            var parsedContent = JSON.parse(content);
            return (0, exports.constructPactFile)({ intercept: intercept, testCaseTitle: testCaseTitle, pactConfig: pactConfig, blocklist: blocklist, omitList: omitList, autoMatching: autoMatching, content: parsedContent });
        }
        else {
            return (0, exports.constructPactFile)({ intercept: intercept, testCaseTitle: testCaseTitle, pactConfig: pactConfig, blocklist: blocklist, omitList: omitList, autoMatching: autoMatching });
        }
    })
        .then(function (data) {
        cy.writeFile(filePath, JSON.stringify(data));
    })
        .then(function () {
        return intercept;
    });
};
exports.writePact = writePact;
function omitElementsFromResponseBody(responseBody, elementsToOmit) {
    function omitElement(obj, key) {
        if (Array.isArray(obj)) {
            obj.forEach(function (item) {
                omitElement(item, key);
            });
        }
        else if (typeof obj === "object" && obj !== null) {
            for (var objKey in obj) {
                if (objKey === key) {
                    delete obj[key];
                }
                else {
                    omitElement(obj[objKey], key);
                }
            }
        }
    }
    elementsToOmit.forEach(function (element) {
        omitElement(responseBody, element);
    });
    return responseBody;
}
var omitHeaders = function (headers, blocklist) {
    return (0, lodash_1.omit)(headers, __spreadArray([], blocklist, true));
};
exports.omitHeaders = omitHeaders;
var constructInteraction = function (intercept, testTitle, blocklist, omitList, autoMatching) {
    var _a, _b, _c;
    var path = new URL(intercept.request.url).pathname;
    var search = new URL(intercept.request.url).search;
    var query = new URLSearchParams(search).toString();
    var responseBody = omitElementsFromResponseBody((_a = intercept.response) === null || _a === void 0 ? void 0 : _a.body, omitList);
    var generatedRules = generateMatchingRules(responseBody, "$.body");
    var interation = {
        description: testTitle,
        providerState: '',
        request: {
            method: intercept.request.method,
            path: path,
            headers: (0, exports.omitHeaders)(intercept.request.headers, blocklist),
            body: intercept.request.body,
            query: query
        },
        response: {
            status: (_b = intercept.response) === null || _b === void 0 ? void 0 : _b.statusCode,
            headers: (0, exports.omitHeaders)((_c = intercept.response) === null || _c === void 0 ? void 0 : _c.headers, blocklist),
            body: responseBody,
        }
    };
    if (autoMatching) {
        interation.response.matchingRules = generatedRules;
    }
    return interation;
};
function generateMatchingRules(responseBody, parentPath) {
    if (parentPath === void 0) { parentPath = "$.body"; }
    var matchingRules = {};
    function traverseObject(obj, path) {
        if (path === void 0) { path = ""; }
        if (typeof obj === "object" && !Array.isArray(obj)) {
            for (var key in obj) {
                var newPath = path ? "".concat(path, ".").concat(key) : key;
                traverseObject(obj[key], newPath);
            }
        }
        else if (Array.isArray(obj)) {
            obj.forEach(function (item, index) {
                var newPath = "".concat(path, "[").concat(index, "]");
                traverseObject(item, newPath);
            });
        }
        else {
            var rulePath = "".concat(parentPath, ".").concat(path);
            matchingRules[rulePath] = { match: "type" };
        }
    }
    traverseObject(responseBody);
    return matchingRules;
}
var constructPactFile = function (_a) {
    var intercept = _a.intercept, testCaseTitle = _a.testCaseTitle, pactConfig = _a.pactConfig, _b = _a.blocklist, blocklist = _b === void 0 ? [] : _b, _c = _a.omitList, omitList = _c === void 0 ? [] : _c, _d = _a.autoMatching, autoMatching = _d === void 0 ? false : _d, content = _a.content;
    var pactSkeletonObject = {
        consumer: { name: pactConfig.consumerName },
        provider: { name: pactConfig.providerName },
        interactions: [],
        metadata: {
            pactSpecification: {
                version: '2.0.0'
            },
            client: {
                name: 'pact-cypress-adapter',
                version: pjson.version
            }
        }
    };
    if (content) {
        var interactions = __spreadArray(__spreadArray([], content.interactions, true), [constructInteraction(intercept, testCaseTitle, blocklist, omitList, autoMatching)], false);
        var nonDuplicatesInteractions = (0, lodash_1.reverse)((0, lodash_1.uniqBy)((0, lodash_1.reverse)(interactions), 'description'));
        var data = __assign(__assign(__assign({}, pactSkeletonObject), content), { interactions: nonDuplicatesInteractions });
        return data;
    }
    return __assign(__assign({}, pactSkeletonObject), { interactions: __spreadArray(__spreadArray([], pactSkeletonObject.interactions, true), [constructInteraction(intercept, testCaseTitle, blocklist, omitList, autoMatching)], false) });
};
exports.constructPactFile = constructPactFile;
var isFileExisted = function (fs, filename) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, fs.stat(filename).catch(function (e) { return false; })];
        case 1: return [2 /*return*/, !!(_a.sent())];
    }
}); }); };
var readFileAsync = function (fs, filename) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, isFileExisted(fs, filename)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 3];
                return [4 /*yield*/, fs.readFile(filename, 'utf8')];
            case 2:
                data = _a.sent();
                return [2 /*return*/, data];
            case 3: return [2 /*return*/, null];
        }
    });
}); };
exports.readFileAsync = readFileAsync;
//# sourceMappingURL=utils.js.map