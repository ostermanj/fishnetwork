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
	details.innerHTML = '<em>Select a fishery or cycle through for details.</em>';
	detailWrapper.appendChild(details);
	overlayDiv.appendChild(detailWrapper);
	var btn = document.createElement('button');
	btn.id = 'cycle-through-btn';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYtanMvbWFpbi5lczYiLCJqcy1leHBvcnRzL0NsYXNzTGlzdC5qcyIsImpzLWV4cG9ydHMvRm9yRWFjaC5qcyIsImpzLWV4cG9ydHMvTm9kZUxpc3RGb3JFYWNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQTs7QUFDQTs7QUFDQTs7QUFFQSxJQUFJLE1BQU0sU0FBUyxjQUFULENBQXdCLFlBQXhCLENBQVYsQyxDQUxBOztBQU1BLElBQUksV0FBSjtBQUFBLElBQ0MsV0FERDtBQUFBLElBRUMsS0FGRDtBQUFBLElBR0MsYUFBYSxDQUFDLENBSGY7O0FBS0E7QUFDQTtBQUNBOztBQUVBLFNBQVMsaUJBQVQsR0FBNEI7QUFDM0IsVUFBUyxnQkFBVCxDQUEwQixhQUExQixFQUF5QyxPQUF6QyxDQUFpRCxhQUFLO0FBQUU7QUFDdkQsSUFBRSxTQUFGLENBQVksTUFBWixDQUFtQixRQUFuQjtBQUNBLEVBRkQ7QUFHQSxLQUFJLGFBQWEsU0FBUyxhQUFULENBQXVCLGVBQXZCLENBQWpCO0FBQ0EsS0FBSyxVQUFMLEVBQWtCO0FBQ2pCLGFBQVcsU0FBWCxDQUFxQixNQUFyQixDQUE0QixRQUE1QjtBQUNBO0FBQ0QsS0FBSSxnQkFBSixDQUFxQixRQUFyQixFQUErQixPQUEvQixDQUF1QyxhQUFLO0FBQzNDLElBQUUsZ0JBQUYsQ0FBbUIsWUFBbkIsRUFBaUMsUUFBakM7QUFDQSxJQUFFLGdCQUFGLENBQW1CLFlBQW5CLEVBQWlDLFVBQWpDO0FBQ0EsSUFBRSxnQkFBRixDQUFtQixPQUFuQixFQUE0QixRQUE1QjtBQUNBLElBQUUsZ0JBQUYsQ0FBbUIsTUFBbkIsRUFBMkIsVUFBM0I7QUFDQSxFQUxEO0FBTUE7O0FBRUQsU0FBUyxRQUFULENBQWtCLENBQWxCLEVBQW9C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QUNsQyxjQUFNLElBQUksU0FBSixDQUFjLFdBQVcsb0JBQXpCLENBQU47QUFDRDs7QUFFRDtBQUNBO0FBQ0EsVUFBSSxVQUFVLE1BQVYsR0FBbUIsQ0FBdkIsRUFBMEI7QUFDeEIsWUFBSSxVQUFVLENBQVYsQ0FBSjtBQUNEOztBQUVEO0FBQ0EsVUFBSSxDQUFKOztBQUVBO0FBQ0EsYUFBTyxJQUFJLEdBQVgsRUFBZ0I7O0FBRWQsWUFBSSxNQUFKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUksS0FBSyxDQUFULEVBQVk7O0FBRVY7QUFDQTtBQUNBLG1CQUFTLEVBQUUsQ0FBRixDQUFUOztBQUVBO0FBQ0E7QUFDQSxtQkFBUyxJQUFULENBQWMsQ0FBZCxFQUFpQixNQUFqQixFQUF5QixDQUF6QixFQUE0QixDQUE1QjtBQUNEO0FBQ0Q7QUFDQTtBQUNEO0FBQ0Q7QUFDRCxLQXpERDtBQTBERDtBQUNGLENBOURzQixFQUFoQjs7Ozs7Ozs7QUNIQSxJQUFNLDRDQUFtQixZQUFVO0FBQ3pDLEtBQUksT0FBTyxRQUFQLElBQW1CLENBQUMsU0FBUyxTQUFULENBQW1CLE9BQTNDLEVBQW9EO0FBQ2hELFdBQVMsU0FBVCxDQUFtQixPQUFuQixHQUE2QixVQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkI7QUFDdEQsYUFBVSxXQUFXLE1BQXJCO0FBQ0EsUUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7QUFDbEMsYUFBUyxJQUFULENBQWMsT0FBZCxFQUF1QixLQUFLLENBQUwsQ0FBdkIsRUFBZ0MsQ0FBaEMsRUFBbUMsSUFBbkM7QUFDSDtBQUNKLEdBTEQ7QUFNSDtBQUNELENBVDhCLEVBQXhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyogZXhwb3J0ZWQgRm9yRWFjaCwgTm9kZUxpc3RGb3JFYWNoLCBDbGFzc0xpc3QgKi9cbmltcG9ydCB7IEZvckVhY2ggfSBmcm9tICcuLi9qcy1leHBvcnRzL0ZvckVhY2guanMnO1xuaW1wb3J0IHsgTm9kZUxpc3RGb3JFYWNoIH0gZnJvbSAnLi4vanMtZXhwb3J0cy9Ob2RlTGlzdEZvckVhY2guanMnO1xuaW1wb3J0IHsgQ2xhc3NMaXN0IH0gZnJvbSAnLi4vanMtZXhwb3J0cy9DbGFzc0xpc3QuanMnO1xuXG52YXIgc3ZnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FsYXNrYS1tYXAnKTtcbnZhciB0aW1lb3V0U2hvdyxcblx0dGltZW91dEhpZGUsXG5cdG5vZGVzLFxuXHRjeWNsZUluZGV4ID0gLTE7XG5cbmNhdGFsb2dOb2RlcygpO1xuZGF0YU92ZXJsYXkoKTtcbmFkZEV2ZW50TGlzdGVuZXJzKCk7XG5cbmZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJzKCl7XG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmUuYWN0aXZlJykuZm9yRWFjaChsID0+IHsgLy8gbmVlZCB0byBoYW5kbGUgbGluZSBvcGFjaXR5IHZpYSBjc3MgY2xhc3Mgc28gdGhhdCBpdCBjYW4gYmUgc2VsZWN0ZWQgaGVyZVxuXHRcdGwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdH0pO1xuXHR2YXIgYWN0aXZlTm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NpcmNsZS5hY3RpdmUnKTtcblx0aWYgKCBhY3RpdmVOb2RlICkge1xuXHRcdGFjdGl2ZU5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdH1cblx0c3ZnLnF1ZXJ5U2VsZWN0b3JBbGwoJ2NpcmNsZScpLmZvckVhY2goYyA9PiB7XG5cdFx0Yy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgYWN0aXZhdGUpO1xuXHRcdGMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGRlYWN0aXZhdGUpO1xuXHRcdGMuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBhY3RpdmF0ZSk7XG5cdFx0Yy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZGVhY3RpdmF0ZSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBhY3RpdmF0ZShlKXtcblx0Y29uc29sZS5sb2coZSk7XG5cdGlmIChlLnR5cGUgIT09ICdmb2N1cycpIHtcblx0XHRkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcblx0fSBcblx0bGV0IGNpcmNsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NpcmNsZS5hY3RpdmUnKTtcblx0Y29uc29sZS5sb2coY2lyY2xlKTtcblx0aWYgKCBjaXJjbGUgKSB7XG5cdFx0ZGVhY3RpdmF0ZS5jYWxsKGNpcmNsZSk7XG5cdH1cblx0dGhpcy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0c2hvd0xpbmtzKHRoaXMuZGF0YXNldCk7XG5cdHNob3dEZXRhaWxzKHRoaXMuZGF0YXNldCk7XG59XG5cbmZ1bmN0aW9uIGRlYWN0aXZhdGUoKXtcblx0dGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0aGlkZUxpbmtzKHRoaXMuZGF0YXNldCk7XG5cdGhpZGVEZXRhaWxzKCk7XG59XG5cbmZ1bmN0aW9uIHNob3dMaW5rcyhkKXtcblx0c3ZnLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmUuJyArIGQubmFtZSkuZm9yRWFjaChsID0+IHtcblx0XHRsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdHZhciBhdHRhY2hlZE5vZGVzID0gbC5jbGFzc05hbWUuYmFzZVZhbC5tYXRjaCgvW0EtWl0rLS4qPy1bXiBdL2cpO1xuXHRcdGF0dGFjaGVkTm9kZXMuZm9yRWFjaChuZElkID0+IHtcblx0XHRcdGlmICggbmRJZCAhPT0gZC5uYW1lICl7XG5cdFx0XHRcdGxldCBuZCA9IHN2Zy5xdWVyeVNlbGVjdG9yKCdjaXJjbGVbZGF0YS1uYW1lPVwiJyArIG5kSWQgKyAnXCJdJyk7XG5cdFx0XHRcdGlmICggbmQgKSB7XG5cdFx0XHRcdFx0bmQuY2xhc3NMaXN0LmFkZCgnYXR0YWNoZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcbn1cbmZ1bmN0aW9uIGhpZGVMaW5rcyhkKXtcblx0c3ZnLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmUuJyArIGQubmFtZSkuZm9yRWFjaChsID0+IHtcblx0XHRsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHR9KTtcblx0c3ZnLnF1ZXJ5U2VsZWN0b3JBbGwoJ2NpcmNsZS5hdHRhY2hlZCcpLmZvckVhY2goYyA9PiB7XG5cdFx0Yy5jbGFzc0xpc3QucmVtb3ZlKCdhdHRhY2hlZCcpO1xuXHR9KTtcbn1cbmZ1bmN0aW9uIHNob3dEZXRhaWxzKGQpe1xuXHRjbGVhclRpbWVvdXQodGltZW91dEhpZGUpO1xuXHR2YXIgaHRtbCA9IGA8Yj5GaXNoZXJ5OiA8L2I+JHtkLm5hbWV9PGJyIC8+PGI+U3BlY2llczwvYj46ICR7ZC5zcGVjaWVzfSB8IDxiPkdlYXI8L2I+OiAke2QuZ2Vhcn0gfCA8Yj5BcmVhPC9iPjogJHtkLmFyZWF9IHwgPGI+TnVtYmVyIG9mIHBlcm1pdHM8L2I+OiAke2QuY291bnR9YDtcblx0dmFyIGRldGFpbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGV0YWlsLWRpdicpO1xuXHRkZXRhaWxzLnN0eWxlLm9wYWNpdHkgPSAwO1xuXHR0aW1lb3V0U2hvdyA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRkZXRhaWxzLmlubmVySFRNTCA9IGh0bWw7XG5cdFx0ZGV0YWlscy5zdHlsZS5vcGFjaXR5ID0gMTtcblx0fSwyNTApO1xufVxuZnVuY3Rpb24gaGlkZURldGFpbHMoKXtcblx0Y2xlYXJUaW1lb3V0KHRpbWVvdXRTaG93KTtcblx0dmFyIGRldGFpbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGV0YWlsLWRpdicpO1xuXHRkZXRhaWxzLnN0eWxlLm9wYWNpdHkgPSAwO1xuXHR0aW1lb3V0SGlkZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRkZXRhaWxzLmlubmVySFRNTCA9ICc8ZW0+U2VsZWN0IGEgZmlzaGVyeSBvciBjeWNsZSB0aHJvdWdoIGZvciBkZXRhaWxzLjwvZW0+Jztcblx0XHRkZXRhaWxzLnN0eWxlLm9wYWNpdHkgPSAxO1xuXHR9LDI1MCk7XG59XG5mdW5jdGlvbiBkYXRhT3ZlcmxheSgpe1xuXHR2YXIgb3ZlcmxheURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRvdmVybGF5RGl2LmlkID0gJ292ZXJsYXktZGl2Jztcblx0dmFyIGRldGFpbFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0ZGV0YWlsV3JhcHBlci5pZCA9ICdkZXRhaWwtd3JhcHBlcic7XG5cdHZhciBkZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdGRldGFpbHMuaWQgPSAnZGV0YWlsLWRpdic7XG5cdGRldGFpbHMuaW5uZXJIVE1MID0gJzxlbT5TZWxlY3QgYSBmaXNoZXJ5IG9yIGN5Y2xlIHRocm91Z2ggZm9yIGRldGFpbHMuPC9lbT4nO1xuXHRkZXRhaWxXcmFwcGVyLmFwcGVuZENoaWxkKGRldGFpbHMpO1xuXHRvdmVybGF5RGl2LmFwcGVuZENoaWxkKGRldGFpbFdyYXBwZXIpO1xuXHR2YXIgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cdGJ0bi5pZCA9ICdjeWNsZS10aHJvdWdoLWJ0bic7XG5cdGJ0bi5pbm5lckhUTUwgPSAnTmV4dCc7XG5cdG92ZXJsYXlEaXYuYXBwZW5kQ2hpbGQoYnRuKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcC1vdXRlci1jb250YWluZXInKS5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLG92ZXJsYXlEaXYuaW5uZXJIVE1MKTtcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N5Y2xlLXRocm91Z2gtYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjeWNsZU5leHQpO1xufVxuXG5mdW5jdGlvbiBjeWNsZU5leHQoKXtcblx0Y3ljbGVJbmRleCsrO1xuXHRpZiAoIGN5Y2xlSW5kZXggPT09IG5vZGVzLmxlbmd0aCApIHtcblx0XHRjeWNsZUluZGV4ID0gMDtcblx0fVxuXHRhY3RpdmF0ZS5jYWxsKG5vZGVzW2N5Y2xlSW5kZXhdLCdidG4nKTtcbn1cblxuZnVuY3Rpb24gY2F0YWxvZ05vZGVzKCl7XG5cdG5vZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2FsYXNrYS1tYXAgLm5vZGVzIGNpcmNsZScpO1xufSIsIi8qXG4gKiBjbGFzc0xpc3QuanM6IENyb3NzLWJyb3dzZXIgZnVsbCBlbGVtZW50LmNsYXNzTGlzdCBpbXBsZW1lbnRhdGlvbi5cbiAqIDEuMi4yMDE3MTIxMFxuICpcbiAqIEJ5IEVsaSBHcmV5LCBodHRwOi8vZWxpZ3JleS5jb21cbiAqIExpY2Vuc2U6IERlZGljYXRlZCB0byB0aGUgcHVibGljIGRvbWFpbi5cbiAqICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4gKi9cblxuLypnbG9iYWwgc2VsZiwgZG9jdW1lbnQsIERPTUV4Y2VwdGlvbiAqL1xuXG4vKiEgQHNvdXJjZSBodHRwOi8vcHVybC5lbGlncmV5LmNvbS9naXRodWIvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL2NsYXNzTGlzdC5qcyAqL1xuXG5leHBvcnQgY29uc3QgQ2xhc3NMaXN0ID0gKGZ1bmN0aW9uKCl7XG5cblx0aWYgKFwiZG9jdW1lbnRcIiBpbiBzZWxmKSB7XG5cblx0Ly8gRnVsbCBwb2x5ZmlsbCBmb3IgYnJvd3NlcnMgd2l0aCBubyBjbGFzc0xpc3Qgc3VwcG9ydFxuXHQvLyBJbmNsdWRpbmcgSUUgPCBFZGdlIG1pc3NpbmcgU1ZHRWxlbWVudC5jbGFzc0xpc3Rcblx0aWYgKFxuXHRcdCAgICEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKSkgXG5cdFx0fHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TXG5cdFx0JiYgIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpKVxuXHQpIHtcblxuXHQoZnVuY3Rpb24gKHZpZXcpIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpZiAoISgnRWxlbWVudCcgaW4gdmlldykpIHJldHVybjtcblxuXHR2YXJcblx0XHQgIGNsYXNzTGlzdFByb3AgPSBcImNsYXNzTGlzdFwiXG5cdFx0LCBwcm90b1Byb3AgPSBcInByb3RvdHlwZVwiXG5cdFx0LCBlbGVtQ3RyUHJvdG8gPSB2aWV3LkVsZW1lbnRbcHJvdG9Qcm9wXVxuXHRcdCwgb2JqQ3RyID0gT2JqZWN0XG5cdFx0LCBzdHJUcmltID0gU3RyaW5nW3Byb3RvUHJvcF0udHJpbSB8fCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCBcIlwiKTtcblx0XHR9XG5cdFx0LCBhcnJJbmRleE9mID0gQXJyYXlbcHJvdG9Qcm9wXS5pbmRleE9mIHx8IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXJcblx0XHRcdFx0ICBpID0gMFxuXHRcdFx0XHQsIGxlbiA9IHRoaXMubGVuZ3RoXG5cdFx0XHQ7XG5cdFx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkge1xuXHRcdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gLTE7XG5cdFx0fVxuXHRcdC8vIFZlbmRvcnM6IHBsZWFzZSBhbGxvdyBjb250ZW50IGNvZGUgdG8gaW5zdGFudGlhdGUgRE9NRXhjZXB0aW9uc1xuXHRcdCwgRE9NRXggPSBmdW5jdGlvbiAodHlwZSwgbWVzc2FnZSkge1xuXHRcdFx0dGhpcy5uYW1lID0gdHlwZTtcblx0XHRcdHRoaXMuY29kZSA9IERPTUV4Y2VwdGlvblt0eXBlXTtcblx0XHRcdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG5cdFx0fVxuXHRcdCwgY2hlY2tUb2tlbkFuZEdldEluZGV4ID0gZnVuY3Rpb24gKGNsYXNzTGlzdCwgdG9rZW4pIHtcblx0XHRcdGlmICh0b2tlbiA9PT0gXCJcIikge1xuXHRcdFx0XHR0aHJvdyBuZXcgRE9NRXgoXG5cdFx0XHRcdFx0ICBcIlNZTlRBWF9FUlJcIlxuXHRcdFx0XHRcdCwgXCJUaGUgdG9rZW4gbXVzdCBub3QgYmUgZW1wdHkuXCJcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGlmICgvXFxzLy50ZXN0KHRva2VuKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRE9NRXgoXG5cdFx0XHRcdFx0ICBcIklOVkFMSURfQ0hBUkFDVEVSX0VSUlwiXG5cdFx0XHRcdFx0LCBcIlRoZSB0b2tlbiBtdXN0IG5vdCBjb250YWluIHNwYWNlIGNoYXJhY3RlcnMuXCJcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBhcnJJbmRleE9mLmNhbGwoY2xhc3NMaXN0LCB0b2tlbik7XG5cdFx0fVxuXHRcdCwgQ2xhc3NMaXN0ID0gZnVuY3Rpb24gKGVsZW0pIHtcblx0XHRcdHZhclxuXHRcdFx0XHQgIHRyaW1tZWRDbGFzc2VzID0gc3RyVHJpbS5jYWxsKGVsZW0uZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIilcblx0XHRcdFx0LCBjbGFzc2VzID0gdHJpbW1lZENsYXNzZXMgPyB0cmltbWVkQ2xhc3Nlcy5zcGxpdCgvXFxzKy8pIDogW11cblx0XHRcdFx0LCBpID0gMFxuXHRcdFx0XHQsIGxlbiA9IGNsYXNzZXMubGVuZ3RoXG5cdFx0XHQ7XG5cdFx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdHRoaXMucHVzaChjbGFzc2VzW2ldKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLnRvU3RyaW5nKCkpO1xuXHRcdFx0fTtcblx0XHR9XG5cdFx0LCBjbGFzc0xpc3RQcm90byA9IENsYXNzTGlzdFtwcm90b1Byb3BdID0gW11cblx0XHQsIGNsYXNzTGlzdEdldHRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBuZXcgQ2xhc3NMaXN0KHRoaXMpO1xuXHRcdH1cblx0O1xuXHQvLyBNb3N0IERPTUV4Y2VwdGlvbiBpbXBsZW1lbnRhdGlvbnMgZG9uJ3QgYWxsb3cgY2FsbGluZyBET01FeGNlcHRpb24ncyB0b1N0cmluZygpXG5cdC8vIG9uIG5vbi1ET01FeGNlcHRpb25zLiBFcnJvcidzIHRvU3RyaW5nKCkgaXMgc3VmZmljaWVudCBoZXJlLlxuXHRET01FeFtwcm90b1Byb3BdID0gRXJyb3JbcHJvdG9Qcm9wXTtcblx0Y2xhc3NMaXN0UHJvdG8uaXRlbSA9IGZ1bmN0aW9uIChpKSB7XG5cdFx0cmV0dXJuIHRoaXNbaV0gfHwgbnVsbDtcblx0fTtcblx0Y2xhc3NMaXN0UHJvdG8uY29udGFpbnMgPSBmdW5jdGlvbiAodG9rZW4pIHtcblx0XHRyZXR1cm4gfmNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbiArIFwiXCIpO1xuXHR9O1xuXHRjbGFzc0xpc3RQcm90by5hZGQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyXG5cdFx0XHQgIHRva2VucyA9IGFyZ3VtZW50c1xuXHRcdFx0LCBpID0gMFxuXHRcdFx0LCBsID0gdG9rZW5zLmxlbmd0aFxuXHRcdFx0LCB0b2tlblxuXHRcdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0XHQ7XG5cdFx0ZG8ge1xuXHRcdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdFx0aWYgKCF+Y2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSkge1xuXHRcdFx0XHR0aGlzLnB1c2godG9rZW4pO1xuXHRcdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdFx0aWYgKHVwZGF0ZWQpIHtcblx0XHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuXHRcdH1cblx0fTtcblx0Y2xhc3NMaXN0UHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdHZhclxuXHRcdFx0ICB0b2tlbnMgPSBhcmd1bWVudHNcblx0XHRcdCwgaSA9IDBcblx0XHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHRcdCwgdG9rZW5cblx0XHRcdCwgdXBkYXRlZCA9IGZhbHNlXG5cdFx0XHQsIGluZGV4XG5cdFx0O1xuXHRcdGRvIHtcblx0XHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHRcdHdoaWxlICh+aW5kZXgpIHtcblx0XHRcdFx0dGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHRcdFx0aW5kZXggPSBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR3aGlsZSAoKytpIDwgbCk7XG5cblx0XHRpZiAodXBkYXRlZCkge1xuXHRcdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdFx0fVxuXHR9O1xuXHRjbGFzc0xpc3RQcm90by50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4sIGZvcmNlKSB7XG5cdFx0dmFyXG5cdFx0XHQgIHJlc3VsdCA9IHRoaXMuY29udGFpbnModG9rZW4pXG5cdFx0XHQsIG1ldGhvZCA9IHJlc3VsdCA/XG5cdFx0XHRcdGZvcmNlICE9PSB0cnVlICYmIFwicmVtb3ZlXCJcblx0XHRcdDpcblx0XHRcdFx0Zm9yY2UgIT09IGZhbHNlICYmIFwiYWRkXCJcblx0XHQ7XG5cblx0XHRpZiAobWV0aG9kKSB7XG5cdFx0XHR0aGlzW21ldGhvZF0odG9rZW4pO1xuXHRcdH1cblxuXHRcdGlmIChmb3JjZSA9PT0gdHJ1ZSB8fCBmb3JjZSA9PT0gZmFsc2UpIHtcblx0XHRcdHJldHVybiBmb3JjZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuICFyZXN1bHQ7XG5cdFx0fVxuXHR9O1xuXHRjbGFzc0xpc3RQcm90by5yZXBsYWNlID0gZnVuY3Rpb24gKHRva2VuLCByZXBsYWNlbWVudF90b2tlbikge1xuXHRcdHZhciBpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0b2tlbiArIFwiXCIpO1xuXHRcdGlmICh+aW5kZXgpIHtcblx0XHRcdHRoaXMuc3BsaWNlKGluZGV4LCAxLCByZXBsYWNlbWVudF90b2tlbik7XG5cdFx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0XHR9XG5cdH1cblx0Y2xhc3NMaXN0UHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuam9pbihcIiBcIik7XG5cdH07XG5cblx0aWYgKG9iakN0ci5kZWZpbmVQcm9wZXJ0eSkge1xuXHRcdHZhciBjbGFzc0xpc3RQcm9wRGVzYyA9IHtcblx0XHRcdCAgZ2V0OiBjbGFzc0xpc3RHZXR0ZXJcblx0XHRcdCwgZW51bWVyYWJsZTogdHJ1ZVxuXHRcdFx0LCBjb25maWd1cmFibGU6IHRydWVcblx0XHR9O1xuXHRcdHRyeSB7XG5cdFx0XHRvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XG5cdFx0fSBjYXRjaCAoZXgpIHsgLy8gSUUgOCBkb2Vzbid0IHN1cHBvcnQgZW51bWVyYWJsZTp0cnVlXG5cdFx0XHQvLyBhZGRpbmcgdW5kZWZpbmVkIHRvIGZpZ2h0IHRoaXMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2lzc3Vlcy8zNlxuXHRcdFx0Ly8gbW9kZXJuaWUgSUU4LU1TVzcgbWFjaGluZSBoYXMgSUU4IDguMC42MDAxLjE4NzAyIGFuZCBpcyBhZmZlY3RlZFxuXHRcdFx0aWYgKGV4Lm51bWJlciA9PT0gdW5kZWZpbmVkIHx8IGV4Lm51bWJlciA9PT0gLTB4N0ZGNUVDNTQpIHtcblx0XHRcdFx0Y2xhc3NMaXN0UHJvcERlc2MuZW51bWVyYWJsZSA9IGZhbHNlO1xuXHRcdFx0XHRvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2UgaWYgKG9iakN0cltwcm90b1Byb3BdLl9fZGVmaW5lR2V0dGVyX18pIHtcblx0XHRlbGVtQ3RyUHJvdG8uX19kZWZpbmVHZXR0ZXJfXyhjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RHZXR0ZXIpO1xuXHR9XG5cblx0fShzZWxmKSk7XG5cblx0fVxuXG5cdC8vIFRoZXJlIGlzIGZ1bGwgb3IgcGFydGlhbCBuYXRpdmUgY2xhc3NMaXN0IHN1cHBvcnQsIHNvIGp1c3QgY2hlY2sgaWYgd2UgbmVlZFxuXHQvLyB0byBub3JtYWxpemUgdGhlIGFkZC9yZW1vdmUgYW5kIHRvZ2dsZSBBUElzLlxuXG5cdChmdW5jdGlvbiAoKSB7XG5cdFx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0XHR2YXIgdGVzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKTtcblxuXHRcdHRlc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjMVwiLCBcImMyXCIpO1xuXG5cdFx0Ly8gUG9seWZpbGwgZm9yIElFIDEwLzExIGFuZCBGaXJlZm94IDwyNiwgd2hlcmUgY2xhc3NMaXN0LmFkZCBhbmRcblx0XHQvLyBjbGFzc0xpc3QucmVtb3ZlIGV4aXN0IGJ1dCBzdXBwb3J0IG9ubHkgb25lIGFyZ3VtZW50IGF0IGEgdGltZS5cblx0XHRpZiAoIXRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImMyXCIpKSB7XG5cdFx0XHR2YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24obWV0aG9kKSB7XG5cdFx0XHRcdHZhciBvcmlnaW5hbCA9IERPTVRva2VuTGlzdC5wcm90b3R5cGVbbWV0aG9kXTtcblxuXHRcdFx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih0b2tlbikge1xuXHRcdFx0XHRcdHZhciBpLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuXG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdFx0XHR0b2tlbiA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdFx0XHRcdG9yaWdpbmFsLmNhbGwodGhpcywgdG9rZW4pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdH07XG5cdFx0XHRjcmVhdGVNZXRob2QoJ2FkZCcpO1xuXHRcdFx0Y3JlYXRlTWV0aG9kKCdyZW1vdmUnKTtcblx0XHR9XG5cblx0XHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYzNcIiwgZmFsc2UpO1xuXG5cdFx0Ly8gUG9seWZpbGwgZm9yIElFIDEwIGFuZCBGaXJlZm94IDwyNCwgd2hlcmUgY2xhc3NMaXN0LnRvZ2dsZSBkb2VzIG5vdFxuXHRcdC8vIHN1cHBvcnQgdGhlIHNlY29uZCBhcmd1bWVudC5cblx0XHRpZiAodGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYzNcIikpIHtcblx0XHRcdHZhciBfdG9nZ2xlID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGU7XG5cblx0XHRcdERPTVRva2VuTGlzdC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24odG9rZW4sIGZvcmNlKSB7XG5cdFx0XHRcdGlmICgxIGluIGFyZ3VtZW50cyAmJiAhdGhpcy5jb250YWlucyh0b2tlbikgPT09ICFmb3JjZSkge1xuXHRcdFx0XHRcdHJldHVybiBmb3JjZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gX3RvZ2dsZS5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdH1cblxuXHRcdC8vIHJlcGxhY2UoKSBwb2x5ZmlsbFxuXHRcdGlmICghKFwicmVwbGFjZVwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpLmNsYXNzTGlzdCkpIHtcblx0XHRcdERPTVRva2VuTGlzdC5wcm90b3R5cGUucmVwbGFjZSA9IGZ1bmN0aW9uICh0b2tlbiwgcmVwbGFjZW1lbnRfdG9rZW4pIHtcblx0XHRcdFx0dmFyXG5cdFx0XHRcdFx0ICB0b2tlbnMgPSB0aGlzLnRvU3RyaW5nKCkuc3BsaXQoXCIgXCIpXG5cdFx0XHRcdFx0LCBpbmRleCA9IHRva2Vucy5pbmRleE9mKHRva2VuICsgXCJcIilcblx0XHRcdFx0O1xuXHRcdFx0XHRpZiAofmluZGV4KSB7XG5cdFx0XHRcdFx0dG9rZW5zID0gdG9rZW5zLnNsaWNlKGluZGV4KTtcblx0XHRcdFx0XHR0aGlzLnJlbW92ZS5hcHBseSh0aGlzLCB0b2tlbnMpO1xuXHRcdFx0XHRcdHRoaXMuYWRkKHJlcGxhY2VtZW50X3Rva2VuKTtcblx0XHRcdFx0XHR0aGlzLmFkZC5hcHBseSh0aGlzLCB0b2tlbnMuc2xpY2UoMSkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGVzdEVsZW1lbnQgPSBudWxsO1xuXHR9KCkpO1xuXG5cdH1cbn0pKCk7XG4iLCIvLyBmb3JFYWNoIHBvbHlmaWxsXG4vLyBQcm9kdWN0aW9uIHN0ZXBzIG9mIEVDTUEtMjYyLCBFZGl0aW9uIDUsIDE1LjQuNC4xOFxuLy8gUmVmZXJlbmNlOiBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDE1LjQuNC4xOFxuZXhwb3J0IGNvbnN0IEZvckVhY2ggPSAoZnVuY3Rpb24oKXtcbiAgaWYgKCFBcnJheS5wcm90b3R5cGUuZm9yRWFjaCkge1xuXG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjay8qLCB0aGlzQXJnKi8pIHtcblxuICAgICAgdmFyIFQsIGs7XG5cbiAgICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIDEuIExldCBPIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0b09iamVjdCgpIHBhc3NpbmcgdGhlXG4gICAgICAvLyB8dGhpc3wgdmFsdWUgYXMgdGhlIGFyZ3VtZW50LlxuICAgICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XG5cbiAgICAgIC8vIDIuIExldCBsZW5WYWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldCgpIGludGVybmFsXG4gICAgICAvLyBtZXRob2Qgb2YgTyB3aXRoIHRoZSBhcmd1bWVudCBcImxlbmd0aFwiLlxuICAgICAgLy8gMy4gTGV0IGxlbiBiZSB0b1VpbnQzMihsZW5WYWx1ZSkuXG4gICAgICB2YXIgbGVuID0gTy5sZW5ndGggPj4+IDA7XG5cbiAgICAgIC8vIDQuIElmIGlzQ2FsbGFibGUoY2FsbGJhY2spIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uIFxuICAgICAgLy8gU2VlOiBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3g5LjExXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoY2FsbGJhY2sgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIDUuIElmIHRoaXNBcmcgd2FzIHN1cHBsaWVkLCBsZXQgVCBiZSB0aGlzQXJnOyBlbHNlIGxldFxuICAgICAgLy8gVCBiZSB1bmRlZmluZWQuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgVCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIH1cblxuICAgICAgLy8gNi4gTGV0IGsgYmUgMC5cbiAgICAgIGsgPSAwO1xuXG4gICAgICAvLyA3LiBSZXBlYXQgd2hpbGUgayA8IGxlbi5cbiAgICAgIHdoaWxlIChrIDwgbGVuKSB7XG5cbiAgICAgICAgdmFyIGtWYWx1ZTtcblxuICAgICAgICAvLyBhLiBMZXQgUGsgYmUgVG9TdHJpbmcoaykuXG4gICAgICAgIC8vICAgIFRoaXMgaXMgaW1wbGljaXQgZm9yIExIUyBvcGVyYW5kcyBvZiB0aGUgaW4gb3BlcmF0b3IuXG4gICAgICAgIC8vIGIuIExldCBrUHJlc2VudCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEhhc1Byb3BlcnR5XG4gICAgICAgIC8vICAgIGludGVybmFsIG1ldGhvZCBvZiBPIHdpdGggYXJndW1lbnQgUGsuXG4gICAgICAgIC8vICAgIFRoaXMgc3RlcCBjYW4gYmUgY29tYmluZWQgd2l0aCBjLlxuICAgICAgICAvLyBjLiBJZiBrUHJlc2VudCBpcyB0cnVlLCB0aGVuXG4gICAgICAgIGlmIChrIGluIE8pIHtcblxuICAgICAgICAgIC8vIGkuIExldCBrVmFsdWUgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXQgaW50ZXJuYWxcbiAgICAgICAgICAvLyBtZXRob2Qgb2YgTyB3aXRoIGFyZ3VtZW50IFBrLlxuICAgICAgICAgIGtWYWx1ZSA9IE9ba107XG5cbiAgICAgICAgICAvLyBpaS4gQ2FsbCB0aGUgQ2FsbCBpbnRlcm5hbCBtZXRob2Qgb2YgY2FsbGJhY2sgd2l0aCBUIGFzXG4gICAgICAgICAgLy8gdGhlIHRoaXMgdmFsdWUgYW5kIGFyZ3VtZW50IGxpc3QgY29udGFpbmluZyBrVmFsdWUsIGssIGFuZCBPLlxuICAgICAgICAgIGNhbGxiYWNrLmNhbGwoVCwga1ZhbHVlLCBrLCBPKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBkLiBJbmNyZWFzZSBrIGJ5IDEuXG4gICAgICAgIGsrKztcbiAgICAgIH1cbiAgICAgIC8vIDguIHJldHVybiB1bmRlZmluZWQuXG4gICAgfTtcbiAgfVxufSkoKTtcbiIsImV4cG9ydCBjb25zdCBOb2RlTGlzdEZvckVhY2ggPSAoZnVuY3Rpb24oKXtcblx0aWYgKHdpbmRvdy5Ob2RlTGlzdCAmJiAhTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2gpIHtcblx0ICAgIE5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG5cdCAgICAgICAgdGhpc0FyZyA9IHRoaXNBcmcgfHwgd2luZG93O1xuXHQgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHQgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHRoaXNbaV0sIGksIHRoaXMpO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cdH1cbn0pKCk7Il19
