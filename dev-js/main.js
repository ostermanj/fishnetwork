(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _polyfills = require("../js-exports/polyfills");

(function () {
  "use strict";

  /*var species = {
    B: "Halibut",
    C: "Sablefish",
    D: "Dungeness crab",
    E: "Hair Crab",
    F: "Freshwater fish",
    G: "Herring roe",
    H: "Herring (food/bait)",
    I: "Ling cod",
    J: "Geoduck clams",
    K: "King crab",
    L: "Herring spawn on kelp",
    M: "Misc. saltwater finfish",
    N: "Snails",
    O: "Octopus/squid",
    P: "Shrimp",
    Q: "Sea cucumber",
    R: "Clams",
    S: "Salmon",
    T: "Tanner crab",
    TB: "Tanner Bairdi crab",
    U: "Sea urchin",
    W: "Scallops",
    Y: "Rockfish"
  };
   var gear = {"1":"PURSE SEINE","2":"VESSEL TO 80'","4":"SET GILLNET","5":"HAND TROLL","6":"LONGLINE VESSEL UNDER 60'","7":"OTTER TRAWL","8":"FISH WHEEL","9":"POT GEAR VESSEL UNDER 60'","10":"RING NET","11":"DIVING GEAR","12":"DIVE/HAND PICK","17":"BEAM TRAWL","18":"SHOVEL","21":"POUND","23":"MECHANICAL DIGGER","25":"DINGLEBAR TROLL","26":"MECHANICAL JIG","34":"GILLNET","37":"PAIR TRAWL","61":"LONGLINE VESSEL 60' OR OVER","77":"GILLNET","91":"POT GEAR VESSEL 60' OR OVER"};
   var regions = {"A":"SOUTHEAST","B":"STATEWIDE","D":"YAKUTAT","E":"PRINCE WILLIAM SOUND","J":"WESTWARD","L":"CHIGNIK","M":"ALASKA PENINSULA","Q":"BERING SEA","T":"BRISTOL BAY","X":"KOTZEBUE","H":"COOK INLET","S":"SECURITY COVE","V":"CAPE AVINOF","Z":"NORTON SOUND","K":"KODIAK","O":"DUTCH HARBOR","OA":"ALEUTIAN CDQAPICDA","OB":"ALEUTIAN CDQBBEDC","OC":"ALEUTIAN CDQCBSFA","OD":"ALEUTIAN CDQCVRF","OE":"ALEUTIAN CDQNSEDC","OF":"ALEUTIAN CDQYDFDA","OG":"ALEUTIAN ISLANDS ACAACDC","QA":"BERING SEA CDQAPICDA","QB":"BERING SEA CDQBBEDC","QC":"BERING SEA CDQCBSFA","QD":"BERING SEA CDQCVRF","QE":"BERING SEA CDQNSEDC","QF":"BERING SEA CDQYDFDA","TA":"BRISTOL BAY CDQAPICDA","TB":"BRISTOL BAY CDQBBEDC","TC":"BRISTOL BAY CDQCBSFA","TD":"BRISTOL BAY CDQCVRF","TE":"BRISTOL BAY CDQNSEDC","TF":"BRISTOL BAY CDQYDFDA","ZE":"NORTON SOUND CDQNSEDC","ZF":"NORTON SOUND CDQYDFDA","G":"GOA","AB":"STATEWIDE","AG":"GOA","BB":"STATEWIDE","BG":"GOA","FB":"STATEWIDE","FG":"GOA","GB":"STATEWIDE","GG":"GOA","HB":"STATEWIDE","HG":"GOA","IB":"STATEWIDE","IG":"GOA","F":"ATKA/AMLIA ISLANDS","R":"ADAK","AFW":"FEDERAL WATERS","ASW":"STATE WATERS","BFW":"FEDERAL WATERS","BSW":"STATE WATERS"};
  */

  var fishNodes = null,
      fishLinks = null,
      margin = { // expressed as percentages
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
      width = 100 - margin.right - margin.left,
      height = 100 - margin.top - margin.bottom;

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var rScale = d3.scaleLog().range([0.5, 5]);

  var simulation = d3.forceSimulation().force("link", d3.forceLink()).force("charge", d3.forceManyBody()).force("center", d3.forceCenter(width / 2, height / 2));

  d3.csv('matrix-headers.csv', function (data) {
    console.log(data);
    fishLinks = data;
    goGate();
  });
  d3.csv('fisheries-nodes.csv', function (data) {
    console.log(data);
    data.forEach(function (each) {
      for (var key in each) {
        if (each.hasOwnProperty(key)) {
          if (!isNaN(+each[key])) {
            each[key] = +each[key];
          }
        }
      }
    });
    fishNodes = data;
    goGate();
  });

  function goGate() {
    if (fishNodes !== null && fishLinks !== null) {
      go();
    } else {
      return;
    }
  }

  var newLinks = [],
      network = {};

  function go() {
    function isMatch(key) {
      return fishNodes.find(function (obj) {
        return obj.id === key;
      });
    }
    fishLinks.forEach(function (each, i) {
      for (var key in each) {
        if (each.hasOwnProperty(key)) {
          var match = isMatch(key);
          var index = fishNodes.indexOf(match);
          if (index !== i && each[key] !== "0") {
            // if source and target are not the same
            newLinks.push({
              source: i,
              target: index,
              value: +each[key]
            });
          }
        }
      }
    }); // end forEach
    network.nodes = fishNodes;
    network.links = newLinks;
    console.log(network);
    render(network);
  } // end go()

  function render(network) {
    /* if (true){
       return;
     }*/

    rScale.domain(d3.extent(network.nodes, function (d) {
      return d.count;
    }));

    var radius = 2;

    var svg = d3.select('body').append('svg').attr('width', '100%').attr('xmlns', 'http://www.w3.org/2000/svg').attr('version', '1.1').attr('viewBox', '0 0 100 100').append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var link = svg.append("g").attr("class", "links").selectAll("line").data(network.links).enter().append("line").attr("stroke-width", function (d) {
      return Math.sqrt(d.value) / 20;
    });

    var node = svg.append("g").attr("class", "nodes").selectAll("circle").data(network.nodes).enter().append("circle").attr("r", function (d) {
      return rScale(d.count);
    }).attr("fill", function (d) {
      return color(d.cluster);
    }).call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

    node.append("title").text(function (d) {
      return d.id;
    });

    simulation.nodes(network.nodes).on("tick", ticked);

    simulation.force("link").links(network.links).strength(1);

    function ticked() {
      link.attr("x1", function (d) {
        return d.source.x;
      }).attr("y1", function (d) {
        return d.source.y;
      }).attr("x2", function (d) {
        return d.target.x;
      }).attr("y2", function (d) {
        return d.target.y;
      });

      node.attr("cx", function (d) {
        d.x = Math.max(radius, Math.min(width - radius, d.x));
        return d.x;
      }).attr("cy", function (d) {
        d.y = Math.max(radius, Math.min(height - radius, d.y));
        return d.y;
      });
    }
  } // end render()
  function dragstarted(d) {
    if (!d3.event.active) {
      simulation.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) {
      simulation.alphaTarget(0);
    }
    d.fx = null;
    d.fy = null;
  }
})(); /* exported arrayFind */

},{"../js-exports/polyfills":2}],2:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * SVG focus 
 * Copyright(c) 2017, John Osterman
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
 * associated documentation files (the "Software"), to deal in the Software without restriction, including 
 * without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the 
 * following conditions:

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO 
 * EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER 
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE 
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// IE/Edge (perhaps others) does not allow programmatic focusing of SVG Elements (via `focus()`). Same for `blur()`.

var SVGFocus = exports.SVGFocus = function () {
  if ('focus' in SVGElement.prototype === false) {
    SVGElement.prototype.focus = HTMLElement.prototype.focus;
  }
  if ('blur' in SVGElement.prototype === false) {
    SVGElement.prototype.blur = HTMLElement.prototype.blur;
  }
}();

/**
 * innerHTML property for SVGElement
 * Copyright(c) 2010, Jeff Schiller
 *
 * Licensed under the Apache License, Version 2
 *
 * Works in a SVG document in Chrome 6+, Safari 5+, Firefox 4+ and IE9+.
 * Works in a HTML5 document in Chrome 7+, Firefox 4+ and IE9+.
 * Does not work in Opera since it doesn't support the SVGElement interface yet.
 *
 * I haven't decided on the best name for this property - thus the duplication.
 */
// edited by John Osterman to declare the variable `sXML`, which was referenced without being declared
// which failed silently in implicit strict mode of an export

// most browsers allow setting innerHTML of svg elements but IE does not (not an HTML element)
// this polyfill provides that. necessary for d3 method `.html()` on svg elements

var SVGInnerHTML = exports.SVGInnerHTML = function () {
  var serializeXML = function serializeXML(node, output) {
    var nodeType = node.nodeType;
    if (nodeType == 3) {
      // TEXT nodes.
      // Replace special XML characters with their entities.
      output.push(node.textContent.replace(/&/, '&amp;').replace(/</, '&lt;').replace('>', '&gt;'));
    } else if (nodeType == 1) {
      // ELEMENT nodes.
      // Serialize Element nodes.
      output.push('<', node.tagName);
      if (node.hasAttributes()) {
        var attrMap = node.attributes;
        for (var i = 0, len = attrMap.length; i < len; ++i) {
          var attrNode = attrMap.item(i);
          output.push(' ', attrNode.name, '=\'', attrNode.value, '\'');
        }
      }
      if (node.hasChildNodes()) {
        output.push('>');
        var childNodes = node.childNodes;
        for (var i = 0, len = childNodes.length; i < len; ++i) {
          serializeXML(childNodes.item(i), output);
        }
        output.push('</', node.tagName, '>');
      } else {
        output.push('/>');
      }
    } else if (nodeType == 8) {
      // TODO(codedread): Replace special characters with XML entities?
      output.push('<!--', node.nodeValue, '-->');
    } else {
      // TODO: Handle CDATA nodes.
      // TODO: Handle ENTITY nodes.
      // TODO: Handle DOCUMENT nodes.
      throw 'Error serializing XML. Unhandled node of type: ' + nodeType;
    }
  };
  // The innerHTML DOM property for SVGElement.
  if ('innerHTML' in SVGElement.prototype === false) {
    Object.defineProperty(SVGElement.prototype, 'innerHTML', {
      get: function get() {
        var output = [];
        var childNode = this.firstChild;
        while (childNode) {
          serializeXML(childNode, output);
          childNode = childNode.nextSibling;
        }
        return output.join('');
      },
      set: function set(markupText) {
        console.log(this);
        // Wipe out the current contents of the element.
        while (this.firstChild) {
          this.removeChild(this.firstChild);
        }

        try {
          // Parse the markup into valid nodes.
          var dXML = new DOMParser();
          dXML.async = false;
          // Wrap the markup into a SVG node to ensure parsing works.
          console.log(markupText);
          var sXML = '<svg xmlns="http://www.w3.org/2000/svg">' + markupText + '</svg>';
          console.log(sXML);
          var svgDocElement = dXML.parseFromString(sXML, 'text/xml').documentElement;

          // Now take each node, import it and append to this element.
          var childNode = svgDocElement.firstChild;
          while (childNode) {
            this.appendChild(this.ownerDocument.importNode(childNode, true));
            childNode = childNode.nextSibling;
          }
        } catch (e) {
          throw new Error('Error parsing XML string');
        };
      }
    });

    // The innerSVG DOM property for SVGElement.
    Object.defineProperty(SVGElement.prototype, 'innerSVG', {
      get: function get() {
        return this.innerHTML;
      },
      set: function set(markupText) {
        this.innerHTML = markupText;
      }
    });
  }
}();

// https://tc39.github.io/ecma262/#sec-array.prototype.find
var arrayFind = exports.arrayFind = function () {
  if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
      value: function value(predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1];

        // 5. Let k be 0.
        var k = 0;

        // 6. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
          // d. If testResult is true, return kValue.
          var kValue = o[k];
          if (predicate.call(thisArg, kValue, k, o)) {
            return kValue;
          }
          // e. Increase k by 1.
          k++;
        }

        // 7. Return undefined.
        return undefined;
      }
    });
  }
}();

// Copyright (C) 2011-2012 Software Languages Lab, Vrije Universiteit Brussel
// This code is dual-licensed under both the Apache License and the MPL

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is a shim for the ES-Harmony reflection module
 *
 * The Initial Developer of the Original Code is
 * Tom Van Cutsem, Vrije Universiteit Brussel.
 * Portions created by the Initial Developer are Copyright (C) 2011-2012
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 */

// ----------------------------------------------------------------------------

// This file is a polyfill for the upcoming ECMAScript Reflect API,
// including support for Proxies. See the draft specification at:
// http://wiki.ecmascript.org/doku.php?id=harmony:reflect_api
// http://wiki.ecmascript.org/doku.php?id=harmony:direct_proxies

// For an implementation of the Handler API, see handlers.js, which implements:
// http://wiki.ecmascript.org/doku.php?id=harmony:virtual_object_api

// This implementation supersedes the earlier polyfill at:
// code.google.com/p/es-lab/source/browse/trunk/src/proxies/DirectProxies.js

// This code was tested on tracemonkey / Firefox 12
//  (and should run fine on older Firefox versions starting with FF4)
// The code also works correctly on
//   v8 --harmony_proxies --harmony_weakmaps (v3.6.5.1)

// Language Dependencies:
//  - ECMAScript 5/strict
//  - "old" (i.e. non-direct) Harmony Proxies
//  - Harmony WeakMaps
// Patches:
//  - Object.{freeze,seal,preventExtensions}
//  - Object.{isFrozen,isSealed,isExtensible}
//  - Object.getPrototypeOf
//  - Object.keys
//  - Object.prototype.valueOf
//  - Object.prototype.isPrototypeOf
//  - Object.prototype.toString
//  - Object.prototype.hasOwnProperty
//  - Object.getOwnPropertyDescriptor
//  - Object.defineProperty
//  - Object.defineProperties
//  - Object.getOwnPropertyNames
//  - Object.getOwnPropertySymbols
//  - Object.getPrototypeOf
//  - Object.setPrototypeOf
//  - Object.assign
//  - Function.prototype.toString
//  - Date.prototype.toString
//  - Array.isArray
//  - Array.prototype.concat
//  - Proxy
// Adds new globals:
//  - Reflect

// Direct proxies can be created via Proxy(target, handler)

// ----------------------------------------------------------------------------

