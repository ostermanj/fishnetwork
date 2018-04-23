(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var svg = document.getElementById('alaska-map');
console.log(svg);

svg.querySelectorAll('circle').forEach(function (c) {
	console.log(c);
	c.addEventListener('mouseenter', function () {
		showLinks(this.dataset);
		showDetails(this.dataset);
	});
	c.addEventListener('mouseleave', function () {
		hideLinks(this.dataset);
		hideDetails();
	});
});

dataOverlay();

function showLinks(d) {
	svg.querySelectorAll('line.' + d.name).forEach(function (l) {
		l.style.display = 'initial';
		l.style.opacity = 0.6;
	});
}
function hideLinks(d) {
	svg.querySelectorAll('line.' + d.name).forEach(function (l) {
		l.style.opacity = 0.3;
	});
	svg.querySelectorAll('line.below-threshold.' + d.name).forEach(function (l) {
		l.style.display = 'none';
	});
}
function showDetails(d) {
	var html = '<br/>\n\t\t\t\t<b>' + d.name + '</b><br />\n\t\t\t\tSpecies: ' + d.species + '<br />\n\t\t\t\tGear: ' + d.gear + '<br />\n\t\t\t\tArea: ' + d.area;

	document.getElementById('content-div').insertAdjacentHTML('beforeend', html);
}
function hideDetails() {
	document.getElementById('content-div').innerHTML = '';
}
function dataOverlay() {
	var overlayDiv = document.createElement('div');
	overlayDiv.id = 'overlay-div';
	overlayDiv.innerText = 'Select a fishery for details.';
	var contentDiv = document.createElement('div');
	contentDiv.id = 'content-div';
	overlayDiv.appendChild(contentDiv);
	document.getElementById('map-container').appendChild(overlayDiv);
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYtanMvbWFpbi5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksTUFBTSxTQUFTLGNBQVQsQ0FBd0IsWUFBeEIsQ0FBVjtBQUNBLFFBQVEsR0FBUixDQUFZLEdBQVo7O0FBRUEsSUFBSSxnQkFBSixDQUFxQixRQUFyQixFQUErQixPQUEvQixDQUF1QyxhQUFLO0FBQzNDLFNBQVEsR0FBUixDQUFZLENBQVo7QUFDQSxHQUFFLGdCQUFGLENBQW1CLFlBQW5CLEVBQWlDLFlBQVU7QUFDMUMsWUFBVSxLQUFLLE9BQWY7QUFDQSxjQUFZLEtBQUssT0FBakI7QUFDQSxFQUhEO0FBSUEsR0FBRSxnQkFBRixDQUFtQixZQUFuQixFQUFpQyxZQUFVO0FBQzFDLFlBQVUsS0FBSyxPQUFmO0FBQ0E7QUFDQSxFQUhEO0FBSUEsQ0FWRDs7QUFZQTs7QUFFQSxTQUFTLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBcUI7QUFDcEIsS0FBSSxnQkFBSixDQUFxQixVQUFVLEVBQUUsSUFBakMsRUFBdUMsT0FBdkMsQ0FBK0MsYUFBSztBQUNuRCxJQUFFLEtBQUYsQ0FBUSxPQUFSLEdBQWtCLFNBQWxCO0FBQ0EsSUFBRSxLQUFGLENBQVEsT0FBUixHQUFrQixHQUFsQjtBQUNBLEVBSEQ7QUFJQTtBQUNELFNBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFxQjtBQUNwQixLQUFJLGdCQUFKLENBQXFCLFVBQVUsRUFBRSxJQUFqQyxFQUF1QyxPQUF2QyxDQUErQyxhQUFLO0FBQ25ELElBQUUsS0FBRixDQUFRLE9BQVIsR0FBa0IsR0FBbEI7QUFDQSxFQUZEO0FBR0EsS0FBSSxnQkFBSixDQUFxQiwwQkFBMEIsRUFBRSxJQUFqRCxFQUF1RCxPQUF2RCxDQUErRCxhQUFLO0FBQ25FLElBQUUsS0FBRixDQUFRLE9BQVIsR0FBa0IsTUFBbEI7QUFDQSxFQUZEO0FBR0E7QUFDRCxTQUFTLFdBQVQsQ0FBcUIsQ0FBckIsRUFBdUI7QUFDdEIsS0FBSSw4QkFDSSxFQUFFLElBRE4scUNBRVUsRUFBRSxPQUZaLDhCQUdPLEVBQUUsSUFIVCw4QkFJTyxFQUFFLElBSmI7O0FBTUEsVUFBUyxjQUFULENBQXdCLGFBQXhCLEVBQXVDLGtCQUF2QyxDQUEwRCxXQUExRCxFQUFzRSxJQUF0RTtBQUVBO0FBQ0QsU0FBUyxXQUFULEdBQXNCO0FBQ3JCLFVBQVMsY0FBVCxDQUF3QixhQUF4QixFQUF1QyxTQUF2QyxHQUFtRCxFQUFuRDtBQUNBO0FBQ0QsU0FBUyxXQUFULEdBQXNCO0FBQ3JCLEtBQUksYUFBYSxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBakI7QUFDQSxZQUFXLEVBQVgsR0FBZ0IsYUFBaEI7QUFDQSxZQUFXLFNBQVgsR0FBdUIsK0JBQXZCO0FBQ0EsS0FBSSxhQUFhLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFqQjtBQUNBLFlBQVcsRUFBWCxHQUFnQixhQUFoQjtBQUNBLFlBQVcsV0FBWCxDQUF1QixVQUF2QjtBQUNBLFVBQVMsY0FBVCxDQUF3QixlQUF4QixFQUF5QyxXQUF6QyxDQUFxRCxVQUFyRDtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwidmFyIHN2ZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbGFza2EtbWFwJyk7XG5jb25zb2xlLmxvZyhzdmcpO1xuXG5zdmcucXVlcnlTZWxlY3RvckFsbCgnY2lyY2xlJykuZm9yRWFjaChjID0+IHtcblx0Y29uc29sZS5sb2coYyk7XG5cdGMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIGZ1bmN0aW9uKCl7XG5cdFx0c2hvd0xpbmtzKHRoaXMuZGF0YXNldCk7XG5cdFx0c2hvd0RldGFpbHModGhpcy5kYXRhc2V0KTtcblx0fSk7XG5cdGMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCl7XG5cdFx0aGlkZUxpbmtzKHRoaXMuZGF0YXNldCk7XG5cdFx0aGlkZURldGFpbHMoKTtcblx0fSk7XG59KTtcblxuZGF0YU92ZXJsYXkoKTtcblxuZnVuY3Rpb24gc2hvd0xpbmtzKGQpe1xuXHRzdmcucXVlcnlTZWxlY3RvckFsbCgnbGluZS4nICsgZC5uYW1lKS5mb3JFYWNoKGwgPT4ge1xuXHRcdGwuc3R5bGUuZGlzcGxheSA9ICdpbml0aWFsJztcblx0XHRsLnN0eWxlLm9wYWNpdHkgPSAwLjY7XG5cdH0pO1xufVxuZnVuY3Rpb24gaGlkZUxpbmtzKGQpe1xuXHRzdmcucXVlcnlTZWxlY3RvckFsbCgnbGluZS4nICsgZC5uYW1lKS5mb3JFYWNoKGwgPT4ge1xuXHRcdGwuc3R5bGUub3BhY2l0eSA9IDAuMztcblx0fSk7XG5cdHN2Zy5xdWVyeVNlbGVjdG9yQWxsKCdsaW5lLmJlbG93LXRocmVzaG9sZC4nICsgZC5uYW1lKS5mb3JFYWNoKGwgPT4ge1xuXHRcdGwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0fSk7XG59XG5mdW5jdGlvbiBzaG93RGV0YWlscyhkKXtcblx0dmFyIGh0bWwgPSBgPGJyLz5cblx0XHRcdFx0PGI+JHtkLm5hbWV9PC9iPjxiciAvPlxuXHRcdFx0XHRTcGVjaWVzOiAke2Quc3BlY2llc308YnIgLz5cblx0XHRcdFx0R2VhcjogJHtkLmdlYXJ9PGJyIC8+XG5cdFx0XHRcdEFyZWE6ICR7ZC5hcmVhfWA7XG5cdFxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudC1kaXYnKS5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsaHRtbCk7XG5cbn1cbmZ1bmN0aW9uIGhpZGVEZXRhaWxzKCl7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50LWRpdicpLmlubmVySFRNTCA9ICcnO1xufVxuZnVuY3Rpb24gZGF0YU92ZXJsYXkoKXtcblx0dmFyIG92ZXJsYXlEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0b3ZlcmxheURpdi5pZCA9ICdvdmVybGF5LWRpdic7XG5cdG92ZXJsYXlEaXYuaW5uZXJUZXh0ID0gJ1NlbGVjdCBhIGZpc2hlcnkgZm9yIGRldGFpbHMuJztcblx0dmFyIGNvbnRlbnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0Y29udGVudERpdi5pZCA9ICdjb250ZW50LWRpdic7XG5cdG92ZXJsYXlEaXYuYXBwZW5kQ2hpbGQoY29udGVudERpdik7XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAtY29udGFpbmVyJykuYXBwZW5kQ2hpbGQob3ZlcmxheURpdik7XG59Il19
