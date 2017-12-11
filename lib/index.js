"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var vboxmanage = require("./vboxmanage");
var IE_PATH = "C:\\Program Files\\Internet Explorer\\iexplore.exe";
var SERVICE_NOT_READY_YET_MESSAGE = "VBoxManage: error: The guest execution service is not ready (yet)";
var SYSTEM_IN_INVALID_STATE_MESSAGE = "VBOX_E_INVALID_OBJECT_STATE";
var runningBrowsers = [];
var runningTestIds = {};
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
        });
    });
}
function startBrowser(browserName, pageUrl) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, vboxmanage.guestcontrolStart(browserName, "IEUser", "Passw0rd!", "\"" + IE_PATH + "\" \"" + pageUrl + "\"")];
        });
    });
}
function retryStartBrowser(browserName, pageUrl, attempts) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 5]);
                    return [4 /*yield*/, startBrowser(browserName, pageUrl)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_1 = _a.sent();
                    if (!(attempts > 0 && error_1.message.includes(SERVICE_NOT_READY_YET_MESSAGE))) return [3 /*break*/, 4];
                    return [4 /*yield*/, sleep(5 * 1000)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, retryStartBrowser(browserName, pageUrl, attempts - 1)];
                case 4: throw error_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.isMultiBrowser = true;
function openBrowser(id, pageUrl, browserName) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, vboxmanage.startvm(browserName)];
                case 1:
                    _a.sent();
                    runningBrowsers.push(browserName);
                    return [4 /*yield*/, sleep(10 * 1000)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    error = e_1;
                    if (!error.message.includes(SYSTEM_IN_INVALID_STATE_MESSAGE)) {
                        throw error;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, retryStartBrowser(browserName, pageUrl, 5)];
            }
        });
    });
}
exports.openBrowser = openBrowser;
function getBrowserList() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, vboxmanage.list()];
                case 1: return [2 /*return*/, (_a.sent()).map(function (_a) {
                        var name = _a.name;
                        return name;
                    }).sort()];
            }
        });
    });
}
exports.getBrowserList = getBrowserList;
function dispose() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            runningBrowsers.forEach(function (browser) { return vboxmanage.acpipowerbutton(browser); });
            return [2 /*return*/];
        });
    });
}
exports.dispose = dispose;
