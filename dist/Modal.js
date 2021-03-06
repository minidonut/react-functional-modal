var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import * as React from "react";
import * as ReactDOM from "react-dom";
import { injectStyle } from "./injectStyle";
var counter = 0;
var instances = [];
var Instance = /** @class */ (function (_super) {
    __extends(Instance, _super);
    function Instance() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            children: null,
            option: {},
            show: true,
            returnValue: [],
        };
        _this.handleClickOutside = function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (_this.state.option.clickOutsideToClose) {
                hide(_this.state.option.key);
            }
        };
        return _this;
    }
    Instance.prototype.show = function (children, option) {
        this.setState({ children: children, option: option });
    };
    Instance.prototype.hide = function () {
        this.setState({ show: false });
    };
    Instance.prototype.render = function () {
        var _a, _b;
        return React.createElement("div", { className: "rfm-overlay " + (((_a = this.state.option) === null || _a === void 0 ? void 0 : _a.fading) ? (this.state.show ? "show" : "hide") : ""), onClick: this.handleClickOutside, style: (_b = this.state.option) === null || _b === void 0 ? void 0 : _b.style }, this.state.children);
    };
    return Instance;
}(React.Component));
var getInstance = function (callback, _option) {
    var option = __assign({ key: String(counter++), onClose: function () { }, fading: false, clickOutsideToClose: false }, _option);
    var i;
    var key = option.key;
    if (i = instances.find(function (x) { return x.key === key; })) {
        callback(i.instance, option);
        return;
    }
    var el = document.createElement("div");
    document.body.appendChild(el);
    var ref = function (instance) {
        if (!instance)
            return;
        callback(instance, option);
        instances.push({ key: key, instance: instance, el: el, option: option });
        return instance;
    };
    ReactDOM.render(React.createElement(Instance, { ref: ref }), el);
};
export var show = function (children, option) {
    injectStyle();
    getInstance(function (instance, o) {
        instance.show(children, o);
    }, option);
};
var hideAndRemove = function (i) {
    var el = i.el, option = i.option;
    var instance = i.instance;
    if (option.fading) {
        instance.hide();
        setTimeout(function () {
            ReactDOM.unmountComponentAtNode(el);
            document.body.removeChild(el);
        }, 200);
    }
    else {
        ReactDOM.unmountComponentAtNode(el);
        document.body.removeChild(el);
    }
};
export var hide = function (key) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var i;
    if (typeof key === "string") {
        if (i = instances.find(function (x) { return x.key === key; })) {
            hideAndRemove(i);
            instances.splice(instances.indexOf(i), 1);
        }
    }
    else {
        if (i = instances.pop()) {
            hideAndRemove(i);
        }
    }
    if (i === null || i === void 0 ? void 0 : i.option.onClose) {
        // Call onClose callback
        (_a = i.option).onClose.apply(_a, args);
    }
};
