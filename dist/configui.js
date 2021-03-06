(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ConfiGUI = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function handleInput(e) {
  var _this = this;

  var name = e.target.dataset.ns;
  var val = (0, _util.valueOf)(e.target);
  var model = (0, _util.set)(this.model, name, val);

  e.target.nextElementSibling.innerText = val;

  if (this.listeners[name]) {
    this.listeners[name].forEach(function (fn) {
      return fn.call(null, val, _this.model, e);
    });
  }

  this.listeners['*'].forEach(function (fn) {
    return fn.call(null, model, e);
  });
}

var ConfiGUI = function () {
  _createClass(ConfiGUI, [{
    key: 'inputs',
    get: function get() {
      return Array.from(this.root.querySelectorAll('input'));
    }
  }]);

  function ConfiGUI(el) {
    _classCallCheck(this, ConfiGUI);

    this.root = el || document.querySelector('[data-configui]:not([data-active])');
    if (!this.root) throw new Error('No [data-configui] element found and none provided to constructor');

    this.listeners = { '*': [] };

    this.inputs.forEach(function (input) {
      var group = (0, _util.parents)(input, '[data-group]');
      var ns = group.map(function (el) {
        return el.dataset.group;
      }).concat(input.name).join('.');

      input.dataset.ns = ns;
    });

    this.model = (0, _util.valueOf)(this.root);
    (0, _util.createLabels)(this.root);

    this.root.addEventListener('input', handleInput.bind(this), true);
    this.root.addEventListener('change', handleInput.bind(this), true);
  }

  _createClass(ConfiGUI, [{
    key: 'set',
    value: function set(name, value) {
      var _this2 = this;

      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        return Object.keys(value).map(function (key) {
          return _this2.set([name, key].join('.'), value[key]);
        });
      }

      var target = this.root.querySelector('[data-ns="' + name + '"]');

      if (/check|radio/.test(target.type)) {
        target.checked = !!value;
      } else {
        target.value = value;
      }

      handleInput.call(this, { target: target, type: 'custom' });
    }
  }, {
    key: 'get',
    value: function get(name) {
      return (0, _util.get)(this.model, name);
    }
  }, {
    key: 'on',
    value: function on(name, callback) {
      var _this3 = this;

      if (typeof name === 'function') {
        callback = name;
        name = '*';
      }

      this.listeners[name] = [].concat(this.listeners[name] || []).concat(callback);
      var i = this.listeners[name].length - 1;
      return function () {
        return _this3.listeners[name].splice(i, 1);
      };
    }
  }, {
    key: 'off',
    value: function off(name, fn) {
      this.listeners[name].splice(this.listeners[name].findIndex(fn), 1);
    }
  }]);

  return ConfiGUI;
}();

exports.default = ConfiGUI;

},{"./util":5}],2:[function(require,module,exports){
'use strict';

var _configui = require('./configui');

var _configui2 = _interopRequireDefault(_configui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _configui2.default;

},{"./configui":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapInput = wrapInput;
exports.createLabels = createLabels;
function wrapInput(inputElement) {
  var wrap = document.createElement('div');
  wrap.className = 'label-wrap';

  var label = document.createElement('label');
  label.setAttribute('for', inputElement.name);
  label.innerText = inputElement.name;
  wrap.appendChild(label);

  var value = document.createElement('span');
  value.dataset.for = inputElement.name;
  value.innerText = /check|radio/.test(inputElement.type) ? inputElement.checked : inputElement.value;

  wrap.appendChild(value);

  inputElement.parentNode.replaceChild(wrap, inputElement);
  wrap.insertBefore(inputElement, value);
}

function createLabels(root) {
  root.querySelectorAll('[data-group]').forEach(function (el) {
    var sp = document.createElement('h2');
    sp.innerText = el.dataset.group;
    el.insertBefore(sp, el.children[0]);
  });

  root.querySelectorAll('input').forEach(function (el) {
    return wrapInput(el);
  });
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closest = closest;
exports.parents = parents;
exports.valueOf = valueOf;

var _index = require('./index');

function closest(el, selector) {
  var target = el;

  while (target && target.parentNode && !target.matches(selector)) {
    target = target.parentNode;
  }

  return target;
}

function parents(el, selector) {
  var parents = [];
  var target = el;

  while (target && target.parentNode) {
    if (!selector || selector && target.matches(selector)) {
      parents.push(target);
    }

    target = target.parentNode;
  }

  return parents;
}

function valueOf(el) {
  if (el.tagName !== 'INPUT') {
    return (Array.from(el.querySelectorAll('input')) || []).reduce(function (values, el) {
      return (0, _index.set)(values, el.dataset.ns, valueOf(el));
    }, {});
  } else if (el.type === 'checkbox' || el.type === 'radio') {
    return !!el.checked;
  } else {
    return parseFloat(el.value) || el.value;
  }
}

},{"./index":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dom = require('./dom');

Object.defineProperty(exports, 'valueOf', {
  enumerable: true,
  get: function get() {
    return _dom.valueOf;
  }
});
Object.defineProperty(exports, 'closest', {
  enumerable: true,
  get: function get() {
    return _dom.closest;
  }
});
Object.defineProperty(exports, 'parents', {
  enumerable: true,
  get: function get() {
    return _dom.parents;
  }
});

var _display = require('./display');

Object.defineProperty(exports, 'createLabels', {
  enumerable: true,
  get: function get() {
    return _display.createLabels;
  }
});
exports.get = get;
exports.set = set;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function get(obj, ns) {
  return ns.split('.').reduce(function (obj, key) {
    return obj[key];
  }, obj);
}

function set(obj, key, value) {
  key.split('.').reduce(function (obj, k, i, ns) {
    if (i < ns.length - 1) {
      return obj[k] = obj[k] || {};
    } else {
      return Object.assign(obj, _defineProperty({}, k, value));
    }
  }, obj);

  return obj;
}

},{"./display":3,"./dom":4}]},{},[2])(2)
});