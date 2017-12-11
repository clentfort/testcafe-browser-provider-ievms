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
var child_process_1 = require("child_process");
var MATCH_VM_REGEXP = /^"([^"]+)"\s{([0-9a-fA-F\-]+)}$/;
var VBOXMANAGE_BINARY = "vboxmanage";
function getRunTemplateFromOsType(osType) {
    if (osType.startsWith("Windows")) {
        return "cmd.exe";
    }
    if (osType.startsWith("MacOS")) {
        return "/usr/bin/open -a";
    }
    return "/bin/sh";
}
function matchVm(line) {
    var matching = line.match(MATCH_VM_REGEXP);
    if (matching) {
        return { name: matching[1], uuid: matching[2] };
    }
    return null;
}
function vboxmanage(name) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    child_process_1.exec(VBOXMANAGE_BINARY + " -q " + name + " " + args.join(" "), function (error, stdout, stderr) {
                        if (error) {
                            reject(error);
                        }
                        resolve(stdout.trim());
                    });
                })];
        });
    });
}
exports.vboxmanage = vboxmanage;
function startvm(vm) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, vboxmanage("startvm", "\"" + vm + "\"", "--type gui")];
        });
    });
}
exports.startvm = startvm;
function showvminfo(vm) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, vboxmanage("showvminfo", "\"" + vm + "\"", "--machinereadable")];
                case 1: return [2 /*return*/, (_a.sent())
                        .split("\n")
                        .reduce(function (info, line) {
                        var _a = line
                            .split("=")
                            .map(function (s) { return s.replace(/^"(.*)"$/, "$1"); }), key = _a[0], value = _a[1];
                        info[key] = value;
                        return info;
                    }, {})];
            }
        });
    });
}
exports.showvminfo = showvminfo;
function guestcontrol(vm, username, password, command) {
    var args = [];
    for (var _i = 4; _i < arguments.length; _i++) {
        args[_i - 4] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, vboxmanage.apply(void 0, ["guestcontrol",
                    "\"" + vm + "\"",
                    "--username '" + username + "'",
                    "--password '" + password + "'",
                    command].concat(args))];
        });
    });
}
exports.guestcontrol = guestcontrol;
function guestcontrolStart(vm, username, password, command) {
    return __awaiter(this, void 0, void 0, function () {
        var osType, runTemplate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, showvminfo(vm)];
                case 1:
                    osType = (_a.sent()).GuestOSType;
                    runTemplate = getRunTemplateFromOsType(osType);
                    return [2 /*return*/, guestcontrol(vm, username, password, "start", runTemplate + " -- \"/c\" " + command)];
            }
        });
    });
}
exports.guestcontrolStart = guestcontrolStart;
function list() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, vboxmanage("list vms")];
                case 1: return [2 /*return*/, (_a.sent())
                        .split("\n")
                        .map(matchVm)
                        .filter(function (vm) { return vm != null; })];
            }
        });
    });
}
exports.list = list;
function controlvm(vm, command) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, vboxmanage.apply(void 0, ["controlvm", "\"" + vm + "\"", command].concat(args))];
        });
    });
}
exports.controlvm = controlvm;
function acpipowerbutton(vm) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, controlvm(vm, "acpipowerbutton")];
        });
    });
}
exports.acpipowerbutton = acpipowerbutton;
