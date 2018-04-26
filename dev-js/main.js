(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _ForEach = require('../js-exports/ForEach.js');

var _NodeListForEach = require('../js-exports/NodeListForEach.js');

var _ClassList = require('../js-exports/ClassList.js');

var svg = document.getElementById('alaska-map'); /* exported ForEach, NodeListForEach, ClassList */

var timeoutShow,
    timeoutHide,
    nodes,
    cycleIndex = -1;

catalogNodes();
dataOverlay();
addEventListeners();

function addEventListeners() {
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
	});
}

function activate(e) {
	console.log(e);
	if (e.type !== 'focus') {
		document.activeElement.blur();
	}
	var circle = document.querySelector('circle.active');
	console.log(circle);
	if (circle) {
		deactivate.call(circle);
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
	var html = '<b>Fishery: </b>' + d.name + '<br /><b>Species</b>: ' + d.species + ' | <b>Gear</b>: ' + d.gear + ' | <b>Area</b>: ' + d.area + ' | <b>Number of permits</b>: ' + d.count;
	var details = document.querySelector('#detail-div');
	details.style.opacity = 0;
	timeoutShow = setTimeout(function () {
		details.innerHTML = html;
		details.style.opacity = 1;
	}, 250);
}
function hideDetails() {
	clearTimeout(timeoutShow);
	var details = document.querySelector('#detail-div');
	details.style.opacity = 0;
	timeoutHide = setTimeout(function () {
		details.innerHTML = '<em>Select a fishery or cycle through for details.</em>';
		details.style.opacity = 1;
	}, 250);
}
function dataOverlay() {
	var overlayDiv = document.createElement('div');
	overlayDiv.id = 'overlay-div';
	var detailWrapper = document.createElement('div');
	detailWrapper.id = 'detail-wrapper';
	var details = document.createElement('div');
	details.id = 'detail-div';
	details.setAttribute('aria-live', 'polite');
	details.innerHTML = '<em>Select a fishery or cycle through for details.</em>';
	detailWrapper.appendChild(details);
	overlayDiv.appendChild(detailWrapper);
	var btn = document.createElement('button');
	btn.id = 'cycle-through-btn';
	btn.setAttribute('aria-label', 'Select the next fishery on the map for details.');
	btn.setAttribute('aria-controls', 'detail-div');
	btn.innerHTML = 'Next';
	overlayDiv.appendChild(btn);
	document.getElementById('map-outer-container').insertAdjacentHTML('afterbegin', overlayDiv.innerHTML);
	document.getElementById('cycle-through-btn').addEventListener('click', cycleNext);
}

function cycleNext() {
	cycleIndex++;
	if (cycleIndex === nodes.length) {
		cycleIndex = 0;
	}
	activate.call(nodes[cycleIndex], 'btn');
}

function catalogNodes() {
	nodes = document.querySelectorAll('#alaska-map .nodes circle');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYtanMvbWFpbi5lczYiLCJqcy1leHBvcnRzL0NsYXNzTGlzdC5qcyIsImpzLWV4cG9ydHMvRm9yRWFjaC5qcyIsImpzLWV4cG9ydHMvTm9kZUxpc3RGb3JFYWNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQTs7QUFDQTs7QUFDQTs7QUFFQSxJQUFJLE1BQU0sU0FBUyxjQUFULENBQXdCLFlBQXhCLENBQVYsQyxDQUxBOztBQU1BLElBQUksV0FBSjtBQUFBLElBQ0MsV0FERDtBQUFBLElBRUMsS0FGRDtBQUFBLElBR0MsYUFBYSxDQUFDLENBSGY7O0FBS0E7QUFDQTtBQUNBOztBQUVBLFNBQVMsaUJBQVQsR0FBNEI7QUFDM0IsVUFBUyxnQkFBVCxDQUEwQixhQUExQixFQUF5QyxPQUF6QyxDQUFpRCxhQUFLO0FBQUU7QUFDdkQsSUFBRSxTQUFGLENBQVksTUFBWixDQUFtQixRQUFuQjtBQUNBLEVBRkQ7QUFHQSxLQUFJLGFBQWEsU0FBUyxhQUFULENBQXVCLGVBQXZCLENBQWpCO0FBQ0EsS0FBSyxVQUFMLEVBQWtCO0FBQ2pCLGFBQVcsU0FBWCxDQUFxQixNQUFyQixDQUE0QixRQUE1QjtBQUNBO0FBQ0QsS0FBSSxnQkFBSixDQUFxQixRQUFyQixFQUErQixPQUEvQixDQUF1QyxhQUFLO0FBQzNDLElBQUUsZ0JBQUYsQ0FBbUIsWUFBbkIsRUFBaUMsUUFBakM7QUFDQSxJQUFFLGdCQUFGLENBQW1CLFlBQW5CLEVBQWlDLFVBQWpDO0FBQ0EsSUFBRSxnQkFBRixDQUFtQixPQUFuQixFQUE0QixRQUE1QjtBQUNBLElBQUUsZ0JBQUYsQ0FBbUIsTUFBbkIsRUFBMkIsVUFBM0I7QUFDQSxFQUxEO0FBTUE7O0FBRUQsU0FBUyxRQUFULENBQWtCLENBQWxCLEVBQW9C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cmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qIGV4cG9ydGVkIEZvckVhY2gsIE5vZGVMaXN0Rm9yRWFjaCwgQ2xhc3NMaXN0ICovXG5pbXBvcnQgeyBGb3JFYWNoIH0gZnJvbSAnLi4vanMtZXhwb3J0cy9Gb3JFYWNoLmpzJztcbmltcG9ydCB7IE5vZGVMaXN0Rm9yRWFjaCB9IGZyb20gJy4uL2pzLWV4cG9ydHMvTm9kZUxpc3RGb3JFYWNoLmpzJztcbmltcG9ydCB7IENsYXNzTGlzdCB9IGZyb20gJy4uL2pzLWV4cG9ydHMvQ2xhc3NMaXN0LmpzJztcblxudmFyIHN2ZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbGFza2EtbWFwJyk7XG52YXIgdGltZW91dFNob3csXG5cdHRpbWVvdXRIaWRlLFxuXHRub2Rlcyxcblx0Y3ljbGVJbmRleCA9IC0xO1xuXG5jYXRhbG9nTm9kZXMoKTtcbmRhdGFPdmVybGF5KCk7XG5hZGRFdmVudExpc3RlbmVycygpO1xuXG5mdW5jdGlvbiBhZGRFdmVudExpc3RlbmVycygpe1xuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5lLmFjdGl2ZScpLmZvckVhY2gobCA9PiB7IC8vIG5lZWQgdG8gaGFuZGxlIGxpbmUgb3BhY2l0eSB2aWEgY3NzIGNsYXNzIHNvIHRoYXQgaXQgY2FuIGJlIHNlbGVjdGVkIGhlcmVcblx0XHRsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHR9KTtcblx0dmFyIGFjdGl2ZU5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjaXJjbGUuYWN0aXZlJyk7XG5cdGlmICggYWN0aXZlTm9kZSApIHtcblx0XHRhY3RpdmVOb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHR9XG5cdHN2Zy5xdWVyeVNlbGVjdG9yQWxsKCdjaXJjbGUnKS5mb3JFYWNoKGMgPT4ge1xuXHRcdGMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIGFjdGl2YXRlKTtcblx0XHRjLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBkZWFjdGl2YXRlKTtcblx0XHRjLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgYWN0aXZhdGUpO1xuXHRcdGMuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGRlYWN0aXZhdGUpO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYWN0aXZhdGUoZSl7XG5cdGNvbnNvbGUubG9nKGUpO1xuXHRpZiAoZS50eXBlICE9PSAnZm9jdXMnKSB7XG5cdFx0ZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XG5cdH0gXG5cdGxldCBjaXJjbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjaXJjbGUuYWN0aXZlJyk7XG5cdGNvbnNvbGUubG9nKGNpcmNsZSk7XG5cdGlmICggY2lyY2xlICkge1xuXHRcdGRlYWN0aXZhdGUuY2FsbChjaXJjbGUpO1xuXHR9XG5cdHRoaXMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdHNob3dMaW5rcyh0aGlzLmRhdGFzZXQpO1xuXHRzaG93RGV0YWlscyh0aGlzLmRhdGFzZXQpO1xufVxuXG5mdW5jdGlvbiBkZWFjdGl2YXRlKCl7XG5cdHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdGhpZGVMaW5rcyh0aGlzLmRhdGFzZXQpO1xuXHRoaWRlRGV0YWlscygpO1xufVxuXG5mdW5jdGlvbiBzaG93TGlua3MoZCl7XG5cdHN2Zy5xdWVyeVNlbGVjdG9yQWxsKCdsaW5lLicgKyBkLm5hbWUpLmZvckVhY2gobCA9PiB7XG5cdFx0bC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHR2YXIgYXR0YWNoZWROb2RlcyA9IGwuY2xhc3NOYW1lLmJhc2VWYWwubWF0Y2goL1tBLVpdKy0uKj8tW14gXS9nKTtcblx0XHRhdHRhY2hlZE5vZGVzLmZvckVhY2gobmRJZCA9PiB7XG5cdFx0XHRpZiAoIG5kSWQgIT09IGQubmFtZSApe1xuXHRcdFx0XHRsZXQgbmQgPSBzdmcucXVlcnlTZWxlY3RvcignY2lyY2xlW2RhdGEtbmFtZT1cIicgKyBuZElkICsgJ1wiXScpO1xuXHRcdFx0XHRpZiAoIG5kICkge1xuXHRcdFx0XHRcdG5kLmNsYXNzTGlzdC5hZGQoJ2F0dGFjaGVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG59XG5mdW5jdGlvbiBoaWRlTGlua3MoZCl7XG5cdHN2Zy5xdWVyeVNlbGVjdG9yQWxsKCdsaW5lLicgKyBkLm5hbWUpLmZvckVhY2gobCA9PiB7XG5cdFx0bC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0fSk7XG5cdHN2Zy5xdWVyeVNlbGVjdG9yQWxsKCdjaXJjbGUuYXR0YWNoZWQnKS5mb3JFYWNoKGMgPT4ge1xuXHRcdGMuY2xhc3NMaXN0LnJlbW92ZSgnYXR0YWNoZWQnKTtcblx0fSk7XG59XG5mdW5jdGlvbiBzaG93RGV0YWlscyhkKXtcblx0Y2xlYXJUaW1lb3V0KHRpbWVvdXRIaWRlKTtcblx0dmFyIGh0bWwgPSBgPGI+RmlzaGVyeTogPC9iPiR7ZC5uYW1lfTxiciAvPjxiPlNwZWNpZXM8L2I+OiAke2Quc3BlY2llc30gfCA8Yj5HZWFyPC9iPjogJHtkLmdlYXJ9IHwgPGI+QXJlYTwvYj46ICR7ZC5hcmVhfSB8IDxiPk51bWJlciBvZiBwZXJtaXRzPC9iPjogJHtkLmNvdW50fWA7XG5cdHZhciBkZXRhaWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RldGFpbC1kaXYnKTtcblx0ZGV0YWlscy5zdHlsZS5vcGFjaXR5ID0gMDtcblx0dGltZW91dFNob3cgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0ZGV0YWlscy5pbm5lckhUTUwgPSBodG1sO1xuXHRcdGRldGFpbHMuc3R5bGUub3BhY2l0eSA9IDE7XG5cdH0sMjUwKTtcbn1cbmZ1bmN0aW9uIGhpZGVEZXRhaWxzKCl7XG5cdGNsZWFyVGltZW91dCh0aW1lb3V0U2hvdyk7XG5cdHZhciBkZXRhaWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RldGFpbC1kaXYnKTtcblx0ZGV0YWlscy5zdHlsZS5vcGFjaXR5ID0gMDtcblx0dGltZW91dEhpZGUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0ZGV0YWlscy5pbm5lckhUTUwgPSAnPGVtPlNlbGVjdCBhIGZpc2hlcnkgb3IgY3ljbGUgdGhyb3VnaCBmb3IgZGV0YWlscy48L2VtPic7XG5cdFx0ZGV0YWlscy5zdHlsZS5vcGFjaXR5ID0gMTtcblx0fSwyNTApO1xufVxuZnVuY3Rpb24gZGF0YU92ZXJsYXkoKXtcblx0dmFyIG92ZXJsYXlEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0b3ZlcmxheURpdi5pZCA9ICdvdmVybGF5LWRpdic7XG5cdHZhciBkZXRhaWxXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdGRldGFpbFdyYXBwZXIuaWQgPSAnZGV0YWlsLXdyYXBwZXInO1xuXHR2YXIgZGV0YWlscyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRkZXRhaWxzLmlkID0gJ2RldGFpbC1kaXYnO1xuXHRkZXRhaWxzLnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywncG9saXRlJyk7XG5cdGRldGFpbHMuaW5uZXJIVE1MID0gJzxlbT5TZWxlY3QgYSBmaXNoZXJ5IG9yIGN5Y2xlIHRocm91Z2ggZm9yIGRldGFpbHMuPC9lbT4nO1xuXHRkZXRhaWxXcmFwcGVyLmFwcGVuZENoaWxkKGRldGFpbHMpO1xuXHRvdmVybGF5RGl2LmFwcGVuZENoaWxkKGRldGFpbFdyYXBwZXIpO1xuXHR2YXIgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cdGJ0bi5pZCA9ICdjeWNsZS10aHJvdWdoLWJ0bic7XG5cdGJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCdTZWxlY3QgdGhlIG5leHQgZmlzaGVyeSBvbiB0aGUgbWFwIGZvciBkZXRhaWxzLicpO1xuXHRidG4uc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywnZGV0YWlsLWRpdicpO1xuXHRidG4uaW5uZXJIVE1MID0gJ05leHQnO1xuXHRvdmVybGF5RGl2LmFwcGVuZENoaWxkKGJ0bik7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtb3V0ZXItY29udGFpbmVyJykuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJyxvdmVybGF5RGl2LmlubmVySFRNTCk7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjeWNsZS10aHJvdWdoLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY3ljbGVOZXh0KTtcbn1cblxuZnVuY3Rpb24gY3ljbGVOZXh0KCl7XG5cdGN5Y2xlSW5kZXgrKztcblx0aWYgKCBjeWNsZUluZGV4ID09PSBub2Rlcy5sZW5ndGggKSB7XG5cdFx0Y3ljbGVJbmRleCA9IDA7XG5cdH1cblx0YWN0aXZhdGUuY2FsbChub2Rlc1tjeWNsZUluZGV4XSwnYnRuJyk7XG59XG5cbmZ1bmN0aW9uIGNhdGFsb2dOb2Rlcygpe1xuXHRub2RlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNhbGFza2EtbWFwIC5ub2RlcyBjaXJjbGUnKTtcbn0iLCIvKlxuICogY2xhc3NMaXN0LmpzOiBDcm9zcy1icm93c2VyIGZ1bGwgZWxlbWVudC5jbGFzc0xpc3QgaW1wbGVtZW50YXRpb24uXG4gKiAxLjIuMjAxNzEyMTBcbiAqXG4gKiBCeSBFbGkgR3JleSwgaHR0cDovL2VsaWdyZXkuY29tXG4gKiBMaWNlbnNlOiBEZWRpY2F0ZWQgdG8gdGhlIHB1YmxpYyBkb21haW4uXG4gKiAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZWxpZ3JleS9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZFxuICovXG5cbi8qZ2xvYmFsIHNlbGYsIGRvY3VtZW50LCBET01FeGNlcHRpb24gKi9cblxuLyohIEBzb3VyY2UgaHR0cDovL3B1cmwuZWxpZ3JleS5jb20vZ2l0aHViL2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9jbGFzc0xpc3QuanMgKi9cblxuZXhwb3J0IGNvbnN0IENsYXNzTGlzdCA9IChmdW5jdGlvbigpe1xuXG5cdGlmIChcImRvY3VtZW50XCIgaW4gc2VsZikge1xuXG5cdC8vIEZ1bGwgcG9seWZpbGwgZm9yIGJyb3dzZXJzIHdpdGggbm8gY2xhc3NMaXN0IHN1cHBvcnRcblx0Ly8gSW5jbHVkaW5nIElFIDwgRWRnZSBtaXNzaW5nIFNWR0VsZW1lbnQuY2xhc3NMaXN0XG5cdGlmIChcblx0XHQgICAhKFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIl9cIikpIFxuXHRcdHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROU1xuXHRcdCYmICEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKSlcblx0KSB7XG5cblx0KGZ1bmN0aW9uICh2aWV3KSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0aWYgKCEoJ0VsZW1lbnQnIGluIHZpZXcpKSByZXR1cm47XG5cblx0dmFyXG5cdFx0ICBjbGFzc0xpc3RQcm9wID0gXCJjbGFzc0xpc3RcIlxuXHRcdCwgcHJvdG9Qcm9wID0gXCJwcm90b3R5cGVcIlxuXHRcdCwgZWxlbUN0clByb3RvID0gdmlldy5FbGVtZW50W3Byb3RvUHJvcF1cblx0XHQsIG9iakN0ciA9IE9iamVjdFxuXHRcdCwgc3RyVHJpbSA9IFN0cmluZ1twcm90b1Byb3BdLnRyaW0gfHwgZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgXCJcIik7XG5cdFx0fVxuXHRcdCwgYXJySW5kZXhPZiA9IEFycmF5W3Byb3RvUHJvcF0uaW5kZXhPZiB8fCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0dmFyXG5cdFx0XHRcdCAgaSA9IDBcblx0XHRcdFx0LCBsZW4gPSB0aGlzLmxlbmd0aFxuXHRcdFx0O1xuXHRcdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHRpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHtcblx0XHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIC0xO1xuXHRcdH1cblx0XHQvLyBWZW5kb3JzOiBwbGVhc2UgYWxsb3cgY29udGVudCBjb2RlIHRvIGluc3RhbnRpYXRlIERPTUV4Y2VwdGlvbnNcblx0XHQsIERPTUV4ID0gZnVuY3Rpb24gKHR5cGUsIG1lc3NhZ2UpIHtcblx0XHRcdHRoaXMubmFtZSA9IHR5cGU7XG5cdFx0XHR0aGlzLmNvZGUgPSBET01FeGNlcHRpb25bdHlwZV07XG5cdFx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHRcdH1cblx0XHQsIGNoZWNrVG9rZW5BbmRHZXRJbmRleCA9IGZ1bmN0aW9uIChjbGFzc0xpc3QsIHRva2VuKSB7XG5cdFx0XHRpZiAodG9rZW4gPT09IFwiXCIpIHtcblx0XHRcdFx0dGhyb3cgbmV3IERPTUV4KFxuXHRcdFx0XHRcdCAgXCJTWU5UQVhfRVJSXCJcblx0XHRcdFx0XHQsIFwiVGhlIHRva2VuIG11c3Qgbm90IGJlIGVtcHR5LlwiXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoL1xccy8udGVzdCh0b2tlbikpIHtcblx0XHRcdFx0dGhyb3cgbmV3IERPTUV4KFxuXHRcdFx0XHRcdCAgXCJJTlZBTElEX0NIQVJBQ1RFUl9FUlJcIlxuXHRcdFx0XHRcdCwgXCJUaGUgdG9rZW4gbXVzdCBub3QgY29udGFpbiBzcGFjZSBjaGFyYWN0ZXJzLlwiXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYXJySW5kZXhPZi5jYWxsKGNsYXNzTGlzdCwgdG9rZW4pO1xuXHRcdH1cblx0XHQsIENsYXNzTGlzdCA9IGZ1bmN0aW9uIChlbGVtKSB7XG5cdFx0XHR2YXJcblx0XHRcdFx0ICB0cmltbWVkQ2xhc3NlcyA9IHN0clRyaW0uY2FsbChlbGVtLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCIpXG5cdFx0XHRcdCwgY2xhc3NlcyA9IHRyaW1tZWRDbGFzc2VzID8gdHJpbW1lZENsYXNzZXMuc3BsaXQoL1xccysvKSA6IFtdXG5cdFx0XHRcdCwgaSA9IDBcblx0XHRcdFx0LCBsZW4gPSBjbGFzc2VzLmxlbmd0aFxuXHRcdFx0O1xuXHRcdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHR0aGlzLnB1c2goY2xhc3Nlc1tpXSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGVsZW0uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy50b1N0cmluZygpKTtcblx0XHRcdH07XG5cdFx0fVxuXHRcdCwgY2xhc3NMaXN0UHJvdG8gPSBDbGFzc0xpc3RbcHJvdG9Qcm9wXSA9IFtdXG5cdFx0LCBjbGFzc0xpc3RHZXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gbmV3IENsYXNzTGlzdCh0aGlzKTtcblx0XHR9XG5cdDtcblx0Ly8gTW9zdCBET01FeGNlcHRpb24gaW1wbGVtZW50YXRpb25zIGRvbid0IGFsbG93IGNhbGxpbmcgRE9NRXhjZXB0aW9uJ3MgdG9TdHJpbmcoKVxuXHQvLyBvbiBub24tRE9NRXhjZXB0aW9ucy4gRXJyb3IncyB0b1N0cmluZygpIGlzIHN1ZmZpY2llbnQgaGVyZS5cblx0RE9NRXhbcHJvdG9Qcm9wXSA9IEVycm9yW3Byb3RvUHJvcF07XG5cdGNsYXNzTGlzdFByb3RvLml0ZW0gPSBmdW5jdGlvbiAoaSkge1xuXHRcdHJldHVybiB0aGlzW2ldIHx8IG51bGw7XG5cdH07XG5cdGNsYXNzTGlzdFByb3RvLmNvbnRhaW5zID0gZnVuY3Rpb24gKHRva2VuKSB7XG5cdFx0cmV0dXJuIH5jaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4gKyBcIlwiKTtcblx0fTtcblx0Y2xhc3NMaXN0UHJvdG8uYWRkID0gZnVuY3Rpb24gKCkge1xuXHRcdHZhclxuXHRcdFx0ICB0b2tlbnMgPSBhcmd1bWVudHNcblx0XHRcdCwgaSA9IDBcblx0XHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHRcdCwgdG9rZW5cblx0XHRcdCwgdXBkYXRlZCA9IGZhbHNlXG5cdFx0O1xuXHRcdGRvIHtcblx0XHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRcdGlmICghfmNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbikpIHtcblx0XHRcdFx0dGhpcy5wdXNoKHRva2VuKTtcblx0XHRcdFx0dXBkYXRlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHdoaWxlICgrK2kgPCBsKTtcblxuXHRcdGlmICh1cGRhdGVkKSB7XG5cdFx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0XHR9XG5cdH07XG5cdGNsYXNzTGlzdFByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHR2YXJcblx0XHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0XHQsIGkgPSAwXG5cdFx0XHQsIGwgPSB0b2tlbnMubGVuZ3RoXG5cdFx0XHQsIHRva2VuXG5cdFx0XHQsIHVwZGF0ZWQgPSBmYWxzZVxuXHRcdFx0LCBpbmRleFxuXHRcdDtcblx0XHRkbyB7XG5cdFx0XHR0b2tlbiA9IHRva2Vuc1tpXSArIFwiXCI7XG5cdFx0XHRpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG5cdFx0XHR3aGlsZSAofmluZGV4KSB7XG5cdFx0XHRcdHRoaXMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdFx0dXBkYXRlZCA9IHRydWU7XG5cdFx0XHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdFx0aWYgKHVwZGF0ZWQpIHtcblx0XHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuXHRcdH1cblx0fTtcblx0Y2xhc3NMaXN0UHJvdG8udG9nZ2xlID0gZnVuY3Rpb24gKHRva2VuLCBmb3JjZSkge1xuXHRcdHZhclxuXHRcdFx0ICByZXN1bHQgPSB0aGlzLmNvbnRhaW5zKHRva2VuKVxuXHRcdFx0LCBtZXRob2QgPSByZXN1bHQgP1xuXHRcdFx0XHRmb3JjZSAhPT0gdHJ1ZSAmJiBcInJlbW92ZVwiXG5cdFx0XHQ6XG5cdFx0XHRcdGZvcmNlICE9PSBmYWxzZSAmJiBcImFkZFwiXG5cdFx0O1xuXG5cdFx0aWYgKG1ldGhvZCkge1xuXHRcdFx0dGhpc1ttZXRob2RdKHRva2VuKTtcblx0XHR9XG5cblx0XHRpZiAoZm9yY2UgPT09IHRydWUgfHwgZm9yY2UgPT09IGZhbHNlKSB7XG5cdFx0XHRyZXR1cm4gZm9yY2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiAhcmVzdWx0O1xuXHRcdH1cblx0fTtcblx0Y2xhc3NMaXN0UHJvdG8ucmVwbGFjZSA9IGZ1bmN0aW9uICh0b2tlbiwgcmVwbGFjZW1lbnRfdG9rZW4pIHtcblx0XHR2YXIgaW5kZXggPSBjaGVja1Rva2VuQW5kR2V0SW5kZXgodG9rZW4gKyBcIlwiKTtcblx0XHRpZiAofmluZGV4KSB7XG5cdFx0XHR0aGlzLnNwbGljZShpbmRleCwgMSwgcmVwbGFjZW1lbnRfdG9rZW4pO1xuXHRcdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdFx0fVxuXHR9XG5cdGNsYXNzTGlzdFByb3RvLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLmpvaW4oXCIgXCIpO1xuXHR9O1xuXG5cdGlmIChvYmpDdHIuZGVmaW5lUHJvcGVydHkpIHtcblx0XHR2YXIgY2xhc3NMaXN0UHJvcERlc2MgPSB7XG5cdFx0XHQgIGdldDogY2xhc3NMaXN0R2V0dGVyXG5cdFx0XHQsIGVudW1lcmFibGU6IHRydWVcblx0XHRcdCwgY29uZmlndXJhYmxlOiB0cnVlXG5cdFx0fTtcblx0XHR0cnkge1xuXHRcdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHRcdH0gY2F0Y2ggKGV4KSB7IC8vIElFIDggZG9lc24ndCBzdXBwb3J0IGVudW1lcmFibGU6dHJ1ZVxuXHRcdFx0Ly8gYWRkaW5nIHVuZGVmaW5lZCB0byBmaWdodCB0aGlzIGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9pc3N1ZXMvMzZcblx0XHRcdC8vIG1vZGVybmllIElFOC1NU1c3IG1hY2hpbmUgaGFzIElFOCA4LjAuNjAwMS4xODcwMiBhbmQgaXMgYWZmZWN0ZWRcblx0XHRcdGlmIChleC5udW1iZXIgPT09IHVuZGVmaW5lZCB8fCBleC5udW1iZXIgPT09IC0weDdGRjVFQzU0KSB7XG5cdFx0XHRcdGNsYXNzTGlzdFByb3BEZXNjLmVudW1lcmFibGUgPSBmYWxzZTtcblx0XHRcdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIGlmIChvYmpDdHJbcHJvdG9Qcm9wXS5fX2RlZmluZUdldHRlcl9fKSB7XG5cdFx0ZWxlbUN0clByb3RvLl9fZGVmaW5lR2V0dGVyX18oY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0R2V0dGVyKTtcblx0fVxuXG5cdH0oc2VsZikpO1xuXG5cdH1cblxuXHQvLyBUaGVyZSBpcyBmdWxsIG9yIHBhcnRpYWwgbmF0aXZlIGNsYXNzTGlzdCBzdXBwb3J0LCBzbyBqdXN0IGNoZWNrIGlmIHdlIG5lZWRcblx0Ly8gdG8gbm9ybWFsaXplIHRoZSBhZGQvcmVtb3ZlIGFuZCB0b2dnbGUgQVBJcy5cblxuXHQoZnVuY3Rpb24gKCkge1xuXHRcdFwidXNlIHN0cmljdFwiO1xuXG5cdFx0dmFyIHRlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIl9cIik7XG5cblx0XHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYzFcIiwgXCJjMlwiKTtcblxuXHRcdC8vIFBvbHlmaWxsIGZvciBJRSAxMC8xMSBhbmQgRmlyZWZveCA8MjYsIHdoZXJlIGNsYXNzTGlzdC5hZGQgYW5kXG5cdFx0Ly8gY2xhc3NMaXN0LnJlbW92ZSBleGlzdCBidXQgc3VwcG9ydCBvbmx5IG9uZSBhcmd1bWVudCBhdCBhIHRpbWUuXG5cdFx0aWYgKCF0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjMlwiKSkge1xuXHRcdFx0dmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuXHRcdFx0XHR2YXIgb3JpZ2luYWwgPSBET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF07XG5cblx0XHRcdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odG9rZW4pIHtcblx0XHRcdFx0XHR2YXIgaSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHRcdFx0dG9rZW4gPSBhcmd1bWVudHNbaV07XG5cdFx0XHRcdFx0XHRvcmlnaW5hbC5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHR9O1xuXHRcdFx0Y3JlYXRlTWV0aG9kKCdhZGQnKTtcblx0XHRcdGNyZWF0ZU1ldGhvZCgncmVtb3ZlJyk7XG5cdFx0fVxuXG5cdFx0dGVzdEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImMzXCIsIGZhbHNlKTtcblxuXHRcdC8vIFBvbHlmaWxsIGZvciBJRSAxMCBhbmQgRmlyZWZveCA8MjQsIHdoZXJlIGNsYXNzTGlzdC50b2dnbGUgZG9lcyBub3Rcblx0XHQvLyBzdXBwb3J0IHRoZSBzZWNvbmQgYXJndW1lbnQuXG5cdFx0aWYgKHRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImMzXCIpKSB7XG5cdFx0XHR2YXIgX3RvZ2dsZSA9IERPTVRva2VuTGlzdC5wcm90b3R5cGUudG9nZ2xlO1xuXG5cdFx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKHRva2VuLCBmb3JjZSkge1xuXHRcdFx0XHRpZiAoMSBpbiBhcmd1bWVudHMgJiYgIXRoaXMuY29udGFpbnModG9rZW4pID09PSAhZm9yY2UpIHtcblx0XHRcdFx0XHRyZXR1cm4gZm9yY2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIF90b2dnbGUuY2FsbCh0aGlzLCB0b2tlbik7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHR9XG5cblx0XHQvLyByZXBsYWNlKCkgcG9seWZpbGxcblx0XHRpZiAoIShcInJlcGxhY2VcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKS5jbGFzc0xpc3QpKSB7XG5cdFx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlLnJlcGxhY2UgPSBmdW5jdGlvbiAodG9rZW4sIHJlcGxhY2VtZW50X3Rva2VuKSB7XG5cdFx0XHRcdHZhclxuXHRcdFx0XHRcdCAgdG9rZW5zID0gdGhpcy50b1N0cmluZygpLnNwbGl0KFwiIFwiKVxuXHRcdFx0XHRcdCwgaW5kZXggPSB0b2tlbnMuaW5kZXhPZih0b2tlbiArIFwiXCIpXG5cdFx0XHRcdDtcblx0XHRcdFx0aWYgKH5pbmRleCkge1xuXHRcdFx0XHRcdHRva2VucyA9IHRva2Vucy5zbGljZShpbmRleCk7XG5cdFx0XHRcdFx0dGhpcy5yZW1vdmUuYXBwbHkodGhpcywgdG9rZW5zKTtcblx0XHRcdFx0XHR0aGlzLmFkZChyZXBsYWNlbWVudF90b2tlbik7XG5cdFx0XHRcdFx0dGhpcy5hZGQuYXBwbHkodGhpcywgdG9rZW5zLnNsaWNlKDEpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRlc3RFbGVtZW50ID0gbnVsbDtcblx0fSgpKTtcblxuXHR9XG59KSgpO1xuIiwiLy8gZm9yRWFjaCBwb2x5ZmlsbFxuLy8gUHJvZHVjdGlvbiBzdGVwcyBvZiBFQ01BLTI2MiwgRWRpdGlvbiA1LCAxNS40LjQuMThcbi8vIFJlZmVyZW5jZTogaHR0cDovL2VzNS5naXRodWIuaW8vI3gxNS40LjQuMThcbmV4cG9ydCBjb25zdCBGb3JFYWNoID0gKGZ1bmN0aW9uKCl7XG4gIGlmICghQXJyYXkucHJvdG90eXBlLmZvckVhY2gpIHtcblxuICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2svKiwgdGhpc0FyZyovKSB7XG5cbiAgICAgIHZhciBULCBrO1xuXG4gICAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RoaXMgaXMgbnVsbCBvciBub3QgZGVmaW5lZCcpO1xuICAgICAgfVxuXG4gICAgICAvLyAxLiBMZXQgTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdG9PYmplY3QoKSBwYXNzaW5nIHRoZVxuICAgICAgLy8gfHRoaXN8IHZhbHVlIGFzIHRoZSBhcmd1bWVudC5cbiAgICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xuXG4gICAgICAvLyAyLiBMZXQgbGVuVmFsdWUgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXQoKSBpbnRlcm5hbFxuICAgICAgLy8gbWV0aG9kIG9mIE8gd2l0aCB0aGUgYXJndW1lbnQgXCJsZW5ndGhcIi5cbiAgICAgIC8vIDMuIExldCBsZW4gYmUgdG9VaW50MzIobGVuVmFsdWUpLlxuICAgICAgdmFyIGxlbiA9IE8ubGVuZ3RoID4+PiAwO1xuXG4gICAgICAvLyA0LiBJZiBpc0NhbGxhYmxlKGNhbGxiYWNrKSBpcyBmYWxzZSwgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLiBcbiAgICAgIC8vIFNlZTogaHR0cDovL2VzNS5naXRodWIuY29tLyN4OS4xMVxuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGNhbGxiYWNrICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xuICAgICAgfVxuXG4gICAgICAvLyA1LiBJZiB0aGlzQXJnIHdhcyBzdXBwbGllZCwgbGV0IFQgYmUgdGhpc0FyZzsgZWxzZSBsZXRcbiAgICAgIC8vIFQgYmUgdW5kZWZpbmVkLlxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIFQgPSBhcmd1bWVudHNbMV07XG4gICAgICB9XG5cbiAgICAgIC8vIDYuIExldCBrIGJlIDAuXG4gICAgICBrID0gMDtcblxuICAgICAgLy8gNy4gUmVwZWF0IHdoaWxlIGsgPCBsZW4uXG4gICAgICB3aGlsZSAoayA8IGxlbikge1xuXG4gICAgICAgIHZhciBrVmFsdWU7XG5cbiAgICAgICAgLy8gYS4gTGV0IFBrIGJlIFRvU3RyaW5nKGspLlxuICAgICAgICAvLyAgICBUaGlzIGlzIGltcGxpY2l0IGZvciBMSFMgb3BlcmFuZHMgb2YgdGhlIGluIG9wZXJhdG9yLlxuICAgICAgICAvLyBiLiBMZXQga1ByZXNlbnQgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBIYXNQcm9wZXJ0eVxuICAgICAgICAvLyAgICBpbnRlcm5hbCBtZXRob2Qgb2YgTyB3aXRoIGFyZ3VtZW50IFBrLlxuICAgICAgICAvLyAgICBUaGlzIHN0ZXAgY2FuIGJlIGNvbWJpbmVkIHdpdGggYy5cbiAgICAgICAgLy8gYy4gSWYga1ByZXNlbnQgaXMgdHJ1ZSwgdGhlblxuICAgICAgICBpZiAoayBpbiBPKSB7XG5cbiAgICAgICAgICAvLyBpLiBMZXQga1ZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0IGludGVybmFsXG4gICAgICAgICAgLy8gbWV0aG9kIG9mIE8gd2l0aCBhcmd1bWVudCBQay5cbiAgICAgICAgICBrVmFsdWUgPSBPW2tdO1xuXG4gICAgICAgICAgLy8gaWkuIENhbGwgdGhlIENhbGwgaW50ZXJuYWwgbWV0aG9kIG9mIGNhbGxiYWNrIHdpdGggVCBhc1xuICAgICAgICAgIC8vIHRoZSB0aGlzIHZhbHVlIGFuZCBhcmd1bWVudCBsaXN0IGNvbnRhaW5pbmcga1ZhbHVlLCBrLCBhbmQgTy5cbiAgICAgICAgICBjYWxsYmFjay5jYWxsKFQsIGtWYWx1ZSwgaywgTyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZC4gSW5jcmVhc2UgayBieSAxLlxuICAgICAgICBrKys7XG4gICAgICB9XG4gICAgICAvLyA4LiByZXR1cm4gdW5kZWZpbmVkLlxuICAgIH07XG4gIH1cbn0pKCk7XG4iLCJleHBvcnQgY29uc3QgTm9kZUxpc3RGb3JFYWNoID0gKGZ1bmN0aW9uKCl7XG5cdGlmICh3aW5kb3cuTm9kZUxpc3QgJiYgIU5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoKSB7XG5cdCAgICBOb2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaywgdGhpc0FyZykge1xuXHQgICAgICAgIHRoaXNBcmcgPSB0aGlzQXJnIHx8IHdpbmRvdztcblx0ICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzW2ldLCBpLCB0aGlzKTtcblx0ICAgICAgICB9XG5cdCAgICB9O1xuXHR9XG59KSgpOyJdfQ==
