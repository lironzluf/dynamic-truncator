(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("dynamic-truncator", [], factory);
	else if(typeof exports === 'object')
		exports["dynamic-truncator"] = factory();
	else
		root["dynamic-truncator"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DynamicTruncator = exports.DynamicTruncator = function () {
  function DynamicTruncator(element, text) {
    _classCallCheck(this, DynamicTruncator);

    this._element = element;
    this._text = text;
    this.words = [];
    if (!this._element) {
      throw new Error('Dynamic Truncator: Element is required');
    }

    // Check if text is supplied, if not - get the one from the element
    if (!this.isTextValid()) {
      this._text = this.getTextFromElement();

      if (!this.isTextValid()) {
        throw new Error('Dynamic Truncator: No text found in element');
      }
    }

    // Set height 100% to element to prevent IE bug
    this.setHeightOnElement(100);
    this.words = this.getWordsFromText();

    if (this.isTruncationNeeded()) {
      // if text is overflown, truncate it
      this.startTruncating();
    }
  }

  _createClass(DynamicTruncator, [{
    key: 'startTruncating',
    value: function startTruncating() {
      //get max height of text element
      var height = this.getMaxHeight();
      // clear text in element
      this._element.innerText = '';
      // add each word in the words array to the element and check for overflow, if overflown - add ellipsis and stop
      for (var i = 0; i < this.words.length; i += 1) {
        this._element.innerText = this._element.innerText + ' ' + this.words[i];
        // if dots added, break
        if (this.addElipsis(i, height)) {
          break;
        }
      }
    }
  }, {
    key: 'addElipsis',
    value: function addElipsis(i, height) {
      // if text element is now overflown add elipsis
      if (this._element.scrollHeight > height && this._element.innerText.length > 0) {
        this._element.innerText = this._element.innerText.substring(0, this._element.innerText.length - this.words[i].length - 1); // remove last word
        // replace special chars at the end of the word and replace them with three dots
        this._element.innerText = this._element.innerText.substring(0, this._element.innerText.length - 1) + this._element.innerText[this._element.innerText.length - 1].replace(/(_|\+|\.|\/|\\|\,|\:|\;|\-)/g, '');
        this._element.innerText += '...';
        if (this._element.scrollHeight > height) {
          // if ellipsis added caused overflow
          this._element.innerText = this._element.innerText.substring(0, this._element.innerText.length - 3); // remove ellipsis
          this._element.innerText = this._element.innerText.substring(0, this._element.innerText.length - this.words[i - 1].length - 1); // remove last word
          this._element.innerText = this._element.innerText.substring(0, this._element.innerText.length - 1) + this._element.innerText[this._element.innerText.length - 1].replace(/(_|\+|\.|\/|\\|\,|\:|\;|\-)/g, '');
          this._element.innerText += '...';
        }
        return true;
      }
      // not yet overflown.. continue to add words
      return false;
    }
  }, {
    key: 'isTruncationNeeded',
    value: function isTruncationNeeded() {
      return this._element.scrollHeight > this._element.clientHeight;
    }
  }, {
    key: 'isTextValid',
    value: function isTextValid() {
      return typeof this._text === 'string' && this._text.length > 0;
    }
  }, {
    key: 'getMaxHeight',
    value: function getMaxHeight() {
      var computedStyle = window.getComputedStyle(this._element, null),
          maxHeightComputedStyle = 0,
          heightComputedStyle = 0;
      if (computedStyle) {
        maxHeightComputedStyle = parseInt(computedStyle.maxHeight, 10);
        heightComputedStyle = parseInt(computedStyle.height, 10);
      }

      return Math.max(maxHeightComputedStyle, heightComputedStyle, this._element.clientHeight);
    }
  }, {
    key: 'getTextFromElement',
    value: function getTextFromElement() {
      return this._element.innerText;
    }
  }, {
    key: 'setHeightOnElement',
    value: function setHeightOnElement(height) {
      if (!isNaN(height)) {
        this._element.style.height = height + '%';
      }
    }
  }, {
    key: 'getWordsFromText',
    value: function getWordsFromText() {
      return this._text.split(' ');
    }
  }]);

  return DynamicTruncator;
}();

/***/ })
/******/ ]);
});
//# sourceMappingURL=dynamic-truncator.js.map