var reflect = exports.reflect = function (global) {
  // function-as-module pattern
  "use strict";

  // === Direct Proxies: Invariant Enforcement ===

  // Direct proxies build on non-direct proxies by automatically wrapping
  // all user-defined proxy handlers in a Validator handler that checks and
  // enforces ES5 invariants.

  // A direct proxy is a proxy for an existing object called the target object.

  // A Validator handler is a wrapper for a target proxy handler H.
  // The Validator forwards all operations to H, but additionally
  // performs a number of integrity checks on the results of some traps,
  // to make sure H does not violate the ES5 invariants w.r.t. non-configurable
  // properties and non-extensible, sealed or frozen objects.

  // For each property that H exposes as own, non-configurable
  // (e.g. by returning a descriptor from a call to getOwnPropertyDescriptor)
  // the Validator handler defines those properties on the target object.
  // When the proxy becomes non-extensible, also configurable own properties
  // are checked against the target.
  // We will call properties that are defined on the target object
  // "fixed properties".

  // We will name fixed non-configurable properties "sealed properties".
  // We will name fixed non-configurable non-writable properties "frozen
  // properties".

  // The Validator handler upholds the following invariants w.r.t. non-configurability:
  // - getOwnPropertyDescriptor cannot report sealed properties as non-existent
  // - getOwnPropertyDescriptor cannot report incompatible changes to the
  //   attributes of a sealed property (e.g. reporting a non-configurable
  //   property as configurable, or reporting a non-configurable, non-writable
  //   property as writable)
  // - getPropertyDescriptor cannot report sealed properties as non-existent
  // - getPropertyDescriptor cannot report incompatible changes to the
  //   attributes of a sealed property. It _can_ report incompatible changes
  //   to the attributes of non-own, inherited properties.
  // - defineProperty cannot make incompatible changes to the attributes of
  //   sealed properties
  // - deleteProperty cannot report a successful deletion of a sealed property
  // - hasOwn cannot report a sealed property as non-existent
  // - has cannot report a sealed property as non-existent
  // - get cannot report inconsistent values for frozen data
  //   properties, and must report undefined for sealed accessors with an
  //   undefined getter
  // - set cannot report a successful assignment for frozen data
  //   properties or sealed accessors with an undefined setter.
  // - get{Own}PropertyNames lists all sealed properties of the target.
  // - keys lists all enumerable sealed properties of the target.
  // - enumerate lists all enumerable sealed properties of the target.
  // - if a property of a non-extensible proxy is reported as non-existent,
  //   then it must forever be reported as non-existent. This applies to
  //   own and inherited properties and is enforced in the
  //   deleteProperty, get{Own}PropertyDescriptor, has{Own},
  //   get{Own}PropertyNames, keys and enumerate traps

  // Violation of any of these invariants by H will result in TypeError being
  // thrown.

  // Additionally, once Object.preventExtensions, Object.seal or Object.freeze
  // is invoked on the proxy, the set of own property names for the proxy is
  // fixed. Any property name that is not fixed is called a 'new' property.

  // The Validator upholds the following invariants regarding extensibility:
  // - getOwnPropertyDescriptor cannot report new properties as existent
  //   (it must report them as non-existent by returning undefined)
  // - defineProperty cannot successfully add a new property (it must reject)
  // - getOwnPropertyNames cannot list new properties
  // - hasOwn cannot report true for new properties (it must report false)
  // - keys cannot list new properties

  // Invariants currently not enforced:
  // - getOwnPropertyNames lists only own property names
  // - keys lists only enumerable own property names
  // Both traps may list more property names than are actually defined on the
  // target.

  // Invariants with regard to inheritance are currently not enforced.
  // - a non-configurable potentially inherited property on a proxy with
  //   non-mutable ancestry cannot be reported as non-existent
  // (An object with non-mutable ancestry is a non-extensible object whose
  // [[Prototype]] is either null or an object with non-mutable ancestry.)

  // Changes in Handler API compared to previous harmony:proxies, see:
  // http://wiki.ecmascript.org/doku.php?id=strawman:direct_proxies
  // http://wiki.ecmascript.org/doku.php?id=harmony:direct_proxies

  // ----------------------------------------------------------------------------

  // ---- WeakMap polyfill ----

  // TODO: find a proper WeakMap polyfill

  // define an empty WeakMap so that at least the Reflect module code
  // will work in the absence of WeakMaps. Proxy emulation depends on
  // actual WeakMaps, so will not work with this little shim.

  if (typeof WeakMap === "undefined") {
    global.WeakMap = function () {};
    global.WeakMap.prototype = {
      get: function get(k) {
        return undefined;
      },
      set: function set(k, v) {
        throw new Error("WeakMap not supported");
      }
    };
  }

  // ---- Normalization functions for property descriptors ----

  function isStandardAttribute(name) {
    return (/^(get|set|value|writable|enumerable|configurable)$/.test(name)
    );
  }

  // Adapted from ES5 section 8.10.5
  function toPropertyDescriptor(obj) {
    if (Object(obj) !== obj) {
      throw new TypeError("property descriptor should be an Object, given: " + obj);
    }
    var desc = {};
    if ('enumerable' in obj) {
      desc.enumerable = !!obj.enumerable;
    }
    if ('configurable' in obj) {
      desc.configurable = !!obj.configurable;
    }
    if ('value' in obj) {
      desc.value = obj.value;
    }
    if ('writable' in obj) {
      desc.writable = !!obj.writable;
    }
    if ('get' in obj) {
      var getter = obj.get;
      if (getter !== undefined && typeof getter !== "function") {
        throw new TypeError("property descriptor 'get' attribute must be " + "callable or undefined, given: " + getter);
      }
      desc.get = getter;
    }
    if ('set' in obj) {
      var setter = obj.set;
      if (setter !== undefined && typeof setter !== "function") {
        throw new TypeError("property descriptor 'set' attribute must be " + "callable or undefined, given: " + setter);
      }
      desc.set = setter;
    }
    if ('get' in desc || 'set' in desc) {
      if ('value' in desc || 'writable' in desc) {
        throw new TypeError("property descriptor cannot be both a data and an " + "accessor descriptor: " + obj);
      }
    }
    return desc;
  }

  function isAccessorDescriptor(desc) {
    if (desc === undefined) return false;
    return 'get' in desc || 'set' in desc;
  }
  function isDataDescriptor(desc) {
    if (desc === undefined) return false;
    return 'value' in desc || 'writable' in desc;
  }
  function isGenericDescriptor(desc) {
    if (desc === undefined) return false;
    return !isAccessorDescriptor(desc) && !isDataDescriptor(desc);
  }

  function toCompletePropertyDescriptor(desc) {
    var internalDesc = toPropertyDescriptor(desc);
    if (isGenericDescriptor(internalDesc) || isDataDescriptor(internalDesc)) {
      if (!('value' in internalDesc)) {
        internalDesc.value = undefined;
      }
      if (!('writable' in internalDesc)) {
        internalDesc.writable = false;
      }
    } else {
      if (!('get' in internalDesc)) {
        internalDesc.get = undefined;
      }
      if (!('set' in internalDesc)) {
        internalDesc.set = undefined;
      }
    }
    if (!('enumerable' in internalDesc)) {
      internalDesc.enumerable = false;
    }
    if (!('configurable' in internalDesc)) {
      internalDesc.configurable = false;
    }
    return internalDesc;
  }

  function isEmptyDescriptor(desc) {
    return !('get' in desc) && !('set' in desc) && !('value' in desc) && !('writable' in desc) && !('enumerable' in desc) && !('configurable' in desc);
  }

  function isEquivalentDescriptor(desc1, desc2) {
    return sameValue(desc1.get, desc2.get) && sameValue(desc1.set, desc2.set) && sameValue(desc1.value, desc2.value) && sameValue(desc1.writable, desc2.writable) && sameValue(desc1.enumerable, desc2.enumerable) && sameValue(desc1.configurable, desc2.configurable);
  }

  // copied from http://wiki.ecmascript.org/doku.php?id=harmony:egal
  function sameValue(x, y) {
    if (x === y) {
      // 0 === -0, but they are not identical
      return x !== 0 || 1 / x === 1 / y;
    }

    // NaN !== NaN, but they are identical.
    // NaNs are the only non-reflexive value, i.e., if x !== x,
    // then x is a NaN.
    // isNaN is broken: it converts its argument to number, so
    // isNaN("foo") => true
    return x !== x && y !== y;
  }

  /**
   * Returns a fresh property descriptor that is guaranteed
   * to be complete (i.e. contain all the standard attributes).
   * Additionally, any non-standard enumerable properties of
   * attributes are copied over to the fresh descriptor.
   *
   * If attributes is undefined, returns undefined.
   *
   * See also: http://wiki.ecmascript.org/doku.php?id=harmony:proxies_semantics
   */
  function normalizeAndCompletePropertyDescriptor(attributes) {
    if (attributes === undefined) {
      return undefined;
    }
    var desc = toCompletePropertyDescriptor(attributes);
    // Note: no need to call FromPropertyDescriptor(desc), as we represent
    // "internal" property descriptors as proper Objects from the start
    for (var name in attributes) {
      if (!isStandardAttribute(name)) {
        Object.defineProperty(desc, name, { value: attributes[name],
          writable: true,
          enumerable: true,
          configurable: true });
      }
    }
    return desc;
  }

  /**
   * Returns a fresh property descriptor whose standard
   * attributes are guaranteed to be data properties of the right type.
   * Additionally, any non-standard enumerable properties of
   * attributes are copied over to the fresh descriptor.
   *
   * If attributes is undefined, will throw a TypeError.
   *
   * See also: http://wiki.ecmascript.org/doku.php?id=harmony:proxies_semantics
   */
  function normalizePropertyDescriptor(attributes) {
    var desc = toPropertyDescriptor(attributes);
    // Note: no need to call FromGenericPropertyDescriptor(desc), as we represent
    // "internal" property descriptors as proper Objects from the start
    for (var name in attributes) {
      if (!isStandardAttribute(name)) {
        Object.defineProperty(desc, name, { value: attributes[name],
          writable: true,
          enumerable: true,
          configurable: true });
      }
    }
    return desc;
  }

  // store a reference to the real ES5 primitives before patching them later
  var prim_preventExtensions = Object.preventExtensions,
      prim_seal = Object.seal,
      prim_freeze = Object.freeze,
      prim_isExtensible = Object.isExtensible,
      prim_isSealed = Object.isSealed,
      prim_isFrozen = Object.isFrozen,
      prim_getPrototypeOf = Object.getPrototypeOf,
      prim_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
      prim_defineProperty = Object.defineProperty,
      prim_defineProperties = Object.defineProperties,
      prim_keys = Object.keys,
      prim_getOwnPropertyNames = Object.getOwnPropertyNames,
      prim_getOwnPropertySymbols = Object.getOwnPropertySymbols,
      prim_assign = Object.assign,
      prim_isArray = Array.isArray,
      prim_concat = Array.prototype.concat,
      prim_isPrototypeOf = Object.prototype.isPrototypeOf,
      prim_hasOwnProperty = Object.prototype.hasOwnProperty;

  // these will point to the patched versions of the respective methods on
  // Object. They are used within this module as the "intrinsic" bindings
  // of these methods (i.e. the "original" bindings as defined in the spec)
  var Object_isFrozen, Object_isSealed, Object_isExtensible, Object_getPrototypeOf, Object_getOwnPropertyNames;

  /**
   * A property 'name' is fixed if it is an own property of the target.
   */
  function isFixed(name, target) {
    return {}.hasOwnProperty.call(target, name);
  }
  function isSealed(name, target) {
    var desc = Object.getOwnPropertyDescriptor(target, name);
    if (desc === undefined) {
      return false;
    }
    return desc.configurable === false;
  }
  function isSealedDesc(desc) {
    return desc !== undefined && desc.configurable === false;
  }

  /**
   * Performs all validation that Object.defineProperty performs,
   * without actually defining the property. Returns a boolean
   * indicating whether validation succeeded.
   *
   * Implementation transliterated from ES5.1 section 8.12.9
   */
  function isCompatibleDescriptor(extensible, current, desc) {
    if (current === undefined && extensible === false) {
      return false;
    }
    if (current === undefined && extensible === true) {
      return true;
    }
    if (isEmptyDescriptor(desc)) {
      return true;
    }
    if (isEquivalentDescriptor(current, desc)) {
      return true;
    }
    if (current.configurable === false) {
      if (desc.configurable === true) {
        return false;
      }
      if ('enumerable' in desc && desc.enumerable !== current.enumerable) {
        return false;
      }
    }
    if (isGenericDescriptor(desc)) {
      return true;
    }
    if (isDataDescriptor(current) !== isDataDescriptor(desc)) {
      if (current.configurable === false) {
        return false;
      }
      return true;
    }
    if (isDataDescriptor(current) && isDataDescriptor(desc)) {
      if (current.configurable === false) {
        if (current.writable === false && desc.writable === true) {
          return false;
        }
        if (current.writable === false) {
          if ('value' in desc && !sameValue(desc.value, current.value)) {
            return false;
          }
        }
      }
      return true;
    }
    if (isAccessorDescriptor(current) && isAccessorDescriptor(desc)) {
      if (current.configurable === false) {
        if ('set' in desc && !sameValue(desc.set, current.set)) {
          return false;
        }
        if ('get' in desc && !sameValue(desc.get, current.get)) {
          return false;
        }
      }
    }
    return true;
  }

  // ES6 7.3.11 SetIntegrityLevel
  // level is one of "sealed" or "frozen"
  function setIntegrityLevel(target, level) {
    var ownProps = Object_getOwnPropertyNames(target);
    var pendingException = undefined;
    if (level === "sealed") {
      var l = +ownProps.length;
      var k;
      for (var i = 0; i < l; i++) {
        k = String(ownProps[i]);
        try {
          Object.defineProperty(target, k, { configurable: false });
        } catch (e) {
          if (pendingException === undefined) {
            pendingException = e;
          }
        }
      }
    } else {
      // level === "frozen"
      var l = +ownProps.length;
      var k;
      for (var i = 0; i < l; i++) {
        k = String(ownProps[i]);
        try {
          var currentDesc = Object.getOwnPropertyDescriptor(target, k);
          if (currentDesc !== undefined) {
            var desc;
            if (isAccessorDescriptor(currentDesc)) {
              desc = { configurable: false };
            } else {
              desc = { configurable: false, writable: false };
            }
            Object.defineProperty(target, k, desc);
          }
        } catch (e) {
          if (pendingException === undefined) {
            pendingException = e;
          }
        }
      }
    }
    if (pendingException !== undefined) {
      throw pendingException;
    }
    return Reflect.preventExtensions(target);
  }

  // ES6 7.3.12 TestIntegrityLevel
  // level is one of "sealed" or "frozen"
  function testIntegrityLevel(target, level) {
    var isExtensible = Object_isExtensible(target);
    if (isExtensible) return false;

    var ownProps = Object_getOwnPropertyNames(target);
    var pendingException = undefined;
    var configurable = false;
    var writable = false;

    var l = +ownProps.length;
    var k;
    var currentDesc;
    for (var i = 0; i < l; i++) {
      k = String(ownProps[i]);
      try {
        currentDesc = Object.getOwnPropertyDescriptor(target, k);
        configurable = configurable || currentDesc.configurable;
        if (isDataDescriptor(currentDesc)) {
          writable = writable || currentDesc.writable;
        }
      } catch (e) {
        if (pendingException === undefined) {
          pendingException = e;
          configurable = true;
        }
      }
    }
    if (pendingException !== undefined) {
      throw pendingException;
    }
    if (level === "frozen" && writable === true) {
      return false;
    }
    if (configurable === true) {
      return false;
    }
    return true;
  }

  // ---- The Validator handler wrapper around user handlers ----

  /**
   * @param target the object wrapped by this proxy.
   * As long as the proxy is extensible, only non-configurable properties
   * are checked against the target. Once the proxy becomes non-extensible,
   * invariants w.r.t. non-extensibility are also enforced.
   *
   * @param handler the handler of the direct proxy. The object emulated by
   * this handler is validated against the target object of the direct proxy.
   * Any violations that the handler makes against the invariants
   * of the target will cause a TypeError to be thrown.
   *
   * Both target and handler must be proper Objects at initialization time.
   */
  function Validator(target, handler) {
    // for non-revokable proxies, these are const references
    // for revokable proxies, on revocation:
    // - this.target is set to null
    // - this.handler is set to a handler that throws on all traps
    this.target = target;
    this.handler = handler;
  }

  Validator.prototype = {

    /**
     * If getTrap returns undefined, the caller should perform the
     * default forwarding behavior.
     * If getTrap returns normally otherwise, the return value
     * will be a callable trap function. When calling the trap function,
     * the caller is responsible for binding its |this| to |this.handler|.
     */
    getTrap: function getTrap(trapName) {
      var trap = this.handler[trapName];
      if (trap === undefined) {
        // the trap was not defined,
        // perform the default forwarding behavior
        return undefined;
      }

      if (typeof trap !== "function") {
        throw new TypeError(trapName + " trap is not callable: " + trap);
      }

      return trap;
    },

    // === fundamental traps ===

    /**
     * If name denotes a fixed property, check:
     *   - whether targetHandler reports it as existent
     *   - whether the returned descriptor is compatible with the fixed property
     * If the proxy is non-extensible, check:
     *   - whether name is not a new property
     * Additionally, the returned descriptor is normalized and completed.
     */
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(name) {
      "use strict";

      var trap = this.getTrap("getOwnPropertyDescriptor");
      if (trap === undefined) {
        return Reflect.getOwnPropertyDescriptor(this.target, name);
      }

      name = String(name);
      var desc = trap.call(this.handler, this.target, name);
      desc = normalizeAndCompletePropertyDescriptor(desc);

      var targetDesc = Object.getOwnPropertyDescriptor(this.target, name);
      var extensible = Object.isExtensible(this.target);

      if (desc === undefined) {
        if (isSealedDesc(targetDesc)) {
          throw new TypeError("cannot report non-configurable property '" + name + "' as non-existent");
        }
        if (!extensible && targetDesc !== undefined) {
          // if handler is allowed to return undefined, we cannot guarantee
          // that it will not return a descriptor for this property later.
          // Once a property has been reported as non-existent on a non-extensible
          // object, it should forever be reported as non-existent
          throw new TypeError("cannot report existing own property '" + name + "' as non-existent on a non-extensible object");
        }
        return undefined;
      }

      // at this point, we know (desc !== undefined), i.e.
      // targetHandler reports 'name' as an existing property

      // Note: we could collapse the following two if-tests into a single
      // test. Separating out the cases to improve error reporting.

      if (!extensible) {
        if (targetDesc === undefined) {
          throw new TypeError("cannot report a new own property '" + name + "' on a non-extensible object");
        }
      }

      if (name !== undefined) {
        if (!isCompatibleDescriptor(extensible, targetDesc, desc)) {
          throw new TypeError("cannot report incompatible property descriptor " + "for property '" + name + "'");
        }
      }

      if (desc.configurable === false) {
        if (targetDesc === undefined || targetDesc.configurable === true) {
          // if the property is configurable or non-existent on the target,
          // but is reported as a non-configurable property, it may later be
          // reported as configurable or non-existent, which violates the
          // invariant that if the property might change or disappear, the
          // configurable attribute must be true.
          throw new TypeError("cannot report a non-configurable descriptor " + "for configurable or non-existent property '" + name + "'");
        }
        if ('writable' in desc && desc.writable === false) {
          if (targetDesc.writable === true) {
            // if the property is non-configurable, writable on the target,
            // but is reported as non-configurable, non-writable, it may later
            // be reported as non-configurable, writable again, which violates
            // the invariant that a non-configurable, non-writable property
            // may not change state.
            throw new TypeError("cannot report non-configurable, writable property '" + name + "' as non-configurable, non-writable");
          }
        }
      }

      return desc;
    },

    /**
     * In the direct proxies design with refactored prototype climbing,
     * this trap is deprecated. For proxies-as-prototypes, instead
     * of calling this trap, the get, set, has or enumerate traps are
     * called instead.
     *
     * In this implementation, we "abuse" getPropertyDescriptor to
     * support trapping the get or set traps for proxies-as-prototypes.
     * We do this by returning a getter/setter pair that invokes
     * the corresponding traps.
     *
     * While this hack works for inherited property access, it has some
     * quirks:
     *
     * In Firefox, this trap is only called after a prior invocation
     * of the 'has' trap has returned true. Hence, expect the following
     * behavior:
     * <code>
     * var child = Object.create(Proxy(target, handler));
     * child[name] // triggers handler.has(target, name)
     * // if that returns true, triggers handler.get(target, name, child)
     * </code>
     *
     * On v8, the 'in' operator, when applied to an object that inherits
     * from a proxy, will call getPropertyDescriptor and walk the proto-chain.
     * That calls the below getPropertyDescriptor trap on the proxy. The
     * result of the 'in'-operator is then determined by whether this trap
     * returns undefined or a property descriptor object. That is why
     * we first explicitly trigger the 'has' trap to determine whether
     * the property exists.
     *
     * This has the side-effect that when enumerating properties on
     * an object that inherits from a proxy in v8, only properties
     * for which 'has' returns true are returned:
     *
     * <code>
     * var child = Object.create(Proxy(target, handler));
     * for (var prop in child) {
     *   // only enumerates prop if (prop in child) returns true
     * }
     * </code>
     */
    getPropertyDescriptor: function getPropertyDescriptor(name) {
      var handler = this;

      if (!handler.has(name)) return undefined;

      return {
        get: function get() {
          return handler.get(this, name);
        },
        set: function set(val) {
          if (handler.set(this, name, val)) {
            return val;
          } else {
            throw new TypeError("failed assignment to " + name);
          }
        },
        enumerable: true,
        configurable: true
      };
    },

    /**
     * If name denotes a fixed property, check for incompatible changes.
     * If the proxy is non-extensible, check that new properties are rejected.
     */
    defineProperty: function defineProperty(name, desc) {
      // TODO(tvcutsem): the current tracemonkey implementation of proxies
      // auto-completes 'desc', which is not correct. 'desc' should be
      // normalized, but not completed. Consider:
      // Object.defineProperty(proxy, 'foo', {enumerable:false})
      // This trap will receive desc =
      //  {value:undefined,writable:false,enumerable:false,configurable:false}
      // This will also set all other attributes to their default value,
      // which is unexpected and different from [[DefineOwnProperty]].
      // Bug filed: https://bugzilla.mozilla.org/show_bug.cgi?id=601329

      var trap = this.getTrap("defineProperty");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.defineProperty(this.target, name, desc);
      }

      name = String(name);
      var descObj = normalizePropertyDescriptor(desc);
      var success = trap.call(this.handler, this.target, name, descObj);
      success = !!success; // coerce to Boolean

      if (success === true) {

        var targetDesc = Object.getOwnPropertyDescriptor(this.target, name);
        var extensible = Object.isExtensible(this.target);

        // Note: we could collapse the following two if-tests into a single
        // test. Separating out the cases to improve error reporting.

        if (!extensible) {
          if (targetDesc === undefined) {
            throw new TypeError("cannot successfully add a new property '" + name + "' to a non-extensible object");
          }
        }

        if (targetDesc !== undefined) {
          if (!isCompatibleDescriptor(extensible, targetDesc, desc)) {
            throw new TypeError("cannot define incompatible property " + "descriptor for property '" + name + "'");
          }
          if (isDataDescriptor(targetDesc) && targetDesc.configurable === false && targetDesc.writable === true) {
            if (desc.configurable === false && desc.writable === false) {
              // if the property is non-configurable, writable on the target
              // but was successfully reported to be updated to
              // non-configurable, non-writable, it can later be reported
              // again as non-configurable, writable, which violates
              // the invariant that non-configurable, non-writable properties
              // cannot change state
              throw new TypeError("cannot successfully define non-configurable, writable " + " property '" + name + "' as non-configurable, non-writable");
            }
          }
        }

        if (desc.configurable === false && !isSealedDesc(targetDesc)) {
          // if the property is configurable or non-existent on the target,
          // but is successfully being redefined as a non-configurable property,
          // it may later be reported as configurable or non-existent, which violates
          // the invariant that if the property might change or disappear, the
          // configurable attribute must be true.
          throw new TypeError("cannot successfully define a non-configurable " + "descriptor for configurable or non-existent property '" + name + "'");
        }
      }

      return success;
    },

    /**
     * On success, check whether the target object is indeed non-extensible.
     */
    preventExtensions: function preventExtensions() {
      var trap = this.getTrap("preventExtensions");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.preventExtensions(this.target);
      }

      var success = trap.call(this.handler, this.target);
      success = !!success; // coerce to Boolean
      if (success) {
        if (Object_isExtensible(this.target)) {
          throw new TypeError("can't report extensible object as non-extensible: " + this.target);
        }
      }
      return success;
    },

    /**
     * If name denotes a sealed property, check whether handler rejects.
     */
    delete: function _delete(name) {
      "use strict";

      var trap = this.getTrap("deleteProperty");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.deleteProperty(this.target, name);
      }

      name = String(name);
      var res = trap.call(this.handler, this.target, name);
      res = !!res; // coerce to Boolean

      var targetDesc;
      if (res === true) {
        targetDesc = Object.getOwnPropertyDescriptor(this.target, name);
        if (targetDesc !== undefined && targetDesc.configurable === false) {
          throw new TypeError("property '" + name + "' is non-configurable " + "and can't be deleted");
        }
        if (targetDesc !== undefined && !Object_isExtensible(this.target)) {
          // if the property still exists on a non-extensible target but
          // is reported as successfully deleted, it may later be reported
          // as present, which violates the invariant that an own property,
          // deleted from a non-extensible object cannot reappear.
          throw new TypeError("cannot successfully delete existing property '" + name + "' on a non-extensible object");
        }
      }

      return res;
    },

    /**
     * The getOwnPropertyNames trap was replaced by the ownKeys trap,
     * which now also returns an array (of strings or symbols) and
     * which performs the same rigorous invariant checks as getOwnPropertyNames
     *
     * See issue #48 on how this trap can still get invoked by external libs
     * that don't use the patched Object.getOwnPropertyNames function.
     */
    getOwnPropertyNames: function getOwnPropertyNames() {
      // Note: removed deprecation warning to avoid dependency on 'console'
      // (and on node, should anyway use util.deprecate). Deprecation warnings
      // can also be annoying when they are outside of the user's control, e.g.
      // when an external library calls unpatched Object.getOwnPropertyNames.
      // Since there is a clean fallback to `ownKeys`, the fact that the
      // deprecated method is still called is mostly harmless anyway.
      // See also issues #65 and #66.
      // console.warn("getOwnPropertyNames trap is deprecated. Use ownKeys instead");
      return this.ownKeys();
    },

    /**
     * Checks whether the trap result does not contain any new properties
     * if the proxy is non-extensible.
     *
     * Any own non-configurable properties of the target that are not included
     * in the trap result give rise to a TypeError. As such, we check whether the
     * returned result contains at least all sealed properties of the target
     * object.
     *
     * Additionally, the trap result is normalized.
     * Instead of returning the trap result directly:
     *  - create and return a fresh Array,
     *  - of which each element is coerced to a String
     *
     * This trap is called a.o. by Reflect.ownKeys, Object.getOwnPropertyNames
     * and Object.keys (the latter filters out only the enumerable own properties).
     */
    ownKeys: function ownKeys() {
      var trap = this.getTrap("ownKeys");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.ownKeys(this.target);
      }

      var trapResult = trap.call(this.handler, this.target);

      // propNames is used as a set of strings
      var propNames = Object.create(null);
      var numProps = +trapResult.length;
      var result = new Array(numProps);

      for (var i = 0; i < numProps; i++) {
        var s = String(trapResult[i]);
        if (!Object.isExtensible(this.target) && !isFixed(s, this.target)) {
          // non-extensible proxies don't tolerate new own property names
          throw new TypeError("ownKeys trap cannot list a new " + "property '" + s + "' on a non-extensible object");
        }

        propNames[s] = true;
        result[i] = s;
      }

      var ownProps = Object_getOwnPropertyNames(this.target);
      var target = this.target;
      ownProps.forEach(function (ownProp) {
        if (!propNames[ownProp]) {
          if (isSealed(ownProp, target)) {
            throw new TypeError("ownKeys trap failed to include " + "non-configurable property '" + ownProp + "'");
          }
          if (!Object.isExtensible(target) && isFixed(ownProp, target)) {
            // if handler is allowed to report ownProp as non-existent,
            // we cannot guarantee that it will never later report it as
            // existent. Once a property has been reported as non-existent
            // on a non-extensible object, it should forever be reported as
            // non-existent
            throw new TypeError("ownKeys trap cannot report existing own property '" + ownProp + "' as non-existent on a non-extensible object");
          }
        }
      });

      return result;
    },

    /**
     * Checks whether the trap result is consistent with the state of the
     * wrapped target.
     */
    isExtensible: function isExtensible() {
      var trap = this.getTrap("isExtensible");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.isExtensible(this.target);
      }

      var result = trap.call(this.handler, this.target);
      result = !!result; // coerce to Boolean
      var state = Object_isExtensible(this.target);
      if (result !== state) {
        if (result) {
          throw new TypeError("cannot report non-extensible object as extensible: " + this.target);
        } else {
          throw new TypeError("cannot report extensible object as non-extensible: " + this.target);
        }
      }
      return state;
    },

    /**
     * Check whether the trap result corresponds to the target's [[Prototype]]
     */
    getPrototypeOf: function getPrototypeOf() {
      var trap = this.getTrap("getPrototypeOf");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.getPrototypeOf(this.target);
      }

      var allegedProto = trap.call(this.handler, this.target);

      if (!Object_isExtensible(this.target)) {
        var actualProto = Object_getPrototypeOf(this.target);
        if (!sameValue(allegedProto, actualProto)) {
          throw new TypeError("prototype value does not match: " + this.target);
        }
      }

      return allegedProto;
    },

    /**
     * If target is non-extensible and setPrototypeOf trap returns true,
     * check whether the trap result corresponds to the target's [[Prototype]]
     */
    setPrototypeOf: function setPrototypeOf(newProto) {
      var trap = this.getTrap("setPrototypeOf");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.setPrototypeOf(this.target, newProto);
      }

      var success = trap.call(this.handler, this.target, newProto);

      success = !!success;
      if (success && !Object_isExtensible(this.target)) {
        var actualProto = Object_getPrototypeOf(this.target);
        if (!sameValue(newProto, actualProto)) {
          throw new TypeError("prototype value does not match: " + this.target);
        }
      }

      return success;
    },

    /**
     * In the direct proxies design with refactored prototype climbing,
     * this trap is deprecated. For proxies-as-prototypes, for-in will
     * call the enumerate() trap. If that trap is not defined, the
     * operation is forwarded to the target, no more fallback on this
     * fundamental trap.
     */
    getPropertyNames: function getPropertyNames() {
      throw new TypeError("getPropertyNames trap is deprecated");
    },

    // === derived traps ===

    /**
     * If name denotes a fixed property, check whether the trap returns true.
     */
    has: function has(name) {
      var trap = this.getTrap("has");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.has(this.target, name);
      }

      name = String(name);
      var res = trap.call(this.handler, this.target, name);
      res = !!res; // coerce to Boolean

      if (res === false) {
        if (isSealed(name, this.target)) {
          throw new TypeError("cannot report existing non-configurable own " + "property '" + name + "' as a non-existent " + "property");
        }
        if (!Object.isExtensible(this.target) && isFixed(name, this.target)) {
          // if handler is allowed to return false, we cannot guarantee
          // that it will not return true for this property later.
          // Once a property has been reported as non-existent on a non-extensible
          // object, it should forever be reported as non-existent
          throw new TypeError("cannot report existing own property '" + name + "' as non-existent on a non-extensible object");
        }
      }

      // if res === true, we don't need to check for extensibility
      // even for a non-extensible proxy that has no own name property,
      // the property may have been inherited

      return res;
    },

    /**
     * If name denotes a fixed non-configurable, non-writable data property,
     * check its return value against the previously asserted value of the
     * fixed property.
     */
    get: function get(receiver, name) {

      // experimental support for invoke() trap on platforms that
      // support __noSuchMethod__
      /*
      if (name === '__noSuchMethod__') {
        var handler = this;
        return function(name, args) {
          return handler.invoke(receiver, name, args);
        }
      }
      */

      var trap = this.getTrap("get");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.get(this.target, name, receiver);
      }

      name = String(name);
      var res = trap.call(this.handler, this.target, name, receiver);

      var fixedDesc = Object.getOwnPropertyDescriptor(this.target, name);
      // check consistency of the returned value
      if (fixedDesc !== undefined) {
        // getting an existing property
        if (isDataDescriptor(fixedDesc) && fixedDesc.configurable === false && fixedDesc.writable === false) {
          // own frozen data property
          if (!sameValue(res, fixedDesc.value)) {
            throw new TypeError("cannot report inconsistent value for " + "non-writable, non-configurable property '" + name + "'");
          }
        } else {
          // it's an accessor property
          if (isAccessorDescriptor(fixedDesc) && fixedDesc.configurable === false && fixedDesc.get === undefined) {
            if (res !== undefined) {
              throw new TypeError("must report undefined for non-configurable " + "accessor property '" + name + "' without getter");
            }
          }
        }
      }

      return res;
    },

    /**
     * If name denotes a fixed non-configurable, non-writable data property,
     * check that the trap rejects the assignment.
     */
    set: function set(receiver, name, val) {
      var trap = this.getTrap("set");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.set(this.target, name, val, receiver);
      }

      name = String(name);
      var res = trap.call(this.handler, this.target, name, val, receiver);
      res = !!res; // coerce to Boolean

      // if success is reported, check whether property is truly assignable
      if (res === true) {
        var fixedDesc = Object.getOwnPropertyDescriptor(this.target, name);
        if (fixedDesc !== undefined) {
          // setting an existing property
          if (isDataDescriptor(fixedDesc) && fixedDesc.configurable === false && fixedDesc.writable === false) {
            if (!sameValue(val, fixedDesc.value)) {
              throw new TypeError("cannot successfully assign to a " + "non-writable, non-configurable property '" + name + "'");
            }
          } else {
            if (isAccessorDescriptor(fixedDesc) && fixedDesc.configurable === false && // non-configurable
            fixedDesc.set === undefined) {
              // accessor with undefined setter
              throw new TypeError("setting a property '" + name + "' that has " + " only a getter");
            }
          }
        }
      }

      return res;
    },

    /**
     * Any own enumerable non-configurable properties of the target that are not
     * included in the trap result give rise to a TypeError. As such, we check
     * whether the returned result contains at least all sealed enumerable properties
     * of the target object.
     *
     * The trap should return an iterator.
     *
     * However, as implementations of pre-direct proxies still expect enumerate
     * to return an array of strings, we convert the iterator into an array.
     */
    enumerate: function enumerate() {
      var trap = this.getTrap("enumerate");
      if (trap === undefined) {
        // default forwarding behavior
        var trapResult = Reflect.enumerate(this.target);
        var result = [];
        var nxt = trapResult.next();
        while (!nxt.done) {
          result.push(String(nxt.value));
          nxt = trapResult.next();
        }
        return result;
      }

      var trapResult = trap.call(this.handler, this.target);

      if (trapResult === null || trapResult === undefined || trapResult.next === undefined) {
        throw new TypeError("enumerate trap should return an iterator, got: " + trapResult);
      }

      // propNames is used as a set of strings
      var propNames = Object.create(null);

      // var numProps = +trapResult.length;
      var result = []; // new Array(numProps);

      // trapResult is supposed to be an iterator
      // drain iterator to array as current implementations still expect
      // enumerate to return an array of strings
      var nxt = trapResult.next();

      while (!nxt.done) {
        var s = String(nxt.value);
        if (propNames[s]) {
          throw new TypeError("enumerate trap cannot list a " + "duplicate property '" + s + "'");
        }
        propNames[s] = true;
        result.push(s);
        nxt = trapResult.next();
      }

      /*for (var i = 0; i < numProps; i++) {
        var s = String(trapResult[i]);
        if (propNames[s]) {
          throw new TypeError("enumerate trap cannot list a "+
                              "duplicate property '"+s+"'");
        }
         propNames[s] = true;
        result[i] = s;
      } */

      var ownEnumerableProps = Object.keys(this.target);
      var target = this.target;
      ownEnumerableProps.forEach(function (ownEnumerableProp) {
        if (!propNames[ownEnumerableProp]) {
          if (isSealed(ownEnumerableProp, target)) {
            throw new TypeError("enumerate trap failed to include " + "non-configurable enumerable property '" + ownEnumerableProp + "'");
          }
          if (!Object.isExtensible(target) && isFixed(ownEnumerableProp, target)) {
            // if handler is allowed not to report ownEnumerableProp as an own
            // property, we cannot guarantee that it will never report it as
            // an own property later. Once a property has been reported as
            // non-existent on a non-extensible object, it should forever be
            // reported as non-existent
            throw new TypeError("cannot report existing own property '" + ownEnumerableProp + "' as non-existent on a " + "non-extensible object");
          }
        }
      });

      return result;
    },

    /**
     * The iterate trap is deprecated by the enumerate trap.
     */
    iterate: Validator.prototype.enumerate,

    /**
     * Any own non-configurable properties of the target that are not included
     * in the trap result give rise to a TypeError. As such, we check whether the
     * returned result contains at least all sealed properties of the target
     * object.
     *
     * The trap result is normalized.
     * The trap result is not returned directly. Instead:
     *  - create and return a fresh Array,
     *  - of which each element is coerced to String,
     *  - which does not contain duplicates
     *
     * FIXME: keys trap is deprecated
     */
    /*
    keys: function() {
      var trap = this.getTrap("keys");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.keys(this.target);
      }
       var trapResult = trap.call(this.handler, this.target);
       // propNames is used as a set of strings
      var propNames = Object.create(null);
      var numProps = +trapResult.length;
      var result = new Array(numProps);
       for (var i = 0; i < numProps; i++) {
       var s = String(trapResult[i]);
       if (propNames[s]) {
         throw new TypeError("keys trap cannot list a "+
                             "duplicate property '"+s+"'");
       }
       if (!Object.isExtensible(this.target) && !isFixed(s, this.target)) {
         // non-extensible proxies don't tolerate new own property names
         throw new TypeError("keys trap cannot list a new "+
                             "property '"+s+"' on a non-extensible object");
       }
        propNames[s] = true;
       result[i] = s;
      }
       var ownEnumerableProps = Object.keys(this.target);
      var target = this.target;
      ownEnumerableProps.forEach(function (ownEnumerableProp) {
        if (!propNames[ownEnumerableProp]) {
          if (isSealed(ownEnumerableProp, target)) {
            throw new TypeError("keys trap failed to include "+
                                "non-configurable enumerable property '"+
                                ownEnumerableProp+"'");
          }
          if (!Object.isExtensible(target) &&
              isFixed(ownEnumerableProp, target)) {
              // if handler is allowed not to report ownEnumerableProp as an own
              // property, we cannot guarantee that it will never report it as
              // an own property later. Once a property has been reported as
              // non-existent on a non-extensible object, it should forever be
              // reported as non-existent
              throw new TypeError("cannot report existing own property '"+
                                  ownEnumerableProp+"' as non-existent on a "+
                                  "non-extensible object");
          }
        }
      });
       return result;
    },
    */

    /**
     * New trap that reifies [[Call]].
     * If the target is a function, then a call to
     *   proxy(...args)
     * Triggers this trap
     */
    apply: function apply(target, thisBinding, args) {
      var trap = this.getTrap("apply");
      if (trap === undefined) {
        return Reflect.apply(target, thisBinding, args);
      }

      if (typeof this.target === "function") {
        return trap.call(this.handler, target, thisBinding, args);
      } else {
        throw new TypeError("apply: " + target + " is not a function");
      }
    },

    /**
     * New trap that reifies [[Construct]].
     * If the target is a function, then a call to
     *   new proxy(...args)
     * Triggers this trap
     */
    construct: function construct(target, args, newTarget) {
      var trap = this.getTrap("construct");
      if (trap === undefined) {
        return Reflect.construct(target, args, newTarget);
      }

      if (typeof target !== "function") {
        throw new TypeError("new: " + target + " is not a function");
      }

      if (newTarget === undefined) {
        newTarget = target;
      } else {
        if (typeof newTarget !== "function") {
          throw new TypeError("new: " + newTarget + " is not a function");
        }
      }
      return trap.call(this.handler, target, args, newTarget);
    }
  };

  // ---- end of the Validator handler wrapper handler ----

  // In what follows, a 'direct proxy' is a proxy
  // whose handler is a Validator. Such proxies can be made non-extensible,
  // sealed or frozen without losing the ability to trap.

  // maps direct proxies to their Validator handlers
  var directProxies = new WeakMap();

  // patch Object.{preventExtensions,seal,freeze} so that
  // they recognize fixable proxies and act accordingly
  Object.preventExtensions = function (subject) {
    var vhandler = directProxies.get(subject);
    if (vhandler !== undefined) {
      if (vhandler.preventExtensions()) {
        return subject;
      } else {
        throw new TypeError("preventExtensions on " + subject + " rejected");
      }
    } else {
      return prim_preventExtensions(subject);
    }
  };
  Object.seal = function (subject) {
    setIntegrityLevel(subject, "sealed");
    return subject;
  };
  Object.freeze = function (subject) {
    setIntegrityLevel(subject, "frozen");
    return subject;
  };
  Object.isExtensible = Object_isExtensible = function Object_isExtensible(subject) {
    var vHandler = directProxies.get(subject);
    if (vHandler !== undefined) {
      return vHandler.isExtensible();
    } else {
      return prim_isExtensible(subject);
    }
  };
  Object.isSealed = Object_isSealed = function Object_isSealed(subject) {
    return testIntegrityLevel(subject, "sealed");
  };
  Object.isFrozen = Object_isFrozen = function Object_isFrozen(subject) {
    return testIntegrityLevel(subject, "frozen");
  };
  Object.getPrototypeOf = Object_getPrototypeOf = function Object_getPrototypeOf(subject) {
    var vHandler = directProxies.get(subject);
    if (vHandler !== undefined) {
      return vHandler.getPrototypeOf();
    } else {
      return prim_getPrototypeOf(subject);
    }
  };

  // patch Object.getOwnPropertyDescriptor to directly call
  // the Validator.prototype.getOwnPropertyDescriptor trap
  // This is to circumvent an assertion in the built-in Proxy
  // trapping mechanism of v8, which disallows that trap to
  // return non-configurable property descriptors (as per the
  // old Proxy design)
  Object.getOwnPropertyDescriptor = function (subject, name) {
    var vhandler = directProxies.get(subject);
    if (vhandler !== undefined) {
      return vhandler.getOwnPropertyDescriptor(name);
    } else {
      return prim_getOwnPropertyDescriptor(subject, name);
    }
  };

  // patch Object.defineProperty to directly call
  // the Validator.prototype.defineProperty trap
  // This is to circumvent two issues with the built-in
  // trap mechanism:
  // 1) the current tracemonkey implementation of proxies
  // auto-completes 'desc', which is not correct. 'desc' should be
  // normalized, but not completed. Consider:
  // Object.defineProperty(proxy, 'foo', {enumerable:false})
  // This trap will receive desc =
  //  {value:undefined,writable:false,enumerable:false,configurable:false}
  // This will also set all other attributes to their default value,
  // which is unexpected and different from [[DefineOwnProperty]].
  // Bug filed: https://bugzilla.mozilla.org/show_bug.cgi?id=601329
  // 2) the current spidermonkey implementation does not
  // throw an exception when this trap returns 'false', but instead silently
  // ignores the operation (this is regardless of strict-mode)
  // 2a) v8 does throw an exception for this case, but includes the rather
  //     unhelpful error message:
  // 'Proxy handler #<Object> returned false from 'defineProperty' trap'
  Object.defineProperty = function (subject, name, desc) {
    var vhandler = directProxies.get(subject);
    if (vhandler !== undefined) {
      var normalizedDesc = normalizePropertyDescriptor(desc);
      var success = vhandler.defineProperty(name, normalizedDesc);
      if (success === false) {
        throw new TypeError("can't redefine property '" + name + "'");
      }
      return subject;
    } else {
      return prim_defineProperty(subject, name, desc);
    }
  };

  Object.defineProperties = function (subject, descs) {
    var vhandler = directProxies.get(subject);
    if (vhandler !== undefined) {
      var names = Object.keys(descs);
      for (var i = 0; i < names.length; i++) {
        var name = names[i];
        var normalizedDesc = normalizePropertyDescriptor(descs[name]);
        var success = vhandler.defineProperty(name, normalizedDesc);
        if (success === false) {
          throw new TypeError("can't redefine property '" + name + "'");
        }
      }
      return subject;
    } else {
      return prim_defineProperties(subject, descs);
    }
  };

  Object.keys = function (subject) {
    var vHandler = directProxies.get(subject);
    if (vHandler !== undefined) {
      var ownKeys = vHandler.ownKeys();
      var result = [];
      for (var i = 0; i < ownKeys.length; i++) {
        var k = String(ownKeys[i]);
        var desc = Object.getOwnPropertyDescriptor(subject, k);
        if (desc !== undefined && desc.enumerable === true) {
          result.push(k);
        }
      }
      return result;
    } else {
      return prim_keys(subject);
    }
  };

  Object.getOwnPropertyNames = Object_getOwnPropertyNames = function Object_getOwnPropertyNames(subject) {
    var vHandler = directProxies.get(subject);
    if (vHandler !== undefined) {
      return vHandler.ownKeys();
    } else {
      return prim_getOwnPropertyNames(subject);
    }
  };

  // fixes issue #71 (Calling Object.getOwnPropertySymbols() on a Proxy
  // throws an error)
  if (prim_getOwnPropertySymbols !== undefined) {
    Object.getOwnPropertySymbols = function (subject) {
      var vHandler = directProxies.get(subject);
      if (vHandler !== undefined) {
        // as this shim does not support symbols, a Proxy never advertises
        // any symbol-valued own properties
        return [];
      } else {
        return prim_getOwnPropertySymbols(subject);
      }
    };
  }

  // fixes issue #72 ('Illegal access' error when using Object.assign)
  // Object.assign polyfill based on a polyfill posted on MDN: 
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/\
  //  Global_Objects/Object/assign
  // Note that this polyfill does not support Symbols, but this Proxy Shim
  // does not support Symbols anyway.
  if (prim_assign !== undefined) {
    Object.assign = function (target) {

      // check if any argument is a proxy object
      var noProxies = true;
      for (var i = 0; i < arguments.length; i++) {
        var vHandler = directProxies.get(arguments[i]);
        if (vHandler !== undefined) {
          noProxies = false;
          break;
        }
      }
      if (noProxies) {
        // not a single argument is a proxy, perform built-in algorithm
        return prim_assign.apply(Object, arguments);
      }

      // there is at least one proxy argument, use the polyfill

      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  }

  // returns whether an argument is a reference to an object,
  // which is legal as a WeakMap key.
  function isObject(arg) {
    var type = typeof arg === 'undefined' ? 'undefined' : _typeof(arg);
    return type === 'object' && arg !== null || type === 'function';
  };

  // a wrapper for WeakMap.get which returns the undefined value
  // for keys that are not objects (in which case the underlying
  // WeakMap would have thrown a TypeError).
  function safeWeakMapGet(map, key) {
    return isObject(key) ? map.get(key) : undefined;
  };

  // returns a new function of zero arguments that recursively
  // unwraps any proxies specified as the |this|-value.
  // The primitive is assumed to be a zero-argument method
  // that uses its |this|-binding.
  function makeUnwrapping0ArgMethod(primitive) {
    return function builtin() {
      var vHandler = safeWeakMapGet(directProxies, this);
      if (vHandler !== undefined) {
        return builtin.call(vHandler.target);
      } else {
        return primitive.call(this);
      }
    };
  };

  // returns a new function of 1 arguments that recursively
  // unwraps any proxies specified as the |this|-value.
  // The primitive is assumed to be a 1-argument method
  // that uses its |this|-binding.
  function makeUnwrapping1ArgMethod(primitive) {
    return function builtin(arg) {
      var vHandler = safeWeakMapGet(directProxies, this);
      if (vHandler !== undefined) {
        return builtin.call(vHandler.target, arg);
      } else {
        return primitive.call(this, arg);
      }
    };
  };

  Object.prototype.valueOf = makeUnwrapping0ArgMethod(Object.prototype.valueOf);
  Object.prototype.toString = makeUnwrapping0ArgMethod(Object.prototype.toString);
  Function.prototype.toString = makeUnwrapping0ArgMethod(Function.prototype.toString);
  Date.prototype.toString = makeUnwrapping0ArgMethod(Date.prototype.toString);

  Object.prototype.isPrototypeOf = function builtin(arg) {
    // bugfix thanks to Bill Mark:
    // built-in isPrototypeOf does not unwrap proxies used
    // as arguments. So, we implement the builtin ourselves,
    // based on the ECMAScript 6 spec. Our encoding will
    // make sure that if a proxy is used as an argument,
    // its getPrototypeOf trap will be called.
    while (true) {
      var vHandler2 = safeWeakMapGet(directProxies, arg);
      if (vHandler2 !== undefined) {
        arg = vHandler2.getPrototypeOf();
        if (arg === null) {
          return false;
        } else if (sameValue(arg, this)) {
          return true;
        }
      } else {
        return prim_isPrototypeOf.call(this, arg);
      }
    }
  };

  Array.isArray = function (subject) {
    var vHandler = safeWeakMapGet(directProxies, subject);
    if (vHandler !== undefined) {
      return Array.isArray(vHandler.target);
    } else {
      return prim_isArray(subject);
    }
  };

  function isProxyArray(arg) {
    var vHandler = safeWeakMapGet(directProxies, arg);
    if (vHandler !== undefined) {
      return Array.isArray(vHandler.target);
    }
    return false;
  }

  // Array.prototype.concat internally tests whether one of its
  // arguments is an Array, by checking whether [[Class]] == "Array"
  // As such, it will fail to recognize proxies-for-arrays as arrays.
  // We patch Array.prototype.concat so that it "unwraps" proxies-for-arrays
  // by making a copy. This will trigger the exact same sequence of
  // traps on the proxy-for-array as if we would not have unwrapped it.
  // See <https://github.com/tvcutsem/harmony-reflect/issues/19> for more.
  Array.prototype.concat = function () /*...args*/{
    var length;
    for (var i = 0; i < arguments.length; i++) {
      if (isProxyArray(arguments[i])) {
        length = arguments[i].length;
        arguments[i] = Array.prototype.slice.call(arguments[i], 0, length);
      }
    }
    return prim_concat.apply(this, arguments);
  };

  // setPrototypeOf support on platforms that support __proto__

  var prim_setPrototypeOf = Object.setPrototypeOf;

  // patch and extract original __proto__ setter
  var __proto__setter = function () {
    var protoDesc = prim_getOwnPropertyDescriptor(Object.prototype, '__proto__');
    if (protoDesc === undefined || typeof protoDesc.set !== "function") {
      return function () {
        throw new TypeError("setPrototypeOf not supported on this platform");
      };
    }

    // see if we can actually mutate a prototype with the generic setter
    // (e.g. Chrome v28 doesn't allow setting __proto__ via the generic setter)
    try {
      protoDesc.set.call({}, {});
    } catch (e) {
      return function () {
        throw new TypeError("setPrototypeOf not supported on this platform");
      };
    }

    prim_defineProperty(Object.prototype, '__proto__', {
      set: function set(newProto) {
        return Object.setPrototypeOf(this, Object(newProto));
      }
    });

    return protoDesc.set;
  }();

  Object.setPrototypeOf = function (target, newProto) {
    var handler = directProxies.get(target);
    if (handler !== undefined) {
      if (handler.setPrototypeOf(newProto)) {
        return target;
      } else {
        throw new TypeError("proxy rejected prototype mutation");
      }
    } else {
      if (!Object_isExtensible(target)) {
        throw new TypeError("can't set prototype on non-extensible object: " + target);
      }
      if (prim_setPrototypeOf) return prim_setPrototypeOf(target, newProto);

      if (Object(newProto) !== newProto || newProto === null) {
        throw new TypeError("Object prototype may only be an Object or null: " + newProto);
        // throw new TypeError("prototype must be an object or null")
      }
      __proto__setter.call(target, newProto);
      return target;
    }
  };

  Object.prototype.hasOwnProperty = function (name) {
    var handler = safeWeakMapGet(directProxies, this);
    if (handler !== undefined) {
      var desc = handler.getOwnPropertyDescriptor(name);
      return desc !== undefined;
    } else {
      return prim_hasOwnProperty.call(this, name);
    }
  };

  // ============= Reflection module =============
  // see http://wiki.ecmascript.org/doku.php?id=harmony:reflect_api

  var Reflect = global.Reflect = {
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, name) {
      return Object.getOwnPropertyDescriptor(target, name);
    },
    defineProperty: function defineProperty(target, name, desc) {

      // if target is a proxy, invoke its "defineProperty" trap
      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.defineProperty(target, name, desc);
      }

      // Implementation transliterated from [[DefineOwnProperty]]
      // see ES5.1 section 8.12.9
      // this is the _exact same algorithm_ as the isCompatibleDescriptor
      // algorithm defined above, except that at every place it
      // returns true, this algorithm actually does define the property.
      var current = Object.getOwnPropertyDescriptor(target, name);
      var extensible = Object.isExtensible(target);
      if (current === undefined && extensible === false) {
        return false;
      }
      if (current === undefined && extensible === true) {
        Object.defineProperty(target, name, desc); // should never fail
        return true;
      }
      if (isEmptyDescriptor(desc)) {
        return true;
      }
      if (isEquivalentDescriptor(current, desc)) {
        return true;
      }
      if (current.configurable === false) {
        if (desc.configurable === true) {
          return false;
        }
        if ('enumerable' in desc && desc.enumerable !== current.enumerable) {
          return false;
        }
      }
      if (isGenericDescriptor(desc)) {
        // no further validation necessary
      } else if (isDataDescriptor(current) !== isDataDescriptor(desc)) {
        if (current.configurable === false) {
          return false;
        }
      } else if (isDataDescriptor(current) && isDataDescriptor(desc)) {
        if (current.configurable === false) {
          if (current.writable === false && desc.writable === true) {
            return false;
          }
          if (current.writable === false) {
            if ('value' in desc && !sameValue(desc.value, current.value)) {
              return false;
            }
          }
        }
      } else if (isAccessorDescriptor(current) && isAccessorDescriptor(desc)) {
        if (current.configurable === false) {
          if ('set' in desc && !sameValue(desc.set, current.set)) {
            return false;
          }
          if ('get' in desc && !sameValue(desc.get, current.get)) {
            return false;
          }
        }
      }
      Object.defineProperty(target, name, desc); // should never fail
      return true;
    },
    deleteProperty: function deleteProperty(target, name) {
      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.delete(name);
      }

      var desc = Object.getOwnPropertyDescriptor(target, name);
      if (desc === undefined) {
        return true;
      }
      if (desc.configurable === true) {
        delete target[name];
        return true;
      }
      return false;
    },
    getPrototypeOf: function getPrototypeOf(target) {
      return Object.getPrototypeOf(target);
    },
    setPrototypeOf: function setPrototypeOf(target, newProto) {

      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.setPrototypeOf(newProto);
      }

      if (Object(newProto) !== newProto || newProto === null) {
        throw new TypeError("Object prototype may only be an Object or null: " + newProto);
      }

      if (!Object_isExtensible(target)) {
        return false;
      }

      var current = Object.getPrototypeOf(target);
      if (sameValue(current, newProto)) {
        return true;
      }

      if (prim_setPrototypeOf) {
        try {
          prim_setPrototypeOf(target, newProto);
          return true;
        } catch (e) {
          return false;
        }
      }

      __proto__setter.call(target, newProto);
      return true;
    },
    preventExtensions: function preventExtensions(target) {
      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.preventExtensions();
      }
      prim_preventExtensions(target);
      return true;
    },
    isExtensible: function isExtensible(target) {
      return Object.isExtensible(target);
    },
    has: function has(target, name) {
      return name in target;
    },
    get: function get(target, name, receiver) {
      receiver = receiver || target;

      // if target is a proxy, invoke its "get" trap
      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.get(receiver, name);
      }

      var desc = Object.getOwnPropertyDescriptor(target, name);
      if (desc === undefined) {
        var proto = Object.getPrototypeOf(target);
        if (proto === null) {
          return undefined;
        }
        return Reflect.get(proto, name, receiver);
      }
      if (isDataDescriptor(desc)) {
        return desc.value;
      }
      var getter = desc.get;
      if (getter === undefined) {
        return undefined;
      }
      return desc.get.call(receiver);
    },
    // Reflect.set implementation based on latest version of [[SetP]] at
    // http://wiki.ecmascript.org/doku.php?id=harmony:proto_climbing_refactoring
    set: function set(target, name, value, receiver) {
      receiver = receiver || target;

      // if target is a proxy, invoke its "set" trap
      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.set(receiver, name, value);
      }

      // first, check whether target has a non-writable property
      // shadowing name on receiver
      var ownDesc = Object.getOwnPropertyDescriptor(target, name);

      if (ownDesc === undefined) {
        // name is not defined in target, search target's prototype
        var proto = Object.getPrototypeOf(target);

        if (proto !== null) {
          // continue the search in target's prototype
          return Reflect.set(proto, name, value, receiver);
        }

        // Rev16 change. Cf. https://bugs.ecmascript.org/show_bug.cgi?id=1549
        // target was the last prototype, now we know that 'name' is not shadowed
        // by an existing (accessor or data) property, so we can add the property
        // to the initial receiver object
        // (this branch will intentionally fall through to the code below)
        ownDesc = { value: undefined,
          writable: true,
          enumerable: true,
          configurable: true };
      }

      // we now know that ownDesc !== undefined
      if (isAccessorDescriptor(ownDesc)) {
        var setter = ownDesc.set;
        if (setter === undefined) return false;
        setter.call(receiver, value); // assumes Function.prototype.call
        return true;
      }
      // otherwise, isDataDescriptor(ownDesc) must be true
      if (ownDesc.writable === false) return false;
      // we found an existing writable data property on the prototype chain.
      // Now update or add the data property on the receiver, depending on
      // whether the receiver already defines the property or not.
      var existingDesc = Object.getOwnPropertyDescriptor(receiver, name);
      if (existingDesc !== undefined) {
        var updateDesc = { value: value,
          // FIXME: it should not be necessary to describe the following
          // attributes. Added to circumvent a bug in tracemonkey:
          // https://bugzilla.mozilla.org/show_bug.cgi?id=601329
          writable: existingDesc.writable,
          enumerable: existingDesc.enumerable,
          configurable: existingDesc.configurable };
        Object.defineProperty(receiver, name, updateDesc);
        return true;
      } else {
        if (!Object.isExtensible(receiver)) return false;
        var newDesc = { value: value,
          writable: true,
          enumerable: true,
          configurable: true };
        Object.defineProperty(receiver, name, newDesc);
        return true;
      }
    },
    /*invoke: function(target, name, args, receiver) {
      receiver = receiver || target;
       var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.invoke(receiver, name, args);
      }
       var fun = Reflect.get(target, name, receiver);
      return Function.prototype.apply.call(fun, receiver, args);
    },*/
    enumerate: function enumerate(target) {
      var handler = directProxies.get(target);
      var result;
      if (handler !== undefined) {
        // handler.enumerate should return an iterator directly, but the
        // iterator gets converted to an array for backward-compat reasons,
        // so we must re-iterate over the array
        result = handler.enumerate(handler.target);
      } else {
        result = [];
        for (var name in target) {
          result.push(name);
        };
      }
      var l = +result.length;
      var idx = 0;
      return {
        next: function next() {
          if (idx === l) return { done: true };
          return { done: false, value: result[idx++] };
        }
      };
    },
    // imperfect ownKeys implementation: in ES6, should also include
    // symbol-keyed properties.
    ownKeys: function ownKeys(target) {
      return Object_getOwnPropertyNames(target);
    },
    apply: function apply(target, receiver, args) {
      // target.apply(receiver, args)
      return Function.prototype.apply.call(target, receiver, args);
    },
    construct: function construct(target, args, newTarget) {
      // return new target(...args);

      // if target is a proxy, invoke its "construct" trap
      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.construct(handler.target, args, newTarget);
      }

      if (typeof target !== "function") {
        throw new TypeError("target is not a function: " + target);
      }
      if (newTarget === undefined) {
        newTarget = target;
      } else {
        if (typeof newTarget !== "function") {
          throw new TypeError("newTarget is not a function: " + target);
        }
      }

      return new (Function.prototype.bind.apply(newTarget, [null].concat(args)))();
    }
  };

  // feature-test whether the Proxy global exists, with
  // the harmony-era Proxy.create API
  if (typeof Proxy !== "undefined" && typeof Proxy.create !== "undefined") {

    var primCreate = Proxy.create,
        primCreateFunction = Proxy.createFunction;

    var revokedHandler = primCreate({
      get: function get() {
        throw new TypeError("proxy is revoked");
      }
    });

    global.Proxy = function (target, handler) {
      // check that target is an Object
      if (Object(target) !== target) {
        throw new TypeError("Proxy target must be an Object, given " + target);
      }
      // check that handler is an Object
      if (Object(handler) !== handler) {
        throw new TypeError("Proxy handler must be an Object, given " + handler);
      }

      var vHandler = new Validator(target, handler);
      var proxy;
      if (typeof target === "function") {
        proxy = primCreateFunction(vHandler,
        // call trap
        function () {
          var args = Array.prototype.slice.call(arguments);
          return vHandler.apply(target, this, args);
        },
        // construct trap
        function () {
          var args = Array.prototype.slice.call(arguments);
          return vHandler.construct(target, args);
        });
      } else {
        proxy = primCreate(vHandler, Object.getPrototypeOf(target));
      }
      directProxies.set(proxy, vHandler);
      return proxy;
    };

    global.Proxy.revocable = function (target, handler) {
      var proxy = new Proxy(target, handler);
      var revoke = function revoke() {
        var vHandler = directProxies.get(proxy);
        if (vHandler !== null) {
          vHandler.target = null;
          vHandler.handler = revokedHandler;
        }
        return undefined;
      };
      return { proxy: proxy, revoke: revoke };
    };

    // add the old Proxy.create and Proxy.createFunction methods
    // so old code that still depends on the harmony-era Proxy object
    // is not broken. Also ensures that multiple versions of this
    // library should load fine
    global.Proxy.create = primCreate;
    global.Proxy.createFunction = primCreateFunction;
  } else {
    // Proxy global not defined, or old API not available
    if (typeof Proxy === "undefined") {
      // Proxy global not defined, add a Proxy function stub
      global.Proxy = function (_target, _handler) {
        throw new Error("proxies not supported on this platform. On v8/node/iojs, make sure to pass the --harmony_proxies flag");
      };
    }
    // Proxy global defined but old API not available
    // presumably Proxy global already supports new API, leave untouched
  }

  // for node.js modules, export every property in the Reflect object
  // as part of the module interface
  if (typeof exports !== 'undefined') {
    Object.keys(Reflect).forEach(function (key) {
      exports[key] = Reflect[key];
    });
  }

  // function-as-module pattern
}(typeof exports !== 'undefined' ? global : undefined);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYtanMvbWFpbi5lczYiLCJqcy1leHBvcnRzL3BvbHlmaWxscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQ0E7O0FBRUEsQ0FBQyxZQUFVO0FBQ1Q7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOEJBLE1BQUksWUFBWSxJQUFoQjtBQUFBLE1BQ0ksWUFBWSxJQURoQjtBQUFBLE1BRUksU0FBUyxFQUFFO0FBQ1QsU0FBSSxDQURHO0FBRVAsV0FBTSxDQUZDO0FBR1AsWUFBTyxDQUhBO0FBSVAsVUFBSztBQUpFLEdBRmI7QUFBQSxNQVFJLFFBQVEsTUFBTSxPQUFPLEtBQWIsR0FBcUIsT0FBTyxJQVJ4QztBQUFBLE1BU0ksU0FBUyxNQUFNLE9BQU8sR0FBYixHQUFtQixPQUFPLE1BVHZDOztBQVdBLE1BQUksUUFBUSxHQUFHLFlBQUgsQ0FBZ0IsR0FBRyxnQkFBbkIsQ0FBWjs7QUFFQSxNQUFJLFNBQVMsR0FBRyxRQUFILEdBQWMsS0FBZCxDQUFvQixDQUFDLEdBQUQsRUFBSyxDQUFMLENBQXBCLENBQWI7O0FBRUEsTUFBSSxhQUFhLEdBQUcsZUFBSCxHQUNkLEtBRGMsQ0FDUixNQURRLEVBQ0EsR0FBRyxTQUFILEVBREEsRUFFZCxLQUZjLENBRVIsUUFGUSxFQUVFLEdBQUcsYUFBSCxFQUZGLEVBR2QsS0FIYyxDQUdSLFFBSFEsRUFHRSxHQUFHLFdBQUgsQ0FBZSxRQUFRLENBQXZCLEVBQTBCLFNBQVMsQ0FBbkMsQ0FIRixDQUFqQjs7QUFLQSxLQUFHLEdBQUgsQ0FBTyxvQkFBUCxFQUE2QixVQUFTLElBQVQsRUFBYztBQUN6QyxZQUFRLEdBQVIsQ0FBWSxJQUFaO0FBQ0EsZ0JBQVksSUFBWjtBQUNBO0FBQ0QsR0FKRDtBQUtBLEtBQUcsR0FB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QUFSLEVBQWUsUUFBUSxNQUF2QixFQUFQO0FBQ0QsS0FYRDs7QUFhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQU8sS0FBUCxDQUFhLE1BQWIsR0FBc0IsVUFBdEI7QUFDQSxXQUFPLEtBQVAsQ0FBYSxjQUFiLEdBQThCLGtCQUE5QjtBQUVELEdBN0RELE1BNkRPO0FBQ0w7QUFDQSxRQUFJLE9BQU8sS0FBUCxLQUFpQixXQUFyQixFQUFrQztBQUNoQztBQUNBLGFBQU8sS0FBUCxHQUFlLFVBQVMsT0FBVCxFQUFrQixRQUFsQixFQUE0QjtBQUN6QyxjQUFNLElBQUksS0FBSixDQUFVLHVHQUFWLENBQU47QUFDRCxPQUZEO0FBR0Q7QUFDRDtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBLE1BQUksT0FBTyxPQUFQLEtBQW1CLFdBQXZCLEVBQW9DO0FBQ2xDLFdBQU8sSUFBUCxDQUFZLE9BQVosRUFBcUIsT0FBckIsQ0FBNkIsVUFBVSxHQUFWLEVBQWU7QUFDMUMsY0FBUSxHQUFSLElBQWUsUUFBUSxHQUFSLENBQWY7QUFDRCxLQUZEO0FBR0Q7O0FBRUQ7QUFDQyxDQXBpRXVCLENBb2lFdEIsT0FBTyxPQUFQLEtBQW1CLFdBQW5CLEdBQWlDLE1BQWpDLFlBcGlFc0IsQ0FBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiBleHBvcnRlZCBhcnJheUZpbmQgKi9cbmltcG9ydCB7IGFycmF5RmluZCB9IGZyb20gJy4uL2pzLWV4cG9ydHMvcG9seWZpbGxzJztcbiBcbihmdW5jdGlvbigpeyBcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLyp2YXIgc3BlY2llcyA9IHtcbiAgICBCOiBcIkhhbGlidXRcIixcbiAgICBDOiBcIlNhYmxlZmlzaFwiLFxuICAgIEQ6IFwiRHVuZ2VuZXNzIGNyYWJcIixcbiAgICBFOiBcIkhhaXIgQ3JhYlwiLFxuICAgIEY6IFwiRnJlc2h3YXRlciBmaXNoXCIsXG4gICAgRzogXCJIZXJyaW5nIHJvZVwiLFxuICAgIEg6IFwiSGVycmluZyAoZm9vZC9iYWl0KVwiLFxuICAgIEk6IFwiTGluZyBjb2RcIixcbiAgICBKOiBcIkdlb2R1Y2sgY2xhbXNcIixcbiAgICBLOiBcIktpbmcgY3JhYlwiLFxuICAgIEw6IFwiSGVycmluZyBzcGF3biBvbiBrZWxwXCIsXG4gICAgTTogXCJNaXNjLiBzYWx0d2F0ZXIgZmluZmlzaFwiLFxuICAgIE46IFwiU25haWxzXCIsXG4gICAgTzogXCJPY3RvcHVzL3NxdWlkXCIsXG4gICAgUDogXCJTaHJpbXBcIixcbiAgICBROiBcIlNlYSBjdWN1bWJlclwiLFxuICAgIFI6IFwiQ2xhbXNcIixcbiAgICBTOiBcIlNhbG1vblwiLFxuICAgIFQ6IFwiVGFubmVyIGNyYWJcIixcbiAgICBUQjogXCJUYW5uZXIgQmFpcmRpIGNyYWJcIixcbiAgICBVOiBcIlNlYSB1cmNoaW5cIixcbiAgICBXOiBcIlNjYWxsb3BzXCIsXG4gICAgWTogXCJSb2NrZmlzaFwiXG4gIH07XG5cbiAgdmFyIGdlYXIgPSB7XCIxXCI6XCJQVVJTRSBTRUlORVwiLFwiMlwiOlwiVkVTU0VMIFRPIDgwJ1wiLFwiNFwiOlwiU0VUIEdJTExORVRcIixcIjVcIjpcIkhBTkQgVFJPTExcIixcIjZcIjpcIkxPTkdMSU5FIFZFU1NFTCBVTkRFUiA2MCdcIixcIjdcIjpcIk9UVEVSIFRSQVdMXCIsXCI4XCI6XCJGSVNIIFdIRUVMXCIsXCI5XCI6XCJQT1QgR0VBUiBWRVNTRUwgVU5ERVIgNjAnXCIsXCIxMFwiOlwiUklORyBORVRcIixcIjExXCI6XCJESVZJTkcgR0VBUlwiLFwiMTJcIjpcIkRJVkUvSEFORCBQSUNLXCIsXCIxN1wiOlwiQkVBTSBUUkFXTFwiLFwiMThcIjpcIlNIT1ZFTFwiLFwiMjFcIjpcIlBPVU5EXCIsXCIyM1wiOlwiTUVDSEFOSUNBTCBESUdHRVJcIixcIjI1XCI6XCJESU5HTEVCQVIgVFJPTExcIixcIjI2XCI6XCJNRUNIQU5JQ0FMIEpJR1wiLFwiMzRcIjpcIkdJTExORVRcIixcIjM3XCI6XCJQQUlSIFRSQVdMXCIsXCI2MVwiOlwiTE9OR0xJTkUgVkVTU0VMIDYwJyBPUiBPVkVSXCIsXCI3N1wiOlwiR0lMTE5FVFwiLFwiOTFcIjpcIlBPVCBHRUFSIFZFU1NFTCA2MCcgT1IgT1ZFUlwifTtcblxuICB2YXIgcmVnaW9ucyA9IHtcIkFcIjpcIlNPVVRIRUFTVFwiLFwiQlwiOlwiU1RBVEVXSURFXCIsXCJEXCI6XCJZQUtVVEFUXCIsXCJFXCI6XCJQUklOQ0UgV0lMTElBTSBTT1VORFwiLFwiSlwiOlwiV0VTVFdBUkRcIixcIkxcIjpcIkNISUdOSUtcIixcIk1cIjpcIkFMQVNLQSBQRU5JTlNVTEFcIixcIlFcIjpcIkJFUklORyBTRUFcIixcIlRcIjpcIkJSSVNUT0wgQkFZXCIsXCJYXCI6XCJLT1RaRUJVRVwiLFwiSFwiOlwiQ09PSyBJTkxFVFwiLFwiU1wiOlwiU0VDVVJJVFkgQ09WRVwiLFwiVlwiOlwiQ0FQRSBBVklOT0ZcIixcIlpcIjpcIk5PUlRPTiBTT1VORFwiLFwiS1wiOlwiS09ESUFLXCIsXCJPXCI6XCJEVVRDSCBIQVJCT1JcIixcIk9BXCI6XCJBTEVVVElBTiBDRFFBUElDREFcIixcIk9CXCI6XCJBTEVVVElBTiBDRFFCQkVEQ1wiLFwiT0NcIjpcIkFMRVVUSUFOIENEUUNCU0ZBXCIsXCJPRFwiOlwiQUxFVVRJQU4gQ0RRQ1ZSRlwiLFwiT0VcIjpcIkFMRVVUSUFOIENEUU5TRURDXCIsXCJPRlwiOlwiQUxFVVRJQU4gQ0RRWURGREFcIixcIk9HXCI6XCJBTEVVVElBTiBJU0xBTkRTIEFDQUFDRENcIixcIlFBXCI6XCJCRVJJTkcgU0VBIENEUUFQSUNEQVwiLFwiUUJcIjpcIkJFUklORyBTRUEgQ0RRQkJFRENcIixcIlFDXCI6XCJCRVJJTkcgU0VBIENEUUNCU0ZBXCIsXCJRRFwiOlwiQkVSSU5HIFNFQSBDRFFDVlJGXCIsXCJRRVwiOlwiQkVSSU5HIFNFQSBDRFFOU0VEQ1wiLFwiUUZcIjpcIkJFUklORyBTRUEgQ0RRWURGREFcIixcIlRBXCI6XCJCUklTVE9MIEJBWSBDRFFBUElDREFcIixcIlRCXCI6XCJCUklTVE9MIEJBWSBDRFFCQkVEQ1wiLFwiVENcIjpcIkJSSVNUT0wgQkFZIENEUUNCU0ZBXCIsXCJURFwiOlwiQlJJU1RPTCBCQVkgQ0RRQ1ZSRlwiLFwiVEVcIjpcIkJSSVNUT0wgQkFZIENEUU5TRURDXCIsXCJURlwiOlwiQlJJU1RPTCBCQVkgQ0RRWURGREFcIixcIlpFXCI6XCJOT1JUT04gU09VTkQgQ0RRTlNFRENcIixcIlpGXCI6XCJOT1JUT04gU09VTkQgQ0RRWURGREFcIixcIkdcIjpcIkdPQVwiLFwiQUJcIjpcIlNUQVRFV0lERVwiLFwiQUdcIjpcIkdPQVwiLFwiQkJcIjpcIlNUQVRFV0lERVwiLFwiQkdcIjpcIkdPQVwiLFwiRkJcIjpcIlNUQVRFV0lERVwiLFwiRkdcIjpcIkdPQVwiLFwiR0JcIjpcIlNUQVRFV0lERVwiLFwiR0dcIjpcIkdPQVwiLFwiSEJcIjpcIlNUQVRFV0lERVwiLFwiSEdcIjpcIkdPQVwiLFwiSUJcIjpcIlNUQVRFV0lERVwiLFwiSUdcIjpcIkdPQVwiLFwiRlwiOlwiQVRLQS9BTUxJQSBJU0xBTkRTXCIsXCJSXCI6XCJBREFLXCIsXCJBRldcIjpcIkZFREVSQUwgV0FURVJTXCIsXCJBU1dcIjpcIlNUQVRFIFdBVEVSU1wiLFwiQkZXXCI6XCJGRURFUkFMIFdBVEVSU1wiLFwiQlNXXCI6XCJTVEFURSBXQVRFUlNcIn07XG4qL1xuICB2YXIgZmlzaE5vZGVzID0gbnVsbCxcbiAgICAgIGZpc2hMaW5rcyA9IG51bGwsXG4gICAgICBtYXJnaW4gPSB7IC8vIGV4cHJlc3NlZCBhcyBwZXJjZW50YWdlc1xuICAgICAgICB0b3A6MCxcbiAgICAgICAgcmlnaHQ6MCxcbiAgICAgICAgYm90dG9tOjAsXG4gICAgICAgIGxlZnQ6MFxuICAgICAgfSxcbiAgICAgIHdpZHRoID0gMTAwIC0gbWFyZ2luLnJpZ2h0IC0gbWFyZ2luLmxlZnQsXG4gICAgICBoZWlnaHQgPSAxMDAgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcblxuICB2YXIgY29sb3IgPSBkMy5zY2FsZU9yZGluYWwoZDMuc2NoZW1lQ2F0ZWdvcnkyMCk7XG5cbiAgdmFyIHJTY2FsZSA9IGQzLnNjYWxlTG9nKCkucmFuZ2UoWzAuNSw1XSk7XG5cbiAgdmFyIHNpbXVsYXRpb24gPSBkMy5mb3JjZVNpbXVsYXRpb24oKVxuICAgIC5mb3JjZShcImxpbmtcIiwgZDMuZm9yY2VMaW5rKCkpXG4gICAgLmZvcmNlKFwiY2hhcmdlXCIsIGQzLmZvcmNlTWFueUJvZHkoKSlcbiAgICAuZm9yY2UoXCJjZW50ZXJcIiwgZDMuZm9yY2VDZW50ZXIod2lkdGggLyAyLCBoZWlnaHQgLyAyKSk7XG5cbiAgZDMuY3N2KCdtYXRyaXgtaGVhZGVycy5jc3YnLCBmdW5jdGlvbihkYXRhKXtcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBmaXNoTGlua3MgPSBkYXRhO1xuICAgIGdvR2F0ZSgpO1xuICB9KTtcbiAgZDMuY3N2KCdmaXNoZXJpZXMtbm9kZXMuY3N2JywgZnVuY3Rpb24oZGF0YSl7XG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGVhY2gpe1xuICAgICAgZm9yICh2YXIga2V5IGluIGVhY2gpe1xuICAgICAgICBpZiAoIGVhY2guaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgIGlmICggIWlzTmFOKCtlYWNoW2tleV0pICl7XG4gICAgICAgICAgICBlYWNoW2tleV0gPSArZWFjaFtrZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGZpc2hOb2RlcyA9IGRhdGE7XG4gICAgZ29HYXRlKCk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGdvR2F0ZSgpe1xuICAgIGlmICggZmlzaE5vZGVzICE9PSBudWxsICYmIGZpc2hMaW5rcyAhPT0gbnVsbCApe1xuICAgICAgZ28oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIHZhciBuZXdMaW5rcyA9IFtdLFxuICBuZXR3b3JrID0ge307XG4gIFxuICBmdW5jdGlvbiBnbygpe1xuICAgIGZ1bmN0aW9uIGlzTWF0Y2goa2V5KXtcbiAgICAgIHJldHVybiBmaXNoTm9kZXMuZmluZChmdW5jdGlvbihvYmope1xuICAgICAgICByZXR1cm4gb2JqLmlkID09PSBrZXk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZmlzaExpbmtzLmZvckVhY2goZnVuY3Rpb24oZWFjaCxpKXtcbiAgICAgIGZvciAodmFyIGtleSBpbiBlYWNoKXtcbiAgICAgICAgaWYgKCBlYWNoLmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICBsZXQgbWF0Y2ggPSBpc01hdGNoKGtleSk7XG4gICAgICAgICAgbGV0IGluZGV4ID0gZmlzaE5vZGVzLmluZGV4T2YobWF0Y2gpO1xuICAgICAgICAgIGlmIChpbmRleCAhPT0gaSAmJiBlYWNoW2tleV0gIT09IFwiMFwiICl7IC8vIGlmIHNvdXJjZSBhbmQgdGFyZ2V0IGFyZSBub3QgdGhlIHNhbWVcbiAgICAgICAgICAgIG5ld0xpbmtzLnB1c2goe1xuICAgICAgICAgICAgICBzb3VyY2U6IGksXG4gICAgICAgICAgICAgIHRhcmdldDogaW5kZXgsIFxuICAgICAgICAgICAgICB2YWx1ZTogK2VhY2hba2V5XVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7IC8vIGVuZCBmb3JFYWNoXG4gICAgbmV0d29yay5ub2RlcyA9IGZpc2hOb2RlcztcbiAgICBuZXR3b3JrLmxpbmtzID0gbmV3TGlua3M7XG4gICAgY29uc29sZS5sb2cobmV0d29yayk7XG4gICAgcmVuZGVyKG5ldHdvcmspO1xuICB9IC8vIGVuZCBnbygpXG5cbiAgZnVuY3Rpb24gcmVuZGVyKG5ldHdvcmspIHtcbiAgIC8qIGlmICh0cnVlKXtcbiAgICAgIHJldHVybjtcbiAgICB9Ki9cblxuICAgIHJTY2FsZS5kb21haW4oZDMuZXh0ZW50KG5ldHdvcmsubm9kZXMsIGQgPT4gZC5jb3VudCkpO1xuXG4gICAgdmFyIHJhZGl1cyA9IDI7XG5cbiAgICB2YXIgc3ZnID0gZDMuc2VsZWN0KCdib2R5JylcbiAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCAnMTAwJScpXG4gICAgICAuYXR0cigneG1sbnMnLCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycpXG4gICAgICAuYXR0cigndmVyc2lvbicsJzEuMScpXG4gICAgICAuYXR0cigndmlld0JveCcsICcwIDAgMTAwIDEwMCcpXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBtYXJnaW4ubGVmdCArICcsJyArIG1hcmdpbi50b3AgKyAnKScpO1xuXG4gICAgdmFyIGxpbmsgPSBzdmcuYXBwZW5kKFwiZ1wiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImxpbmtzXCIpXG4gICAgICAuc2VsZWN0QWxsKFwibGluZVwiKVxuICAgICAgLmRhdGEobmV0d29yay5saW5rcylcbiAgICAgIC5lbnRlcigpLmFwcGVuZChcImxpbmVcIilcbiAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIE1hdGguc3FydChkLnZhbHVlKSAvIDIwOyB9KTtcblxuICAgIHZhciBub2RlID0gc3ZnLmFwcGVuZChcImdcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJub2Rlc1wiKVxuICAgICAgLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgICAgLmRhdGEobmV0d29yay5ub2RlcylcbiAgICAgIC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxuICAgICAgICAuYXR0cihcInJcIiwgZCA9PiByU2NhbGUoZC5jb3VudCkpXG4gICAgICAgIC5hdHRyKFwiZmlsbFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBjb2xvcihkLmNsdXN0ZXIpOyB9KVxuICAgICAgICAuY2FsbChkMy5kcmFnKClcbiAgICAgICAgICAgIC5vbihcInN0YXJ0XCIsIGRyYWdzdGFydGVkKVxuICAgICAgICAgICAgLm9uKFwiZHJhZ1wiLCBkcmFnZ2VkKVxuICAgICAgICAgICAgLm9uKFwiZW5kXCIsIGRyYWdlbmRlZCkpO1xuXG4gIG5vZGUuYXBwZW5kKFwidGl0bGVcIilcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7IH0pO1xuXG4gIHNpbXVsYXRpb25cbiAgICAgIC5ub2RlcyhuZXR3b3JrLm5vZGVzKVxuICAgICAgLm9uKFwidGlja1wiLCB0aWNrZWQpO1xuXG4gIHNpbXVsYXRpb24uZm9yY2UoXCJsaW5rXCIpXG4gICAgICAubGlua3MobmV0d29yay5saW5rcylcbiAgICAgIC5zdHJlbmd0aCgxKTtcblxuICBmdW5jdGlvbiB0aWNrZWQoKSB7XG4gICAgbGlua1xuICAgICAgICAuYXR0cihcIngxXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuc291cmNlLng7IH0pXG4gICAgICAgIC5hdHRyKFwieTFcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5zb3VyY2UueTsgfSlcbiAgICAgICAgLmF0dHIoXCJ4MlwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnRhcmdldC54OyB9KVxuICAgICAgICAuYXR0cihcInkyXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQudGFyZ2V0Lnk7IH0pO1xuXG4gICAgbm9kZVxuICAgICAgICAuYXR0cihcImN4XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICBkLnggPSBNYXRoLm1heChyYWRpdXMsIE1hdGgubWluKHdpZHRoIC0gcmFkaXVzLCBkLngpKTtcbiAgICAgICAgICByZXR1cm4gZC54O1xuICAgICAgICB9KVxuICAgICAgICAuYXR0cihcImN5XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICBkLnkgPSBNYXRoLm1heChyYWRpdXMsIE1hdGgubWluKGhlaWdodCAtIHJhZGl1cywgZC55KSk7XG4gICAgICAgICAgcmV0dXJuIGQueTtcbiAgICAgICAgfSk7XG4gIH1cblxuICAgIFxuICB9IC8vIGVuZCByZW5kZXIoKVxuICBmdW5jdGlvbiBkcmFnc3RhcnRlZChkKSB7XG4gIGlmICghZDMuZXZlbnQuYWN0aXZlKSB7XG4gICAgc2ltdWxhdGlvbi5hbHBoYVRhcmdldCgwLjMpLnJlc3RhcnQoKTtcbiAgfVxuICBkLmZ4ID0gZC54O1xuICBkLmZ5ID0gZC55O1xufVxuXG5mdW5jdGlvbiBkcmFnZ2VkKGQpIHtcbiAgZC5meCA9IGQzLmV2ZW50Lng7XG4gIGQuZnkgPSBkMy5ldmVudC55O1xufVxuXG5mdW5jdGlvbiBkcmFnZW5kZWQoZCkge1xuICBpZiAoIWQzLmV2ZW50LmFjdGl2ZSkge1xuICAgIHNpbXVsYXRpb24uYWxwaGFUYXJnZXQoMCk7XG4gIH1cbiAgZC5meCA9IG51bGw7XG4gIGQuZnkgPSBudWxsO1xufVxufSkoKTsiLCIvKipcbiAqIFNWRyBmb2N1cyBcbiAqIENvcHlyaWdodChjKSAyMDE3LCBKb2huIE9zdGVybWFuXG4gKlxuICogTUlUIExpY2Vuc2VcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIFxuICogYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIFxuICogd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIFxuICogZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgXG4gKiBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gXG4gKiBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgXG4gKiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuIC8vIElFL0VkZ2UgKHBlcmhhcHMgb3RoZXJzKSBkb2VzIG5vdCBhbGxvdyBwcm9ncmFtbWF0aWMgZm9jdXNpbmcgb2YgU1ZHIEVsZW1lbnRzICh2aWEgYGZvY3VzKClgKS4gU2FtZSBmb3IgYGJsdXIoKWAuXG5cbiBleHBvcnQgY29uc3QgU1ZHRm9jdXMgPSAoZnVuY3Rpb24oKXtcbiAgICBpZiAoICdmb2N1cycgaW4gU1ZHRWxlbWVudC5wcm90b3R5cGUgPT09IGZhbHNlICkge1xuICAgICAgU1ZHRWxlbWVudC5wcm90b3R5cGUuZm9jdXMgPSBIVE1MRWxlbWVudC5wcm90b3R5cGUuZm9jdXM7XG4gICAgfVxuICAgIGlmICggJ2JsdXInIGluIFNWR0VsZW1lbnQucHJvdG90eXBlID09PSBmYWxzZSApIHtcbiAgICAgIFNWR0VsZW1lbnQucHJvdG90eXBlLmJsdXIgPSBIVE1MRWxlbWVudC5wcm90b3R5cGUuYmx1cjtcbiAgICB9XG4gfSkoKTtcblxuXG5cblxuLyoqXG4gKiBpbm5lckhUTUwgcHJvcGVydHkgZm9yIFNWR0VsZW1lbnRcbiAqIENvcHlyaWdodChjKSAyMDEwLCBKZWZmIFNjaGlsbGVyXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDJcbiAqXG4gKiBXb3JrcyBpbiBhIFNWRyBkb2N1bWVudCBpbiBDaHJvbWUgNissIFNhZmFyaSA1KywgRmlyZWZveCA0KyBhbmQgSUU5Ky5cbiAqIFdvcmtzIGluIGEgSFRNTDUgZG9jdW1lbnQgaW4gQ2hyb21lIDcrLCBGaXJlZm94IDQrIGFuZCBJRTkrLlxuICogRG9lcyBub3Qgd29yayBpbiBPcGVyYSBzaW5jZSBpdCBkb2Vzbid0IHN1cHBvcnQgdGhlIFNWR0VsZW1lbnQgaW50ZXJmYWNlIHlldC5cbiAqXG4gKiBJIGhhdmVuJ3QgZGVjaWRlZCBvbiB0aGUgYmVzdCBuYW1lIGZvciB0aGlzIHByb3BlcnR5IC0gdGh1cyB0aGUgZHVwbGljYXRpb24uXG4gKi9cbi8vIGVkaXRlZCBieSBKb2huIE9zdGVybWFuIHRvIGRlY2xhcmUgdGhlIHZhcmlhYmxlIGBzWE1MYCwgd2hpY2ggd2FzIHJlZmVyZW5jZWQgd2l0aG91dCBiZWluZyBkZWNsYXJlZFxuLy8gd2hpY2ggZmFpbGVkIHNpbGVudGx5IGluIGltcGxpY2l0IHN0cmljdCBtb2RlIG9mIGFuIGV4cG9ydFxuXG4vLyBtb3N0IGJyb3dzZXJzIGFsbG93IHNldHRpbmcgaW5uZXJIVE1MIG9mIHN2ZyBlbGVtZW50cyBidXQgSUUgZG9lcyBub3QgKG5vdCBhbiBIVE1MIGVsZW1lbnQpXG4vLyB0aGlzIHBvbHlmaWxsIHByb3ZpZGVzIHRoYXQuIG5lY2Vzc2FyeSBmb3IgZDMgbWV0aG9kIGAuaHRtbCgpYCBvbiBzdmcgZWxlbWVudHNcblxuZXhwb3J0IGNvbnN0IFNWR0lubmVySFRNTCA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHNlcmlhbGl6ZVhNTCA9IGZ1bmN0aW9uKG5vZGUsIG91dHB1dCkge1xuICAgIHZhciBub2RlVHlwZSA9IG5vZGUubm9kZVR5cGU7XG4gICAgaWYgKG5vZGVUeXBlID09IDMpIHsgLy8gVEVYVCBub2Rlcy5cbiAgICAgIC8vIFJlcGxhY2Ugc3BlY2lhbCBYTUwgY2hhcmFjdGVycyB3aXRoIHRoZWlyIGVudGl0aWVzLlxuICAgICAgb3V0cHV0LnB1c2gobm9kZS50ZXh0Q29udGVudC5yZXBsYWNlKC8mLywgJyZhbXA7JykucmVwbGFjZSgvPC8sICcmbHQ7JykucmVwbGFjZSgnPicsICcmZ3Q7JykpO1xuICAgIH0gZWxzZSBpZiAobm9kZVR5cGUgPT0gMSkgeyAvLyBFTEVNRU5UIG5vZGVzLlxuICAgICAgLy8gU2VyaWFsaXplIEVsZW1lbnQgbm9kZXMuXG4gICAgICBvdXRwdXQucHVzaCgnPCcsIG5vZGUudGFnTmFtZSk7XG4gICAgICBpZiAobm9kZS5oYXNBdHRyaWJ1dGVzKCkpIHtcbiAgICAgICAgdmFyIGF0dHJNYXAgPSBub2RlLmF0dHJpYnV0ZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhdHRyTWFwLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgdmFyIGF0dHJOb2RlID0gYXR0ck1hcC5pdGVtKGkpO1xuICAgICAgICAgIG91dHB1dC5wdXNoKCcgJywgYXR0ck5vZGUubmFtZSwgJz1cXCcnLCBhdHRyTm9kZS52YWx1ZSwgJ1xcJycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgb3V0cHV0LnB1c2goJz4nKTtcbiAgICAgICAgdmFyIGNoaWxkTm9kZXMgPSBub2RlLmNoaWxkTm9kZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjaGlsZE5vZGVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgc2VyaWFsaXplWE1MKGNoaWxkTm9kZXMuaXRlbShpKSwgb3V0cHV0KTtcbiAgICAgICAgfVxuICAgICAgICBvdXRwdXQucHVzaCgnPC8nLCBub2RlLnRhZ05hbWUsICc+Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQucHVzaCgnLz4nKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vZGVUeXBlID09IDgpIHtcbiAgICAgIC8vIFRPRE8oY29kZWRyZWFkKTogUmVwbGFjZSBzcGVjaWFsIGNoYXJhY3RlcnMgd2l0aCBYTUwgZW50aXRpZXM/XG4gICAgICBvdXRwdXQucHVzaCgnPCEtLScsIG5vZGUubm9kZVZhbHVlLCAnLS0+Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRPRE86IEhhbmRsZSBDREFUQSBub2Rlcy5cbiAgICAgIC8vIFRPRE86IEhhbmRsZSBFTlRJVFkgbm9kZXMuXG4gICAgICAvLyBUT0RPOiBIYW5kbGUgRE9DVU1FTlQgbm9kZXMuXG4gICAgICB0aHJvdyAnRXJyb3Igc2VyaWFsaXppbmcgWE1MLiBVbmhhbmRsZWQgbm9kZSBvZiB0eXBlOiAnICsgbm9kZVR5cGU7XG4gICAgfVxuICB9XG4gIC8vIFRoZSBpbm5lckhUTUwgRE9NIHByb3BlcnR5IGZvciBTVkdFbGVtZW50LlxuICBpZiAoICdpbm5lckhUTUwnIGluIFNWR0VsZW1lbnQucHJvdG90eXBlID09PSBmYWxzZSApe1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTVkdFbGVtZW50LnByb3RvdHlwZSwgJ2lubmVySFRNTCcsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICAgICAgdmFyIGNoaWxkTm9kZSA9IHRoaXMuZmlyc3RDaGlsZDtcbiAgICAgICAgd2hpbGUgKGNoaWxkTm9kZSkge1xuICAgICAgICAgIHNlcmlhbGl6ZVhNTChjaGlsZE5vZGUsIG91dHB1dCk7XG4gICAgICAgICAgY2hpbGROb2RlID0gY2hpbGROb2RlLm5leHRTaWJsaW5nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQuam9pbignJyk7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbihtYXJrdXBUZXh0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICAvLyBXaXBlIG91dCB0aGUgY3VycmVudCBjb250ZW50cyBvZiB0aGUgZWxlbWVudC5cbiAgICAgICAgd2hpbGUgKHRoaXMuZmlyc3RDaGlsZCkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gUGFyc2UgdGhlIG1hcmt1cCBpbnRvIHZhbGlkIG5vZGVzLlxuICAgICAgICAgIHZhciBkWE1MID0gbmV3IERPTVBhcnNlcigpO1xuICAgICAgICAgIGRYTUwuYXN5bmMgPSBmYWxzZTtcbiAgICAgICAgICAvLyBXcmFwIHRoZSBtYXJrdXAgaW50byBhIFNWRyBub2RlIHRvIGVuc3VyZSBwYXJzaW5nIHdvcmtzLlxuICAgICAgICAgIGNvbnNvbGUubG9nKG1hcmt1cFRleHQpO1xuICAgICAgICAgIHZhciBzWE1MID0gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPicgKyBtYXJrdXBUZXh0ICsgJzwvc3ZnPic7XG4gICAgICAgICAgY29uc29sZS5sb2coc1hNTCk7XG4gICAgICAgICAgdmFyIHN2Z0RvY0VsZW1lbnQgPSBkWE1MLnBhcnNlRnJvbVN0cmluZyhzWE1MLCAndGV4dC94bWwnKS5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgICAgICAgICAvLyBOb3cgdGFrZSBlYWNoIG5vZGUsIGltcG9ydCBpdCBhbmQgYXBwZW5kIHRvIHRoaXMgZWxlbWVudC5cbiAgICAgICAgICB2YXIgY2hpbGROb2RlID0gc3ZnRG9jRWxlbWVudC5maXJzdENoaWxkO1xuICAgICAgICAgIHdoaWxlKGNoaWxkTm9kZSkge1xuICAgICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLm93bmVyRG9jdW1lbnQuaW1wb3J0Tm9kZShjaGlsZE5vZGUsIHRydWUpKTtcbiAgICAgICAgICAgIGNoaWxkTm9kZSA9IGNoaWxkTm9kZS5uZXh0U2libGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgcGFyc2luZyBYTUwgc3RyaW5nJyk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBUaGUgaW5uZXJTVkcgRE9NIHByb3BlcnR5IGZvciBTVkdFbGVtZW50LlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTVkdFbGVtZW50LnByb3RvdHlwZSwgJ2lubmVyU1ZHJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5uZXJIVE1MO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24obWFya3VwVGV4dCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9IG1hcmt1cFRleHQ7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pKCk7XG5cblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZpbmRcbmV4cG9ydCBjb25zdCBhcnJheUZpbmQgPSAoZnVuY3Rpb24oKXtcbiAgaWYgKCFBcnJheS5wcm90b3R5cGUuZmluZCkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsICdmaW5kJywge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKHByZWRpY2F0ZSkge1xuICAgICAgIC8vIDEuIExldCBPIGJlID8gVG9PYmplY3QodGhpcyB2YWx1ZSkuXG4gICAgICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInRoaXNcIiBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbyA9IE9iamVjdCh0aGlzKTtcblxuICAgICAgICAvLyAyLiBMZXQgbGVuIGJlID8gVG9MZW5ndGgoPyBHZXQoTywgXCJsZW5ndGhcIikpLlxuICAgICAgICB2YXIgbGVuID0gby5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgLy8gMy4gSWYgSXNDYWxsYWJsZShwcmVkaWNhdGUpIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXG4gICAgICAgIGlmICh0eXBlb2YgcHJlZGljYXRlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncHJlZGljYXRlIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gNC4gSWYgdGhpc0FyZyB3YXMgc3VwcGxpZWQsIGxldCBUIGJlIHRoaXNBcmc7IGVsc2UgbGV0IFQgYmUgdW5kZWZpbmVkLlxuICAgICAgICB2YXIgdGhpc0FyZyA9IGFyZ3VtZW50c1sxXTtcblxuICAgICAgICAvLyA1LiBMZXQgayBiZSAwLlxuICAgICAgICB2YXIgayA9IDA7XG5cbiAgICAgICAgLy8gNi4gUmVwZWF0LCB3aGlsZSBrIDwgbGVuXG4gICAgICAgIHdoaWxlIChrIDwgbGVuKSB7XG4gICAgICAgICAgLy8gYS4gTGV0IFBrIGJlICEgVG9TdHJpbmcoaykuXG4gICAgICAgICAgLy8gYi4gTGV0IGtWYWx1ZSBiZSA/IEdldChPLCBQaykuXG4gICAgICAgICAgLy8gYy4gTGV0IHRlc3RSZXN1bHQgYmUgVG9Cb29sZWFuKD8gQ2FsbChwcmVkaWNhdGUsIFQsIMKrIGtWYWx1ZSwgaywgTyDCuykpLlxuICAgICAgICAgIC8vIGQuIElmIHRlc3RSZXN1bHQgaXMgdHJ1ZSwgcmV0dXJuIGtWYWx1ZS5cbiAgICAgICAgICB2YXIga1ZhbHVlID0gb1trXTtcbiAgICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwodGhpc0FyZywga1ZhbHVlLCBrLCBvKSkge1xuICAgICAgICAgICAgcmV0dXJuIGtWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gZS4gSW5jcmVhc2UgayBieSAxLlxuICAgICAgICAgIGsrKztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDcuIFJldHVybiB1bmRlZmluZWQuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pKCk7IFxuXG4vLyBDb3B5cmlnaHQgKEMpIDIwMTEtMjAxMiBTb2Z0d2FyZSBMYW5ndWFnZXMgTGFiLCBWcmlqZSBVbml2ZXJzaXRlaXQgQnJ1c3NlbFxuLy8gVGhpcyBjb2RlIGlzIGR1YWwtbGljZW5zZWQgdW5kZXIgYm90aCB0aGUgQXBhY2hlIExpY2Vuc2UgYW5kIHRoZSBNUExcblxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8qIFZlcnNpb246IE1QTCAxLjFcbiAqXG4gKiBUaGUgY29udGVudHMgb2YgdGhpcyBmaWxlIGFyZSBzdWJqZWN0IHRvIHRoZSBNb3ppbGxhIFB1YmxpYyBMaWNlbnNlIFZlcnNpb25cbiAqIDEuMSAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiBodHRwOi8vd3d3Lm1vemlsbGEub3JnL01QTC9cbiAqXG4gKiBTb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgYmFzaXMsXG4gKiBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2VcbiAqIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHJpZ2h0cyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlXG4gKiBMaWNlbnNlLlxuICpcbiAqIFRoZSBPcmlnaW5hbCBDb2RlIGlzIGEgc2hpbSBmb3IgdGhlIEVTLUhhcm1vbnkgcmVmbGVjdGlvbiBtb2R1bGVcbiAqXG4gKiBUaGUgSW5pdGlhbCBEZXZlbG9wZXIgb2YgdGhlIE9yaWdpbmFsIENvZGUgaXNcbiAqIFRvbSBWYW4gQ3V0c2VtLCBWcmlqZSBVbml2ZXJzaXRlaXQgQnJ1c3NlbC5cbiAqIFBvcnRpb25zIGNyZWF0ZWQgYnkgdGhlIEluaXRpYWwgRGV2ZWxvcGVyIGFyZSBDb3B5cmlnaHQgKEMpIDIwMTEtMjAxMlxuICogdGhlIEluaXRpYWwgRGV2ZWxvcGVyLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIENvbnRyaWJ1dG9yKHMpOlxuICpcbiAqL1xuXG4gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gLy8gVGhpcyBmaWxlIGlzIGEgcG9seWZpbGwgZm9yIHRoZSB1cGNvbWluZyBFQ01BU2NyaXB0IFJlZmxlY3QgQVBJLFxuIC8vIGluY2x1ZGluZyBzdXBwb3J0IGZvciBQcm94aWVzLiBTZWUgdGhlIGRyYWZ0IHNwZWNpZmljYXRpb24gYXQ6XG4gLy8gaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTpyZWZsZWN0X2FwaVxuIC8vIGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6ZGlyZWN0X3Byb3hpZXNcblxuIC8vIEZvciBhbiBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgSGFuZGxlciBBUEksIHNlZSBoYW5kbGVycy5qcywgd2hpY2ggaW1wbGVtZW50czpcbiAvLyBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OnZpcnR1YWxfb2JqZWN0X2FwaVxuXG4gLy8gVGhpcyBpbXBsZW1lbnRhdGlvbiBzdXBlcnNlZGVzIHRoZSBlYXJsaWVyIHBvbHlmaWxsIGF0OlxuIC8vIGNvZGUuZ29vZ2xlLmNvbS9wL2VzLWxhYi9zb3VyY2UvYnJvd3NlL3RydW5rL3NyYy9wcm94aWVzL0RpcmVjdFByb3hpZXMuanNcblxuIC8vIFRoaXMgY29kZSB3YXMgdGVzdGVkIG9uIHRyYWNlbW9ua2V5IC8gRmlyZWZveCAxMlxuLy8gIChhbmQgc2hvdWxkIHJ1biBmaW5lIG9uIG9sZGVyIEZpcmVmb3ggdmVyc2lvbnMgc3RhcnRpbmcgd2l0aCBGRjQpXG4gLy8gVGhlIGNvZGUgYWxzbyB3b3JrcyBjb3JyZWN0bHkgb25cbiAvLyAgIHY4IC0taGFybW9ueV9wcm94aWVzIC0taGFybW9ueV93ZWFrbWFwcyAodjMuNi41LjEpXG5cbiAvLyBMYW5ndWFnZSBEZXBlbmRlbmNpZXM6XG4gLy8gIC0gRUNNQVNjcmlwdCA1L3N0cmljdFxuIC8vICAtIFwib2xkXCIgKGkuZS4gbm9uLWRpcmVjdCkgSGFybW9ueSBQcm94aWVzXG4gLy8gIC0gSGFybW9ueSBXZWFrTWFwc1xuIC8vIFBhdGNoZXM6XG4gLy8gIC0gT2JqZWN0LntmcmVlemUsc2VhbCxwcmV2ZW50RXh0ZW5zaW9uc31cbiAvLyAgLSBPYmplY3Que2lzRnJvemVuLGlzU2VhbGVkLGlzRXh0ZW5zaWJsZX1cbiAvLyAgLSBPYmplY3QuZ2V0UHJvdG90eXBlT2ZcbiAvLyAgLSBPYmplY3Qua2V5c1xuIC8vICAtIE9iamVjdC5wcm90b3R5cGUudmFsdWVPZlxuIC8vICAtIE9iamVjdC5wcm90b3R5cGUuaXNQcm90b3R5cGVPZlxuIC8vICAtIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbiAvLyAgLSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5XG4gLy8gIC0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvclxuIC8vICAtIE9iamVjdC5kZWZpbmVQcm9wZXJ0eVxuIC8vICAtIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzXG4gLy8gIC0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNcbiAvLyAgLSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzXG4gLy8gIC0gT2JqZWN0LmdldFByb3RvdHlwZU9mXG4gLy8gIC0gT2JqZWN0LnNldFByb3RvdHlwZU9mXG4gLy8gIC0gT2JqZWN0LmFzc2lnblxuIC8vICAtIEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZ1xuIC8vICAtIERhdGUucHJvdG90eXBlLnRvU3RyaW5nXG4gLy8gIC0gQXJyYXkuaXNBcnJheVxuIC8vICAtIEFycmF5LnByb3RvdHlwZS5jb25jYXRcbiAvLyAgLSBQcm94eVxuIC8vIEFkZHMgbmV3IGdsb2JhbHM6XG4gLy8gIC0gUmVmbGVjdFxuXG4gLy8gRGlyZWN0IHByb3hpZXMgY2FuIGJlIGNyZWF0ZWQgdmlhIFByb3h5KHRhcmdldCwgaGFuZGxlcilcblxuIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0IGNvbnN0IHJlZmxlY3QgPSAoZnVuY3Rpb24oZ2xvYmFsKXsgLy8gZnVuY3Rpb24tYXMtbW9kdWxlIHBhdHRlcm5cblwidXNlIHN0cmljdFwiO1xuIFxuLy8gPT09IERpcmVjdCBQcm94aWVzOiBJbnZhcmlhbnQgRW5mb3JjZW1lbnQgPT09XG5cbi8vIERpcmVjdCBwcm94aWVzIGJ1aWxkIG9uIG5vbi1kaXJlY3QgcHJveGllcyBieSBhdXRvbWF0aWNhbGx5IHdyYXBwaW5nXG4vLyBhbGwgdXNlci1kZWZpbmVkIHByb3h5IGhhbmRsZXJzIGluIGEgVmFsaWRhdG9yIGhhbmRsZXIgdGhhdCBjaGVja3MgYW5kXG4vLyBlbmZvcmNlcyBFUzUgaW52YXJpYW50cy5cblxuLy8gQSBkaXJlY3QgcHJveHkgaXMgYSBwcm94eSBmb3IgYW4gZXhpc3Rpbmcgb2JqZWN0IGNhbGxlZCB0aGUgdGFyZ2V0IG9iamVjdC5cblxuLy8gQSBWYWxpZGF0b3IgaGFuZGxlciBpcyBhIHdyYXBwZXIgZm9yIGEgdGFyZ2V0IHByb3h5IGhhbmRsZXIgSC5cbi8vIFRoZSBWYWxpZGF0b3IgZm9yd2FyZHMgYWxsIG9wZXJhdGlvbnMgdG8gSCwgYnV0IGFkZGl0aW9uYWxseVxuLy8gcGVyZm9ybXMgYSBudW1iZXIgb2YgaW50ZWdyaXR5IGNoZWNrcyBvbiB0aGUgcmVzdWx0cyBvZiBzb21lIHRyYXBzLFxuLy8gdG8gbWFrZSBzdXJlIEggZG9lcyBub3QgdmlvbGF0ZSB0aGUgRVM1IGludmFyaWFudHMgdy5yLnQuIG5vbi1jb25maWd1cmFibGVcbi8vIHByb3BlcnRpZXMgYW5kIG5vbi1leHRlbnNpYmxlLCBzZWFsZWQgb3IgZnJvemVuIG9iamVjdHMuXG5cbi8vIEZvciBlYWNoIHByb3BlcnR5IHRoYXQgSCBleHBvc2VzIGFzIG93biwgbm9uLWNvbmZpZ3VyYWJsZVxuLy8gKGUuZy4gYnkgcmV0dXJuaW5nIGEgZGVzY3JpcHRvciBmcm9tIGEgY2FsbCB0byBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IpXG4vLyB0aGUgVmFsaWRhdG9yIGhhbmRsZXIgZGVmaW5lcyB0aG9zZSBwcm9wZXJ0aWVzIG9uIHRoZSB0YXJnZXQgb2JqZWN0LlxuLy8gV2hlbiB0aGUgcHJveHkgYmVjb21lcyBub24tZXh0ZW5zaWJsZSwgYWxzbyBjb25maWd1cmFibGUgb3duIHByb3BlcnRpZXNcbi8vIGFyZSBjaGVja2VkIGFnYWluc3QgdGhlIHRhcmdldC5cbi8vIFdlIHdpbGwgY2FsbCBwcm9wZXJ0aWVzIHRoYXQgYXJlIGRlZmluZWQgb24gdGhlIHRhcmdldCBvYmplY3Rcbi8vIFwiZml4ZWQgcHJvcGVydGllc1wiLlxuXG4vLyBXZSB3aWxsIG5hbWUgZml4ZWQgbm9uLWNvbmZpZ3VyYWJsZSBwcm9wZXJ0aWVzIFwic2VhbGVkIHByb3BlcnRpZXNcIi5cbi8vIFdlIHdpbGwgbmFtZSBmaXhlZCBub24tY29uZmlndXJhYmxlIG5vbi13cml0YWJsZSBwcm9wZXJ0aWVzIFwiZnJvemVuXG4vLyBwcm9wZXJ0aWVzXCIuXG5cbi8vIFRoZSBWYWxpZGF0b3IgaGFuZGxlciB1cGhvbGRzIHRoZSBmb2xsb3dpbmcgaW52YXJpYW50cyB3LnIudC4gbm9uLWNvbmZpZ3VyYWJpbGl0eTpcbi8vIC0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIGNhbm5vdCByZXBvcnQgc2VhbGVkIHByb3BlcnRpZXMgYXMgbm9uLWV4aXN0ZW50XG4vLyAtIGdldE93blByb3BlcnR5RGVzY3JpcHRvciBjYW5ub3QgcmVwb3J0IGluY29tcGF0aWJsZSBjaGFuZ2VzIHRvIHRoZVxuLy8gICBhdHRyaWJ1dGVzIG9mIGEgc2VhbGVkIHByb3BlcnR5IChlLmcuIHJlcG9ydGluZyBhIG5vbi1jb25maWd1cmFibGVcbi8vICAgcHJvcGVydHkgYXMgY29uZmlndXJhYmxlLCBvciByZXBvcnRpbmcgYSBub24tY29uZmlndXJhYmxlLCBub24td3JpdGFibGVcbi8vICAgcHJvcGVydHkgYXMgd3JpdGFibGUpXG4vLyAtIGdldFByb3BlcnR5RGVzY3JpcHRvciBjYW5ub3QgcmVwb3J0IHNlYWxlZCBwcm9wZXJ0aWVzIGFzIG5vbi1leGlzdGVudFxuLy8gLSBnZXRQcm9wZXJ0eURlc2NyaXB0b3IgY2Fubm90IHJlcG9ydCBpbmNvbXBhdGlibGUgY2hhbmdlcyB0byB0aGVcbi8vICAgYXR0cmlidXRlcyBvZiBhIHNlYWxlZCBwcm9wZXJ0eS4gSXQgX2Nhbl8gcmVwb3J0IGluY29tcGF0aWJsZSBjaGFuZ2VzXG4vLyAgIHRvIHRoZSBhdHRyaWJ1dGVzIG9mIG5vbi1vd24sIGluaGVyaXRlZCBwcm9wZXJ0aWVzLlxuLy8gLSBkZWZpbmVQcm9wZXJ0eSBjYW5ub3QgbWFrZSBpbmNvbXBhdGlibGUgY2hhbmdlcyB0byB0aGUgYXR0cmlidXRlcyBvZlxuLy8gICBzZWFsZWQgcHJvcGVydGllc1xuLy8gLSBkZWxldGVQcm9wZXJ0eSBjYW5ub3QgcmVwb3J0IGEgc3VjY2Vzc2Z1bCBkZWxldGlvbiBvZiBhIHNlYWxlZCBwcm9wZXJ0eVxuLy8gLSBoYXNPd24gY2Fubm90IHJlcG9ydCBhIHNlYWxlZCBwcm9wZXJ0eSBhcyBub24tZXhpc3RlbnRcbi8vIC0gaGFzIGNhbm5vdCByZXBvcnQgYSBzZWFsZWQgcHJvcGVydHkgYXMgbm9uLWV4aXN0ZW50XG4vLyAtIGdldCBjYW5ub3QgcmVwb3J0IGluY29uc2lzdGVudCB2YWx1ZXMgZm9yIGZyb3plbiBkYXRhXG4vLyAgIHByb3BlcnRpZXMsIGFuZCBtdXN0IHJlcG9ydCB1bmRlZmluZWQgZm9yIHNlYWxlZCBhY2Nlc3NvcnMgd2l0aCBhblxuLy8gICB1bmRlZmluZWQgZ2V0dGVyXG4vLyAtIHNldCBjYW5ub3QgcmVwb3J0IGEgc3VjY2Vzc2Z1bCBhc3NpZ25tZW50IGZvciBmcm96ZW4gZGF0YVxuLy8gICBwcm9wZXJ0aWVzIG9yIHNlYWxlZCBhY2Nlc3NvcnMgd2l0aCBhbiB1bmRlZmluZWQgc2V0dGVyLlxuLy8gLSBnZXR7T3dufVByb3BlcnR5TmFtZXMgbGlzdHMgYWxsIHNlYWxlZCBwcm9wZXJ0aWVzIG9mIHRoZSB0YXJnZXQuXG4vLyAtIGtleXMgbGlzdHMgYWxsIGVudW1lcmFibGUgc2VhbGVkIHByb3BlcnRpZXMgb2YgdGhlIHRhcmdldC5cbi8vIC0gZW51bWVyYXRlIGxpc3RzIGFsbCBlbnVtZXJhYmxlIHNlYWxlZCBwcm9wZXJ0aWVzIG9mIHRoZSB0YXJnZXQuXG4vLyAtIGlmIGEgcHJvcGVydHkgb2YgYSBub24tZXh0ZW5zaWJsZSBwcm94eSBpcyByZXBvcnRlZCBhcyBub24tZXhpc3RlbnQsXG4vLyAgIHRoZW4gaXQgbXVzdCBmb3JldmVyIGJlIHJlcG9ydGVkIGFzIG5vbi1leGlzdGVudC4gVGhpcyBhcHBsaWVzIHRvXG4vLyAgIG93biBhbmQgaW5oZXJpdGVkIHByb3BlcnRpZXMgYW5kIGlzIGVuZm9yY2VkIGluIHRoZVxuLy8gICBkZWxldGVQcm9wZXJ0eSwgZ2V0e093bn1Qcm9wZXJ0eURlc2NyaXB0b3IsIGhhc3tPd259LFxuLy8gICBnZXR7T3dufVByb3BlcnR5TmFtZXMsIGtleXMgYW5kIGVudW1lcmF0ZSB0cmFwc1xuXG4vLyBWaW9sYXRpb24gb2YgYW55IG9mIHRoZXNlIGludmFyaWFudHMgYnkgSCB3aWxsIHJlc3VsdCBpbiBUeXBlRXJyb3IgYmVpbmdcbi8vIHRocm93bi5cblxuLy8gQWRkaXRpb25hbGx5LCBvbmNlIE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucywgT2JqZWN0LnNlYWwgb3IgT2JqZWN0LmZyZWV6ZVxuLy8gaXMgaW52b2tlZCBvbiB0aGUgcHJveHksIHRoZSBzZXQgb2Ygb3duIHByb3BlcnR5IG5hbWVzIGZvciB0aGUgcHJveHkgaXNcbi8vIGZpeGVkLiBBbnkgcHJvcGVydHkgbmFtZSB0aGF0IGlzIG5vdCBmaXhlZCBpcyBjYWxsZWQgYSAnbmV3JyBwcm9wZXJ0eS5cblxuLy8gVGhlIFZhbGlkYXRvciB1cGhvbGRzIHRoZSBmb2xsb3dpbmcgaW52YXJpYW50cyByZWdhcmRpbmcgZXh0ZW5zaWJpbGl0eTpcbi8vIC0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIGNhbm5vdCByZXBvcnQgbmV3IHByb3BlcnRpZXMgYXMgZXhpc3RlbnRcbi8vICAgKGl0IG11c3QgcmVwb3J0IHRoZW0gYXMgbm9uLWV4aXN0ZW50IGJ5IHJldHVybmluZyB1bmRlZmluZWQpXG4vLyAtIGRlZmluZVByb3BlcnR5IGNhbm5vdCBzdWNjZXNzZnVsbHkgYWRkIGEgbmV3IHByb3BlcnR5IChpdCBtdXN0IHJlamVjdClcbi8vIC0gZ2V0T3duUHJvcGVydHlOYW1lcyBjYW5ub3QgbGlzdCBuZXcgcHJvcGVydGllc1xuLy8gLSBoYXNPd24gY2Fubm90IHJlcG9ydCB0cnVlIGZvciBuZXcgcHJvcGVydGllcyAoaXQgbXVzdCByZXBvcnQgZmFsc2UpXG4vLyAtIGtleXMgY2Fubm90IGxpc3QgbmV3IHByb3BlcnRpZXNcblxuLy8gSW52YXJpYW50cyBjdXJyZW50bHkgbm90IGVuZm9yY2VkOlxuLy8gLSBnZXRPd25Qcm9wZXJ0eU5hbWVzIGxpc3RzIG9ubHkgb3duIHByb3BlcnR5IG5hbWVzXG4vLyAtIGtleXMgbGlzdHMgb25seSBlbnVtZXJhYmxlIG93biBwcm9wZXJ0eSBuYW1lc1xuLy8gQm90aCB0cmFwcyBtYXkgbGlzdCBtb3JlIHByb3BlcnR5IG5hbWVzIHRoYW4gYXJlIGFjdHVhbGx5IGRlZmluZWQgb24gdGhlXG4vLyB0YXJnZXQuXG5cbi8vIEludmFyaWFudHMgd2l0aCByZWdhcmQgdG8gaW5oZXJpdGFuY2UgYXJlIGN1cnJlbnRseSBub3QgZW5mb3JjZWQuXG4vLyAtIGEgbm9uLWNvbmZpZ3VyYWJsZSBwb3RlbnRpYWxseSBpbmhlcml0ZWQgcHJvcGVydHkgb24gYSBwcm94eSB3aXRoXG4vLyAgIG5vbi1tdXRhYmxlIGFuY2VzdHJ5IGNhbm5vdCBiZSByZXBvcnRlZCBhcyBub24tZXhpc3RlbnRcbi8vIChBbiBvYmplY3Qgd2l0aCBub24tbXV0YWJsZSBhbmNlc3RyeSBpcyBhIG5vbi1leHRlbnNpYmxlIG9iamVjdCB3aG9zZVxuLy8gW1tQcm90b3R5cGVdXSBpcyBlaXRoZXIgbnVsbCBvciBhbiBvYmplY3Qgd2l0aCBub24tbXV0YWJsZSBhbmNlc3RyeS4pXG5cbi8vIENoYW5nZXMgaW4gSGFuZGxlciBBUEkgY29tcGFyZWQgdG8gcHJldmlvdXMgaGFybW9ueTpwcm94aWVzLCBzZWU6XG4vLyBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1zdHJhd21hbjpkaXJlY3RfcHJveGllc1xuLy8gaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTpkaXJlY3RfcHJveGllc1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIC0tLS0gV2Vha01hcCBwb2x5ZmlsbCAtLS0tXG5cbi8vIFRPRE86IGZpbmQgYSBwcm9wZXIgV2Vha01hcCBwb2x5ZmlsbFxuXG4vLyBkZWZpbmUgYW4gZW1wdHkgV2Vha01hcCBzbyB0aGF0IGF0IGxlYXN0IHRoZSBSZWZsZWN0IG1vZHVsZSBjb2RlXG4vLyB3aWxsIHdvcmsgaW4gdGhlIGFic2VuY2Ugb2YgV2Vha01hcHMuIFByb3h5IGVtdWxhdGlvbiBkZXBlbmRzIG9uXG4vLyBhY3R1YWwgV2Vha01hcHMsIHNvIHdpbGwgbm90IHdvcmsgd2l0aCB0aGlzIGxpdHRsZSBzaGltLlxuaWYgKHR5cGVvZiBXZWFrTWFwID09PSBcInVuZGVmaW5lZFwiKSB7XG4gIGdsb2JhbC5XZWFrTWFwID0gZnVuY3Rpb24oKXt9O1xuICBnbG9iYWwuV2Vha01hcC5wcm90b3R5cGUgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbihrKSB7IHJldHVybiB1bmRlZmluZWQ7IH0sXG4gICAgc2V0OiBmdW5jdGlvbihrLHYpIHsgdGhyb3cgbmV3IEVycm9yKFwiV2Vha01hcCBub3Qgc3VwcG9ydGVkXCIpOyB9XG4gIH07XG59XG5cbi8vIC0tLS0gTm9ybWFsaXphdGlvbiBmdW5jdGlvbnMgZm9yIHByb3BlcnR5IGRlc2NyaXB0b3JzIC0tLS1cblxuZnVuY3Rpb24gaXNTdGFuZGFyZEF0dHJpYnV0ZShuYW1lKSB7XG4gIHJldHVybiAvXihnZXR8c2V0fHZhbHVlfHdyaXRhYmxlfGVudW1lcmFibGV8Y29uZmlndXJhYmxlKSQvLnRlc3QobmFtZSk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBFUzUgc2VjdGlvbiA4LjEwLjVcbmZ1bmN0aW9uIHRvUHJvcGVydHlEZXNjcmlwdG9yKG9iaikge1xuICBpZiAoT2JqZWN0KG9iaikgIT09IG9iaikge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJwcm9wZXJ0eSBkZXNjcmlwdG9yIHNob3VsZCBiZSBhbiBPYmplY3QsIGdpdmVuOiBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iaik7XG4gIH1cbiAgdmFyIGRlc2MgPSB7fTtcbiAgaWYgKCdlbnVtZXJhYmxlJyBpbiBvYmopIHsgZGVzYy5lbnVtZXJhYmxlID0gISFvYmouZW51bWVyYWJsZTsgfVxuICBpZiAoJ2NvbmZpZ3VyYWJsZScgaW4gb2JqKSB7IGRlc2MuY29uZmlndXJhYmxlID0gISFvYmouY29uZmlndXJhYmxlOyB9XG4gIGlmICgndmFsdWUnIGluIG9iaikgeyBkZXNjLnZhbHVlID0gb2JqLnZhbHVlOyB9XG4gIGlmICgnd3JpdGFibGUnIGluIG9iaikgeyBkZXNjLndyaXRhYmxlID0gISFvYmoud3JpdGFibGU7IH1cbiAgaWYgKCdnZXQnIGluIG9iaikge1xuICAgIHZhciBnZXR0ZXIgPSBvYmouZ2V0O1xuICAgIGlmIChnZXR0ZXIgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZ2V0dGVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJwcm9wZXJ0eSBkZXNjcmlwdG9yICdnZXQnIGF0dHJpYnV0ZSBtdXN0IGJlIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImNhbGxhYmxlIG9yIHVuZGVmaW5lZCwgZ2l2ZW46IFwiK2dldHRlcik7XG4gICAgfVxuICAgIGRlc2MuZ2V0ID0gZ2V0dGVyO1xuICB9XG4gIGlmICgnc2V0JyBpbiBvYmopIHtcbiAgICB2YXIgc2V0dGVyID0gb2JqLnNldDtcbiAgICBpZiAoc2V0dGVyICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHNldHRlciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwicHJvcGVydHkgZGVzY3JpcHRvciAnc2V0JyBhdHRyaWJ1dGUgbXVzdCBiZSBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjYWxsYWJsZSBvciB1bmRlZmluZWQsIGdpdmVuOiBcIitzZXR0ZXIpO1xuICAgIH1cbiAgICBkZXNjLnNldCA9IHNldHRlcjtcbiAgfVxuICBpZiAoJ2dldCcgaW4gZGVzYyB8fCAnc2V0JyBpbiBkZXNjKSB7XG4gICAgaWYgKCd2YWx1ZScgaW4gZGVzYyB8fCAnd3JpdGFibGUnIGluIGRlc2MpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJwcm9wZXJ0eSBkZXNjcmlwdG9yIGNhbm5vdCBiZSBib3RoIGEgZGF0YSBhbmQgYW4gXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWNjZXNzb3IgZGVzY3JpcHRvcjogXCIrb2JqKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlc2M7XG59XG5cbmZ1bmN0aW9uIGlzQWNjZXNzb3JEZXNjcmlwdG9yKGRlc2MpIHtcbiAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gKCdnZXQnIGluIGRlc2MgfHwgJ3NldCcgaW4gZGVzYyk7XG59XG5mdW5jdGlvbiBpc0RhdGFEZXNjcmlwdG9yKGRlc2MpIHtcbiAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gKCd2YWx1ZScgaW4gZGVzYyB8fCAnd3JpdGFibGUnIGluIGRlc2MpO1xufVxuZnVuY3Rpb24gaXNHZW5lcmljRGVzY3JpcHRvcihkZXNjKSB7XG4gIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuICFpc0FjY2Vzc29yRGVzY3JpcHRvcihkZXNjKSAmJiAhaXNEYXRhRGVzY3JpcHRvcihkZXNjKTtcbn1cblxuZnVuY3Rpb24gdG9Db21wbGV0ZVByb3BlcnR5RGVzY3JpcHRvcihkZXNjKSB7XG4gIHZhciBpbnRlcm5hbERlc2MgPSB0b1Byb3BlcnR5RGVzY3JpcHRvcihkZXNjKTtcbiAgaWYgKGlzR2VuZXJpY0Rlc2NyaXB0b3IoaW50ZXJuYWxEZXNjKSB8fCBpc0RhdGFEZXNjcmlwdG9yKGludGVybmFsRGVzYykpIHtcbiAgICBpZiAoISgndmFsdWUnIGluIGludGVybmFsRGVzYykpIHsgaW50ZXJuYWxEZXNjLnZhbHVlID0gdW5kZWZpbmVkOyB9XG4gICAgaWYgKCEoJ3dyaXRhYmxlJyBpbiBpbnRlcm5hbERlc2MpKSB7IGludGVybmFsRGVzYy53cml0YWJsZSA9IGZhbHNlOyB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKCEoJ2dldCcgaW4gaW50ZXJuYWxEZXNjKSkgeyBpbnRlcm5hbERlc2MuZ2V0ID0gdW5kZWZpbmVkOyB9XG4gICAgaWYgKCEoJ3NldCcgaW4gaW50ZXJuYWxEZXNjKSkgeyBpbnRlcm5hbERlc2Muc2V0ID0gdW5kZWZpbmVkOyB9XG4gIH1cbiAgaWYgKCEoJ2VudW1lcmFibGUnIGluIGludGVybmFsRGVzYykpIHsgaW50ZXJuYWxEZXNjLmVudW1lcmFibGUgPSBmYWxzZTsgfVxuICBpZiAoISgnY29uZmlndXJhYmxlJyBpbiBpbnRlcm5hbERlc2MpKSB7IGludGVybmFsRGVzYy5jb25maWd1cmFibGUgPSBmYWxzZTsgfVxuICByZXR1cm4gaW50ZXJuYWxEZXNjO1xufVxuXG5mdW5jdGlvbiBpc0VtcHR5RGVzY3JpcHRvcihkZXNjKSB7XG4gIHJldHVybiAhKCdnZXQnIGluIGRlc2MpICYmXG4gICAgICAgICAhKCdzZXQnIGluIGRlc2MpICYmXG4gICAgICAgICAhKCd2YWx1ZScgaW4gZGVzYykgJiZcbiAgICAgICAgICEoJ3dyaXRhYmxlJyBpbiBkZXNjKSAmJlxuICAgICAgICAgISgnZW51bWVyYWJsZScgaW4gZGVzYykgJiZcbiAgICAgICAgICEoJ2NvbmZpZ3VyYWJsZScgaW4gZGVzYyk7XG59XG5cbmZ1bmN0aW9uIGlzRXF1aXZhbGVudERlc2NyaXB0b3IoZGVzYzEsIGRlc2MyKSB7XG4gIHJldHVybiBzYW1lVmFsdWUoZGVzYzEuZ2V0LCBkZXNjMi5nZXQpICYmXG4gICAgICAgICBzYW1lVmFsdWUoZGVzYzEuc2V0LCBkZXNjMi5zZXQpICYmXG4gICAgICAgICBzYW1lVmFsdWUoZGVzYzEudmFsdWUsIGRlc2MyLnZhbHVlKSAmJlxuICAgICAgICAgc2FtZVZhbHVlKGRlc2MxLndyaXRhYmxlLCBkZXNjMi53cml0YWJsZSkgJiZcbiAgICAgICAgIHNhbWVWYWx1ZShkZXNjMS5lbnVtZXJhYmxlLCBkZXNjMi5lbnVtZXJhYmxlKSAmJlxuICAgICAgICAgc2FtZVZhbHVlKGRlc2MxLmNvbmZpZ3VyYWJsZSwgZGVzYzIuY29uZmlndXJhYmxlKTtcbn1cblxuLy8gY29waWVkIGZyb20gaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsXG5mdW5jdGlvbiBzYW1lVmFsdWUoeCwgeSkge1xuICBpZiAoeCA9PT0geSkge1xuICAgIC8vIDAgPT09IC0wLCBidXQgdGhleSBhcmUgbm90IGlkZW50aWNhbFxuICAgIHJldHVybiB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geTtcbiAgfVxuXG4gIC8vIE5hTiAhPT0gTmFOLCBidXQgdGhleSBhcmUgaWRlbnRpY2FsLlxuICAvLyBOYU5zIGFyZSB0aGUgb25seSBub24tcmVmbGV4aXZlIHZhbHVlLCBpLmUuLCBpZiB4ICE9PSB4LFxuICAvLyB0aGVuIHggaXMgYSBOYU4uXG4gIC8vIGlzTmFOIGlzIGJyb2tlbjogaXQgY29udmVydHMgaXRzIGFyZ3VtZW50IHRvIG51bWJlciwgc29cbiAgLy8gaXNOYU4oXCJmb29cIikgPT4gdHJ1ZVxuICByZXR1cm4geCAhPT0geCAmJiB5ICE9PSB5O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmcmVzaCBwcm9wZXJ0eSBkZXNjcmlwdG9yIHRoYXQgaXMgZ3VhcmFudGVlZFxuICogdG8gYmUgY29tcGxldGUgKGkuZS4gY29udGFpbiBhbGwgdGhlIHN0YW5kYXJkIGF0dHJpYnV0ZXMpLlxuICogQWRkaXRpb25hbGx5LCBhbnkgbm9uLXN0YW5kYXJkIGVudW1lcmFibGUgcHJvcGVydGllcyBvZlxuICogYXR0cmlidXRlcyBhcmUgY29waWVkIG92ZXIgdG8gdGhlIGZyZXNoIGRlc2NyaXB0b3IuXG4gKlxuICogSWYgYXR0cmlidXRlcyBpcyB1bmRlZmluZWQsIHJldHVybnMgdW5kZWZpbmVkLlxuICpcbiAqIFNlZSBhbHNvOiBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OnByb3hpZXNfc2VtYW50aWNzXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZUFuZENvbXBsZXRlUHJvcGVydHlEZXNjcmlwdG9yKGF0dHJpYnV0ZXMpIHtcbiAgaWYgKGF0dHJpYnV0ZXMgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gIHZhciBkZXNjID0gdG9Db21wbGV0ZVByb3BlcnR5RGVzY3JpcHRvcihhdHRyaWJ1dGVzKTtcbiAgLy8gTm90ZTogbm8gbmVlZCB0byBjYWxsIEZyb21Qcm9wZXJ0eURlc2NyaXB0b3IoZGVzYyksIGFzIHdlIHJlcHJlc2VudFxuICAvLyBcImludGVybmFsXCIgcHJvcGVydHkgZGVzY3JpcHRvcnMgYXMgcHJvcGVyIE9iamVjdHMgZnJvbSB0aGUgc3RhcnRcbiAgZm9yICh2YXIgbmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKCFpc1N0YW5kYXJkQXR0cmlidXRlKG5hbWUpKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVzYywgbmFtZSxcbiAgICAgICAgeyB2YWx1ZTogYXR0cmlidXRlc1tuYW1lXSxcbiAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlc2M7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZyZXNoIHByb3BlcnR5IGRlc2NyaXB0b3Igd2hvc2Ugc3RhbmRhcmRcbiAqIGF0dHJpYnV0ZXMgYXJlIGd1YXJhbnRlZWQgdG8gYmUgZGF0YSBwcm9wZXJ0aWVzIG9mIHRoZSByaWdodCB0eXBlLlxuICogQWRkaXRpb25hbGx5LCBhbnkgbm9uLXN0YW5kYXJkIGVudW1lcmFibGUgcHJvcGVydGllcyBvZlxuICogYXR0cmlidXRlcyBhcmUgY29waWVkIG92ZXIgdG8gdGhlIGZyZXNoIGRlc2NyaXB0b3IuXG4gKlxuICogSWYgYXR0cmlidXRlcyBpcyB1bmRlZmluZWQsIHdpbGwgdGhyb3cgYSBUeXBlRXJyb3IuXG4gKlxuICogU2VlIGFsc286IGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6cHJveGllc19zZW1hbnRpY3NcbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplUHJvcGVydHlEZXNjcmlwdG9yKGF0dHJpYnV0ZXMpIHtcbiAgdmFyIGRlc2MgPSB0b1Byb3BlcnR5RGVzY3JpcHRvcihhdHRyaWJ1dGVzKTtcbiAgLy8gTm90ZTogbm8gbmVlZCB0byBjYWxsIEZyb21HZW5lcmljUHJvcGVydHlEZXNjcmlwdG9yKGRlc2MpLCBhcyB3ZSByZXByZXNlbnRcbiAgLy8gXCJpbnRlcm5hbFwiIHByb3BlcnR5IGRlc2NyaXB0b3JzIGFzIHByb3BlciBPYmplY3RzIGZyb20gdGhlIHN0YXJ0XG4gIGZvciAodmFyIG5hbWUgaW4gYXR0cmlidXRlcykge1xuICAgIGlmICghaXNTdGFuZGFyZEF0dHJpYnV0ZShuYW1lKSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlc2MsIG5hbWUsXG4gICAgICAgIHsgdmFsdWU6IGF0dHJpYnV0ZXNbbmFtZV0sXG4gICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkZXNjO1xufVxuXG4vLyBzdG9yZSBhIHJlZmVyZW5jZSB0byB0aGUgcmVhbCBFUzUgcHJpbWl0aXZlcyBiZWZvcmUgcGF0Y2hpbmcgdGhlbSBsYXRlclxudmFyIHByaW1fcHJldmVudEV4dGVuc2lvbnMgPSAgICAgICAgT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zLFxuICAgIHByaW1fc2VhbCA9ICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LnNlYWwsXG4gICAgcHJpbV9mcmVlemUgPSAgICAgICAgICAgICAgICAgICBPYmplY3QuZnJlZXplLFxuICAgIHByaW1faXNFeHRlbnNpYmxlID0gICAgICAgICAgICAgT2JqZWN0LmlzRXh0ZW5zaWJsZSxcbiAgICBwcmltX2lzU2VhbGVkID0gICAgICAgICAgICAgICAgIE9iamVjdC5pc1NlYWxlZCxcbiAgICBwcmltX2lzRnJvemVuID0gICAgICAgICAgICAgICAgIE9iamVjdC5pc0Zyb3plbixcbiAgICBwcmltX2dldFByb3RvdHlwZU9mID0gICAgICAgICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZixcbiAgICBwcmltX2dldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gICAgcHJpbV9kZWZpbmVQcm9wZXJ0eSA9ICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHksXG4gICAgcHJpbV9kZWZpbmVQcm9wZXJ0aWVzID0gICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyxcbiAgICBwcmltX2tleXMgPSAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzLFxuICAgIHByaW1fZ2V0T3duUHJvcGVydHlOYW1lcyA9ICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMsXG4gICAgcHJpbV9nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxuICAgIHByaW1fYXNzaWduID0gICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbixcbiAgICBwcmltX2lzQXJyYXkgPSAgICAgICAgICAgICAgICAgIEFycmF5LmlzQXJyYXksXG4gICAgcHJpbV9jb25jYXQgPSAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuY29uY2F0LFxuICAgIHByaW1faXNQcm90b3R5cGVPZiA9ICAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mLFxuICAgIHByaW1faGFzT3duUHJvcGVydHkgPSAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLy8gdGhlc2Ugd2lsbCBwb2ludCB0byB0aGUgcGF0Y2hlZCB2ZXJzaW9ucyBvZiB0aGUgcmVzcGVjdGl2ZSBtZXRob2RzIG9uXG4vLyBPYmplY3QuIFRoZXkgYXJlIHVzZWQgd2l0aGluIHRoaXMgbW9kdWxlIGFzIHRoZSBcImludHJpbnNpY1wiIGJpbmRpbmdzXG4vLyBvZiB0aGVzZSBtZXRob2RzIChpLmUuIHRoZSBcIm9yaWdpbmFsXCIgYmluZGluZ3MgYXMgZGVmaW5lZCBpbiB0aGUgc3BlYylcbnZhciBPYmplY3RfaXNGcm96ZW4sXG4gICAgT2JqZWN0X2lzU2VhbGVkLFxuICAgIE9iamVjdF9pc0V4dGVuc2libGUsXG4gICAgT2JqZWN0X2dldFByb3RvdHlwZU9mLFxuICAgIE9iamVjdF9nZXRPd25Qcm9wZXJ0eU5hbWVzO1xuXG4vKipcbiAqIEEgcHJvcGVydHkgJ25hbWUnIGlzIGZpeGVkIGlmIGl0IGlzIGFuIG93biBwcm9wZXJ0eSBvZiB0aGUgdGFyZ2V0LlxuICovXG5mdW5jdGlvbiBpc0ZpeGVkKG5hbWUsIHRhcmdldCkge1xuICByZXR1cm4gKHt9KS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRhcmdldCwgbmFtZSk7XG59XG5mdW5jdGlvbiBpc1NlYWxlZChuYW1lLCB0YXJnZXQpIHtcbiAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSk7XG4gIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIHJldHVybiBkZXNjLmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2U7XG59XG5mdW5jdGlvbiBpc1NlYWxlZERlc2MoZGVzYykge1xuICByZXR1cm4gZGVzYyAhPT0gdW5kZWZpbmVkICYmIGRlc2MuY29uZmlndXJhYmxlID09PSBmYWxzZTtcbn1cblxuLyoqXG4gKiBQZXJmb3JtcyBhbGwgdmFsaWRhdGlvbiB0aGF0IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBwZXJmb3JtcyxcbiAqIHdpdGhvdXQgYWN0dWFsbHkgZGVmaW5pbmcgdGhlIHByb3BlcnR5LiBSZXR1cm5zIGEgYm9vbGVhblxuICogaW5kaWNhdGluZyB3aGV0aGVyIHZhbGlkYXRpb24gc3VjY2VlZGVkLlxuICpcbiAqIEltcGxlbWVudGF0aW9uIHRyYW5zbGl0ZXJhdGVkIGZyb20gRVM1LjEgc2VjdGlvbiA4LjEyLjlcbiAqL1xuZnVuY3Rpb24gaXNDb21wYXRpYmxlRGVzY3JpcHRvcihleHRlbnNpYmxlLCBjdXJyZW50LCBkZXNjKSB7XG4gIGlmIChjdXJyZW50ID09PSB1bmRlZmluZWQgJiYgZXh0ZW5zaWJsZSA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGN1cnJlbnQgPT09IHVuZGVmaW5lZCAmJiBleHRlbnNpYmxlID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGlzRW1wdHlEZXNjcmlwdG9yKGRlc2MpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGlzRXF1aXZhbGVudERlc2NyaXB0b3IoY3VycmVudCwgZGVzYykpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoY3VycmVudC5jb25maWd1cmFibGUgPT09IGZhbHNlKSB7XG4gICAgaWYgKGRlc2MuY29uZmlndXJhYmxlID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICgnZW51bWVyYWJsZScgaW4gZGVzYyAmJiBkZXNjLmVudW1lcmFibGUgIT09IGN1cnJlbnQuZW51bWVyYWJsZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICBpZiAoaXNHZW5lcmljRGVzY3JpcHRvcihkZXNjKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChpc0RhdGFEZXNjcmlwdG9yKGN1cnJlbnQpICE9PSBpc0RhdGFEZXNjcmlwdG9yKGRlc2MpKSB7XG4gICAgaWYgKGN1cnJlbnQuY29uZmlndXJhYmxlID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoaXNEYXRhRGVzY3JpcHRvcihjdXJyZW50KSAmJiBpc0RhdGFEZXNjcmlwdG9yKGRlc2MpKSB7XG4gICAgaWYgKGN1cnJlbnQuY29uZmlndXJhYmxlID09PSBmYWxzZSkge1xuICAgICAgaWYgKGN1cnJlbnQud3JpdGFibGUgPT09IGZhbHNlICYmIGRlc2Mud3JpdGFibGUgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnQud3JpdGFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgIGlmICgndmFsdWUnIGluIGRlc2MgJiYgIXNhbWVWYWx1ZShkZXNjLnZhbHVlLCBjdXJyZW50LnZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoaXNBY2Nlc3NvckRlc2NyaXB0b3IoY3VycmVudCkgJiYgaXNBY2Nlc3NvckRlc2NyaXB0b3IoZGVzYykpIHtcbiAgICBpZiAoY3VycmVudC5jb25maWd1cmFibGUgPT09IGZhbHNlKSB7XG4gICAgICBpZiAoJ3NldCcgaW4gZGVzYyAmJiAhc2FtZVZhbHVlKGRlc2Muc2V0LCBjdXJyZW50LnNldCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCdnZXQnIGluIGRlc2MgJiYgIXNhbWVWYWx1ZShkZXNjLmdldCwgY3VycmVudC5nZXQpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIEVTNiA3LjMuMTEgU2V0SW50ZWdyaXR5TGV2ZWxcbi8vIGxldmVsIGlzIG9uZSBvZiBcInNlYWxlZFwiIG9yIFwiZnJvemVuXCJcbmZ1bmN0aW9uIHNldEludGVncml0eUxldmVsKHRhcmdldCwgbGV2ZWwpIHtcbiAgdmFyIG93blByb3BzID0gT2JqZWN0X2dldE93blByb3BlcnR5TmFtZXModGFyZ2V0KTtcbiAgdmFyIHBlbmRpbmdFeGNlcHRpb24gPSB1bmRlZmluZWQ7XG4gIGlmIChsZXZlbCA9PT0gXCJzZWFsZWRcIikge1xuICAgIHZhciBsID0gK293blByb3BzLmxlbmd0aDtcbiAgICB2YXIgaztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgayA9IFN0cmluZyhvd25Qcm9wc1tpXSk7XG4gICAgICB0cnkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrLCB7IGNvbmZpZ3VyYWJsZTogZmFsc2UgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChwZW5kaW5nRXhjZXB0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBwZW5kaW5nRXhjZXB0aW9uID0gZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBsZXZlbCA9PT0gXCJmcm96ZW5cIlxuICAgIHZhciBsID0gK293blByb3BzLmxlbmd0aDtcbiAgICB2YXIgaztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgayA9IFN0cmluZyhvd25Qcm9wc1tpXSk7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgY3VycmVudERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgayk7XG4gICAgICAgIGlmIChjdXJyZW50RGVzYyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGRlc2M7XG4gICAgICAgICAgaWYgKGlzQWNjZXNzb3JEZXNjcmlwdG9yKGN1cnJlbnREZXNjKSkge1xuICAgICAgICAgICAgZGVzYyA9IHsgY29uZmlndXJhYmxlOiBmYWxzZSB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlc2MgPSB7IGNvbmZpZ3VyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiBmYWxzZSB9XG4gICAgICAgICAgfVxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGssIGRlc2MpO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKHBlbmRpbmdFeGNlcHRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHBlbmRpbmdFeGNlcHRpb24gPSBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChwZW5kaW5nRXhjZXB0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBwZW5kaW5nRXhjZXB0aW9uO1xuICB9XG4gIHJldHVybiBSZWZsZWN0LnByZXZlbnRFeHRlbnNpb25zKHRhcmdldCk7XG59XG5cbi8vIEVTNiA3LjMuMTIgVGVzdEludGVncml0eUxldmVsXG4vLyBsZXZlbCBpcyBvbmUgb2YgXCJzZWFsZWRcIiBvciBcImZyb3plblwiXG5mdW5jdGlvbiB0ZXN0SW50ZWdyaXR5TGV2ZWwodGFyZ2V0LCBsZXZlbCkge1xuICB2YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0X2lzRXh0ZW5zaWJsZSh0YXJnZXQpO1xuICBpZiAoaXNFeHRlbnNpYmxlKSByZXR1cm4gZmFsc2U7XG4gIFxuICB2YXIgb3duUHJvcHMgPSBPYmplY3RfZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpO1xuICB2YXIgcGVuZGluZ0V4Y2VwdGlvbiA9IHVuZGVmaW5lZDtcbiAgdmFyIGNvbmZpZ3VyYWJsZSA9IGZhbHNlO1xuICB2YXIgd3JpdGFibGUgPSBmYWxzZTtcbiAgXG4gIHZhciBsID0gK293blByb3BzLmxlbmd0aDtcbiAgdmFyIGs7XG4gIHZhciBjdXJyZW50RGVzYztcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICBrID0gU3RyaW5nKG93blByb3BzW2ldKTtcbiAgICB0cnkge1xuICAgICAgY3VycmVudERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgayk7XG4gICAgICBjb25maWd1cmFibGUgPSBjb25maWd1cmFibGUgfHwgY3VycmVudERlc2MuY29uZmlndXJhYmxlO1xuICAgICAgaWYgKGlzRGF0YURlc2NyaXB0b3IoY3VycmVudERlc2MpKSB7XG4gICAgICAgIHdyaXRhYmxlID0gd3JpdGFibGUgfHwgY3VycmVudERlc2Mud3JpdGFibGU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKHBlbmRpbmdFeGNlcHRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwZW5kaW5nRXhjZXB0aW9uID0gZTtcbiAgICAgICAgY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHBlbmRpbmdFeGNlcHRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IHBlbmRpbmdFeGNlcHRpb247XG4gIH1cbiAgaWYgKGxldmVsID09PSBcImZyb3plblwiICYmIHdyaXRhYmxlID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChjb25maWd1cmFibGUgPT09IHRydWUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIC0tLS0gVGhlIFZhbGlkYXRvciBoYW5kbGVyIHdyYXBwZXIgYXJvdW5kIHVzZXIgaGFuZGxlcnMgLS0tLVxuXG4vKipcbiAqIEBwYXJhbSB0YXJnZXQgdGhlIG9iamVjdCB3cmFwcGVkIGJ5IHRoaXMgcHJveHkuXG4gKiBBcyBsb25nIGFzIHRoZSBwcm94eSBpcyBleHRlbnNpYmxlLCBvbmx5IG5vbi1jb25maWd1cmFibGUgcHJvcGVydGllc1xuICogYXJlIGNoZWNrZWQgYWdhaW5zdCB0aGUgdGFyZ2V0LiBPbmNlIHRoZSBwcm94eSBiZWNvbWVzIG5vbi1leHRlbnNpYmxlLFxuICogaW52YXJpYW50cyB3LnIudC4gbm9uLWV4dGVuc2liaWxpdHkgYXJlIGFsc28gZW5mb3JjZWQuXG4gKlxuICogQHBhcmFtIGhhbmRsZXIgdGhlIGhhbmRsZXIgb2YgdGhlIGRpcmVjdCBwcm94eS4gVGhlIG9iamVjdCBlbXVsYXRlZCBieVxuICogdGhpcyBoYW5kbGVyIGlzIHZhbGlkYXRlZCBhZ2FpbnN0IHRoZSB0YXJnZXQgb2JqZWN0IG9mIHRoZSBkaXJlY3QgcHJveHkuXG4gKiBBbnkgdmlvbGF0aW9ucyB0aGF0IHRoZSBoYW5kbGVyIG1ha2VzIGFnYWluc3QgdGhlIGludmFyaWFudHNcbiAqIG9mIHRoZSB0YXJnZXQgd2lsbCBjYXVzZSBhIFR5cGVFcnJvciB0byBiZSB0aHJvd24uXG4gKlxuICogQm90aCB0YXJnZXQgYW5kIGhhbmRsZXIgbXVzdCBiZSBwcm9wZXIgT2JqZWN0cyBhdCBpbml0aWFsaXphdGlvbiB0aW1lLlxuICovXG5mdW5jdGlvbiBWYWxpZGF0b3IodGFyZ2V0LCBoYW5kbGVyKSB7XG4gIC8vIGZvciBub24tcmV2b2thYmxlIHByb3hpZXMsIHRoZXNlIGFyZSBjb25zdCByZWZlcmVuY2VzXG4gIC8vIGZvciByZXZva2FibGUgcHJveGllcywgb24gcmV2b2NhdGlvbjpcbiAgLy8gLSB0aGlzLnRhcmdldCBpcyBzZXQgdG8gbnVsbFxuICAvLyAtIHRoaXMuaGFuZGxlciBpcyBzZXQgdG8gYSBoYW5kbGVyIHRoYXQgdGhyb3dzIG9uIGFsbCB0cmFwc1xuICB0aGlzLnRhcmdldCAgPSB0YXJnZXQ7XG4gIHRoaXMuaGFuZGxlciA9IGhhbmRsZXI7XG59XG5cblZhbGlkYXRvci5wcm90b3R5cGUgPSB7XG5cbiAgLyoqXG4gICAqIElmIGdldFRyYXAgcmV0dXJucyB1bmRlZmluZWQsIHRoZSBjYWxsZXIgc2hvdWxkIHBlcmZvcm0gdGhlXG4gICAqIGRlZmF1bHQgZm9yd2FyZGluZyBiZWhhdmlvci5cbiAgICogSWYgZ2V0VHJhcCByZXR1cm5zIG5vcm1hbGx5IG90aGVyd2lzZSwgdGhlIHJldHVybiB2YWx1ZVxuICAgKiB3aWxsIGJlIGEgY2FsbGFibGUgdHJhcCBmdW5jdGlvbi4gV2hlbiBjYWxsaW5nIHRoZSB0cmFwIGZ1bmN0aW9uLFxuICAgKiB0aGUgY2FsbGVyIGlzIHJlc3BvbnNpYmxlIGZvciBiaW5kaW5nIGl0cyB8dGhpc3wgdG8gfHRoaXMuaGFuZGxlcnwuXG4gICAqL1xuICBnZXRUcmFwOiBmdW5jdGlvbih0cmFwTmFtZSkge1xuICAgIHZhciB0cmFwID0gdGhpcy5oYW5kbGVyW3RyYXBOYW1lXTtcbiAgICBpZiAodHJhcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyB0aGUgdHJhcCB3YXMgbm90IGRlZmluZWQsXG4gICAgICAvLyBwZXJmb3JtIHRoZSBkZWZhdWx0IGZvcndhcmRpbmcgYmVoYXZpb3JcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0cmFwICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IodHJhcE5hbWUgKyBcIiB0cmFwIGlzIG5vdCBjYWxsYWJsZTogXCIrdHJhcCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRyYXA7XG4gIH0sXG5cbiAgLy8gPT09IGZ1bmRhbWVudGFsIHRyYXBzID09PVxuXG4gIC8qKlxuICAgKiBJZiBuYW1lIGRlbm90ZXMgYSBmaXhlZCBwcm9wZXJ0eSwgY2hlY2s6XG4gICAqICAgLSB3aGV0aGVyIHRhcmdldEhhbmRsZXIgcmVwb3J0cyBpdCBhcyBleGlzdGVudFxuICAgKiAgIC0gd2hldGhlciB0aGUgcmV0dXJuZWQgZGVzY3JpcHRvciBpcyBjb21wYXRpYmxlIHdpdGggdGhlIGZpeGVkIHByb3BlcnR5XG4gICAqIElmIHRoZSBwcm94eSBpcyBub24tZXh0ZW5zaWJsZSwgY2hlY2s6XG4gICAqICAgLSB3aGV0aGVyIG5hbWUgaXMgbm90IGEgbmV3IHByb3BlcnR5XG4gICAqIEFkZGl0aW9uYWxseSwgdGhlIHJldHVybmVkIGRlc2NyaXB0b3IgaXMgbm9ybWFsaXplZCBhbmQgY29tcGxldGVkLlxuICAgKi9cbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgdHJhcCA9IHRoaXMuZ2V0VHJhcChcImdldE93blByb3BlcnR5RGVzY3JpcHRvclwiKTtcbiAgICBpZiAodHJhcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGhpcy50YXJnZXQsIG5hbWUpO1xuICAgIH1cblxuICAgIG5hbWUgPSBTdHJpbmcobmFtZSk7XG4gICAgdmFyIGRlc2MgPSB0cmFwLmNhbGwodGhpcy5oYW5kbGVyLCB0aGlzLnRhcmdldCwgbmFtZSk7XG4gICAgZGVzYyA9IG5vcm1hbGl6ZUFuZENvbXBsZXRlUHJvcGVydHlEZXNjcmlwdG9yKGRlc2MpO1xuXG4gICAgdmFyIHRhcmdldERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMudGFyZ2V0LCBuYW1lKTtcbiAgICB2YXIgZXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGUodGhpcy50YXJnZXQpO1xuXG4gICAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGlzU2VhbGVkRGVzYyh0YXJnZXREZXNjKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2Fubm90IHJlcG9ydCBub24tY29uZmlndXJhYmxlIHByb3BlcnR5ICdcIituYW1lK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiJyBhcyBub24tZXhpc3RlbnRcIik7XG4gICAgICB9XG4gICAgICBpZiAoIWV4dGVuc2libGUgJiYgdGFyZ2V0RGVzYyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgLy8gaWYgaGFuZGxlciBpcyBhbGxvd2VkIHRvIHJldHVybiB1bmRlZmluZWQsIHdlIGNhbm5vdCBndWFyYW50ZWVcbiAgICAgICAgICAvLyB0aGF0IGl0IHdpbGwgbm90IHJldHVybiBhIGRlc2NyaXB0b3IgZm9yIHRoaXMgcHJvcGVydHkgbGF0ZXIuXG4gICAgICAgICAgLy8gT25jZSBhIHByb3BlcnR5IGhhcyBiZWVuIHJlcG9ydGVkIGFzIG5vbi1leGlzdGVudCBvbiBhIG5vbi1leHRlbnNpYmxlXG4gICAgICAgICAgLy8gb2JqZWN0LCBpdCBzaG91bGQgZm9yZXZlciBiZSByZXBvcnRlZCBhcyBub24tZXhpc3RlbnRcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2Fubm90IHJlcG9ydCBleGlzdGluZyBvd24gcHJvcGVydHkgJ1wiK25hbWUrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIicgYXMgbm9uLWV4aXN0ZW50IG9uIGEgbm9uLWV4dGVuc2libGUgb2JqZWN0XCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBhdCB0aGlzIHBvaW50LCB3ZSBrbm93IChkZXNjICE9PSB1bmRlZmluZWQpLCBpLmUuXG4gICAgLy8gdGFyZ2V0SGFuZGxlciByZXBvcnRzICduYW1lJyBhcyBhbiBleGlzdGluZyBwcm9wZXJ0eVxuXG4gICAgLy8gTm90ZTogd2UgY291bGQgY29sbGFwc2UgdGhlIGZvbGxvd2luZyB0d28gaWYtdGVzdHMgaW50byBhIHNpbmdsZVxuICAgIC8vIHRlc3QuIFNlcGFyYXRpbmcgb3V0IHRoZSBjYXNlcyB0byBpbXByb3ZlIGVycm9yIHJlcG9ydGluZy5cblxuICAgIGlmICghZXh0ZW5zaWJsZSkge1xuICAgICAgaWYgKHRhcmdldERlc2MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2Fubm90IHJlcG9ydCBhIG5ldyBvd24gcHJvcGVydHkgJ1wiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgKyBcIicgb24gYSBub24tZXh0ZW5zaWJsZSBvYmplY3RcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKCFpc0NvbXBhdGlibGVEZXNjcmlwdG9yKGV4dGVuc2libGUsIHRhcmdldERlc2MsIGRlc2MpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW5ub3QgcmVwb3J0IGluY29tcGF0aWJsZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9yIHByb3BlcnR5ICdcIituYW1lK1wiJ1wiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaWYgKGRlc2MuY29uZmlndXJhYmxlID09PSBmYWxzZSkge1xuICAgICAgaWYgKHRhcmdldERlc2MgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXREZXNjLmNvbmZpZ3VyYWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyBpZiB0aGUgcHJvcGVydHkgaXMgY29uZmlndXJhYmxlIG9yIG5vbi1leGlzdGVudCBvbiB0aGUgdGFyZ2V0LFxuICAgICAgICAvLyBidXQgaXMgcmVwb3J0ZWQgYXMgYSBub24tY29uZmlndXJhYmxlIHByb3BlcnR5LCBpdCBtYXkgbGF0ZXIgYmVcbiAgICAgICAgLy8gcmVwb3J0ZWQgYXMgY29uZmlndXJhYmxlIG9yIG5vbi1leGlzdGVudCwgd2hpY2ggdmlvbGF0ZXMgdGhlXG4gICAgICAgIC8vIGludmFyaWFudCB0aGF0IGlmIHRoZSBwcm9wZXJ0eSBtaWdodCBjaGFuZ2Ugb3IgZGlzYXBwZWFyLCB0aGVcbiAgICAgICAgLy8gY29uZmlndXJhYmxlIGF0dHJpYnV0ZSBtdXN0IGJlIHRydWUuXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJjYW5ub3QgcmVwb3J0IGEgbm9uLWNvbmZpZ3VyYWJsZSBkZXNjcmlwdG9yIFwiICtcbiAgICAgICAgICBcImZvciBjb25maWd1cmFibGUgb3Igbm9uLWV4aXN0ZW50IHByb3BlcnR5ICdcIiArIG5hbWUgKyBcIidcIik7XG4gICAgICB9XG4gICAgICBpZiAoJ3dyaXRhYmxlJyBpbiBkZXNjICYmIGRlc2Mud3JpdGFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgIGlmICh0YXJnZXREZXNjLndyaXRhYmxlID09PSB0cnVlKSB7XG4gICAgICAgICAgLy8gaWYgdGhlIHByb3BlcnR5IGlzIG5vbi1jb25maWd1cmFibGUsIHdyaXRhYmxlIG9uIHRoZSB0YXJnZXQsXG4gICAgICAgICAgLy8gYnV0IGlzIHJlcG9ydGVkIGFzIG5vbi1jb25maWd1cmFibGUsIG5vbi13cml0YWJsZSwgaXQgbWF5IGxhdGVyXG4gICAgICAgICAgLy8gYmUgcmVwb3J0ZWQgYXMgbm9uLWNvbmZpZ3VyYWJsZSwgd3JpdGFibGUgYWdhaW4sIHdoaWNoIHZpb2xhdGVzXG4gICAgICAgICAgLy8gdGhlIGludmFyaWFudCB0aGF0IGEgbm9uLWNvbmZpZ3VyYWJsZSwgbm9uLXdyaXRhYmxlIHByb3BlcnR5XG4gICAgICAgICAgLy8gbWF5IG5vdCBjaGFuZ2Ugc3RhdGUuXG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgIFwiY2Fubm90IHJlcG9ydCBub24tY29uZmlndXJhYmxlLCB3cml0YWJsZSBwcm9wZXJ0eSAnXCIgKyBuYW1lICtcbiAgICAgICAgICAgIFwiJyBhcyBub24tY29uZmlndXJhYmxlLCBub24td3JpdGFibGVcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVzYztcbiAgfSxcblxuICAvKipcbiAgICogSW4gdGhlIGRpcmVjdCBwcm94aWVzIGRlc2lnbiB3aXRoIHJlZmFjdG9yZWQgcHJvdG90eXBlIGNsaW1iaW5nLFxuICAgKiB0aGlzIHRyYXAgaXMgZGVwcmVjYXRlZC4gRm9yIHByb3hpZXMtYXMtcHJvdG90eXBlcywgaW5zdGVhZFxuICAgKiBvZiBjYWxsaW5nIHRoaXMgdHJhcCwgdGhlIGdldCwgc2V0LCBoYXMgb3IgZW51bWVyYXRlIHRyYXBzIGFyZVxuICAgKiBjYWxsZWQgaW5zdGVhZC5cbiAgICpcbiAgICogSW4gdGhpcyBpbXBsZW1lbnRhdGlvbiwgd2UgXCJhYnVzZVwiIGdldFByb3BlcnR5RGVzY3JpcHRvciB0b1xuICAgKiBzdXBwb3J0IHRyYXBwaW5nIHRoZSBnZXQgb3Igc2V0IHRyYXBzIGZvciBwcm94aWVzLWFzLXByb3RvdHlwZXMuXG4gICAqIFdlIGRvIHRoaXMgYnkgcmV0dXJuaW5nIGEgZ2V0dGVyL3NldHRlciBwYWlyIHRoYXQgaW52b2tlc1xuICAgKiB0aGUgY29ycmVzcG9uZGluZyB0cmFwcy5cbiAgICpcbiAgICogV2hpbGUgdGhpcyBoYWNrIHdvcmtzIGZvciBpbmhlcml0ZWQgcHJvcGVydHkgYWNjZXNzLCBpdCBoYXMgc29tZVxuICAgKiBxdWlya3M6XG4gICAqXG4gICAqIEluIEZpcmVmb3gsIHRoaXMgdHJhcCBpcyBvbmx5IGNhbGxlZCBhZnRlciBhIHByaW9yIGludm9jYXRpb25cbiAgICogb2YgdGhlICdoYXMnIHRyYXAgaGFzIHJldHVybmVkIHRydWUuIEhlbmNlLCBleHBlY3QgdGhlIGZvbGxvd2luZ1xuICAgKiBiZWhhdmlvcjpcbiAgICogPGNvZGU+XG4gICAqIHZhciBjaGlsZCA9IE9iamVjdC5jcmVhdGUoUHJveHkodGFyZ2V0LCBoYW5kbGVyKSk7XG4gICAqIGNoaWxkW25hbWVdIC8vIHRyaWdnZXJzIGhhbmRsZXIuaGFzKHRhcmdldCwgbmFtZSlcbiAgICogLy8gaWYgdGhhdCByZXR1cm5zIHRydWUsIHRyaWdnZXJzIGhhbmRsZXIuZ2V0KHRhcmdldCwgbmFtZSwgY2hpbGQpXG4gICAqIDwvY29kZT5cbiAgICpcbiAgICogT24gdjgsIHRoZSAnaW4nIG9wZXJhdG9yLCB3aGVuIGFwcGxpZWQgdG8gYW4gb2JqZWN0IHRoYXQgaW5oZXJpdHNcbiAgICogZnJvbSBhIHByb3h5LCB3aWxsIGNhbGwgZ2V0UHJvcGVydHlEZXNjcmlwdG9yIGFuZCB3YWxrIHRoZSBwcm90by1jaGFpbi5cbiAgICogVGhhdCBjYWxscyB0aGUgYmVsb3cgZ2V0UHJvcGVydHlEZXNjcmlwdG9yIHRyYXAgb24gdGhlIHByb3h5LiBUaGVcbiAgICogcmVzdWx0IG9mIHRoZSAnaW4nLW9wZXJhdG9yIGlzIHRoZW4gZGV0ZXJtaW5lZCBieSB3aGV0aGVyIHRoaXMgdHJhcFxuICAgKiByZXR1cm5zIHVuZGVmaW5lZCBvciBhIHByb3BlcnR5IGRlc2NyaXB0b3Igb2JqZWN0LiBUaGF0IGlzIHdoeVxuICAgKiB3ZSBmaXJzdCBleHBsaWNpdGx5IHRyaWdnZXIgdGhlICdoYXMnIHRyYXAgdG8gZGV0ZXJtaW5lIHdoZXRoZXJcbiAgICogdGhlIHByb3BlcnR5IGV4aXN0cy5cbiAgICpcbiAgICogVGhpcyBoYXMgdGhlIHNpZGUtZWZmZWN0IHRoYXQgd2hlbiBlbnVtZXJhdGluZyBwcm9wZXJ0aWVzIG9uXG4gICAqIGFuIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gYSBwcm94eSBpbiB2OCwgb25seSBwcm9wZXJ0aWVzXG4gICAqIGZvciB3aGljaCAnaGFzJyByZXR1cm5zIHRydWUgYXJlIHJldHVybmVkOlxuICAgKlxuICAgKiA8Y29kZT5cbiAgICogdmFyIGNoaWxkID0gT2JqZWN0LmNyZWF0ZShQcm94eSh0YXJnZXQsIGhhbmRsZXIpKTtcbiAgICogZm9yICh2YXIgcHJvcCBpbiBjaGlsZCkge1xuICAgKiAgIC8vIG9ubHkgZW51bWVyYXRlcyBwcm9wIGlmIChwcm9wIGluIGNoaWxkKSByZXR1cm5zIHRydWVcbiAgICogfVxuICAgKiA8L2NvZGU+XG4gICAqL1xuICBnZXRQcm9wZXJ0eURlc2NyaXB0b3I6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgaGFuZGxlciA9IHRoaXM7XG5cbiAgICBpZiAoIWhhbmRsZXIuaGFzKG5hbWUpKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBoYW5kbGVyLmdldCh0aGlzLCBuYW1lKTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICBpZiAoaGFuZGxlci5zZXQodGhpcywgbmFtZSwgdmFsKSkge1xuICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImZhaWxlZCBhc3NpZ25tZW50IHRvIFwiK25hbWUpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIElmIG5hbWUgZGVub3RlcyBhIGZpeGVkIHByb3BlcnR5LCBjaGVjayBmb3IgaW5jb21wYXRpYmxlIGNoYW5nZXMuXG4gICAqIElmIHRoZSBwcm94eSBpcyBub24tZXh0ZW5zaWJsZSwgY2hlY2sgdGhhdCBuZXcgcHJvcGVydGllcyBhcmUgcmVqZWN0ZWQuXG4gICAqL1xuICBkZWZpbmVQcm9wZXJ0eTogZnVuY3Rpb24obmFtZSwgZGVzYykge1xuICAgIC8vIFRPRE8odHZjdXRzZW0pOiB0aGUgY3VycmVudCB0cmFjZW1vbmtleSBpbXBsZW1lbnRhdGlvbiBvZiBwcm94aWVzXG4gICAgLy8gYXV0by1jb21wbGV0ZXMgJ2Rlc2MnLCB3aGljaCBpcyBub3QgY29ycmVjdC4gJ2Rlc2MnIHNob3VsZCBiZVxuICAgIC8vIG5vcm1hbGl6ZWQsIGJ1dCBub3QgY29tcGxldGVkLiBDb25zaWRlcjpcbiAgICAvLyBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJveHksICdmb28nLCB7ZW51bWVyYWJsZTpmYWxzZX0pXG4gICAgLy8gVGhpcyB0cmFwIHdpbGwgcmVjZWl2ZSBkZXNjID1cbiAgICAvLyAge3ZhbHVlOnVuZGVmaW5lZCx3cml0YWJsZTpmYWxzZSxlbnVtZXJhYmxlOmZhbHNlLGNvbmZpZ3VyYWJsZTpmYWxzZX1cbiAgICAvLyBUaGlzIHdpbGwgYWxzbyBzZXQgYWxsIG90aGVyIGF0dHJpYnV0ZXMgdG8gdGhlaXIgZGVmYXVsdCB2YWx1ZSxcbiAgICAvLyB3aGljaCBpcyB1bmV4cGVjdGVkIGFuZCBkaWZmZXJlbnQgZnJvbSBbW0RlZmluZU93blByb3BlcnR5XV0uXG4gICAgLy8gQnVnIGZpbGVkOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02MDEzMjlcblxuICAgIHZhciB0cmFwID0gdGhpcy5nZXRUcmFwKFwiZGVmaW5lUHJvcGVydHlcIik7XG4gICAgaWYgKHRyYXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gZGVmYXVsdCBmb3J3YXJkaW5nIGJlaGF2aW9yXG4gICAgICByZXR1cm4gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLnRhcmdldCwgbmFtZSwgZGVzYyk7XG4gICAgfVxuXG4gICAgbmFtZSA9IFN0cmluZyhuYW1lKTtcbiAgICB2YXIgZGVzY09iaiA9IG5vcm1hbGl6ZVByb3BlcnR5RGVzY3JpcHRvcihkZXNjKTtcbiAgICB2YXIgc3VjY2VzcyA9IHRyYXAuY2FsbCh0aGlzLmhhbmRsZXIsIHRoaXMudGFyZ2V0LCBuYW1lLCBkZXNjT2JqKTtcbiAgICBzdWNjZXNzID0gISFzdWNjZXNzOyAvLyBjb2VyY2UgdG8gQm9vbGVhblxuXG4gICAgaWYgKHN1Y2Nlc3MgPT09IHRydWUpIHtcblxuICAgICAgdmFyIHRhcmdldERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMudGFyZ2V0LCBuYW1lKTtcbiAgICAgIHZhciBleHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSh0aGlzLnRhcmdldCk7XG5cbiAgICAgIC8vIE5vdGU6IHdlIGNvdWxkIGNvbGxhcHNlIHRoZSBmb2xsb3dpbmcgdHdvIGlmLXRlc3RzIGludG8gYSBzaW5nbGVcbiAgICAgIC8vIHRlc3QuIFNlcGFyYXRpbmcgb3V0IHRoZSBjYXNlcyB0byBpbXByb3ZlIGVycm9yIHJlcG9ydGluZy5cblxuICAgICAgaWYgKCFleHRlbnNpYmxlKSB7XG4gICAgICAgIGlmICh0YXJnZXREZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2Fubm90IHN1Y2Nlc3NmdWxseSBhZGQgYSBuZXcgcHJvcGVydHkgJ1wiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSArIFwiJyB0byBhIG5vbi1leHRlbnNpYmxlIG9iamVjdFwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGFyZ2V0RGVzYyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICghaXNDb21wYXRpYmxlRGVzY3JpcHRvcihleHRlbnNpYmxlLCB0YXJnZXREZXNjLCBkZXNjKSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW5ub3QgZGVmaW5lIGluY29tcGF0aWJsZSBwcm9wZXJ0eSBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRvciBmb3IgcHJvcGVydHkgJ1wiK25hbWUrXCInXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0RhdGFEZXNjcmlwdG9yKHRhcmdldERlc2MpICYmXG4gICAgICAgICAgICB0YXJnZXREZXNjLmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UgJiZcbiAgICAgICAgICAgIHRhcmdldERlc2Mud3JpdGFibGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGlmIChkZXNjLmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UgJiYgZGVzYy53cml0YWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgLy8gaWYgdGhlIHByb3BlcnR5IGlzIG5vbi1jb25maWd1cmFibGUsIHdyaXRhYmxlIG9uIHRoZSB0YXJnZXRcbiAgICAgICAgICAgICAgLy8gYnV0IHdhcyBzdWNjZXNzZnVsbHkgcmVwb3J0ZWQgdG8gYmUgdXBkYXRlZCB0b1xuICAgICAgICAgICAgICAvLyBub24tY29uZmlndXJhYmxlLCBub24td3JpdGFibGUsIGl0IGNhbiBsYXRlciBiZSByZXBvcnRlZFxuICAgICAgICAgICAgICAvLyBhZ2FpbiBhcyBub24tY29uZmlndXJhYmxlLCB3cml0YWJsZSwgd2hpY2ggdmlvbGF0ZXNcbiAgICAgICAgICAgICAgLy8gdGhlIGludmFyaWFudCB0aGF0IG5vbi1jb25maWd1cmFibGUsIG5vbi13cml0YWJsZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgIC8vIGNhbm5vdCBjaGFuZ2Ugc3RhdGVcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgICAgICBcImNhbm5vdCBzdWNjZXNzZnVsbHkgZGVmaW5lIG5vbi1jb25maWd1cmFibGUsIHdyaXRhYmxlIFwiICtcbiAgICAgICAgICAgICAgICBcIiBwcm9wZXJ0eSAnXCIgKyBuYW1lICsgXCInIGFzIG5vbi1jb25maWd1cmFibGUsIG5vbi13cml0YWJsZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChkZXNjLmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UgJiYgIWlzU2VhbGVkRGVzYyh0YXJnZXREZXNjKSkge1xuICAgICAgICAvLyBpZiB0aGUgcHJvcGVydHkgaXMgY29uZmlndXJhYmxlIG9yIG5vbi1leGlzdGVudCBvbiB0aGUgdGFyZ2V0LFxuICAgICAgICAvLyBidXQgaXMgc3VjY2Vzc2Z1bGx5IGJlaW5nIHJlZGVmaW5lZCBhcyBhIG5vbi1jb25maWd1cmFibGUgcHJvcGVydHksXG4gICAgICAgIC8vIGl0IG1heSBsYXRlciBiZSByZXBvcnRlZCBhcyBjb25maWd1cmFibGUgb3Igbm9uLWV4aXN0ZW50LCB3aGljaCB2aW9sYXRlc1xuICAgICAgICAvLyB0aGUgaW52YXJpYW50IHRoYXQgaWYgdGhlIHByb3BlcnR5IG1pZ2h0IGNoYW5nZSBvciBkaXNhcHBlYXIsIHRoZVxuICAgICAgICAvLyBjb25maWd1cmFibGUgYXR0cmlidXRlIG11c3QgYmUgdHJ1ZS5cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcImNhbm5vdCBzdWNjZXNzZnVsbHkgZGVmaW5lIGEgbm9uLWNvbmZpZ3VyYWJsZSBcIiArXG4gICAgICAgICAgXCJkZXNjcmlwdG9yIGZvciBjb25maWd1cmFibGUgb3Igbm9uLWV4aXN0ZW50IHByb3BlcnR5ICdcIiArXG4gICAgICAgICAgbmFtZSArIFwiJ1wiKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBzdWNjZXNzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBPbiBzdWNjZXNzLCBjaGVjayB3aGV0aGVyIHRoZSB0YXJnZXQgb2JqZWN0IGlzIGluZGVlZCBub24tZXh0ZW5zaWJsZS5cbiAgICovXG4gIHByZXZlbnRFeHRlbnNpb25zOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHJhcCA9IHRoaXMuZ2V0VHJhcChcInByZXZlbnRFeHRlbnNpb25zXCIpO1xuICAgIGlmICh0cmFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGRlZmF1bHQgZm9yd2FyZGluZyBiZWhhdmlvclxuICAgICAgcmV0dXJuIFJlZmxlY3QucHJldmVudEV4dGVuc2lvbnModGhpcy50YXJnZXQpO1xuICAgIH1cblxuICAgIHZhciBzdWNjZXNzID0gdHJhcC5jYWxsKHRoaXMuaGFuZGxlciwgdGhpcy50YXJnZXQpO1xuICAgIHN1Y2Nlc3MgPSAhIXN1Y2Nlc3M7IC8vIGNvZXJjZSB0byBCb29sZWFuXG4gICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgIGlmIChPYmplY3RfaXNFeHRlbnNpYmxlKHRoaXMudGFyZ2V0KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2FuJ3QgcmVwb3J0IGV4dGVuc2libGUgb2JqZWN0IGFzIG5vbi1leHRlbnNpYmxlOiBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdWNjZXNzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJZiBuYW1lIGRlbm90ZXMgYSBzZWFsZWQgcHJvcGVydHksIGNoZWNrIHdoZXRoZXIgaGFuZGxlciByZWplY3RzLlxuICAgKi9cbiAgZGVsZXRlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHRyYXAgPSB0aGlzLmdldFRyYXAoXCJkZWxldGVQcm9wZXJ0eVwiKTtcbiAgICBpZiAodHJhcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBkZWZhdWx0IGZvcndhcmRpbmcgYmVoYXZpb3JcbiAgICAgIHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRoaXMudGFyZ2V0LCBuYW1lKTtcbiAgICB9XG5cbiAgICBuYW1lID0gU3RyaW5nKG5hbWUpO1xuICAgIHZhciByZXMgPSB0cmFwLmNhbGwodGhpcy5oYW5kbGVyLCB0aGlzLnRhcmdldCwgbmFtZSk7XG4gICAgcmVzID0gISFyZXM7IC8vIGNvZXJjZSB0byBCb29sZWFuXG5cbiAgICB2YXIgdGFyZ2V0RGVzYztcbiAgICBpZiAocmVzID09PSB0cnVlKSB7XG4gICAgICB0YXJnZXREZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0aGlzLnRhcmdldCwgbmFtZSk7XG4gICAgICBpZiAodGFyZ2V0RGVzYyAhPT0gdW5kZWZpbmVkICYmIHRhcmdldERlc2MuY29uZmlndXJhYmxlID09PSBmYWxzZSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwicHJvcGVydHkgJ1wiICsgbmFtZSArIFwiJyBpcyBub24tY29uZmlndXJhYmxlIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYW5kIGNhbid0IGJlIGRlbGV0ZWRcIik7XG4gICAgICB9XG4gICAgICBpZiAodGFyZ2V0RGVzYyAhPT0gdW5kZWZpbmVkICYmICFPYmplY3RfaXNFeHRlbnNpYmxlKHRoaXMudGFyZ2V0KSkge1xuICAgICAgICAvLyBpZiB0aGUgcHJvcGVydHkgc3RpbGwgZXhpc3RzIG9uIGEgbm9uLWV4dGVuc2libGUgdGFyZ2V0IGJ1dFxuICAgICAgICAvLyBpcyByZXBvcnRlZCBhcyBzdWNjZXNzZnVsbHkgZGVsZXRlZCwgaXQgbWF5IGxhdGVyIGJlIHJlcG9ydGVkXG4gICAgICAgIC8vIGFzIHByZXNlbnQsIHdoaWNoIHZpb2xhdGVzIHRoZSBpbnZhcmlhbnQgdGhhdCBhbiBvd24gcHJvcGVydHksXG4gICAgICAgIC8vIGRlbGV0ZWQgZnJvbSBhIG5vbi1leHRlbnNpYmxlIG9iamVjdCBjYW5ub3QgcmVhcHBlYXIuXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJjYW5ub3Qgc3VjY2Vzc2Z1bGx5IGRlbGV0ZSBleGlzdGluZyBwcm9wZXJ0eSAnXCIgKyBuYW1lICtcbiAgICAgICAgICBcIicgb24gYSBub24tZXh0ZW5zaWJsZSBvYmplY3RcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfSxcblxuICAvKipcbiAgICogVGhlIGdldE93blByb3BlcnR5TmFtZXMgdHJhcCB3YXMgcmVwbGFjZWQgYnkgdGhlIG93bktleXMgdHJhcCxcbiAgICogd2hpY2ggbm93IGFsc28gcmV0dXJucyBhbiBhcnJheSAob2Ygc3RyaW5ncyBvciBzeW1ib2xzKSBhbmRcbiAgICogd2hpY2ggcGVyZm9ybXMgdGhlIHNhbWUgcmlnb3JvdXMgaW52YXJpYW50IGNoZWNrcyBhcyBnZXRPd25Qcm9wZXJ0eU5hbWVzXG4gICAqXG4gICAqIFNlZSBpc3N1ZSAjNDggb24gaG93IHRoaXMgdHJhcCBjYW4gc3RpbGwgZ2V0IGludm9rZWQgYnkgZXh0ZXJuYWwgbGlic1xuICAgKiB0aGF0IGRvbid0IHVzZSB0aGUgcGF0Y2hlZCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyBmdW5jdGlvbi5cbiAgICovXG4gIGdldE93blByb3BlcnR5TmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIC8vIE5vdGU6IHJlbW92ZWQgZGVwcmVjYXRpb24gd2FybmluZyB0byBhdm9pZCBkZXBlbmRlbmN5IG9uICdjb25zb2xlJ1xuICAgIC8vIChhbmQgb24gbm9kZSwgc2hvdWxkIGFueXdheSB1c2UgdXRpbC5kZXByZWNhdGUpLiBEZXByZWNhdGlvbiB3YXJuaW5nc1xuICAgIC8vIGNhbiBhbHNvIGJlIGFubm95aW5nIHdoZW4gdGhleSBhcmUgb3V0c2lkZSBvZiB0aGUgdXNlcidzIGNvbnRyb2wsIGUuZy5cbiAgICAvLyB3aGVuIGFuIGV4dGVybmFsIGxpYnJhcnkgY2FsbHMgdW5wYXRjaGVkIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzLlxuICAgIC8vIFNpbmNlIHRoZXJlIGlzIGEgY2xlYW4gZmFsbGJhY2sgdG8gYG93bktleXNgLCB0aGUgZmFjdCB0aGF0IHRoZVxuICAgIC8vIGRlcHJlY2F0ZWQgbWV0aG9kIGlzIHN0aWxsIGNhbGxlZCBpcyBtb3N0bHkgaGFybWxlc3MgYW55d2F5LlxuICAgIC8vIFNlZSBhbHNvIGlzc3VlcyAjNjUgYW5kICM2Ni5cbiAgICAvLyBjb25zb2xlLndhcm4oXCJnZXRPd25Qcm9wZXJ0eU5hbWVzIHRyYXAgaXMgZGVwcmVjYXRlZC4gVXNlIG93bktleXMgaW5zdGVhZFwiKTtcbiAgICByZXR1cm4gdGhpcy5vd25LZXlzKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSB0cmFwIHJlc3VsdCBkb2VzIG5vdCBjb250YWluIGFueSBuZXcgcHJvcGVydGllc1xuICAgKiBpZiB0aGUgcHJveHkgaXMgbm9uLWV4dGVuc2libGUuXG4gICAqXG4gICAqIEFueSBvd24gbm9uLWNvbmZpZ3VyYWJsZSBwcm9wZXJ0aWVzIG9mIHRoZSB0YXJnZXQgdGhhdCBhcmUgbm90IGluY2x1ZGVkXG4gICAqIGluIHRoZSB0cmFwIHJlc3VsdCBnaXZlIHJpc2UgdG8gYSBUeXBlRXJyb3IuIEFzIHN1Y2gsIHdlIGNoZWNrIHdoZXRoZXIgdGhlXG4gICAqIHJldHVybmVkIHJlc3VsdCBjb250YWlucyBhdCBsZWFzdCBhbGwgc2VhbGVkIHByb3BlcnRpZXMgb2YgdGhlIHRhcmdldFxuICAgKiBvYmplY3QuXG4gICAqXG4gICAqIEFkZGl0aW9uYWxseSwgdGhlIHRyYXAgcmVzdWx0IGlzIG5vcm1hbGl6ZWQuXG4gICAqIEluc3RlYWQgb2YgcmV0dXJuaW5nIHRoZSB0cmFwIHJlc3VsdCBkaXJlY3RseTpcbiAgICogIC0gY3JlYXRlIGFuZCByZXR1cm4gYSBmcmVzaCBBcnJheSxcbiAgICogIC0gb2Ygd2hpY2ggZWFjaCBlbGVtZW50IGlzIGNvZXJjZWQgdG8gYSBTdHJpbmdcbiAgICpcbiAgICogVGhpcyB0cmFwIGlzIGNhbGxlZCBhLm8uIGJ5IFJlZmxlY3Qub3duS2V5cywgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNcbiAgICogYW5kIE9iamVjdC5rZXlzICh0aGUgbGF0dGVyIGZpbHRlcnMgb3V0IG9ubHkgdGhlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMpLlxuICAgKi9cbiAgb3duS2V5czogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRyYXAgPSB0aGlzLmdldFRyYXAoXCJvd25LZXlzXCIpO1xuICAgIGlmICh0cmFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGRlZmF1bHQgZm9yd2FyZGluZyBiZWhhdmlvclxuICAgICAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0aGlzLnRhcmdldCk7XG4gICAgfVxuXG4gICAgdmFyIHRyYXBSZXN1bHQgPSB0cmFwLmNhbGwodGhpcy5oYW5kbGVyLCB0aGlzLnRhcmdldCk7XG5cbiAgICAvLyBwcm9wTmFtZXMgaXMgdXNlZCBhcyBhIHNldCBvZiBzdHJpbmdzXG4gICAgdmFyIHByb3BOYW1lcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdmFyIG51bVByb3BzID0gK3RyYXBSZXN1bHQubGVuZ3RoO1xuICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXkobnVtUHJvcHMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1Qcm9wczsgaSsrKSB7XG4gICAgICB2YXIgcyA9IFN0cmluZyh0cmFwUmVzdWx0W2ldKTtcbiAgICAgIGlmICghT2JqZWN0LmlzRXh0ZW5zaWJsZSh0aGlzLnRhcmdldCkgJiYgIWlzRml4ZWQocywgdGhpcy50YXJnZXQpKSB7XG4gICAgICAgIC8vIG5vbi1leHRlbnNpYmxlIHByb3hpZXMgZG9uJ3QgdG9sZXJhdGUgbmV3IG93biBwcm9wZXJ0eSBuYW1lc1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwib3duS2V5cyB0cmFwIGNhbm5vdCBsaXN0IGEgbmV3IFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHkgJ1wiK3MrXCInIG9uIGEgbm9uLWV4dGVuc2libGUgb2JqZWN0XCIpO1xuICAgICAgfVxuXG4gICAgICBwcm9wTmFtZXNbc10gPSB0cnVlO1xuICAgICAgcmVzdWx0W2ldID0gcztcbiAgICB9XG5cbiAgICB2YXIgb3duUHJvcHMgPSBPYmplY3RfZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzLnRhcmdldCk7XG4gICAgdmFyIHRhcmdldCA9IHRoaXMudGFyZ2V0O1xuICAgIG93blByb3BzLmZvckVhY2goZnVuY3Rpb24gKG93blByb3ApIHtcbiAgICAgIGlmICghcHJvcE5hbWVzW293blByb3BdKSB7XG4gICAgICAgIGlmIChpc1NlYWxlZChvd25Qcm9wLCB0YXJnZXQpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm93bktleXMgdHJhcCBmYWlsZWQgdG8gaW5jbHVkZSBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibm9uLWNvbmZpZ3VyYWJsZSBwcm9wZXJ0eSAnXCIrb3duUHJvcCtcIidcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFPYmplY3QuaXNFeHRlbnNpYmxlKHRhcmdldCkgJiZcbiAgICAgICAgICAgIGlzRml4ZWQob3duUHJvcCwgdGFyZ2V0KSkge1xuICAgICAgICAgICAgLy8gaWYgaGFuZGxlciBpcyBhbGxvd2VkIHRvIHJlcG9ydCBvd25Qcm9wIGFzIG5vbi1leGlzdGVudCxcbiAgICAgICAgICAgIC8vIHdlIGNhbm5vdCBndWFyYW50ZWUgdGhhdCBpdCB3aWxsIG5ldmVyIGxhdGVyIHJlcG9ydCBpdCBhc1xuICAgICAgICAgICAgLy8gZXhpc3RlbnQuIE9uY2UgYSBwcm9wZXJ0eSBoYXMgYmVlbiByZXBvcnRlZCBhcyBub24tZXhpc3RlbnRcbiAgICAgICAgICAgIC8vIG9uIGEgbm9uLWV4dGVuc2libGUgb2JqZWN0LCBpdCBzaG91bGQgZm9yZXZlciBiZSByZXBvcnRlZCBhc1xuICAgICAgICAgICAgLy8gbm9uLWV4aXN0ZW50XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwib3duS2V5cyB0cmFwIGNhbm5vdCByZXBvcnQgZXhpc3Rpbmcgb3duIHByb3BlcnR5ICdcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3duUHJvcCtcIicgYXMgbm9uLWV4aXN0ZW50IG9uIGEgbm9uLWV4dGVuc2libGUgb2JqZWN0XCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgdHJhcCByZXN1bHQgaXMgY29uc2lzdGVudCB3aXRoIHRoZSBzdGF0ZSBvZiB0aGVcbiAgICogd3JhcHBlZCB0YXJnZXQuXG4gICAqL1xuICBpc0V4dGVuc2libGU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFwID0gdGhpcy5nZXRUcmFwKFwiaXNFeHRlbnNpYmxlXCIpO1xuICAgIGlmICh0cmFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGRlZmF1bHQgZm9yd2FyZGluZyBiZWhhdmlvclxuICAgICAgcmV0dXJuIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRoaXMudGFyZ2V0KTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gdHJhcC5jYWxsKHRoaXMuaGFuZGxlciwgdGhpcy50YXJnZXQpO1xuICAgIHJlc3VsdCA9ICEhcmVzdWx0OyAvLyBjb2VyY2UgdG8gQm9vbGVhblxuICAgIHZhciBzdGF0ZSA9IE9iamVjdF9pc0V4dGVuc2libGUodGhpcy50YXJnZXQpO1xuICAgIGlmIChyZXN1bHQgIT09IHN0YXRlKSB7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW5ub3QgcmVwb3J0IG5vbi1leHRlbnNpYmxlIG9iamVjdCBhcyBleHRlbnNpYmxlOiBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbm5vdCByZXBvcnQgZXh0ZW5zaWJsZSBvYmplY3QgYXMgbm9uLWV4dGVuc2libGU6IFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdGF0ZTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGUgdHJhcCByZXN1bHQgY29ycmVzcG9uZHMgdG8gdGhlIHRhcmdldCdzIFtbUHJvdG90eXBlXV1cbiAgICovXG4gIGdldFByb3RvdHlwZU9mOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHJhcCA9IHRoaXMuZ2V0VHJhcChcImdldFByb3RvdHlwZU9mXCIpO1xuICAgIGlmICh0cmFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGRlZmF1bHQgZm9yd2FyZGluZyBiZWhhdmlvclxuICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YodGhpcy50YXJnZXQpO1xuICAgIH1cblxuICAgIHZhciBhbGxlZ2VkUHJvdG8gPSB0cmFwLmNhbGwodGhpcy5oYW5kbGVyLCB0aGlzLnRhcmdldCk7XG5cbiAgICBpZiAoIU9iamVjdF9pc0V4dGVuc2libGUodGhpcy50YXJnZXQpKSB7XG4gICAgICB2YXIgYWN0dWFsUHJvdG8gPSBPYmplY3RfZ2V0UHJvdG90eXBlT2YodGhpcy50YXJnZXQpO1xuICAgICAgaWYgKCFzYW1lVmFsdWUoYWxsZWdlZFByb3RvLCBhY3R1YWxQcm90bykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInByb3RvdHlwZSB2YWx1ZSBkb2VzIG5vdCBtYXRjaDogXCIgKyB0aGlzLnRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFsbGVnZWRQcm90bztcbiAgfSxcblxuICAvKipcbiAgICogSWYgdGFyZ2V0IGlzIG5vbi1leHRlbnNpYmxlIGFuZCBzZXRQcm90b3R5cGVPZiB0cmFwIHJldHVybnMgdHJ1ZSxcbiAgICogY2hlY2sgd2hldGhlciB0aGUgdHJhcCByZXN1bHQgY29ycmVzcG9uZHMgdG8gdGhlIHRhcmdldCdzIFtbUHJvdG90eXBlXV1cbiAgICovXG4gIHNldFByb3RvdHlwZU9mOiBmdW5jdGlvbihuZXdQcm90bykge1xuICAgIHZhciB0cmFwID0gdGhpcy5nZXRUcmFwKFwic2V0UHJvdG90eXBlT2ZcIik7XG4gICAgaWYgKHRyYXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gZGVmYXVsdCBmb3J3YXJkaW5nIGJlaGF2aW9yXG4gICAgICByZXR1cm4gUmVmbGVjdC5zZXRQcm90b3R5cGVPZih0aGlzLnRhcmdldCwgbmV3UHJvdG8pO1xuICAgIH1cblxuICAgIHZhciBzdWNjZXNzID0gdHJhcC5jYWxsKHRoaXMuaGFuZGxlciwgdGhpcy50YXJnZXQsIG5ld1Byb3RvKTtcblxuICAgIHN1Y2Nlc3MgPSAhIXN1Y2Nlc3M7XG4gICAgaWYgKHN1Y2Nlc3MgJiYgIU9iamVjdF9pc0V4dGVuc2libGUodGhpcy50YXJnZXQpKSB7XG4gICAgICB2YXIgYWN0dWFsUHJvdG8gPSBPYmplY3RfZ2V0UHJvdG90eXBlT2YodGhpcy50YXJnZXQpO1xuICAgICAgaWYgKCFzYW1lVmFsdWUobmV3UHJvdG8sIGFjdHVhbFByb3RvKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwicHJvdG90eXBlIHZhbHVlIGRvZXMgbm90IG1hdGNoOiBcIiArIHRoaXMudGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3VjY2VzcztcbiAgfSxcblxuICAvKipcbiAgICogSW4gdGhlIGRpcmVjdCBwcm94aWVzIGRlc2lnbiB3aXRoIHJlZmFjdG9yZWQgcHJvdG90eXBlIGNsaW1iaW5nLFxuICAgKiB0aGlzIHRyYXAgaXMgZGVwcmVjYXRlZC4gRm9yIHByb3hpZXMtYXMtcHJvdG90eXBlcywgZm9yLWluIHdpbGxcbiAgICogY2FsbCB0aGUgZW51bWVyYXRlKCkgdHJhcC4gSWYgdGhhdCB0cmFwIGlzIG5vdCBkZWZpbmVkLCB0aGVcbiAgICogb3BlcmF0aW9uIGlzIGZvcndhcmRlZCB0byB0aGUgdGFyZ2V0LCBubyBtb3JlIGZhbGxiYWNrIG9uIHRoaXNcbiAgICogZnVuZGFtZW50YWwgdHJhcC5cbiAgICovXG4gIGdldFByb3BlcnR5TmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJnZXRQcm9wZXJ0eU5hbWVzIHRyYXAgaXMgZGVwcmVjYXRlZFwiKTtcbiAgfSxcblxuICAvLyA9PT0gZGVyaXZlZCB0cmFwcyA9PT1cblxuICAvKipcbiAgICogSWYgbmFtZSBkZW5vdGVzIGEgZml4ZWQgcHJvcGVydHksIGNoZWNrIHdoZXRoZXIgdGhlIHRyYXAgcmV0dXJucyB0cnVlLlxuICAgKi9cbiAgaGFzOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIHRyYXAgPSB0aGlzLmdldFRyYXAoXCJoYXNcIik7XG4gICAgaWYgKHRyYXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gZGVmYXVsdCBmb3J3YXJkaW5nIGJlaGF2aW9yXG4gICAgICByZXR1cm4gUmVmbGVjdC5oYXModGhpcy50YXJnZXQsIG5hbWUpO1xuICAgIH1cblxuICAgIG5hbWUgPSBTdHJpbmcobmFtZSk7XG4gICAgdmFyIHJlcyA9IHRyYXAuY2FsbCh0aGlzLmhhbmRsZXIsIHRoaXMudGFyZ2V0LCBuYW1lKTtcbiAgICByZXMgPSAhIXJlczsgLy8gY29lcmNlIHRvIEJvb2xlYW5cblxuICAgIGlmIChyZXMgPT09IGZhbHNlKSB7XG4gICAgICBpZiAoaXNTZWFsZWQobmFtZSwgdGhpcy50YXJnZXQpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW5ub3QgcmVwb3J0IGV4aXN0aW5nIG5vbi1jb25maWd1cmFibGUgb3duIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHkgJ1wiKyBuYW1lICsgXCInIGFzIGEgbm9uLWV4aXN0ZW50IFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHlcIik7XG4gICAgICB9XG4gICAgICBpZiAoIU9iamVjdC5pc0V4dGVuc2libGUodGhpcy50YXJnZXQpICYmXG4gICAgICAgICAgaXNGaXhlZChuYW1lLCB0aGlzLnRhcmdldCkpIHtcbiAgICAgICAgICAvLyBpZiBoYW5kbGVyIGlzIGFsbG93ZWQgdG8gcmV0dXJuIGZhbHNlLCB3ZSBjYW5ub3QgZ3VhcmFudGVlXG4gICAgICAgICAgLy8gdGhhdCBpdCB3aWxsIG5vdCByZXR1cm4gdHJ1ZSBmb3IgdGhpcyBwcm9wZXJ0eSBsYXRlci5cbiAgICAgICAgICAvLyBPbmNlIGEgcHJvcGVydHkgaGFzIGJlZW4gcmVwb3J0ZWQgYXMgbm9uLWV4aXN0ZW50IG9uIGEgbm9uLWV4dGVuc2libGVcbiAgICAgICAgICAvLyBvYmplY3QsIGl0IHNob3VsZCBmb3JldmVyIGJlIHJlcG9ydGVkIGFzIG5vbi1leGlzdGVudFxuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW5ub3QgcmVwb3J0IGV4aXN0aW5nIG93biBwcm9wZXJ0eSAnXCIrbmFtZStcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiJyBhcyBub24tZXhpc3RlbnQgb24gYSBub24tZXh0ZW5zaWJsZSBvYmplY3RcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gaWYgcmVzID09PSB0cnVlLCB3ZSBkb24ndCBuZWVkIHRvIGNoZWNrIGZvciBleHRlbnNpYmlsaXR5XG4gICAgLy8gZXZlbiBmb3IgYSBub24tZXh0ZW5zaWJsZSBwcm94eSB0aGF0IGhhcyBubyBvd24gbmFtZSBwcm9wZXJ0eSxcbiAgICAvLyB0aGUgcHJvcGVydHkgbWF5IGhhdmUgYmVlbiBpbmhlcml0ZWRcblxuICAgIHJldHVybiByZXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIElmIG5hbWUgZGVub3RlcyBhIGZpeGVkIG5vbi1jb25maWd1cmFibGUsIG5vbi13cml0YWJsZSBkYXRhIHByb3BlcnR5LFxuICAgKiBjaGVjayBpdHMgcmV0dXJuIHZhbHVlIGFnYWluc3QgdGhlIHByZXZpb3VzbHkgYXNzZXJ0ZWQgdmFsdWUgb2YgdGhlXG4gICAqIGZpeGVkIHByb3BlcnR5LlxuICAgKi9cbiAgZ2V0OiBmdW5jdGlvbihyZWNlaXZlciwgbmFtZSkge1xuXG4gICAgLy8gZXhwZXJpbWVudGFsIHN1cHBvcnQgZm9yIGludm9rZSgpIHRyYXAgb24gcGxhdGZvcm1zIHRoYXRcbiAgICAvLyBzdXBwb3J0IF9fbm9TdWNoTWV0aG9kX19cbiAgICAvKlxuICAgIGlmIChuYW1lID09PSAnX19ub1N1Y2hNZXRob2RfXycpIHtcbiAgICAgIHZhciBoYW5kbGVyID0gdGhpcztcbiAgICAgIHJldHVybiBmdW5jdGlvbihuYW1lLCBhcmdzKSB7XG4gICAgICAgIHJldHVybiBoYW5kbGVyLmludm9rZShyZWNlaXZlciwgbmFtZSwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuICAgICovXG5cbiAgICB2YXIgdHJhcCA9IHRoaXMuZ2V0VHJhcChcImdldFwiKTtcbiAgICBpZiAodHJhcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBkZWZhdWx0IGZvcndhcmRpbmcgYmVoYXZpb3JcbiAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0aGlzLnRhcmdldCwgbmFtZSwgcmVjZWl2ZXIpO1xuICAgIH1cblxuICAgIG5hbWUgPSBTdHJpbmcobmFtZSk7XG4gICAgdmFyIHJlcyA9IHRyYXAuY2FsbCh0aGlzLmhhbmRsZXIsIHRoaXMudGFyZ2V0LCBuYW1lLCByZWNlaXZlcik7XG5cbiAgICB2YXIgZml4ZWREZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0aGlzLnRhcmdldCwgbmFtZSk7XG4gICAgLy8gY2hlY2sgY29uc2lzdGVuY3kgb2YgdGhlIHJldHVybmVkIHZhbHVlXG4gICAgaWYgKGZpeGVkRGVzYyAhPT0gdW5kZWZpbmVkKSB7IC8vIGdldHRpbmcgYW4gZXhpc3RpbmcgcHJvcGVydHlcbiAgICAgIGlmIChpc0RhdGFEZXNjcmlwdG9yKGZpeGVkRGVzYykgJiZcbiAgICAgICAgICBmaXhlZERlc2MuY29uZmlndXJhYmxlID09PSBmYWxzZSAmJlxuICAgICAgICAgIGZpeGVkRGVzYy53cml0YWJsZSA9PT0gZmFsc2UpIHsgLy8gb3duIGZyb3plbiBkYXRhIHByb3BlcnR5XG4gICAgICAgIGlmICghc2FtZVZhbHVlKHJlcywgZml4ZWREZXNjLnZhbHVlKSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW5ub3QgcmVwb3J0IGluY29uc2lzdGVudCB2YWx1ZSBmb3IgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5vbi13cml0YWJsZSwgbm9uLWNvbmZpZ3VyYWJsZSBwcm9wZXJ0eSAnXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lK1wiJ1wiKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHsgLy8gaXQncyBhbiBhY2Nlc3NvciBwcm9wZXJ0eVxuICAgICAgICBpZiAoaXNBY2Nlc3NvckRlc2NyaXB0b3IoZml4ZWREZXNjKSAmJlxuICAgICAgICAgICAgZml4ZWREZXNjLmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UgJiZcbiAgICAgICAgICAgIGZpeGVkRGVzYy5nZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChyZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm11c3QgcmVwb3J0IHVuZGVmaW5lZCBmb3Igbm9uLWNvbmZpZ3VyYWJsZSBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhY2Nlc3NvciBwcm9wZXJ0eSAnXCIrbmFtZStcIicgd2l0aG91dCBnZXR0ZXJcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfSxcblxuICAvKipcbiAgICogSWYgbmFtZSBkZW5vdGVzIGEgZml4ZWQgbm9uLWNvbmZpZ3VyYWJsZSwgbm9uLXdyaXRhYmxlIGRhdGEgcHJvcGVydHksXG4gICAqIGNoZWNrIHRoYXQgdGhlIHRyYXAgcmVqZWN0cyB0aGUgYXNzaWdubWVudC5cbiAgICovXG4gIHNldDogZnVuY3Rpb24ocmVjZWl2ZXIsIG5hbWUsIHZhbCkge1xuICAgIHZhciB0cmFwID0gdGhpcy5nZXRUcmFwKFwic2V0XCIpO1xuICAgIGlmICh0cmFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGRlZmF1bHQgZm9yd2FyZGluZyBiZWhhdmlvclxuICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRoaXMudGFyZ2V0LCBuYW1lLCB2YWwsIHJlY2VpdmVyKTtcbiAgICB9XG5cbiAgICBuYW1lID0gU3RyaW5nKG5hbWUpO1xuICAgIHZhciByZXMgPSB0cmFwLmNhbGwodGhpcy5oYW5kbGVyLCB0aGlzLnRhcmdldCwgbmFtZSwgdmFsLCByZWNlaXZlcik7XG4gICAgcmVzID0gISFyZXM7IC8vIGNvZXJjZSB0byBCb29sZWFuXG5cbiAgICAvLyBpZiBzdWNjZXNzIGlzIHJlcG9ydGVkLCBjaGVjayB3aGV0aGVyIHByb3BlcnR5IGlzIHRydWx5IGFzc2lnbmFibGVcbiAgICBpZiAocmVzID09PSB0cnVlKSB7XG4gICAgICB2YXIgZml4ZWREZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0aGlzLnRhcmdldCwgbmFtZSk7XG4gICAgICBpZiAoZml4ZWREZXNjICE9PSB1bmRlZmluZWQpIHsgLy8gc2V0dGluZyBhbiBleGlzdGluZyBwcm9wZXJ0eVxuICAgICAgICBpZiAoaXNEYXRhRGVzY3JpcHRvcihmaXhlZERlc2MpICYmXG4gICAgICAgICAgICBmaXhlZERlc2MuY29uZmlndXJhYmxlID09PSBmYWxzZSAmJlxuICAgICAgICAgICAgZml4ZWREZXNjLndyaXRhYmxlID09PSBmYWxzZSkge1xuICAgICAgICAgIGlmICghc2FtZVZhbHVlKHZhbCwgZml4ZWREZXNjLnZhbHVlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbm5vdCBzdWNjZXNzZnVsbHkgYXNzaWduIHRvIGEgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibm9uLXdyaXRhYmxlLCBub24tY29uZmlndXJhYmxlIHByb3BlcnR5ICdcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZStcIidcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpc0FjY2Vzc29yRGVzY3JpcHRvcihmaXhlZERlc2MpICYmXG4gICAgICAgICAgICAgIGZpeGVkRGVzYy5jb25maWd1cmFibGUgPT09IGZhbHNlICYmIC8vIG5vbi1jb25maWd1cmFibGVcbiAgICAgICAgICAgICAgZml4ZWREZXNjLnNldCA9PT0gdW5kZWZpbmVkKSB7ICAgICAgLy8gYWNjZXNzb3Igd2l0aCB1bmRlZmluZWQgc2V0dGVyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwic2V0dGluZyBhIHByb3BlcnR5ICdcIituYW1lK1wiJyB0aGF0IGhhcyBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgb25seSBhIGdldHRlclwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBbnkgb3duIGVudW1lcmFibGUgbm9uLWNvbmZpZ3VyYWJsZSBwcm9wZXJ0aWVzIG9mIHRoZSB0YXJnZXQgdGhhdCBhcmUgbm90XG4gICAqIGluY2x1ZGVkIGluIHRoZSB0cmFwIHJlc3VsdCBnaXZlIHJpc2UgdG8gYSBUeXBlRXJyb3IuIEFzIHN1Y2gsIHdlIGNoZWNrXG4gICAqIHdoZXRoZXIgdGhlIHJldHVybmVkIHJlc3VsdCBjb250YWlucyBhdCBsZWFzdCBhbGwgc2VhbGVkIGVudW1lcmFibGUgcHJvcGVydGllc1xuICAgKiBvZiB0aGUgdGFyZ2V0IG9iamVjdC5cbiAgICpcbiAgICogVGhlIHRyYXAgc2hvdWxkIHJldHVybiBhbiBpdGVyYXRvci5cbiAgICpcbiAgICogSG93ZXZlciwgYXMgaW1wbGVtZW50YXRpb25zIG9mIHByZS1kaXJlY3QgcHJveGllcyBzdGlsbCBleHBlY3QgZW51bWVyYXRlXG4gICAqIHRvIHJldHVybiBhbiBhcnJheSBvZiBzdHJpbmdzLCB3ZSBjb252ZXJ0IHRoZSBpdGVyYXRvciBpbnRvIGFuIGFycmF5LlxuICAgKi9cbiAgZW51bWVyYXRlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHJhcCA9IHRoaXMuZ2V0VHJhcChcImVudW1lcmF0ZVwiKTtcbiAgICBpZiAodHJhcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBkZWZhdWx0IGZvcndhcmRpbmcgYmVoYXZpb3JcbiAgICAgIHZhciB0cmFwUmVzdWx0ID0gUmVmbGVjdC5lbnVtZXJhdGUodGhpcy50YXJnZXQpO1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgdmFyIG54dCA9IHRyYXBSZXN1bHQubmV4dCgpO1xuICAgICAgd2hpbGUgKCFueHQuZG9uZSkge1xuICAgICAgICByZXN1bHQucHVzaChTdHJpbmcobnh0LnZhbHVlKSk7XG4gICAgICAgIG54dCA9IHRyYXBSZXN1bHQubmV4dCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICB2YXIgdHJhcFJlc3VsdCA9IHRyYXAuY2FsbCh0aGlzLmhhbmRsZXIsIHRoaXMudGFyZ2V0KTtcbiAgICBcbiAgICBpZiAodHJhcFJlc3VsdCA9PT0gbnVsbCB8fFxuICAgICAgICB0cmFwUmVzdWx0ID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgdHJhcFJlc3VsdC5uZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJlbnVtZXJhdGUgdHJhcCBzaG91bGQgcmV0dXJuIGFuIGl0ZXJhdG9yLCBnb3Q6IFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFwUmVzdWx0KTsgICAgXG4gICAgfVxuICAgIFxuICAgIC8vIHByb3BOYW1lcyBpcyB1c2VkIGFzIGEgc2V0IG9mIHN0cmluZ3NcbiAgICB2YXIgcHJvcE5hbWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBcbiAgICAvLyB2YXIgbnVtUHJvcHMgPSArdHJhcFJlc3VsdC5sZW5ndGg7XG4gICAgdmFyIHJlc3VsdCA9IFtdOyAvLyBuZXcgQXJyYXkobnVtUHJvcHMpO1xuICAgIFxuICAgIC8vIHRyYXBSZXN1bHQgaXMgc3VwcG9zZWQgdG8gYmUgYW4gaXRlcmF0b3JcbiAgICAvLyBkcmFpbiBpdGVyYXRvciB0byBhcnJheSBhcyBjdXJyZW50IGltcGxlbWVudGF0aW9ucyBzdGlsbCBleHBlY3RcbiAgICAvLyBlbnVtZXJhdGUgdG8gcmV0dXJuIGFuIGFycmF5IG9mIHN0cmluZ3NcbiAgICB2YXIgbnh0ID0gdHJhcFJlc3VsdC5uZXh0KCk7XG4gICAgXG4gICAgd2hpbGUgKCFueHQuZG9uZSkge1xuICAgICAgdmFyIHMgPSBTdHJpbmcobnh0LnZhbHVlKTtcbiAgICAgIGlmIChwcm9wTmFtZXNbc10pIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImVudW1lcmF0ZSB0cmFwIGNhbm5vdCBsaXN0IGEgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkdXBsaWNhdGUgcHJvcGVydHkgJ1wiK3MrXCInXCIpO1xuICAgICAgfVxuICAgICAgcHJvcE5hbWVzW3NdID0gdHJ1ZTtcbiAgICAgIHJlc3VsdC5wdXNoKHMpO1xuICAgICAgbnh0ID0gdHJhcFJlc3VsdC5uZXh0KCk7XG4gICAgfVxuICAgIFxuICAgIC8qZm9yICh2YXIgaSA9IDA7IGkgPCBudW1Qcm9wczsgaSsrKSB7XG4gICAgICB2YXIgcyA9IFN0cmluZyh0cmFwUmVzdWx0W2ldKTtcbiAgICAgIGlmIChwcm9wTmFtZXNbc10pIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImVudW1lcmF0ZSB0cmFwIGNhbm5vdCBsaXN0IGEgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkdXBsaWNhdGUgcHJvcGVydHkgJ1wiK3MrXCInXCIpO1xuICAgICAgfVxuXG4gICAgICBwcm9wTmFtZXNbc10gPSB0cnVlO1xuICAgICAgcmVzdWx0W2ldID0gcztcbiAgICB9ICovXG5cbiAgICB2YXIgb3duRW51bWVyYWJsZVByb3BzID0gT2JqZWN0LmtleXModGhpcy50YXJnZXQpO1xuICAgIHZhciB0YXJnZXQgPSB0aGlzLnRhcmdldDtcbiAgICBvd25FbnVtZXJhYmxlUHJvcHMuZm9yRWFjaChmdW5jdGlvbiAob3duRW51bWVyYWJsZVByb3ApIHtcbiAgICAgIGlmICghcHJvcE5hbWVzW293bkVudW1lcmFibGVQcm9wXSkge1xuICAgICAgICBpZiAoaXNTZWFsZWQob3duRW51bWVyYWJsZVByb3AsIHRhcmdldCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiZW51bWVyYXRlIHRyYXAgZmFpbGVkIHRvIGluY2x1ZGUgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5vbi1jb25maWd1cmFibGUgZW51bWVyYWJsZSBwcm9wZXJ0eSAnXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvd25FbnVtZXJhYmxlUHJvcCtcIidcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFPYmplY3QuaXNFeHRlbnNpYmxlKHRhcmdldCkgJiZcbiAgICAgICAgICAgIGlzRml4ZWQob3duRW51bWVyYWJsZVByb3AsIHRhcmdldCkpIHtcbiAgICAgICAgICAgIC8vIGlmIGhhbmRsZXIgaXMgYWxsb3dlZCBub3QgdG8gcmVwb3J0IG93bkVudW1lcmFibGVQcm9wIGFzIGFuIG93blxuICAgICAgICAgICAgLy8gcHJvcGVydHksIHdlIGNhbm5vdCBndWFyYW50ZWUgdGhhdCBpdCB3aWxsIG5ldmVyIHJlcG9ydCBpdCBhc1xuICAgICAgICAgICAgLy8gYW4gb3duIHByb3BlcnR5IGxhdGVyLiBPbmNlIGEgcHJvcGVydHkgaGFzIGJlZW4gcmVwb3J0ZWQgYXNcbiAgICAgICAgICAgIC8vIG5vbi1leGlzdGVudCBvbiBhIG5vbi1leHRlbnNpYmxlIG9iamVjdCwgaXQgc2hvdWxkIGZvcmV2ZXIgYmVcbiAgICAgICAgICAgIC8vIHJlcG9ydGVkIGFzIG5vbi1leGlzdGVudFxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbm5vdCByZXBvcnQgZXhpc3Rpbmcgb3duIHByb3BlcnR5ICdcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3duRW51bWVyYWJsZVByb3ArXCInIGFzIG5vbi1leGlzdGVudCBvbiBhIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5vbi1leHRlbnNpYmxlIG9iamVjdFwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcblxuICAvKipcbiAgICogVGhlIGl0ZXJhdGUgdHJhcCBpcyBkZXByZWNhdGVkIGJ5IHRoZSBlbnVtZXJhdGUgdHJhcC5cbiAgICovXG4gIGl0ZXJhdGU6IFZhbGlkYXRvci5wcm90b3R5cGUuZW51bWVyYXRlLFxuXG4gIC8qKlxuICAgKiBBbnkgb3duIG5vbi1jb25maWd1cmFibGUgcHJvcGVydGllcyBvZiB0aGUgdGFyZ2V0IHRoYXQgYXJlIG5vdCBpbmNsdWRlZFxuICAgKiBpbiB0aGUgdHJhcCByZXN1bHQgZ2l2ZSByaXNlIHRvIGEgVHlwZUVycm9yLiBBcyBzdWNoLCB3ZSBjaGVjayB3aGV0aGVyIHRoZVxuICAgKiByZXR1cm5lZCByZXN1bHQgY29udGFpbnMgYXQgbGVhc3QgYWxsIHNlYWxlZCBwcm9wZXJ0aWVzIG9mIHRoZSB0YXJnZXRcbiAgICogb2JqZWN0LlxuICAgKlxuICAgKiBUaGUgdHJhcCByZXN1bHQgaXMgbm9ybWFsaXplZC5cbiAgICogVGhlIHRyYXAgcmVzdWx0IGlzIG5vdCByZXR1cm5lZCBkaXJlY3RseS4gSW5zdGVhZDpcbiAgICogIC0gY3JlYXRlIGFuZCByZXR1cm4gYSBmcmVzaCBBcnJheSxcbiAgICogIC0gb2Ygd2hpY2ggZWFjaCBlbGVtZW50IGlzIGNvZXJjZWQgdG8gU3RyaW5nLFxuICAgKiAgLSB3aGljaCBkb2VzIG5vdCBjb250YWluIGR1cGxpY2F0ZXNcbiAgICpcbiAgICogRklYTUU6IGtleXMgdHJhcCBpcyBkZXByZWNhdGVkXG4gICAqL1xuICAvKlxuICBrZXlzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHJhcCA9IHRoaXMuZ2V0VHJhcChcImtleXNcIik7XG4gICAgaWYgKHRyYXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gZGVmYXVsdCBmb3J3YXJkaW5nIGJlaGF2aW9yXG4gICAgICByZXR1cm4gUmVmbGVjdC5rZXlzKHRoaXMudGFyZ2V0KTtcbiAgICB9XG5cbiAgICB2YXIgdHJhcFJlc3VsdCA9IHRyYXAuY2FsbCh0aGlzLmhhbmRsZXIsIHRoaXMudGFyZ2V0KTtcblxuICAgIC8vIHByb3BOYW1lcyBpcyB1c2VkIGFzIGEgc2V0IG9mIHN0cmluZ3NcbiAgICB2YXIgcHJvcE5hbWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB2YXIgbnVtUHJvcHMgPSArdHJhcFJlc3VsdC5sZW5ndGg7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheShudW1Qcm9wcyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bVByb3BzOyBpKyspIHtcbiAgICAgdmFyIHMgPSBTdHJpbmcodHJhcFJlc3VsdFtpXSk7XG4gICAgIGlmIChwcm9wTmFtZXNbc10pIHtcbiAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwia2V5cyB0cmFwIGNhbm5vdCBsaXN0IGEgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcImR1cGxpY2F0ZSBwcm9wZXJ0eSAnXCIrcytcIidcIik7XG4gICAgIH1cbiAgICAgaWYgKCFPYmplY3QuaXNFeHRlbnNpYmxlKHRoaXMudGFyZ2V0KSAmJiAhaXNGaXhlZChzLCB0aGlzLnRhcmdldCkpIHtcbiAgICAgICAvLyBub24tZXh0ZW5zaWJsZSBwcm94aWVzIGRvbid0IHRvbGVyYXRlIG5ldyBvd24gcHJvcGVydHkgbmFtZXNcbiAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwia2V5cyB0cmFwIGNhbm5vdCBsaXN0IGEgbmV3IFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0eSAnXCIrcytcIicgb24gYSBub24tZXh0ZW5zaWJsZSBvYmplY3RcIik7XG4gICAgIH1cblxuICAgICBwcm9wTmFtZXNbc10gPSB0cnVlO1xuICAgICByZXN1bHRbaV0gPSBzO1xuICAgIH1cblxuICAgIHZhciBvd25FbnVtZXJhYmxlUHJvcHMgPSBPYmplY3Qua2V5cyh0aGlzLnRhcmdldCk7XG4gICAgdmFyIHRhcmdldCA9IHRoaXMudGFyZ2V0O1xuICAgIG93bkVudW1lcmFibGVQcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChvd25FbnVtZXJhYmxlUHJvcCkge1xuICAgICAgaWYgKCFwcm9wTmFtZXNbb3duRW51bWVyYWJsZVByb3BdKSB7XG4gICAgICAgIGlmIChpc1NlYWxlZChvd25FbnVtZXJhYmxlUHJvcCwgdGFyZ2V0KSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJrZXlzIHRyYXAgZmFpbGVkIHRvIGluY2x1ZGUgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5vbi1jb25maWd1cmFibGUgZW51bWVyYWJsZSBwcm9wZXJ0eSAnXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvd25FbnVtZXJhYmxlUHJvcCtcIidcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFPYmplY3QuaXNFeHRlbnNpYmxlKHRhcmdldCkgJiZcbiAgICAgICAgICAgIGlzRml4ZWQob3duRW51bWVyYWJsZVByb3AsIHRhcmdldCkpIHtcbiAgICAgICAgICAgIC8vIGlmIGhhbmRsZXIgaXMgYWxsb3dlZCBub3QgdG8gcmVwb3J0IG93bkVudW1lcmFibGVQcm9wIGFzIGFuIG93blxuICAgICAgICAgICAgLy8gcHJvcGVydHksIHdlIGNhbm5vdCBndWFyYW50ZWUgdGhhdCBpdCB3aWxsIG5ldmVyIHJlcG9ydCBpdCBhc1xuICAgICAgICAgICAgLy8gYW4gb3duIHByb3BlcnR5IGxhdGVyLiBPbmNlIGEgcHJvcGVydHkgaGFzIGJlZW4gcmVwb3J0ZWQgYXNcbiAgICAgICAgICAgIC8vIG5vbi1leGlzdGVudCBvbiBhIG5vbi1leHRlbnNpYmxlIG9iamVjdCwgaXQgc2hvdWxkIGZvcmV2ZXIgYmVcbiAgICAgICAgICAgIC8vIHJlcG9ydGVkIGFzIG5vbi1leGlzdGVudFxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbm5vdCByZXBvcnQgZXhpc3Rpbmcgb3duIHByb3BlcnR5ICdcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3duRW51bWVyYWJsZVByb3ArXCInIGFzIG5vbi1leGlzdGVudCBvbiBhIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5vbi1leHRlbnNpYmxlIG9iamVjdFwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgKi9cbiAgXG4gIC8qKlxuICAgKiBOZXcgdHJhcCB0aGF0IHJlaWZpZXMgW1tDYWxsXV0uXG4gICAqIElmIHRoZSB0YXJnZXQgaXMgYSBmdW5jdGlvbiwgdGhlbiBhIGNhbGwgdG9cbiAgICogICBwcm94eSguLi5hcmdzKVxuICAgKiBUcmlnZ2VycyB0aGlzIHRyYXBcbiAgICovXG4gIGFwcGx5OiBmdW5jdGlvbih0YXJnZXQsIHRoaXNCaW5kaW5nLCBhcmdzKSB7XG4gICAgdmFyIHRyYXAgPSB0aGlzLmdldFRyYXAoXCJhcHBseVwiKTtcbiAgICBpZiAodHJhcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIHRoaXNCaW5kaW5nLCBhcmdzKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRoaXMudGFyZ2V0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHJldHVybiB0cmFwLmNhbGwodGhpcy5oYW5kbGVyLCB0YXJnZXQsIHRoaXNCaW5kaW5nLCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImFwcGx5OiBcIisgdGFyZ2V0ICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIik7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBOZXcgdHJhcCB0aGF0IHJlaWZpZXMgW1tDb25zdHJ1Y3RdXS5cbiAgICogSWYgdGhlIHRhcmdldCBpcyBhIGZ1bmN0aW9uLCB0aGVuIGEgY2FsbCB0b1xuICAgKiAgIG5ldyBwcm94eSguLi5hcmdzKVxuICAgKiBUcmlnZ2VycyB0aGlzIHRyYXBcbiAgICovXG4gIGNvbnN0cnVjdDogZnVuY3Rpb24odGFyZ2V0LCBhcmdzLCBuZXdUYXJnZXQpIHtcbiAgICB2YXIgdHJhcCA9IHRoaXMuZ2V0VHJhcChcImNvbnN0cnVjdFwiKTtcbiAgICBpZiAodHJhcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUYXJnZXQpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGFyZ2V0ICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJuZXc6IFwiKyB0YXJnZXQgKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICB9XG5cbiAgICBpZiAobmV3VGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld1RhcmdldCA9IHRhcmdldDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiBuZXdUYXJnZXQgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibmV3OiBcIisgbmV3VGFyZ2V0ICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIik7XG4gICAgICB9ICAgICAgXG4gICAgfVxuICAgIHJldHVybiB0cmFwLmNhbGwodGhpcy5oYW5kbGVyLCB0YXJnZXQsIGFyZ3MsIG5ld1RhcmdldCk7XG4gIH1cbn07XG5cbi8vIC0tLS0gZW5kIG9mIHRoZSBWYWxpZGF0b3IgaGFuZGxlciB3cmFwcGVyIGhhbmRsZXIgLS0tLVxuXG4vLyBJbiB3aGF0IGZvbGxvd3MsIGEgJ2RpcmVjdCBwcm94eScgaXMgYSBwcm94eVxuLy8gd2hvc2UgaGFuZGxlciBpcyBhIFZhbGlkYXRvci4gU3VjaCBwcm94aWVzIGNhbiBiZSBtYWRlIG5vbi1leHRlbnNpYmxlLFxuLy8gc2VhbGVkIG9yIGZyb3plbiB3aXRob3V0IGxvc2luZyB0aGUgYWJpbGl0eSB0byB0cmFwLlxuXG4vLyBtYXBzIGRpcmVjdCBwcm94aWVzIHRvIHRoZWlyIFZhbGlkYXRvciBoYW5kbGVyc1xudmFyIGRpcmVjdFByb3hpZXMgPSBuZXcgV2Vha01hcCgpO1xuXG4vLyBwYXRjaCBPYmplY3Que3ByZXZlbnRFeHRlbnNpb25zLHNlYWwsZnJlZXplfSBzbyB0aGF0XG4vLyB0aGV5IHJlY29nbml6ZSBmaXhhYmxlIHByb3hpZXMgYW5kIGFjdCBhY2NvcmRpbmdseVxuT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICB2YXIgdmhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldChzdWJqZWN0KTtcbiAgaWYgKHZoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAodmhhbmRsZXIucHJldmVudEV4dGVuc2lvbnMoKSkge1xuICAgICAgcmV0dXJuIHN1YmplY3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJwcmV2ZW50RXh0ZW5zaW9ucyBvbiBcIitzdWJqZWN0K1wiIHJlamVjdGVkXCIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcHJpbV9wcmV2ZW50RXh0ZW5zaW9ucyhzdWJqZWN0KTtcbiAgfVxufTtcbk9iamVjdC5zZWFsID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICBzZXRJbnRlZ3JpdHlMZXZlbChzdWJqZWN0LCBcInNlYWxlZFwiKTtcbiAgcmV0dXJuIHN1YmplY3Q7XG59O1xuT2JqZWN0LmZyZWV6ZSA9IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgc2V0SW50ZWdyaXR5TGV2ZWwoc3ViamVjdCwgXCJmcm96ZW5cIik7XG4gIHJldHVybiBzdWJqZWN0O1xufTtcbk9iamVjdC5pc0V4dGVuc2libGUgPSBPYmplY3RfaXNFeHRlbnNpYmxlID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICB2YXIgdkhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldChzdWJqZWN0KTtcbiAgaWYgKHZIYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdkhhbmRsZXIuaXNFeHRlbnNpYmxlKCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByaW1faXNFeHRlbnNpYmxlKHN1YmplY3QpO1xuICB9XG59O1xuT2JqZWN0LmlzU2VhbGVkID0gT2JqZWN0X2lzU2VhbGVkID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICByZXR1cm4gdGVzdEludGVncml0eUxldmVsKHN1YmplY3QsIFwic2VhbGVkXCIpO1xufTtcbk9iamVjdC5pc0Zyb3plbiA9IE9iamVjdF9pc0Zyb3plbiA9IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgcmV0dXJuIHRlc3RJbnRlZ3JpdHlMZXZlbChzdWJqZWN0LCBcImZyb3plblwiKTtcbn07XG5PYmplY3QuZ2V0UHJvdG90eXBlT2YgPSBPYmplY3RfZ2V0UHJvdG90eXBlT2YgPSBmdW5jdGlvbihzdWJqZWN0KSB7XG4gIHZhciB2SGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHN1YmplY3QpO1xuICBpZiAodkhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB2SGFuZGxlci5nZXRQcm90b3R5cGVPZigpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcmltX2dldFByb3RvdHlwZU9mKHN1YmplY3QpO1xuICB9XG59O1xuXG4vLyBwYXRjaCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIHRvIGRpcmVjdGx5IGNhbGxcbi8vIHRoZSBWYWxpZGF0b3IucHJvdG90eXBlLmdldE93blByb3BlcnR5RGVzY3JpcHRvciB0cmFwXG4vLyBUaGlzIGlzIHRvIGNpcmN1bXZlbnQgYW4gYXNzZXJ0aW9uIGluIHRoZSBidWlsdC1pbiBQcm94eVxuLy8gdHJhcHBpbmcgbWVjaGFuaXNtIG9mIHY4LCB3aGljaCBkaXNhbGxvd3MgdGhhdCB0cmFwIHRvXG4vLyByZXR1cm4gbm9uLWNvbmZpZ3VyYWJsZSBwcm9wZXJ0eSBkZXNjcmlwdG9ycyAoYXMgcGVyIHRoZVxuLy8gb2xkIFByb3h5IGRlc2lnbilcbk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbihzdWJqZWN0LCBuYW1lKSB7XG4gIHZhciB2aGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHN1YmplY3QpO1xuICBpZiAodmhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB2aGFuZGxlci5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByaW1fZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHN1YmplY3QsIG5hbWUpO1xuICB9XG59O1xuXG4vLyBwYXRjaCBPYmplY3QuZGVmaW5lUHJvcGVydHkgdG8gZGlyZWN0bHkgY2FsbFxuLy8gdGhlIFZhbGlkYXRvci5wcm90b3R5cGUuZGVmaW5lUHJvcGVydHkgdHJhcFxuLy8gVGhpcyBpcyB0byBjaXJjdW12ZW50IHR3byBpc3N1ZXMgd2l0aCB0aGUgYnVpbHQtaW5cbi8vIHRyYXAgbWVjaGFuaXNtOlxuLy8gMSkgdGhlIGN1cnJlbnQgdHJhY2Vtb25rZXkgaW1wbGVtZW50YXRpb24gb2YgcHJveGllc1xuLy8gYXV0by1jb21wbGV0ZXMgJ2Rlc2MnLCB3aGljaCBpcyBub3QgY29ycmVjdC4gJ2Rlc2MnIHNob3VsZCBiZVxuLy8gbm9ybWFsaXplZCwgYnV0IG5vdCBjb21wbGV0ZWQuIENvbnNpZGVyOlxuLy8gT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3h5LCAnZm9vJywge2VudW1lcmFibGU6ZmFsc2V9KVxuLy8gVGhpcyB0cmFwIHdpbGwgcmVjZWl2ZSBkZXNjID1cbi8vICB7dmFsdWU6dW5kZWZpbmVkLHdyaXRhYmxlOmZhbHNlLGVudW1lcmFibGU6ZmFsc2UsY29uZmlndXJhYmxlOmZhbHNlfVxuLy8gVGhpcyB3aWxsIGFsc28gc2V0IGFsbCBvdGhlciBhdHRyaWJ1dGVzIHRvIHRoZWlyIGRlZmF1bHQgdmFsdWUsXG4vLyB3aGljaCBpcyB1bmV4cGVjdGVkIGFuZCBkaWZmZXJlbnQgZnJvbSBbW0RlZmluZU93blByb3BlcnR5XV0uXG4vLyBCdWcgZmlsZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTYwMTMyOVxuLy8gMikgdGhlIGN1cnJlbnQgc3BpZGVybW9ua2V5IGltcGxlbWVudGF0aW9uIGRvZXMgbm90XG4vLyB0aHJvdyBhbiBleGNlcHRpb24gd2hlbiB0aGlzIHRyYXAgcmV0dXJucyAnZmFsc2UnLCBidXQgaW5zdGVhZCBzaWxlbnRseVxuLy8gaWdub3JlcyB0aGUgb3BlcmF0aW9uICh0aGlzIGlzIHJlZ2FyZGxlc3Mgb2Ygc3RyaWN0LW1vZGUpXG4vLyAyYSkgdjggZG9lcyB0aHJvdyBhbiBleGNlcHRpb24gZm9yIHRoaXMgY2FzZSwgYnV0IGluY2x1ZGVzIHRoZSByYXRoZXJcbi8vICAgICB1bmhlbHBmdWwgZXJyb3IgbWVzc2FnZTpcbi8vICdQcm94eSBoYW5kbGVyICM8T2JqZWN0PiByZXR1cm5lZCBmYWxzZSBmcm9tICdkZWZpbmVQcm9wZXJ0eScgdHJhcCdcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uKHN1YmplY3QsIG5hbWUsIGRlc2MpIHtcbiAgdmFyIHZoYW5kbGVyID0gZGlyZWN0UHJveGllcy5nZXQoc3ViamVjdCk7XG4gIGlmICh2aGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIG5vcm1hbGl6ZWREZXNjID0gbm9ybWFsaXplUHJvcGVydHlEZXNjcmlwdG9yKGRlc2MpO1xuICAgIHZhciBzdWNjZXNzID0gdmhhbmRsZXIuZGVmaW5lUHJvcGVydHkobmFtZSwgbm9ybWFsaXplZERlc2MpO1xuICAgIGlmIChzdWNjZXNzID09PSBmYWxzZSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbid0IHJlZGVmaW5lIHByb3BlcnR5ICdcIituYW1lK1wiJ1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHN1YmplY3Q7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByaW1fZGVmaW5lUHJvcGVydHkoc3ViamVjdCwgbmFtZSwgZGVzYyk7XG4gIH1cbn07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24oc3ViamVjdCwgZGVzY3MpIHtcbiAgdmFyIHZoYW5kbGVyID0gZGlyZWN0UHJveGllcy5nZXQoc3ViamVjdCk7XG4gIGlmICh2aGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIG5hbWVzID0gT2JqZWN0LmtleXMoZGVzY3MpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuYW1lID0gbmFtZXNbaV07XG4gICAgICB2YXIgbm9ybWFsaXplZERlc2MgPSBub3JtYWxpemVQcm9wZXJ0eURlc2NyaXB0b3IoZGVzY3NbbmFtZV0pO1xuICAgICAgdmFyIHN1Y2Nlc3MgPSB2aGFuZGxlci5kZWZpbmVQcm9wZXJ0eShuYW1lLCBub3JtYWxpemVkRGVzYyk7XG4gICAgICBpZiAoc3VjY2VzcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbid0IHJlZGVmaW5lIHByb3BlcnR5ICdcIituYW1lK1wiJ1wiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN1YmplY3Q7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByaW1fZGVmaW5lUHJvcGVydGllcyhzdWJqZWN0LCBkZXNjcyk7XG4gIH1cbn07XG5cbk9iamVjdC5rZXlzID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICB2YXIgdkhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldChzdWJqZWN0KTtcbiAgaWYgKHZIYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgb3duS2V5cyA9IHZIYW5kbGVyLm93bktleXMoKTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvd25LZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgayA9IFN0cmluZyhvd25LZXlzW2ldKTtcbiAgICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzdWJqZWN0LCBrKTtcbiAgICAgIGlmIChkZXNjICE9PSB1bmRlZmluZWQgJiYgZGVzYy5lbnVtZXJhYmxlID09PSB0cnVlKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGspO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcmltX2tleXMoc3ViamVjdCk7XG4gIH1cbn1cblxuT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgPSBPYmplY3RfZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgdmFyIHZIYW5kbGVyID0gZGlyZWN0UHJveGllcy5nZXQoc3ViamVjdCk7XG4gIGlmICh2SGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHZIYW5kbGVyLm93bktleXMoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcHJpbV9nZXRPd25Qcm9wZXJ0eU5hbWVzKHN1YmplY3QpO1xuICB9XG59XG5cbi8vIGZpeGVzIGlzc3VlICM3MSAoQ2FsbGluZyBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKCkgb24gYSBQcm94eVxuLy8gdGhyb3dzIGFuIGVycm9yKVxuaWYgKHByaW1fZ2V0T3duUHJvcGVydHlTeW1ib2xzICE9PSB1bmRlZmluZWQpIHtcbiAgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICB2YXIgdkhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldChzdWJqZWN0KTtcbiAgICBpZiAodkhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gYXMgdGhpcyBzaGltIGRvZXMgbm90IHN1cHBvcnQgc3ltYm9scywgYSBQcm94eSBuZXZlciBhZHZlcnRpc2VzXG4gICAgICAvLyBhbnkgc3ltYm9sLXZhbHVlZCBvd24gcHJvcGVydGllc1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcHJpbV9nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoc3ViamVjdCk7XG4gICAgfVxuICB9O1xufVxuXG4vLyBmaXhlcyBpc3N1ZSAjNzIgKCdJbGxlZ2FsIGFjY2VzcycgZXJyb3Igd2hlbiB1c2luZyBPYmplY3QuYXNzaWduKVxuLy8gT2JqZWN0LmFzc2lnbiBwb2x5ZmlsbCBiYXNlZCBvbiBhIHBvbHlmaWxsIHBvc3RlZCBvbiBNRE46IFxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvXFxcbi8vICBHbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduXG4vLyBOb3RlIHRoYXQgdGhpcyBwb2x5ZmlsbCBkb2VzIG5vdCBzdXBwb3J0IFN5bWJvbHMsIGJ1dCB0aGlzIFByb3h5IFNoaW1cbi8vIGRvZXMgbm90IHN1cHBvcnQgU3ltYm9scyBhbnl3YXkuXG5pZiAocHJpbV9hc3NpZ24gIT09IHVuZGVmaW5lZCkge1xuICBPYmplY3QuYXNzaWduID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIFxuICAgIC8vIGNoZWNrIGlmIGFueSBhcmd1bWVudCBpcyBhIHByb3h5IG9iamVjdFxuICAgIHZhciBub1Byb3hpZXMgPSB0cnVlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdkhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldChhcmd1bWVudHNbaV0pO1xuICAgICAgaWYgKHZIYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbm9Qcm94aWVzID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobm9Qcm94aWVzKSB7XG4gICAgICAvLyBub3QgYSBzaW5nbGUgYXJndW1lbnQgaXMgYSBwcm94eSwgcGVyZm9ybSBidWlsdC1pbiBhbGdvcml0aG1cbiAgICAgIHJldHVybiBwcmltX2Fzc2lnbi5hcHBseShPYmplY3QsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIFxuICAgIC8vIHRoZXJlIGlzIGF0IGxlYXN0IG9uZSBwcm94eSBhcmd1bWVudCwgdXNlIHRoZSBwb2x5ZmlsbFxuICAgIFxuICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcpO1xuICAgIH1cblxuICAgIHZhciBvdXRwdXQgPSBPYmplY3QodGFyZ2V0KTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpbmRleF07XG4gICAgICBpZiAoc291cmNlICE9PSB1bmRlZmluZWQgJiYgc291cmNlICE9PSBudWxsKSB7XG4gICAgICAgIGZvciAodmFyIG5leHRLZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShuZXh0S2V5KSkge1xuICAgICAgICAgICAgb3V0cHV0W25leHRLZXldID0gc291cmNlW25leHRLZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xufVxuXG4vLyByZXR1cm5zIHdoZXRoZXIgYW4gYXJndW1lbnQgaXMgYSByZWZlcmVuY2UgdG8gYW4gb2JqZWN0LFxuLy8gd2hpY2ggaXMgbGVnYWwgYXMgYSBXZWFrTWFwIGtleS5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBhcmc7XG4gIHJldHVybiAodHlwZSA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsKSB8fCAodHlwZSA9PT0gJ2Z1bmN0aW9uJyk7XG59O1xuXG4vLyBhIHdyYXBwZXIgZm9yIFdlYWtNYXAuZ2V0IHdoaWNoIHJldHVybnMgdGhlIHVuZGVmaW5lZCB2YWx1ZVxuLy8gZm9yIGtleXMgdGhhdCBhcmUgbm90IG9iamVjdHMgKGluIHdoaWNoIGNhc2UgdGhlIHVuZGVybHlpbmdcbi8vIFdlYWtNYXAgd291bGQgaGF2ZSB0aHJvd24gYSBUeXBlRXJyb3IpLlxuZnVuY3Rpb24gc2FmZVdlYWtNYXBHZXQobWFwLCBrZXkpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGtleSkgPyBtYXAuZ2V0KGtleSkgOiB1bmRlZmluZWQ7XG59O1xuXG4vLyByZXR1cm5zIGEgbmV3IGZ1bmN0aW9uIG9mIHplcm8gYXJndW1lbnRzIHRoYXQgcmVjdXJzaXZlbHlcbi8vIHVud3JhcHMgYW55IHByb3hpZXMgc3BlY2lmaWVkIGFzIHRoZSB8dGhpc3wtdmFsdWUuXG4vLyBUaGUgcHJpbWl0aXZlIGlzIGFzc3VtZWQgdG8gYmUgYSB6ZXJvLWFyZ3VtZW50IG1ldGhvZFxuLy8gdGhhdCB1c2VzIGl0cyB8dGhpc3wtYmluZGluZy5cbmZ1bmN0aW9uIG1ha2VVbndyYXBwaW5nMEFyZ01ldGhvZChwcmltaXRpdmUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGJ1aWx0aW4oKSB7XG4gICAgdmFyIHZIYW5kbGVyID0gc2FmZVdlYWtNYXBHZXQoZGlyZWN0UHJveGllcywgdGhpcyk7XG4gICAgaWYgKHZIYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBidWlsdGluLmNhbGwodkhhbmRsZXIudGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHByaW1pdGl2ZS5jYWxsKHRoaXMpO1xuICAgIH1cbiAgfVxufTtcblxuLy8gcmV0dXJucyBhIG5ldyBmdW5jdGlvbiBvZiAxIGFyZ3VtZW50cyB0aGF0IHJlY3Vyc2l2ZWx5XG4vLyB1bndyYXBzIGFueSBwcm94aWVzIHNwZWNpZmllZCBhcyB0aGUgfHRoaXN8LXZhbHVlLlxuLy8gVGhlIHByaW1pdGl2ZSBpcyBhc3N1bWVkIHRvIGJlIGEgMS1hcmd1bWVudCBtZXRob2Rcbi8vIHRoYXQgdXNlcyBpdHMgfHRoaXN8LWJpbmRpbmcuXG5mdW5jdGlvbiBtYWtlVW53cmFwcGluZzFBcmdNZXRob2QocHJpbWl0aXZlKSB7XG4gIHJldHVybiBmdW5jdGlvbiBidWlsdGluKGFyZykge1xuICAgIHZhciB2SGFuZGxlciA9IHNhZmVXZWFrTWFwR2V0KGRpcmVjdFByb3hpZXMsIHRoaXMpO1xuICAgIGlmICh2SGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gYnVpbHRpbi5jYWxsKHZIYW5kbGVyLnRhcmdldCwgYXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHByaW1pdGl2ZS5jYWxsKHRoaXMsIGFyZyk7XG4gICAgfVxuICB9XG59O1xuXG5PYmplY3QucHJvdG90eXBlLnZhbHVlT2YgPVxuICBtYWtlVW53cmFwcGluZzBBcmdNZXRob2QoT2JqZWN0LnByb3RvdHlwZS52YWx1ZU9mKTtcbk9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcgPVxuICBtYWtlVW53cmFwcGluZzBBcmdNZXRob2QoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyk7XG5GdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcgPVxuICBtYWtlVW53cmFwcGluZzBBcmdNZXRob2QoRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nKTtcbkRhdGUucHJvdG90eXBlLnRvU3RyaW5nID1cbiAgbWFrZVVud3JhcHBpbmcwQXJnTWV0aG9kKERhdGUucHJvdG90eXBlLnRvU3RyaW5nKTtcblxuT2JqZWN0LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mID0gZnVuY3Rpb24gYnVpbHRpbihhcmcpIHtcbiAgLy8gYnVnZml4IHRoYW5rcyB0byBCaWxsIE1hcms6XG4gIC8vIGJ1aWx0LWluIGlzUHJvdG90eXBlT2YgZG9lcyBub3QgdW53cmFwIHByb3hpZXMgdXNlZFxuICAvLyBhcyBhcmd1bWVudHMuIFNvLCB3ZSBpbXBsZW1lbnQgdGhlIGJ1aWx0aW4gb3Vyc2VsdmVzLFxuICAvLyBiYXNlZCBvbiB0aGUgRUNNQVNjcmlwdCA2IHNwZWMuIE91ciBlbmNvZGluZyB3aWxsXG4gIC8vIG1ha2Ugc3VyZSB0aGF0IGlmIGEgcHJveHkgaXMgdXNlZCBhcyBhbiBhcmd1bWVudCxcbiAgLy8gaXRzIGdldFByb3RvdHlwZU9mIHRyYXAgd2lsbCBiZSBjYWxsZWQuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgdmFyIHZIYW5kbGVyMiA9IHNhZmVXZWFrTWFwR2V0KGRpcmVjdFByb3hpZXMsIGFyZyk7XG4gICAgaWYgKHZIYW5kbGVyMiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhcmcgPSB2SGFuZGxlcjIuZ2V0UHJvdG90eXBlT2YoKTtcbiAgICAgIGlmIChhcmcgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIGlmIChzYW1lVmFsdWUoYXJnLCB0aGlzKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHByaW1faXNQcm90b3R5cGVPZi5jYWxsKHRoaXMsIGFyZyk7XG4gICAgfVxuICB9XG59O1xuXG5BcnJheS5pc0FycmF5ID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICB2YXIgdkhhbmRsZXIgPSBzYWZlV2Vha01hcEdldChkaXJlY3RQcm94aWVzLCBzdWJqZWN0KTtcbiAgaWYgKHZIYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2SGFuZGxlci50YXJnZXQpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcmltX2lzQXJyYXkoc3ViamVjdCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGlzUHJveHlBcnJheShhcmcpIHtcbiAgdmFyIHZIYW5kbGVyID0gc2FmZVdlYWtNYXBHZXQoZGlyZWN0UHJveGllcywgYXJnKTtcbiAgaWYgKHZIYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2SGFuZGxlci50YXJnZXQpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLy8gQXJyYXkucHJvdG90eXBlLmNvbmNhdCBpbnRlcm5hbGx5IHRlc3RzIHdoZXRoZXIgb25lIG9mIGl0c1xuLy8gYXJndW1lbnRzIGlzIGFuIEFycmF5LCBieSBjaGVja2luZyB3aGV0aGVyIFtbQ2xhc3NdXSA9PSBcIkFycmF5XCJcbi8vIEFzIHN1Y2gsIGl0IHdpbGwgZmFpbCB0byByZWNvZ25pemUgcHJveGllcy1mb3ItYXJyYXlzIGFzIGFycmF5cy5cbi8vIFdlIHBhdGNoIEFycmF5LnByb3RvdHlwZS5jb25jYXQgc28gdGhhdCBpdCBcInVud3JhcHNcIiBwcm94aWVzLWZvci1hcnJheXNcbi8vIGJ5IG1ha2luZyBhIGNvcHkuIFRoaXMgd2lsbCB0cmlnZ2VyIHRoZSBleGFjdCBzYW1lIHNlcXVlbmNlIG9mXG4vLyB0cmFwcyBvbiB0aGUgcHJveHktZm9yLWFycmF5IGFzIGlmIHdlIHdvdWxkIG5vdCBoYXZlIHVud3JhcHBlZCBpdC5cbi8vIFNlZSA8aHR0cHM6Ly9naXRodWIuY29tL3R2Y3V0c2VtL2hhcm1vbnktcmVmbGVjdC9pc3N1ZXMvMTk+IGZvciBtb3JlLlxuQXJyYXkucHJvdG90eXBlLmNvbmNhdCA9IGZ1bmN0aW9uKC8qLi4uYXJncyovKSB7XG4gIHZhciBsZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGlzUHJveHlBcnJheShhcmd1bWVudHNbaV0pKSB7XG4gICAgICBsZW5ndGggPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xuICAgICAgYXJndW1lbnRzW2ldID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzW2ldLCAwLCBsZW5ndGgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcHJpbV9jb25jYXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cbi8vIHNldFByb3RvdHlwZU9mIHN1cHBvcnQgb24gcGxhdGZvcm1zIHRoYXQgc3VwcG9ydCBfX3Byb3RvX19cblxudmFyIHByaW1fc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2Y7XG5cbi8vIHBhdGNoIGFuZCBleHRyYWN0IG9yaWdpbmFsIF9fcHJvdG9fXyBzZXR0ZXJcbnZhciBfX3Byb3RvX19zZXR0ZXIgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBwcm90b0Rlc2MgPSBwcmltX2dldE93blByb3BlcnR5RGVzY3JpcHRvcihPYmplY3QucHJvdG90eXBlLCdfX3Byb3RvX18nKTtcbiAgaWYgKHByb3RvRGVzYyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICB0eXBlb2YgcHJvdG9EZXNjLnNldCAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInNldFByb3RvdHlwZU9mIG5vdCBzdXBwb3J0ZWQgb24gdGhpcyBwbGF0Zm9ybVwiKTtcbiAgICB9XG4gIH1cblxuICAvLyBzZWUgaWYgd2UgY2FuIGFjdHVhbGx5IG11dGF0ZSBhIHByb3RvdHlwZSB3aXRoIHRoZSBnZW5lcmljIHNldHRlclxuICAvLyAoZS5nLiBDaHJvbWUgdjI4IGRvZXNuJ3QgYWxsb3cgc2V0dGluZyBfX3Byb3RvX18gdmlhIHRoZSBnZW5lcmljIHNldHRlcilcbiAgdHJ5IHtcbiAgICBwcm90b0Rlc2Muc2V0LmNhbGwoe30se30pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInNldFByb3RvdHlwZU9mIG5vdCBzdXBwb3J0ZWQgb24gdGhpcyBwbGF0Zm9ybVwiKTtcbiAgICB9XG4gIH1cblxuICBwcmltX2RlZmluZVByb3BlcnR5KE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nLCB7XG4gICAgc2V0OiBmdW5jdGlvbihuZXdQcm90bykge1xuICAgICAgcmV0dXJuIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBPYmplY3QobmV3UHJvdG8pKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwcm90b0Rlc2Muc2V0O1xufSgpKTtcblxuT2JqZWN0LnNldFByb3RvdHlwZU9mID0gZnVuY3Rpb24odGFyZ2V0LCBuZXdQcm90bykge1xuICB2YXIgaGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHRhcmdldCk7XG4gIGlmIChoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAoaGFuZGxlci5zZXRQcm90b3R5cGVPZihuZXdQcm90bykpIHtcbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJwcm94eSByZWplY3RlZCBwcm90b3R5cGUgbXV0YXRpb25cIik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICghT2JqZWN0X2lzRXh0ZW5zaWJsZSh0YXJnZXQpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2FuJ3Qgc2V0IHByb3RvdHlwZSBvbiBub24tZXh0ZW5zaWJsZSBvYmplY3Q6IFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0KTtcbiAgICB9XG4gICAgaWYgKHByaW1fc2V0UHJvdG90eXBlT2YpXG4gICAgICByZXR1cm4gcHJpbV9zZXRQcm90b3R5cGVPZih0YXJnZXQsIG5ld1Byb3RvKTtcblxuICAgIGlmIChPYmplY3QobmV3UHJvdG8pICE9PSBuZXdQcm90byB8fCBuZXdQcm90byA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBwcm90b3R5cGUgbWF5IG9ubHkgYmUgYW4gT2JqZWN0IG9yIG51bGw6IFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICBuZXdQcm90byk7XG4gICAgICAvLyB0aHJvdyBuZXcgVHlwZUVycm9yKFwicHJvdG90eXBlIG11c3QgYmUgYW4gb2JqZWN0IG9yIG51bGxcIilcbiAgICB9XG4gICAgX19wcm90b19fc2V0dGVyLmNhbGwodGFyZ2V0LCBuZXdQcm90byk7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxufVxuXG5PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5ID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaGFuZGxlciA9IHNhZmVXZWFrTWFwR2V0KGRpcmVjdFByb3hpZXMsIHRoaXMpO1xuICBpZiAoaGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGRlc2MgPSBoYW5kbGVyLmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuYW1lKTtcbiAgICByZXR1cm4gZGVzYyAhPT0gdW5kZWZpbmVkO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcmltX2hhc093blByb3BlcnR5LmNhbGwodGhpcywgbmFtZSk7XG4gIH1cbn1cblxuLy8gPT09PT09PT09PT09PSBSZWZsZWN0aW9uIG1vZHVsZSA9PT09PT09PT09PT09XG4vLyBzZWUgaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTpyZWZsZWN0X2FwaVxuXG52YXIgUmVmbGVjdCA9IGdsb2JhbC5SZWZsZWN0ID0ge1xuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IGZ1bmN0aW9uKHRhcmdldCwgbmFtZSkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSk7XG4gIH0sXG4gIGRlZmluZVByb3BlcnR5OiBmdW5jdGlvbih0YXJnZXQsIG5hbWUsIGRlc2MpIHtcblxuICAgIC8vIGlmIHRhcmdldCBpcyBhIHByb3h5LCBpbnZva2UgaXRzIFwiZGVmaW5lUHJvcGVydHlcIiB0cmFwXG4gICAgdmFyIGhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldCh0YXJnZXQpO1xuICAgIGlmIChoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVyLmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzYyk7XG4gICAgfVxuXG4gICAgLy8gSW1wbGVtZW50YXRpb24gdHJhbnNsaXRlcmF0ZWQgZnJvbSBbW0RlZmluZU93blByb3BlcnR5XV1cbiAgICAvLyBzZWUgRVM1LjEgc2VjdGlvbiA4LjEyLjlcbiAgICAvLyB0aGlzIGlzIHRoZSBfZXhhY3Qgc2FtZSBhbGdvcml0aG1fIGFzIHRoZSBpc0NvbXBhdGlibGVEZXNjcmlwdG9yXG4gICAgLy8gYWxnb3JpdGhtIGRlZmluZWQgYWJvdmUsIGV4Y2VwdCB0aGF0IGF0IGV2ZXJ5IHBsYWNlIGl0XG4gICAgLy8gcmV0dXJucyB0cnVlLCB0aGlzIGFsZ29yaXRobSBhY3R1YWxseSBkb2VzIGRlZmluZSB0aGUgcHJvcGVydHkuXG4gICAgdmFyIGN1cnJlbnQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSk7XG4gICAgdmFyIGV4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlKHRhcmdldCk7XG4gICAgaWYgKGN1cnJlbnQgPT09IHVuZGVmaW5lZCAmJiBleHRlbnNpYmxlID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoY3VycmVudCA9PT0gdW5kZWZpbmVkICYmIGV4dGVuc2libGUgPT09IHRydWUpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2MpOyAvLyBzaG91bGQgbmV2ZXIgZmFpbFxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChpc0VtcHR5RGVzY3JpcHRvcihkZXNjKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChpc0VxdWl2YWxlbnREZXNjcmlwdG9yKGN1cnJlbnQsIGRlc2MpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGN1cnJlbnQuY29uZmlndXJhYmxlID09PSBmYWxzZSkge1xuICAgICAgaWYgKGRlc2MuY29uZmlndXJhYmxlID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICgnZW51bWVyYWJsZScgaW4gZGVzYyAmJiBkZXNjLmVudW1lcmFibGUgIT09IGN1cnJlbnQuZW51bWVyYWJsZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc0dlbmVyaWNEZXNjcmlwdG9yKGRlc2MpKSB7XG4gICAgICAvLyBubyBmdXJ0aGVyIHZhbGlkYXRpb24gbmVjZXNzYXJ5XG4gICAgfSBlbHNlIGlmIChpc0RhdGFEZXNjcmlwdG9yKGN1cnJlbnQpICE9PSBpc0RhdGFEZXNjcmlwdG9yKGRlc2MpKSB7XG4gICAgICBpZiAoY3VycmVudC5jb25maWd1cmFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzRGF0YURlc2NyaXB0b3IoY3VycmVudCkgJiYgaXNEYXRhRGVzY3JpcHRvcihkZXNjKSkge1xuICAgICAgaWYgKGN1cnJlbnQuY29uZmlndXJhYmxlID09PSBmYWxzZSkge1xuICAgICAgICBpZiAoY3VycmVudC53cml0YWJsZSA9PT0gZmFsc2UgJiYgZGVzYy53cml0YWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3VycmVudC53cml0YWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjICYmICFzYW1lVmFsdWUoZGVzYy52YWx1ZSwgY3VycmVudC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzQWNjZXNzb3JEZXNjcmlwdG9yKGN1cnJlbnQpICYmIGlzQWNjZXNzb3JEZXNjcmlwdG9yKGRlc2MpKSB7XG4gICAgICBpZiAoY3VycmVudC5jb25maWd1cmFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgIGlmICgnc2V0JyBpbiBkZXNjICYmICFzYW1lVmFsdWUoZGVzYy5zZXQsIGN1cnJlbnQuc2V0KSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJ2dldCcgaW4gZGVzYyAmJiAhc2FtZVZhbHVlKGRlc2MuZ2V0LCBjdXJyZW50LmdldCkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzYyk7IC8vIHNob3VsZCBuZXZlciBmYWlsXG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIGRlbGV0ZVByb3BlcnR5OiBmdW5jdGlvbih0YXJnZXQsIG5hbWUpIHtcbiAgICB2YXIgaGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHRhcmdldCk7XG4gICAgaWYgKGhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZXIuZGVsZXRlKG5hbWUpO1xuICAgIH1cbiAgICBcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKTtcbiAgICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGRlc2MuY29uZmlndXJhYmxlID09PSB0cnVlKSB7XG4gICAgICBkZWxldGUgdGFyZ2V0W25hbWVdO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTsgICAgXG4gIH0sXG4gIGdldFByb3RvdHlwZU9mOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldCk7XG4gIH0sXG4gIHNldFByb3RvdHlwZU9mOiBmdW5jdGlvbih0YXJnZXQsIG5ld1Byb3RvKSB7XG4gICAgXG4gICAgdmFyIGhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldCh0YXJnZXQpO1xuICAgIGlmIChoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVyLnNldFByb3RvdHlwZU9mKG5ld1Byb3RvKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKE9iamVjdChuZXdQcm90bykgIT09IG5ld1Byb3RvIHx8IG5ld1Byb3RvID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IHByb3RvdHlwZSBtYXkgb25seSBiZSBhbiBPYmplY3Qgb3IgbnVsbDogXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1Byb3RvKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKCFPYmplY3RfaXNFeHRlbnNpYmxlKHRhcmdldCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgdmFyIGN1cnJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KTtcbiAgICBpZiAoc2FtZVZhbHVlKGN1cnJlbnQsIG5ld1Byb3RvKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIFxuICAgIGlmIChwcmltX3NldFByb3RvdHlwZU9mKSB7XG4gICAgICB0cnkge1xuICAgICAgICBwcmltX3NldFByb3RvdHlwZU9mKHRhcmdldCwgbmV3UHJvdG8pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9fcHJvdG9fX3NldHRlci5jYWxsKHRhcmdldCwgbmV3UHJvdG8pO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBwcmV2ZW50RXh0ZW5zaW9uczogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgdmFyIGhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldCh0YXJnZXQpO1xuICAgIGlmIChoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVyLnByZXZlbnRFeHRlbnNpb25zKCk7XG4gICAgfVxuICAgIHByaW1fcHJldmVudEV4dGVuc2lvbnModGFyZ2V0KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgaXNFeHRlbnNpYmxlOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpO1xuICB9LFxuICBoYXM6IGZ1bmN0aW9uKHRhcmdldCwgbmFtZSkge1xuICAgIHJldHVybiBuYW1lIGluIHRhcmdldDtcbiAgfSxcbiAgZ2V0OiBmdW5jdGlvbih0YXJnZXQsIG5hbWUsIHJlY2VpdmVyKSB7XG4gICAgcmVjZWl2ZXIgPSByZWNlaXZlciB8fCB0YXJnZXQ7XG5cbiAgICAvLyBpZiB0YXJnZXQgaXMgYSBwcm94eSwgaW52b2tlIGl0cyBcImdldFwiIHRyYXBcbiAgICB2YXIgaGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHRhcmdldCk7XG4gICAgaWYgKGhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZXIuZ2V0KHJlY2VpdmVyLCBuYW1lKTtcbiAgICB9XG5cbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKTtcbiAgICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KTtcbiAgICAgIGlmIChwcm90byA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0KHByb3RvLCBuYW1lLCByZWNlaXZlcik7XG4gICAgfVxuICAgIGlmIChpc0RhdGFEZXNjcmlwdG9yKGRlc2MpKSB7XG4gICAgICByZXR1cm4gZGVzYy52YWx1ZTtcbiAgICB9XG4gICAgdmFyIGdldHRlciA9IGRlc2MuZ2V0O1xuICAgIGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIGRlc2MuZ2V0LmNhbGwocmVjZWl2ZXIpO1xuICB9LFxuICAvLyBSZWZsZWN0LnNldCBpbXBsZW1lbnRhdGlvbiBiYXNlZCBvbiBsYXRlc3QgdmVyc2lvbiBvZiBbW1NldFBdXSBhdFxuICAvLyBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OnByb3RvX2NsaW1iaW5nX3JlZmFjdG9yaW5nXG4gIHNldDogZnVuY3Rpb24odGFyZ2V0LCBuYW1lLCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICByZWNlaXZlciA9IHJlY2VpdmVyIHx8IHRhcmdldDtcblxuICAgIC8vIGlmIHRhcmdldCBpcyBhIHByb3h5LCBpbnZva2UgaXRzIFwic2V0XCIgdHJhcFxuICAgIHZhciBoYW5kbGVyID0gZGlyZWN0UHJveGllcy5nZXQodGFyZ2V0KTtcbiAgICBpZiAoaGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlci5zZXQocmVjZWl2ZXIsIG5hbWUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBmaXJzdCwgY2hlY2sgd2hldGhlciB0YXJnZXQgaGFzIGEgbm9uLXdyaXRhYmxlIHByb3BlcnR5XG4gICAgLy8gc2hhZG93aW5nIG5hbWUgb24gcmVjZWl2ZXJcbiAgICB2YXIgb3duRGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKTtcblxuICAgIGlmIChvd25EZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIG5hbWUgaXMgbm90IGRlZmluZWQgaW4gdGFyZ2V0LCBzZWFyY2ggdGFyZ2V0J3MgcHJvdG90eXBlXG4gICAgICB2YXIgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KTtcblxuICAgICAgaWYgKHByb3RvICE9PSBudWxsKSB7XG4gICAgICAgIC8vIGNvbnRpbnVlIHRoZSBzZWFyY2ggaW4gdGFyZ2V0J3MgcHJvdG90eXBlXG4gICAgICAgIHJldHVybiBSZWZsZWN0LnNldChwcm90bywgbmFtZSwgdmFsdWUsIHJlY2VpdmVyKTtcbiAgICAgIH1cblxuICAgICAgLy8gUmV2MTYgY2hhbmdlLiBDZi4gaHR0cHM6Ly9idWdzLmVjbWFzY3JpcHQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNTQ5XG4gICAgICAvLyB0YXJnZXQgd2FzIHRoZSBsYXN0IHByb3RvdHlwZSwgbm93IHdlIGtub3cgdGhhdCAnbmFtZScgaXMgbm90IHNoYWRvd2VkXG4gICAgICAvLyBieSBhbiBleGlzdGluZyAoYWNjZXNzb3Igb3IgZGF0YSkgcHJvcGVydHksIHNvIHdlIGNhbiBhZGQgdGhlIHByb3BlcnR5XG4gICAgICAvLyB0byB0aGUgaW5pdGlhbCByZWNlaXZlciBvYmplY3RcbiAgICAgIC8vICh0aGlzIGJyYW5jaCB3aWxsIGludGVudGlvbmFsbHkgZmFsbCB0aHJvdWdoIHRvIHRoZSBjb2RlIGJlbG93KVxuICAgICAgb3duRGVzYyA9XG4gICAgICAgIHsgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9O1xuICAgIH1cblxuICAgIC8vIHdlIG5vdyBrbm93IHRoYXQgb3duRGVzYyAhPT0gdW5kZWZpbmVkXG4gICAgaWYgKGlzQWNjZXNzb3JEZXNjcmlwdG9yKG93bkRlc2MpKSB7XG4gICAgICB2YXIgc2V0dGVyID0gb3duRGVzYy5zZXQ7XG4gICAgICBpZiAoc2V0dGVyID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgICAgIHNldHRlci5jYWxsKHJlY2VpdmVyLCB2YWx1ZSk7IC8vIGFzc3VtZXMgRnVuY3Rpb24ucHJvdG90eXBlLmNhbGxcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyBvdGhlcndpc2UsIGlzRGF0YURlc2NyaXB0b3Iob3duRGVzYykgbXVzdCBiZSB0cnVlXG4gICAgaWYgKG93bkRlc2Mud3JpdGFibGUgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gd2UgZm91bmQgYW4gZXhpc3Rpbmcgd3JpdGFibGUgZGF0YSBwcm9wZXJ0eSBvbiB0aGUgcHJvdG90eXBlIGNoYWluLlxuICAgIC8vIE5vdyB1cGRhdGUgb3IgYWRkIHRoZSBkYXRhIHByb3BlcnR5IG9uIHRoZSByZWNlaXZlciwgZGVwZW5kaW5nIG9uXG4gICAgLy8gd2hldGhlciB0aGUgcmVjZWl2ZXIgYWxyZWFkeSBkZWZpbmVzIHRoZSBwcm9wZXJ0eSBvciBub3QuXG4gICAgdmFyIGV4aXN0aW5nRGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocmVjZWl2ZXIsIG5hbWUpO1xuICAgIGlmIChleGlzdGluZ0Rlc2MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHVwZGF0ZURlc2MgPVxuICAgICAgICB7IHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAvLyBGSVhNRTogaXQgc2hvdWxkIG5vdCBiZSBuZWNlc3NhcnkgdG8gZGVzY3JpYmUgdGhlIGZvbGxvd2luZ1xuICAgICAgICAgIC8vIGF0dHJpYnV0ZXMuIEFkZGVkIHRvIGNpcmN1bXZlbnQgYSBidWcgaW4gdHJhY2Vtb25rZXk6XG4gICAgICAgICAgLy8gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NjAxMzI5XG4gICAgICAgICAgd3JpdGFibGU6ICAgICBleGlzdGluZ0Rlc2Mud3JpdGFibGUsXG4gICAgICAgICAgZW51bWVyYWJsZTogICBleGlzdGluZ0Rlc2MuZW51bWVyYWJsZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IGV4aXN0aW5nRGVzYy5jb25maWd1cmFibGUgfTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZWNlaXZlciwgbmFtZSwgdXBkYXRlRGVzYyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFPYmplY3QuaXNFeHRlbnNpYmxlKHJlY2VpdmVyKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgdmFyIG5ld0Rlc2MgPVxuICAgICAgICB7IHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9O1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlY2VpdmVyLCBuYW1lLCBuZXdEZXNjKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSxcbiAgLyppbnZva2U6IGZ1bmN0aW9uKHRhcmdldCwgbmFtZSwgYXJncywgcmVjZWl2ZXIpIHtcbiAgICByZWNlaXZlciA9IHJlY2VpdmVyIHx8IHRhcmdldDtcblxuICAgIHZhciBoYW5kbGVyID0gZGlyZWN0UHJveGllcy5nZXQodGFyZ2V0KTtcbiAgICBpZiAoaGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlci5pbnZva2UocmVjZWl2ZXIsIG5hbWUsIGFyZ3MpO1xuICAgIH1cblxuICAgIHZhciBmdW4gPSBSZWZsZWN0LmdldCh0YXJnZXQsIG5hbWUsIHJlY2VpdmVyKTtcbiAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoZnVuLCByZWNlaXZlciwgYXJncyk7XG4gIH0sKi9cbiAgZW51bWVyYXRlOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICB2YXIgaGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHRhcmdldCk7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBpZiAoaGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBoYW5kbGVyLmVudW1lcmF0ZSBzaG91bGQgcmV0dXJuIGFuIGl0ZXJhdG9yIGRpcmVjdGx5LCBidXQgdGhlXG4gICAgICAvLyBpdGVyYXRvciBnZXRzIGNvbnZlcnRlZCB0byBhbiBhcnJheSBmb3IgYmFja3dhcmQtY29tcGF0IHJlYXNvbnMsXG4gICAgICAvLyBzbyB3ZSBtdXN0IHJlLWl0ZXJhdGUgb3ZlciB0aGUgYXJyYXlcbiAgICAgIHJlc3VsdCA9IGhhbmRsZXIuZW51bWVyYXRlKGhhbmRsZXIudGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gW107XG4gICAgICBmb3IgKHZhciBuYW1lIGluIHRhcmdldCkgeyByZXN1bHQucHVzaChuYW1lKTsgfTsgICAgICBcbiAgICB9XG4gICAgdmFyIGwgPSArcmVzdWx0Lmxlbmd0aDtcbiAgICB2YXIgaWR4ID0gMDtcbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChpZHggPT09IGwpIHJldHVybiB7IGRvbmU6IHRydWUgfTtcbiAgICAgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiByZXN1bHRbaWR4KytdIH07XG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgLy8gaW1wZXJmZWN0IG93bktleXMgaW1wbGVtZW50YXRpb246IGluIEVTNiwgc2hvdWxkIGFsc28gaW5jbHVkZVxuICAvLyBzeW1ib2wta2V5ZWQgcHJvcGVydGllcy5cbiAgb3duS2V5czogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgcmV0dXJuIE9iamVjdF9nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldCk7XG4gIH0sXG4gIGFwcGx5OiBmdW5jdGlvbih0YXJnZXQsIHJlY2VpdmVyLCBhcmdzKSB7XG4gICAgLy8gdGFyZ2V0LmFwcGx5KHJlY2VpdmVyLCBhcmdzKVxuICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbCh0YXJnZXQsIHJlY2VpdmVyLCBhcmdzKTtcbiAgfSxcbiAgY29uc3RydWN0OiBmdW5jdGlvbih0YXJnZXQsIGFyZ3MsIG5ld1RhcmdldCkge1xuICAgIC8vIHJldHVybiBuZXcgdGFyZ2V0KC4uLmFyZ3MpO1xuXG4gICAgLy8gaWYgdGFyZ2V0IGlzIGEgcHJveHksIGludm9rZSBpdHMgXCJjb25zdHJ1Y3RcIiB0cmFwXG4gICAgdmFyIGhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldCh0YXJnZXQpO1xuICAgIGlmIChoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVyLmNvbnN0cnVjdChoYW5kbGVyLnRhcmdldCwgYXJncywgbmV3VGFyZ2V0KTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInRhcmdldCBpcyBub3QgYSBmdW5jdGlvbjogXCIgKyB0YXJnZXQpO1xuICAgIH1cbiAgICBpZiAobmV3VGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld1RhcmdldCA9IHRhcmdldDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiBuZXdUYXJnZXQgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibmV3VGFyZ2V0IGlzIG5vdCBhIGZ1bmN0aW9uOiBcIiArIHRhcmdldCk7XG4gICAgICB9ICAgICAgXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyAoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuYXBwbHkobmV3VGFyZ2V0LCBbbnVsbF0uY29uY2F0KGFyZ3MpKSk7XG4gIH1cbn07XG5cbi8vIGZlYXR1cmUtdGVzdCB3aGV0aGVyIHRoZSBQcm94eSBnbG9iYWwgZXhpc3RzLCB3aXRoXG4vLyB0aGUgaGFybW9ueS1lcmEgUHJveHkuY3JlYXRlIEFQSVxuaWYgKHR5cGVvZiBQcm94eSAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgIHR5cGVvZiBQcm94eS5jcmVhdGUgIT09IFwidW5kZWZpbmVkXCIpIHtcblxuICB2YXIgcHJpbUNyZWF0ZSA9IFByb3h5LmNyZWF0ZSxcbiAgICAgIHByaW1DcmVhdGVGdW5jdGlvbiA9IFByb3h5LmNyZWF0ZUZ1bmN0aW9uO1xuXG4gIHZhciByZXZva2VkSGFuZGxlciA9IHByaW1DcmVhdGUoe1xuICAgIGdldDogZnVuY3Rpb24oKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJwcm94eSBpcyByZXZva2VkXCIpOyB9XG4gIH0pO1xuXG4gIGdsb2JhbC5Qcm94eSA9IGZ1bmN0aW9uKHRhcmdldCwgaGFuZGxlcikge1xuICAgIC8vIGNoZWNrIHRoYXQgdGFyZ2V0IGlzIGFuIE9iamVjdFxuICAgIGlmIChPYmplY3QodGFyZ2V0KSAhPT0gdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJveHkgdGFyZ2V0IG11c3QgYmUgYW4gT2JqZWN0LCBnaXZlbiBcIit0YXJnZXQpO1xuICAgIH1cbiAgICAvLyBjaGVjayB0aGF0IGhhbmRsZXIgaXMgYW4gT2JqZWN0XG4gICAgaWYgKE9iamVjdChoYW5kbGVyKSAhPT0gaGFuZGxlcikge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByb3h5IGhhbmRsZXIgbXVzdCBiZSBhbiBPYmplY3QsIGdpdmVuIFwiK2hhbmRsZXIpO1xuICAgIH1cblxuICAgIHZhciB2SGFuZGxlciA9IG5ldyBWYWxpZGF0b3IodGFyZ2V0LCBoYW5kbGVyKTtcbiAgICB2YXIgcHJveHk7XG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcHJveHkgPSBwcmltQ3JlYXRlRnVuY3Rpb24odkhhbmRsZXIsXG4gICAgICAgIC8vIGNhbGwgdHJhcFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgcmV0dXJuIHZIYW5kbGVyLmFwcGx5KHRhcmdldCwgdGhpcywgYXJncyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGNvbnN0cnVjdCB0cmFwXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICByZXR1cm4gdkhhbmRsZXIuY29uc3RydWN0KHRhcmdldCwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm94eSA9IHByaW1DcmVhdGUodkhhbmRsZXIsIE9iamVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpKTtcbiAgICB9XG4gICAgZGlyZWN0UHJveGllcy5zZXQocHJveHksIHZIYW5kbGVyKTtcbiAgICByZXR1cm4gcHJveHk7XG4gIH07XG5cbiAgZ2xvYmFsLlByb3h5LnJldm9jYWJsZSA9IGZ1bmN0aW9uKHRhcmdldCwgaGFuZGxlcikge1xuICAgIHZhciBwcm94eSA9IG5ldyBQcm94eSh0YXJnZXQsIGhhbmRsZXIpO1xuICAgIHZhciByZXZva2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2SGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHByb3h5KTtcbiAgICAgIGlmICh2SGFuZGxlciAhPT0gbnVsbCkge1xuICAgICAgICB2SGFuZGxlci50YXJnZXQgID0gbnVsbDtcbiAgICAgICAgdkhhbmRsZXIuaGFuZGxlciA9IHJldm9rZWRIYW5kbGVyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIHJldHVybiB7cHJveHk6IHByb3h5LCByZXZva2U6IHJldm9rZX07XG4gIH1cbiAgXG4gIC8vIGFkZCB0aGUgb2xkIFByb3h5LmNyZWF0ZSBhbmQgUHJveHkuY3JlYXRlRnVuY3Rpb24gbWV0aG9kc1xuICAvLyBzbyBvbGQgY29kZSB0aGF0IHN0aWxsIGRlcGVuZHMgb24gdGhlIGhhcm1vbnktZXJhIFByb3h5IG9iamVjdFxuICAvLyBpcyBub3QgYnJva2VuLiBBbHNvIGVuc3VyZXMgdGhhdCBtdWx0aXBsZSB2ZXJzaW9ucyBvZiB0aGlzXG4gIC8vIGxpYnJhcnkgc2hvdWxkIGxvYWQgZmluZVxuICBnbG9iYWwuUHJveHkuY3JlYXRlID0gcHJpbUNyZWF0ZTtcbiAgZ2xvYmFsLlByb3h5LmNyZWF0ZUZ1bmN0aW9uID0gcHJpbUNyZWF0ZUZ1bmN0aW9uO1xuXG59IGVsc2Uge1xuICAvLyBQcm94eSBnbG9iYWwgbm90IGRlZmluZWQsIG9yIG9sZCBBUEkgbm90IGF2YWlsYWJsZVxuICBpZiAodHlwZW9mIFByb3h5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgLy8gUHJveHkgZ2xvYmFsIG5vdCBkZWZpbmVkLCBhZGQgYSBQcm94eSBmdW5jdGlvbiBzdHViXG4gICAgZ2xvYmFsLlByb3h5ID0gZnVuY3Rpb24oX3RhcmdldCwgX2hhbmRsZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInByb3hpZXMgbm90IHN1cHBvcnRlZCBvbiB0aGlzIHBsYXRmb3JtLiBPbiB2OC9ub2RlL2lvanMsIG1ha2Ugc3VyZSB0byBwYXNzIHRoZSAtLWhhcm1vbnlfcHJveGllcyBmbGFnXCIpO1xuICAgIH07XG4gIH1cbiAgLy8gUHJveHkgZ2xvYmFsIGRlZmluZWQgYnV0IG9sZCBBUEkgbm90IGF2YWlsYWJsZVxuICAvLyBwcmVzdW1hYmx5IFByb3h5IGdsb2JhbCBhbHJlYWR5IHN1cHBvcnRzIG5ldyBBUEksIGxlYXZlIHVudG91Y2hlZFxufVxuXG4vLyBmb3Igbm9kZS5qcyBtb2R1bGVzLCBleHBvcnQgZXZlcnkgcHJvcGVydHkgaW4gdGhlIFJlZmxlY3Qgb2JqZWN0XG4vLyBhcyBwYXJ0IG9mIHRoZSBtb2R1bGUgaW50ZXJmYWNlXG5pZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gIE9iamVjdC5rZXlzKFJlZmxlY3QpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGV4cG9ydHNba2V5XSA9IFJlZmxlY3Rba2V5XTtcbiAgfSk7XG59XG5cbi8vIGZ1bmN0aW9uLWFzLW1vZHVsZSBwYXR0ZXJuXG59KHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHRoaXMpKTsiXX0=
