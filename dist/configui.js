(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ConfiGUI = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getSelector(name) {
  var group = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  // Any dot-delimeted name assumes inputs in preceeding groups.
  // e.g. `something.else.a` => `[data-group="something"] [data-group="else"] input[name="a"]
  return name.split('.').reduce(function (selector, name, i, names) {
    if (group || i < names.length - 1) return selector + ' [data-group="' + name + '"]';
    return selector + ' input[name="' + name + '"]';
  }, '');
}

function getValue(el) {
  var value = /^(checkbox|radio)/i.test(el.type) ? el.checked : parseFloat(el.value);
  if (!value && typeof value === 'number' && value !== 0) return el.value;
  return !value && value !== false ? el.value : value;
}

function wrapInput(inputElement) {
  var wrap = document.createElement('div');
  wrap.className = 'label-wrap';

  var label = document.createElement('label');
  label.setAttribute('for', inputElement.name);
  label.innerText = inputElement.name;
  wrap.appendChild(label);

  var value = document.createElement('span');
  value.dataset.for = inputElement.name;
  value.innerText = inputElement.value;

  wrap.appendChild(value);

  inputElement.parentNode.replaceChild(wrap, inputElement);
  wrap.insertBefore(inputElement, value);
}

var ConfiGUI = exports.ConfiGUI = function () {
  _createClass(ConfiGUI, [{
    key: 'groups',
    get: function get() {
      return Array.from(this.root.querySelectorAll('[data-group]'));
    }
  }, {
    key: 'inputs',
    get: function get() {
      return Array.from(this.root.querySelectorAll('input:not([data-group-item])'));
    }
  }]);

  function ConfiGUI(el) {
    var _this = this;

    _classCallCheck(this, ConfiGUI);

    this.root = el || document.body.querySelector('[data-configui]:not([data-active="true"])');
    if (this.root) this.root.dataset.active = true;

    Array.from(this.root.querySelectorAll('input')).forEach(function (el) {
      if (el.parentNode.dataset.group) {
        el.dataset.groupItem = el.parentNode.dataset.group;
      }
    });

    this.createLabels();

    this.on(function (v, e) {
      var value = v[e.target.name] || _this.get(e.target.dataset.groupItem || e.target.name);

      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        _this.updateLabel(value, e);
      } else {
        _this.updateLabel(_defineProperty({}, e.target.name, value), e);
      }
    });
  }

  _createClass(ConfiGUI, [{
    key: 'createLabels',
    value: function createLabels() {
      this.groups.forEach(function (el) {
        var sp = document.createElement('h2');
        sp.innerText = el.dataset.group;
        el.insertBefore(sp, el.children[0]);
        Array.from(el.children).forEach(function (el) {
          return el.tagName === 'INPUT' && wrapInput(el);
        });
      });

      this.inputs.forEach(function (el) {
        return wrapInput(el);
      });
    }
  }, {
    key: 'updateLabel',
    value: function updateLabel(values, e) {
      if (e && e.target.dataset.noLabel) return;
      var root = this.root;

      if (e.target.dataset.groupItem) {
        root = this.groups.find(function (el) {
          return el.dataset.group === (e.target.dataset.groupItem || e.target.dataset.group);
        });
      }

      Object.keys(values).forEach(function (key) {
        (root.querySelector('span[data-for="' + key + '"]') || {}).innerText = values[key];
      });
    }
  }, {
    key: 'get',
    value: function get(name) {
      var _this2 = this;

      if (!name) {
        return Object.assign({}, this.inputs.reduce(function (values, el) {
          return Object.assign(values, _defineProperty({}, el.name, el.value));
        }, {}), this.groups.reduce(function (values, el) {
          return Object.assign(values, _defineProperty({}, el.dataset.group, _this2.get(el.dataset.group)));
        }, {}));
      }

      var el = this.root.querySelector(getSelector(name)) || this.root.querySelector(getSelector(name, true));

      // if `name` references a group, return an object with all of its values
      if (el && el.tagName !== 'INPUT') {
        return Array.from(el.querySelectorAll('input')).reduce(function (group, el) {
          return Object.assign(group, _defineProperty({}, el.name, getValue(el)));
        }, {});
      } else {
        return getValue(el);
      }
    }
  }, {
    key: 'set',
    value: function set(name, value) {
      var el = this.root.querySelector(getSelector(name)) || this.root.querySelector(getSelector(name, true));

      if (el && el.tagName !== 'INPUT') {
        return Array.from(el.querySelectorAll('input')).forEach(function (el) {
          return el.value = value[el.name] || value;
        });
      } else {
        el.value = value;
      }
    }
  }, {
    key: 'on',
    value: function on(name, callback) {
      var _this3 = this;

      var cb = void 0,
          el = void 0;

      if (typeof name === 'function') {
        callback = name;
        name = undefined;
        el = this.root;
      } else {
        el = this.root.querySelector(getSelector(name)) || this.root.querySelector(getSelector(name, true));
      }

      if (!el) throw new Error('The selector must map to an input...');

      cb = function cb(e) {
        return callback.call(null, _this3.get(name), e);
      };

      el.addEventListener('input', cb, el.tagName !== 'INPUT');
      el.addEventListener('change', cb, el.tagName !== 'INPUT');

      return this.off.bind(this, el, cb);
    }
  }, {
    key: 'off',
    value: function off(el, callback) {
      el.removeEventListener('input', callback, el.tagName !== 'INPUT');
      el.removeEventListener('change', callback, el.tagName !== 'INPUT');
    }
  }]);

  return ConfiGUI;
}();

},{}],2:[function(require,module,exports){
'use strict';

var _ConfiGUI = require('./ConfiGUI');

module.exports = _ConfiGUI.ConfiGUI;

},{"./ConfiGUI":1}]},{},[2])(2)
});