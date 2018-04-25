(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _ForEach = require('../js-exports/ForEach.js');

var _NodeListForEach = require('../js-exports/NodeListForEach.js');

var _ClassList = require('../js-exports/ClassList.js');

var svg = document.getElementById('alaska-map'); /* exported ForEach, NodeListForEach, ClassList */

var timeoutShow, timeoutHide, listenersAreOn;

dataOverlay();
addEventListeners();

document.querySelector('body').addEventListener('click', addEventListeners);

function addEventListeners() {
	if (listenersAreOn !== true) {
		listenersAreOn = true;
		document.querySelectorAll('line.active').forEach(function (l) {
			// need to handle line opacity via css class so that it can be selected here
			l.classList.remove('active');
		});
		var activeNode = document.querySelector('circle.active');
		if (activeNode) {
			activeNode.classList.remove('active');
		}
		svg.querySelectorAll('circle').forEach(function (c) {
			c.addEventListener('mouseenter', activate);
			c.addEventListener('mouseleave', deactivate);
			c.addEventListener('focus', activate);
			c.addEventListener('blur', deactivate);
			c.addEventListener('click', removeEventListeners);
		});
	}
}

function removeEventListeners(e) {
	listenersAreOn = false;
	e.stopPropagation();
	svg.querySelectorAll('circle').forEach(function (c) {
		c.removeEventListener('mouseenter', activate);
		c.removeEventListener('mouseleave', deactivate);
		c.removeEventListener('click', removeEventListeners);
	});
}

function activate(e) {
	if (e.type !== 'focus') {
		document.activeElement.blur();
	} else {
		var circle = document.querySelector('circle.active');
		if (circle) {
			deactivate.call(circle);
		}
	}
	this.classList.add('active');
	showLinks(this.dataset);
	showDetails(this.dataset);
}

function deactivate() {
	this.classList.remove('active');
	hideLinks(this.dataset);
	hideDetails();
}

function showLinks(d) {
	svg.querySelectorAll('line.' + d.name).forEach(function (l) {
		l.classList.add('active');
		var attachedNodes = l.className.baseVal.match(/[A-Z]+-.*?-[^ ]/g);
		attachedNodes.forEach(function (ndId) {
			if (ndId !== d.name) {
				var nd = svg.querySelector('circle[data-name="' + ndId + '"]');
				if (nd) {
					nd.classList.add('attached');
				}
			}
		});
	});
}
function hideLinks(d) {
	svg.querySelectorAll('line.' + d.name).forEach(function (l) {
		l.classList.remove('active');
	});
	svg.querySelectorAll('circle.attached').forEach(function (c) {
		c.classList.remove('attached');
	});
}
function showDetails(d) {
	clearTimeout(timeoutHide);
	var html = '<b>' + d.name + '</b><br /><b>Species</b>: ' + d.species + ' | <b>Gear</b>: ' + d.gear + ' | <b>Area</b>: ' + d.area + ' | <b>Number of permits</b>: ' + d.count;
	var overlayDiv = document.getElementById('overlay-div');
	overlayDiv.style.opacity = 0;
	timeoutShow = setTimeout(function () {
		overlayDiv.innerHTML = html;
		overlayDiv.style.opacity = 1;
	}, 250);
}
function hideDetails() {
	clearTimeout(timeoutShow);
	var html = 'Select a fishery or tab through for details.';
	var overlayDiv = document.getElementById('overlay-div');
	overlayDiv.style.opacity = 0;
	timeoutHide = setTimeout(function () {
		overlayDiv.innerHTML = html;
		overlayDiv.style.opacity = 1;
	}, 250);
}
function dataOverlay() {
	var overlayDiv = document.createElement('div');
	overlayDiv.id = 'overlay-div';
	overlayDiv.innerHTML = 'Select a fishery or tab through for details.';
	document.getElementById('map-container').appendChild(overlayDiv);
}

},{"../js-exports/ClassList.js":2,"../js-exports/ForEach.js":3,"../js-exports/NodeListForEach.js":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.2.20171210
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

var ClassList = exports.ClassList = function () {

	if ("document" in self) {

		// Full polyfill for browsers with no classList support
		// Including IE < Edge missing SVGElement.classList
		if (!("classList" in document.createElement("_")) || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {

			(function (view) {

				"use strict";

				if (!('Element' in view)) return;

				var classListProp = "classList",
				    protoProp = "prototype",
				    elemCtrProto = view.Element[protoProp],
				    objCtr = Object,
				    strTrim = String[protoProp].trim || function () {
					return this.replace(/^\s+|\s+$/g, "");
				},
				    arrIndexOf = Array[protoProp].indexOf || function (item) {
					var i = 0,
					    len = this.length;
					for (; i < len; i++) {
						if (i in this && this[i] === item) {
							return i;
						}
					}
					return -1;
				}
				// Vendors: please allow content code to instantiate DOMExceptions
				,
				    DOMEx = function DOMEx(type, message) {
					this.name = type;
					this.code = DOMException[type];
					this.message = message;
				},
				    checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
					if (token === "") {
						throw new DOMEx("SYNTAX_ERR", "The token must not be empty.");
					}
					if (/\s/.test(token)) {
						throw new DOMEx("INVALID_CHARACTER_ERR", "The token must not contain space characters.");
					}
					return arrIndexOf.call(classList, token);
				},
				    ClassList = function ClassList(elem) {
					var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
					    classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
					    i = 0,
					    len = classes.length;
					for (; i < len; i++) {
						this.push(classes[i]);
					}
					this._updateClassName = function () {
						elem.setAttribute("class", this.toString());
					};
				},
				    classListProto = ClassList[protoProp] = [],
				    classListGetter = function classListGetter() {
					return new ClassList(this);
				};
				// Most DOMException implementations don't allow calling DOMException's toString()
				// on non-DOMExceptions. Error's toString() is sufficient here.
				DOMEx[protoProp] = Error[protoProp];
				classListProto.item = function (i) {
					return this[i] || null;
				};
				classListProto.contains = function (token) {
					return ~checkTokenAndGetIndex(this, token + "");
				};
				classListProto.add = function () {
					var tokens = arguments,
					    i = 0,
					    l = tokens.length,
					    token,
					    updated = false;
					do {
						token = tokens[i] + "";
						if (!~checkTokenAndGetIndex(this, token)) {
							this.push(token);
							updated = true;
						}
					} while (++i < l);

					if (updated) {
						this._updateClassName();
					}
				};
				classListProto.remove = function () {
					var tokens = arguments,
					    i = 0,
					    l = tokens.length,
					    token,
					    updated = false,
					    index;
					do {
						token = tokens[i] + "";
						index = checkTokenAndGetIndex(this, token);
						while (~index) {
							this.splice(index, 1);
							updated = true;
							index = checkTokenAndGetIndex(this, token);
						}
					} while (++i < l);

					if (updated) {
						this._updateClassName();
					}
				};
				classListProto.toggle = function (token, force) {
					var result = this.contains(token),
					    method = result ? force !== true && "remove" : force !== false && "add";

					if (method) {
						this[method](token);
					}

					if (force === true || force === false) {
						return force;
					} else {
						return !result;
					}
				};
				classListProto.replace = function (token, replacement_token) {
					var index = checkTokenAndGetIndex(token + "");
					if (~index) {
						this.splice(index, 1, replacement_token);
						this._updateClassName();
					}
				};
				classListProto.toString = function () {
					return this.join(" ");
				};

				if (objCtr.defineProperty) {
					var classListPropDesc = {
						get: classListGetter,
						enumerable: true,
						configurable: true
					};
					try {
						objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
					} catch (ex) {
						// IE 8 doesn't support enumerable:true
						// adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
						// modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
						if (ex.number === undefined || ex.number === -0x7FF5EC54) {
							classListPropDesc.enumerable = false;
							objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
						}
					}
				} else if (objCtr[protoProp].__defineGetter__) {
					elemCtrProto.__defineGetter__(classListProp, classListGetter);
				}
			})(self);
		}

		// There is full or partial native classList support, so just check if we need
		// to normalize the add/remove and toggle APIs.

		(function () {
			"use strict";

			var testElement = document.createElement("_");

			testElement.classList.add("c1", "c2");

			// Polyfill for IE 10/11 and Firefox <26, where classList.add and
			// classList.remove exist but support only one argument at a time.
			if (!testElement.classList.contains("c2")) {
				var createMethod = function createMethod(method) {
					var original = DOMTokenList.prototype[method];

					DOMTokenList.prototype[method] = function (token) {
						var i,
						    len = arguments.length;

						for (i = 0; i < len; i++) {
							token = arguments[i];
							original.call(this, token);
						}
					};
				};
				createMethod('add');
				createMethod('remove');
			}

			testElement.classList.toggle("c3", false);

			// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
			// support the second argument.
			if (testElement.classList.contains("c3")) {
				var _toggle = DOMTokenList.prototype.toggle;

				DOMTokenList.prototype.toggle = function (token, force) {
					if (1 in arguments && !this.contains(token) === !force) {
						return force;
					} else {
						return _toggle.call(this, token);
					}
				};
			}

			// replace() polyfill
			if (!("replace" in document.createElement("_").classList)) {
				DOMTokenList.prototype.replace = function (token, replacement_token) {
					var tokens = this.toString().split(" "),
					    index = tokens.indexOf(token + "");
					if (~index) {
						tokens = tokens.slice(index);
						this.remove.apply(this, tokens);
						this.add(replacement_token);
						this.add.apply(this, tokens.slice(1));
					}
				};
			}

			testElement = null;
		})();
	}
}();

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// forEach polyfill
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
var ForEach = exports.ForEach = function () {
  if (!Array.prototype.forEach) {

    Array.prototype.forEach = function (callback /*, thisArg*/) {

      var T, k;

      if (this == null) {
        throw new TypeError('this is null or not defined');
      }

      // 1. Let O be the result of calling toObject() passing the
      // |this| value as the argument.
      var O = Object(this);

      // 2. Let lenValue be the result of calling the Get() internal
      // method of O with the argument "length".
      // 3. Let len be toUint32(lenValue).
      var len = O.length >>> 0;

      // 4. If isCallable(callback) is false, throw a TypeError exception. 
      // See: http://es5.github.com/#x9.11
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }

      // 5. If thisArg was supplied, let T be thisArg; else let
      // T be undefined.
      if (arguments.length > 1) {
        T = arguments[1];
      }

      // 6. Let k be 0.
      k = 0;

      // 7. Repeat while k < len.
      while (k < len) {

        var kValue;

        // a. Let Pk be ToString(k).
        //    This is implicit for LHS operands of the in operator.
        // b. Let kPresent be the result of calling the HasProperty
        //    internal method of O with argument Pk.
        //    This step can be combined with c.
        // c. If kPresent is true, then
        if (k in O) {

          // i. Let kValue be the result of calling the Get internal
          // method of O with argument Pk.
          kValue = O[k];

          // ii. Call the Call internal method of callback with T as
          // the this value and argument list containing kValue, k, and O.
          callback.call(T, kValue, k, O);
        }
        // d. Increase k by 1.
        k++;
      }
      // 8. return undefined.
    };
  }
}();

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var NodeListForEach = exports.NodeListForEach = function () {
	if (window.NodeList && !NodeList.prototype.forEach) {
		NodeList.prototype.forEach = function (callback, thisArg) {
			thisArg = thisArg || window;
			for (var i = 0; i < this.length; i++) {
				callback.call(thisArg, this[i], i, this);
			}
		};
	}
}();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYtanMvbWFpbi5lczYiLCJqcy1leHBvcnRzL0NsYXNzTGlzdC5qcyIsImpzLWV4cG9ydHMvRm9yRWFjaC5qcyIsImpzLWV4cG9ydHMvTm9kZUxpc3RGb3JFYWNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQTs7QUFDQTs7QUFDQTs7QUFFQSxJQUFJLE1BQU0sU0FBUyxjQUFULENBQXdCLFlBQXhCLENBQVYsQyxDQUxBOztBQU1BLElBQUksV0FBSixFQUNDLFdBREQsRUFFQyxjQUZEOztBQU1BO0FBQ0E7O0FBRUEsU0FBUyxhQUFULENBQXVCLE1BQXZCLEVBQStCLGdCQUEvQixDQUFnRCxPQUFoRCxFQUF5RCxpQkFBekQ7O0FBRUEsU0FBUyxpQkFBVCxHQUE0QjtBQUMzQixLQUFLLG1CQUFtQixJQUF4QixFQUE4QjtBQUM3QixtQkFBaUIsSUFBakI7QUFDQSxXQUFTLGdCQUFULENBQTBCLGFBQTFCLEVBQXlDLE9BQXpDLENBQWlELGFBQUs7QUFBRTtBQUN2RCxLQUFFLFNBQUYsQ0FBWSxNQUFaLENBQW1CLFFBQW5CO0FBQ0EsR0FGRDtBQUdBLE1BQUksYUFBYSxTQUFTLGFBQVQsQ0FBdUIsZUFBdkIsQ0FBakI7QUFDQSxNQUFLLFVBQUwsRUFBa0I7QUFDakIsY0FBVyxTQUFYLENBQXFCLE1BQXJCLENBQTRCLFFBQTVCO0FBQ0E7QUFDRCxNQUFJLGdCQUFKLENBQXFCLFFBQXJCLEVBQStCLE9BQS9CLENBQXVDLGFBQUs7QUFDM0MsS0FBRSxnQkFBRixDQUFtQixZQUFuQixFQUFpQyxRQUFqQztBQUNBLEtBQUUsZ0JBQUYsQ0FBbUIsWUFBbkIsRUFBaUMsVUFBakM7QUFDQSxLQUFFLGdCQUFGLENBQW1CLE9BQW5CLEVBQTRCLFFBQTVCO0FBQ0EsS0FBRSxnQkFB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LFlBQUksS0FBSyxDQUFULEVBQVk7O0FBRVY7QUFDQTtBQUNBLG1CQUFTLEVBQUUsQ0FBRixDQUFUOztBQUVBO0FBQ0E7QUFDQSxtQkFBUyxJQUFULENBQWMsQ0FBZCxFQUFpQixNQUFqQixFQUF5QixDQUF6QixFQUE0QixDQUE1QjtBQUNEO0FBQ0Q7QUFDQTtBQUNEO0FBQ0Q7QUFDRCxLQXpERDtBQTBERDtBQUNGLENBOURzQixFQUFoQjs7Ozs7Ozs7QUNIQSxJQUFNLDRDQUFtQixZQUFVO0FBQ3pDLEtBQUksT0FBTyxRQUFQLElBQW1CLENBQUMsU0FBUyxTQUFULENBQW1CLE9BQTNDLEVBQW9EO0FBQ2hELFdBQVMsU0FBVCxDQUFtQixPQUFuQixHQUE2QixVQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkI7QUFDdEQsYUFBVSxXQUFXLE1BQXJCO0FBQ0EsUUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7QUFDbEMsYUFBUyxJQUFULENBQWMsT0FBZCxFQUF1QixLQUFLLENBQUwsQ0FBdkIsRUFBZ0MsQ0FBaEMsRUFBbUMsSUFBbkM7QUFDSDtBQUNKLEdBTEQ7QUFNSDtBQUNELENBVDhCLEVBQXhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyogZXhwb3J0ZWQgRm9yRWFjaCwgTm9kZUxpc3RGb3JFYWNoLCBDbGFzc0xpc3QgKi9cbmltcG9ydCB7IEZvckVhY2ggfSBmcm9tICcuLi9qcy1leHBvcnRzL0ZvckVhY2guanMnO1xuaW1wb3J0IHsgTm9kZUxpc3RGb3JFYWNoIH0gZnJvbSAnLi4vanMtZXhwb3J0cy9Ob2RlTGlzdEZvckVhY2guanMnO1xuaW1wb3J0IHsgQ2xhc3NMaXN0IH0gZnJvbSAnLi4vanMtZXhwb3J0cy9DbGFzc0xpc3QuanMnO1xuXG52YXIgc3ZnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FsYXNrYS1tYXAnKTtcbnZhciB0aW1lb3V0U2hvdyxcblx0dGltZW91dEhpZGUsXG5cdGxpc3RlbmVyc0FyZU9uO1xuXG5cblxuZGF0YU92ZXJsYXkoKTtcbmFkZEV2ZW50TGlzdGVuZXJzKCk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFkZEV2ZW50TGlzdGVuZXJzKTtcblxuZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcnMoKXtcblx0aWYgKCBsaXN0ZW5lcnNBcmVPbiAhPT0gdHJ1ZSApe1xuXHRcdGxpc3RlbmVyc0FyZU9uID0gdHJ1ZTtcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5lLmFjdGl2ZScpLmZvckVhY2gobCA9PiB7IC8vIG5lZWQgdG8gaGFuZGxlIGxpbmUgb3BhY2l0eSB2aWEgY3NzIGNsYXNzIHNvIHRoYXQgaXQgY2FuIGJlIHNlbGVjdGVkIGhlcmVcblx0XHRcdGwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0fSk7XG5cdFx0dmFyIGFjdGl2ZU5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjaXJjbGUuYWN0aXZlJyk7XG5cdFx0aWYgKCBhY3RpdmVOb2RlICkge1xuXHRcdFx0YWN0aXZlTm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHR9XG5cdFx0c3ZnLnF1ZXJ5U2VsZWN0b3JBbGwoJ2NpcmNsZScpLmZvckVhY2goYyA9PiB7XG5cdFx0XHRjLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBhY3RpdmF0ZSk7XG5cdFx0XHRjLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBkZWFjdGl2YXRlKTtcblx0XHRcdGMuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBhY3RpdmF0ZSk7XG5cdFx0XHRjLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBkZWFjdGl2YXRlKTtcblx0XHRcdGMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZW1vdmVFdmVudExpc3RlbmVycyk7XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoZSl7XG5cdGxpc3RlbmVyc0FyZU9uID0gZmFsc2U7XG5cdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdHN2Zy5xdWVyeVNlbGVjdG9yQWxsKCdjaXJjbGUnKS5mb3JFYWNoKGMgPT4ge1xuXHRcdGMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIGFjdGl2YXRlKTtcblx0XHRjLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBkZWFjdGl2YXRlKTtcblx0XHRjLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVtb3ZlRXZlbnRMaXN0ZW5lcnMpO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYWN0aXZhdGUoZSl7XG5cdGlmIChlLnR5cGUgIT09ICdmb2N1cycpIHtcblx0XHRkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcblx0fSBlbHNlIHtcblx0XHRsZXQgY2lyY2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignY2lyY2xlLmFjdGl2ZScpO1xuXHRcdGlmICggY2lyY2xlICkge1xuXHRcdFx0ZGVhY3RpdmF0ZS5jYWxsKGNpcmNsZSk7XG5cdFx0fVxuXHR9XG5cdHRoaXMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdHNob3dMaW5rcyh0aGlzLmRhdGFzZXQpO1xuXHRzaG93RGV0YWlscyh0aGlzLmRhdGFzZXQpO1xufVxuXG5mdW5jdGlvbiBkZWFjdGl2YXRlKCl7XG5cdHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdGhpZGVMaW5rcyh0aGlzLmRhdGFzZXQpO1xuXHRoaWRlRGV0YWlscygpO1xufVxuXG5mdW5jdGlvbiBzaG93TGlua3MoZCl7XG5cdHN2Zy5xdWVyeVNlbGVjdG9yQWxsKCdsaW5lLicgKyBkLm5hbWUpLmZvckVhY2gobCA9PiB7XG5cdFx0bC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR2YXIgYXR0YWNoZWROb2RlcyA9IGwuY2xhc3NOYW1lLmJhc2VWYWwubWF0Y2goL1tBLVpdKy0uKj8tW14gXS9nKTtcblx0XHRhdHRhY2hlZE5vZGVzLmZvckVhY2gobmRJZCA9PiB7XG5cdFx0XHRpZiAoIG5kSWQgIT09IGQubmFtZSApe1xuXHRcdFx0XHRsZXQgbmQgPSBzdmcucXVlcnlTZWxlY3RvcignY2lyY2xlW2RhdGEtbmFtZT1cIicgKyBuZElkICsgJ1wiXScpO1xuXHRcdFx0XHRpZiAoIG5kICkge1xuXHRcdFx0XHRcdG5kLmNsYXNzTGlzdC5hZGQoJ2F0dGFjaGVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG59XG5mdW5jdGlvbiBoaWRlTGlua3MoZCl7XG5cdHN2Zy5xdWVyeVNlbGVjdG9yQWxsKCdsaW5lLicgKyBkLm5hbWUpLmZvckVhY2gobCA9PiB7XG5cdFx0bC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0fSk7XG5cdHN2Zy5xdWVyeVNlbGVjdG9yQWxsKCdjaXJjbGUuYXR0YWNoZWQnKS5mb3JFYWNoKGMgPT4ge1xuXHRcdGMuY2xhc3NMaXN0LnJlbW92ZSgnYXR0YWNoZWQnKTtcblx0fSk7XG59XG5mdW5jdGlvbiBzaG93RGV0YWlscyhkKXtcblx0Y2xlYXJUaW1lb3V0KHRpbWVvdXRIaWRlKTtcblx0dmFyIGh0bWwgPSBgPGI+JHtkLm5hbWV9PC9iPjxiciAvPjxiPlNwZWNpZXM8L2I+OiAke2Quc3BlY2llc30gfCA8Yj5HZWFyPC9iPjogJHtkLmdlYXJ9IHwgPGI+QXJlYTwvYj46ICR7ZC5hcmVhfSB8IDxiPk51bWJlciBvZiBwZXJtaXRzPC9iPjogJHtkLmNvdW50fWA7XG5cdHZhciBvdmVybGF5RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ292ZXJsYXktZGl2Jyk7XG5cdG92ZXJsYXlEaXYuc3R5bGUub3BhY2l0eSA9IDA7XG5cdHRpbWVvdXRTaG93ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdG92ZXJsYXlEaXYuaW5uZXJIVE1MID0gaHRtbDtcblx0XHRvdmVybGF5RGl2LnN0eWxlLm9wYWNpdHkgPSAxO1xuXHR9LDI1MCk7XG59XG5mdW5jdGlvbiBoaWRlRGV0YWlscygpe1xuXHRjbGVhclRpbWVvdXQodGltZW91dFNob3cpO1xuXHR2YXIgaHRtbCA9ICdTZWxlY3QgYSBmaXNoZXJ5IG9yIHRhYiB0aHJvdWdoIGZvciBkZXRhaWxzLic7XG5cdHZhciBvdmVybGF5RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ292ZXJsYXktZGl2Jyk7XG5cdG92ZXJsYXlEaXYuc3R5bGUub3BhY2l0eSA9IDA7XG5cdHRpbWVvdXRIaWRlID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdG92ZXJsYXlEaXYuaW5uZXJIVE1MID0gaHRtbDtcblx0XHRvdmVybGF5RGl2LnN0eWxlLm9wYWNpdHkgPSAxO1xuXHR9LDI1MCk7XG5cbn1cbmZ1bmN0aW9uIGRhdGFPdmVybGF5KCl7XG5cdHZhciBvdmVybGF5RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdG92ZXJsYXlEaXYuaWQgPSAnb3ZlcmxheS1kaXYnO1xuXHRvdmVybGF5RGl2LmlubmVySFRNTCA9ICdTZWxlY3QgYSBmaXNoZXJ5IG9yIHRhYiB0aHJvdWdoIGZvciBkZXRhaWxzLic7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtY29udGFpbmVyJykuYXBwZW5kQ2hpbGQob3ZlcmxheURpdik7XG59IiwiLypcbiAqIGNsYXNzTGlzdC5qczogQ3Jvc3MtYnJvd3NlciBmdWxsIGVsZW1lbnQuY2xhc3NMaXN0IGltcGxlbWVudGF0aW9uLlxuICogMS4yLjIwMTcxMjEwXG4gKlxuICogQnkgRWxpIEdyZXksIGh0dHA6Ly9lbGlncmV5LmNvbVxuICogTGljZW5zZTogRGVkaWNhdGVkIHRvIHRoZSBwdWJsaWMgZG9tYWluLlxuICogICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiAqL1xuXG4vKmdsb2JhbCBzZWxmLCBkb2N1bWVudCwgRE9NRXhjZXB0aW9uICovXG5cbi8qISBAc291cmNlIGh0dHA6Ly9wdXJsLmVsaWdyZXkuY29tL2dpdGh1Yi9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvY2xhc3NMaXN0LmpzICovXG5cbmV4cG9ydCBjb25zdCBDbGFzc0xpc3QgPSAoZnVuY3Rpb24oKXtcblxuXHRpZiAoXCJkb2N1bWVudFwiIGluIHNlbGYpIHtcblxuXHQvLyBGdWxsIHBvbHlmaWxsIGZvciBicm93c2VycyB3aXRoIG5vIGNsYXNzTGlzdCBzdXBwb3J0XG5cdC8vIEluY2x1ZGluZyBJRSA8IEVkZ2UgbWlzc2luZyBTVkdFbGVtZW50LmNsYXNzTGlzdFxuXHRpZiAoXG5cdFx0ICAgIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpKSBcblx0XHR8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlNcblx0XHQmJiAhKFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIikpXG5cdCkge1xuXG5cdChmdW5jdGlvbiAodmlldykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdGlmICghKCdFbGVtZW50JyBpbiB2aWV3KSkgcmV0dXJuO1xuXG5cdHZhclxuXHRcdCAgY2xhc3NMaXN0UHJvcCA9IFwiY2xhc3NMaXN0XCJcblx0XHQsIHByb3RvUHJvcCA9IFwicHJvdG90eXBlXCJcblx0XHQsIGVsZW1DdHJQcm90byA9IHZpZXcuRWxlbWVudFtwcm90b1Byb3BdXG5cdFx0LCBvYmpDdHIgPSBPYmplY3Rcblx0XHQsIHN0clRyaW0gPSBTdHJpbmdbcHJvdG9Qcm9wXS50cmltIHx8IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csIFwiXCIpO1xuXHRcdH1cblx0XHQsIGFyckluZGV4T2YgPSBBcnJheVtwcm90b1Byb3BdLmluZGV4T2YgfHwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhclxuXHRcdFx0XHQgIGkgPSAwXG5cdFx0XHRcdCwgbGVuID0gdGhpcy5sZW5ndGhcblx0XHRcdDtcblx0XHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0aWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiAtMTtcblx0XHR9XG5cdFx0Ly8gVmVuZG9yczogcGxlYXNlIGFsbG93IGNvbnRlbnQgY29kZSB0byBpbnN0YW50aWF0ZSBET01FeGNlcHRpb25zXG5cdFx0LCBET01FeCA9IGZ1bmN0aW9uICh0eXBlLCBtZXNzYWdlKSB7XG5cdFx0XHR0aGlzLm5hbWUgPSB0eXBlO1xuXHRcdFx0dGhpcy5jb2RlID0gRE9NRXhjZXB0aW9uW3R5cGVdO1xuXHRcdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblx0XHR9XG5cdFx0LCBjaGVja1Rva2VuQW5kR2V0SW5kZXggPSBmdW5jdGlvbiAoY2xhc3NMaXN0LCB0b2tlbikge1xuXHRcdFx0aWYgKHRva2VuID09PSBcIlwiKSB7XG5cdFx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0XHQgIFwiU1lOVEFYX0VSUlwiXG5cdFx0XHRcdFx0LCBcIlRoZSB0b2tlbiBtdXN0IG5vdCBiZSBlbXB0eS5cIlxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKC9cXHMvLnRlc3QodG9rZW4pKSB7XG5cdFx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0XHQgIFwiSU5WQUxJRF9DSEFSQUNURVJfRVJSXCJcblx0XHRcdFx0XHQsIFwiVGhlIHRva2VuIG11c3Qgbm90IGNvbnRhaW4gc3BhY2UgY2hhcmFjdGVycy5cIlxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGFyckluZGV4T2YuY2FsbChjbGFzc0xpc3QsIHRva2VuKTtcblx0XHR9XG5cdFx0LCBDbGFzc0xpc3QgPSBmdW5jdGlvbiAoZWxlbSkge1xuXHRcdFx0dmFyXG5cdFx0XHRcdCAgdHJpbW1lZENsYXNzZXMgPSBzdHJUcmltLmNhbGwoZWxlbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKVxuXHRcdFx0XHQsIGNsYXNzZXMgPSB0cmltbWVkQ2xhc3NlcyA/IHRyaW1tZWRDbGFzc2VzLnNwbGl0KC9cXHMrLykgOiBbXVxuXHRcdFx0XHQsIGkgPSAwXG5cdFx0XHRcdCwgbGVuID0gY2xhc3Nlcy5sZW5ndGhcblx0XHRcdDtcblx0XHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0dGhpcy5wdXNoKGNsYXNzZXNbaV0pO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRlbGVtLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMudG9TdHJpbmcoKSk7XG5cdFx0XHR9O1xuXHRcdH1cblx0XHQsIGNsYXNzTGlzdFByb3RvID0gQ2xhc3NMaXN0W3Byb3RvUHJvcF0gPSBbXVxuXHRcdCwgY2xhc3NMaXN0R2V0dGVyID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIG5ldyBDbGFzc0xpc3QodGhpcyk7XG5cdFx0fVxuXHQ7XG5cdC8vIE1vc3QgRE9NRXhjZXB0aW9uIGltcGxlbWVudGF0aW9ucyBkb24ndCBhbGxvdyBjYWxsaW5nIERPTUV4Y2VwdGlvbidzIHRvU3RyaW5nKClcblx0Ly8gb24gbm9uLURPTUV4Y2VwdGlvbnMuIEVycm9yJ3MgdG9TdHJpbmcoKSBpcyBzdWZmaWNpZW50IGhlcmUuXG5cdERPTUV4W3Byb3RvUHJvcF0gPSBFcnJvcltwcm90b1Byb3BdO1xuXHRjbGFzc0xpc3RQcm90by5pdGVtID0gZnVuY3Rpb24gKGkpIHtcblx0XHRyZXR1cm4gdGhpc1tpXSB8fCBudWxsO1xuXHR9O1xuXHRjbGFzc0xpc3RQcm90by5jb250YWlucyA9IGZ1bmN0aW9uICh0b2tlbikge1xuXHRcdHJldHVybiB+Y2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuICsgXCJcIik7XG5cdH07XG5cdGNsYXNzTGlzdFByb3RvLmFkZCA9IGZ1bmN0aW9uICgpIHtcblx0XHR2YXJcblx0XHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0XHQsIGkgPSAwXG5cdFx0XHQsIGwgPSB0b2tlbnMubGVuZ3RoXG5cdFx0XHQsIHRva2VuXG5cdFx0XHQsIHVwZGF0ZWQgPSBmYWxzZVxuXHRcdDtcblx0XHRkbyB7XG5cdFx0XHR0b2tlbiA9IHRva2Vuc1tpXSArIFwiXCI7XG5cdFx0XHRpZiAoIX5jaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pKSB7XG5cdFx0XHRcdHRoaXMucHVzaCh0b2tlbik7XG5cdFx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR3aGlsZSAoKytpIDwgbCk7XG5cblx0XHRpZiAodXBkYXRlZCkge1xuXHRcdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdFx0fVxuXHR9O1xuXHRjbGFzc0xpc3RQcm90by5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyXG5cdFx0XHQgIHRva2VucyA9IGFyZ3VtZW50c1xuXHRcdFx0LCBpID0gMFxuXHRcdFx0LCBsID0gdG9rZW5zLmxlbmd0aFxuXHRcdFx0LCB0b2tlblxuXHRcdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0XHRcdCwgaW5kZXhcblx0XHQ7XG5cdFx0ZG8ge1xuXHRcdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdFx0aW5kZXggPSBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pO1xuXHRcdFx0d2hpbGUgKH5pbmRleCkge1xuXHRcdFx0XHR0aGlzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0XHRpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHdoaWxlICgrK2kgPCBsKTtcblxuXHRcdGlmICh1cGRhdGVkKSB7XG5cdFx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0XHR9XG5cdH07XG5cdGNsYXNzTGlzdFByb3RvLnRvZ2dsZSA9IGZ1bmN0aW9uICh0b2tlbiwgZm9yY2UpIHtcblx0XHR2YXJcblx0XHRcdCAgcmVzdWx0ID0gdGhpcy5jb250YWlucyh0b2tlbilcblx0XHRcdCwgbWV0aG9kID0gcmVzdWx0ID9cblx0XHRcdFx0Zm9yY2UgIT09IHRydWUgJiYgXCJyZW1vdmVcIlxuXHRcdFx0OlxuXHRcdFx0XHRmb3JjZSAhPT0gZmFsc2UgJiYgXCJhZGRcIlxuXHRcdDtcblxuXHRcdGlmIChtZXRob2QpIHtcblx0XHRcdHRoaXNbbWV0aG9kXSh0b2tlbik7XG5cdFx0fVxuXG5cdFx0aWYgKGZvcmNlID09PSB0cnVlIHx8IGZvcmNlID09PSBmYWxzZSkge1xuXHRcdFx0cmV0dXJuIGZvcmNlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gIXJlc3VsdDtcblx0XHR9XG5cdH07XG5cdGNsYXNzTGlzdFByb3RvLnJlcGxhY2UgPSBmdW5jdGlvbiAodG9rZW4sIHJlcGxhY2VtZW50X3Rva2VuKSB7XG5cdFx0dmFyIGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRva2VuICsgXCJcIik7XG5cdFx0aWYgKH5pbmRleCkge1xuXHRcdFx0dGhpcy5zcGxpY2UoaW5kZXgsIDEsIHJlcGxhY2VtZW50X3Rva2VuKTtcblx0XHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuXHRcdH1cblx0fVxuXHRjbGFzc0xpc3RQcm90by50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gdGhpcy5qb2luKFwiIFwiKTtcblx0fTtcblxuXHRpZiAob2JqQ3RyLmRlZmluZVByb3BlcnR5KSB7XG5cdFx0dmFyIGNsYXNzTGlzdFByb3BEZXNjID0ge1xuXHRcdFx0ICBnZXQ6IGNsYXNzTGlzdEdldHRlclxuXHRcdFx0LCBlbnVtZXJhYmxlOiB0cnVlXG5cdFx0XHQsIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHRcdH07XG5cdFx0dHJ5IHtcblx0XHRcdG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcblx0XHR9IGNhdGNoIChleCkgeyAvLyBJRSA4IGRvZXNuJ3Qgc3VwcG9ydCBlbnVtZXJhYmxlOnRydWVcblx0XHRcdC8vIGFkZGluZyB1bmRlZmluZWQgdG8gZmlnaHQgdGhpcyBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vZWxpZ3JleS9jbGFzc0xpc3QuanMvaXNzdWVzLzM2XG5cdFx0XHQvLyBtb2Rlcm5pZSBJRTgtTVNXNyBtYWNoaW5lIGhhcyBJRTggOC4wLjYwMDEuMTg3MDIgYW5kIGlzIGFmZmVjdGVkXG5cdFx0XHRpZiAoZXgubnVtYmVyID09PSB1bmRlZmluZWQgfHwgZXgubnVtYmVyID09PSAtMHg3RkY1RUM1NCkge1xuXHRcdFx0XHRjbGFzc0xpc3RQcm9wRGVzYy5lbnVtZXJhYmxlID0gZmFsc2U7XG5cdFx0XHRcdG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSBpZiAob2JqQ3RyW3Byb3RvUHJvcF0uX19kZWZpbmVHZXR0ZXJfXykge1xuXHRcdGVsZW1DdHJQcm90by5fX2RlZmluZUdldHRlcl9fKGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdEdldHRlcik7XG5cdH1cblxuXHR9KHNlbGYpKTtcblxuXHR9XG5cblx0Ly8gVGhlcmUgaXMgZnVsbCBvciBwYXJ0aWFsIG5hdGl2ZSBjbGFzc0xpc3Qgc3VwcG9ydCwgc28ganVzdCBjaGVjayBpZiB3ZSBuZWVkXG5cdC8vIHRvIG5vcm1hbGl6ZSB0aGUgYWRkL3JlbW92ZSBhbmQgdG9nZ2xlIEFQSXMuXG5cblx0KGZ1bmN0aW9uICgpIHtcblx0XHRcInVzZSBzdHJpY3RcIjtcblxuXHRcdHZhciB0ZXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpO1xuXG5cdFx0dGVzdEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImMxXCIsIFwiYzJcIik7XG5cblx0XHQvLyBQb2x5ZmlsbCBmb3IgSUUgMTAvMTEgYW5kIEZpcmVmb3ggPDI2LCB3aGVyZSBjbGFzc0xpc3QuYWRkIGFuZFxuXHRcdC8vIGNsYXNzTGlzdC5yZW1vdmUgZXhpc3QgYnV0IHN1cHBvcnQgb25seSBvbmUgYXJndW1lbnQgYXQgYSB0aW1lLlxuXHRcdGlmICghdGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYzJcIikpIHtcblx0XHRcdHZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbihtZXRob2QpIHtcblx0XHRcdFx0dmFyIG9yaWdpbmFsID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdO1xuXG5cdFx0XHRcdERPTVRva2VuTGlzdC5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHRva2VuKSB7XG5cdFx0XHRcdFx0dmFyIGksIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cblx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0XHRcdHRva2VuID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0XHRcdFx0b3JpZ2luYWwuY2FsbCh0aGlzLCB0b2tlbik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0fTtcblx0XHRcdGNyZWF0ZU1ldGhvZCgnYWRkJyk7XG5cdFx0XHRjcmVhdGVNZXRob2QoJ3JlbW92ZScpO1xuXHRcdH1cblxuXHRcdHRlc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJjM1wiLCBmYWxzZSk7XG5cblx0XHQvLyBQb2x5ZmlsbCBmb3IgSUUgMTAgYW5kIEZpcmVmb3ggPDI0LCB3aGVyZSBjbGFzc0xpc3QudG9nZ2xlIGRvZXMgbm90XG5cdFx0Ly8gc3VwcG9ydCB0aGUgc2Vjb25kIGFyZ3VtZW50LlxuXHRcdGlmICh0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjM1wiKSkge1xuXHRcdFx0dmFyIF90b2dnbGUgPSBET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZTtcblxuXHRcdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbih0b2tlbiwgZm9yY2UpIHtcblx0XHRcdFx0aWYgKDEgaW4gYXJndW1lbnRzICYmICF0aGlzLmNvbnRhaW5zKHRva2VuKSA9PT0gIWZvcmNlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZvcmNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBfdG9nZ2xlLmNhbGwodGhpcywgdG9rZW4pO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0fVxuXG5cdFx0Ly8gcmVwbGFjZSgpIHBvbHlmaWxsXG5cdFx0aWYgKCEoXCJyZXBsYWNlXCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIl9cIikuY2xhc3NMaXN0KSkge1xuXHRcdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZS5yZXBsYWNlID0gZnVuY3Rpb24gKHRva2VuLCByZXBsYWNlbWVudF90b2tlbikge1xuXHRcdFx0XHR2YXJcblx0XHRcdFx0XHQgIHRva2VucyA9IHRoaXMudG9TdHJpbmcoKS5zcGxpdChcIiBcIilcblx0XHRcdFx0XHQsIGluZGV4ID0gdG9rZW5zLmluZGV4T2YodG9rZW4gKyBcIlwiKVxuXHRcdFx0XHQ7XG5cdFx0XHRcdGlmICh+aW5kZXgpIHtcblx0XHRcdFx0XHR0b2tlbnMgPSB0b2tlbnMuc2xpY2UoaW5kZXgpO1xuXHRcdFx0XHRcdHRoaXMucmVtb3ZlLmFwcGx5KHRoaXMsIHRva2Vucyk7XG5cdFx0XHRcdFx0dGhpcy5hZGQocmVwbGFjZW1lbnRfdG9rZW4pO1xuXHRcdFx0XHRcdHRoaXMuYWRkLmFwcGx5KHRoaXMsIHRva2Vucy5zbGljZSgxKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHR0ZXN0RWxlbWVudCA9IG51bGw7XG5cdH0oKSk7XG5cblx0fVxufSkoKTtcbiIsIi8vIGZvckVhY2ggcG9seWZpbGxcbi8vIFByb2R1Y3Rpb24gc3RlcHMgb2YgRUNNQS0yNjIsIEVkaXRpb24gNSwgMTUuNC40LjE4XG4vLyBSZWZlcmVuY2U6IGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuNC40LjE4XG5leHBvcnQgY29uc3QgRm9yRWFjaCA9IChmdW5jdGlvbigpe1xuICBpZiAoIUFycmF5LnByb3RvdHlwZS5mb3JFYWNoKSB7XG5cbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLyosIHRoaXNBcmcqLykge1xuXG4gICAgICB2YXIgVCwgaztcblxuICAgICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0aGlzIGlzIG51bGwgb3Igbm90IGRlZmluZWQnKTtcbiAgICAgIH1cblxuICAgICAgLy8gMS4gTGV0IE8gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRvT2JqZWN0KCkgcGFzc2luZyB0aGVcbiAgICAgIC8vIHx0aGlzfCB2YWx1ZSBhcyB0aGUgYXJndW1lbnQuXG4gICAgICB2YXIgTyA9IE9iamVjdCh0aGlzKTtcblxuICAgICAgLy8gMi4gTGV0IGxlblZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0KCkgaW50ZXJuYWxcbiAgICAgIC8vIG1ldGhvZCBvZiBPIHdpdGggdGhlIGFyZ3VtZW50IFwibGVuZ3RoXCIuXG4gICAgICAvLyAzLiBMZXQgbGVuIGJlIHRvVWludDMyKGxlblZhbHVlKS5cbiAgICAgIHZhciBsZW4gPSBPLmxlbmd0aCA+Pj4gMDtcblxuICAgICAgLy8gNC4gSWYgaXNDYWxsYWJsZShjYWxsYmFjaykgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi4gXG4gICAgICAvLyBTZWU6IGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDkuMTFcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihjYWxsYmFjayArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgICAgIH1cblxuICAgICAgLy8gNS4gSWYgdGhpc0FyZyB3YXMgc3VwcGxpZWQsIGxldCBUIGJlIHRoaXNBcmc7IGVsc2UgbGV0XG4gICAgICAvLyBUIGJlIHVuZGVmaW5lZC5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBUID0gYXJndW1lbnRzWzFdO1xuICAgICAgfVxuXG4gICAgICAvLyA2LiBMZXQgayBiZSAwLlxuICAgICAgayA9IDA7XG5cbiAgICAgIC8vIDcuIFJlcGVhdCB3aGlsZSBrIDwgbGVuLlxuICAgICAgd2hpbGUgKGsgPCBsZW4pIHtcblxuICAgICAgICB2YXIga1ZhbHVlO1xuXG4gICAgICAgIC8vIGEuIExldCBQayBiZSBUb1N0cmluZyhrKS5cbiAgICAgICAgLy8gICAgVGhpcyBpcyBpbXBsaWNpdCBmb3IgTEhTIG9wZXJhbmRzIG9mIHRoZSBpbiBvcGVyYXRvci5cbiAgICAgICAgLy8gYi4gTGV0IGtQcmVzZW50IGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgSGFzUHJvcGVydHlcbiAgICAgICAgLy8gICAgaW50ZXJuYWwgbWV0aG9kIG9mIE8gd2l0aCBhcmd1bWVudCBQay5cbiAgICAgICAgLy8gICAgVGhpcyBzdGVwIGNhbiBiZSBjb21iaW5lZCB3aXRoIGMuXG4gICAgICAgIC8vIGMuIElmIGtQcmVzZW50IGlzIHRydWUsIHRoZW5cbiAgICAgICAgaWYgKGsgaW4gTykge1xuXG4gICAgICAgICAgLy8gaS4gTGV0IGtWYWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldCBpbnRlcm5hbFxuICAgICAgICAgIC8vIG1ldGhvZCBvZiBPIHdpdGggYXJndW1lbnQgUGsuXG4gICAgICAgICAga1ZhbHVlID0gT1trXTtcblxuICAgICAgICAgIC8vIGlpLiBDYWxsIHRoZSBDYWxsIGludGVybmFsIG1ldGhvZCBvZiBjYWxsYmFjayB3aXRoIFQgYXNcbiAgICAgICAgICAvLyB0aGUgdGhpcyB2YWx1ZSBhbmQgYXJndW1lbnQgbGlzdCBjb250YWluaW5nIGtWYWx1ZSwgaywgYW5kIE8uXG4gICAgICAgICAgY2FsbGJhY2suY2FsbChULCBrVmFsdWUsIGssIE8pO1xuICAgICAgICB9XG4gICAgICAgIC8vIGQuIEluY3JlYXNlIGsgYnkgMS5cbiAgICAgICAgaysrO1xuICAgICAgfVxuICAgICAgLy8gOC4gcmV0dXJuIHVuZGVmaW5lZC5cbiAgICB9O1xuICB9XG59KSgpO1xuIiwiZXhwb3J0IGNvbnN0IE5vZGVMaXN0Rm9yRWFjaCA9IChmdW5jdGlvbigpe1xuXHRpZiAod2luZG93Lk5vZGVMaXN0ICYmICFOb2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCkge1xuXHQgICAgTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2ssIHRoaXNBcmcpIHtcblx0ICAgICAgICB0aGlzQXJnID0gdGhpc0FyZyB8fCB3aW5kb3c7XG5cdCAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpc1tpXSwgaSwgdGhpcyk7XG5cdCAgICAgICAgfVxuXHQgICAgfTtcblx0fVxufSkoKTsiXX0=
