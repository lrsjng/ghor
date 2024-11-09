/*! ghor v1.1.0 - https://larsjung.de/ghor/ */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("ghor", [], factory);
	else if(typeof exports === 'object')
		exports["ghor"] = factory();
	else
		root["ghor"] = factory();
})((typeof self !== 'undefined' ? self : this), () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module) => {

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var is_fn = function is_fn(x) {
  return typeof x === 'function';
};
var is_obj = function is_obj(x) {
  return x && _typeof(x) === 'object';
};
var asrt = function asrt(expr, msg) {
  if (!expr) {
    throw new Error(msg);
  }
};
module.exports = function (definitions, inspector) {
  asrt(is_fn(Proxy), 'ghor-no-proxy');
  asrt(is_obj(definitions), 'ghor-no-defs');
  if (!is_fn(inspector)) {
    inspector = function inspector() {
      return null;
    };
  }
  var defs = Object.assign({}, definitions);
  var insts = {};
  var resolver = function resolver(fn) {
    return new Proxy({}, {
      get: function get(target, prop) {
        return fn(prop);
      }
    });
  };
  var _resolve = function resolve(id) {
    var stack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    if (id === '_resolve') {
      return _resolve;
    }
    asrt(!stack.includes(id), 'ghor-cycle: ' + [].concat(_toConsumableArray(stack), [id]).join(' > '));
    stack = [].concat(_toConsumableArray(stack), [id]);
    inspector('req', id, stack);
    if (!insts.hasOwnProperty(id)) {
      asrt(defs.hasOwnProperty(id), 'ghor-no-def: ' + String(id));
      inspector('ini', id);
      var def = defs[id];
      insts[id] = is_fn(def) ? def(resolver(function (i) {
        return _resolve(i, stack);
      })) : def;
    }
    inspector('res', id);
    return insts[id];
  };
  return _resolve;
};

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});