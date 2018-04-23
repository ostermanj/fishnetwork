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
	var html = '<br/>\n\t\t\t\t<b>' + d.name + '</b><br />\n\t\t\t\tSpecies: ' + d.species + '<br />\n\t\t\t\tGear: ' + d.gear + '<br />\n\t\t\t\tArea: ' + d.area + '<br />\n\t\t\t\t<br />\n\t\t\t\tNumber of permits: ' + d.count;
	var contentDiv = document.getElementById('content-div');
	contentDiv.classList.add('active');
	contentDiv.insertAdjacentHTML('beforeend', html);
}
function hideDetails() {
	var contentDiv = document.getElementById('content-div');
	contentDiv.classList.remove('active');
	setTimeout(function () {
		contentDiv.innerHTML = '';
	}, 500);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYtanMvbWFpbi5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksTUFBTSxTQUFTLGNBQVQsQ0FBd0IsWUFBeEIsQ0FBVjtBQUNBLFFBQVEsR0FBUixDQUFZLEdBQVo7O0FBRUEsSUFBSSxnQkFBSixDQUFxQixRQUFyQixFQUErQixPQUEvQixDQUF1QyxhQUFLO0FBQzNDLFNBQVEsR0FBUixDQUFZLENBQVo7QUFDQSxHQUFFLGdCQUFGLENBQW1CLFlBQW5CLEVBQWlDLFlBQVU7QUFDMUMsWUFBVSxLQUFLLE9BQWY7QUFDQSxjQUFZLEtBQUssT0FBakI7QUFDQSxFQUhEO0FBSUEsR0FBRSxnQkFBRixDQUFtQixZQUFuQixFQUFpQyxZQUFVO0FBQzFDLFlBQVUsS0FBSyxPQUFmO0FBQ0E7QUFDQSxFQUhEO0FBSUEsQ0FWRDs7QUFZQTs7QUFFQSxTQUFTLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBcUI7QUFDcEIsS0FBSSxnQkFBSixDQUFxQixVQUFVLEVBQUUsSUFBakMsRUFBdUMsT0FBdkMsQ0FBK0MsYUFBSztBQUNuRCxJQUFFLEtBQUYsQ0FBUSxPQUFSLEdBQWtCLFNBQWxCO0FBQ0EsSUFBRSxLQUFGLENBQVEsT0FBUixHQUFrQixHQUFsQjtBQUNBLEVBSEQ7QUFJQTtBQUNELFNBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFxQjtBQUNwQixLQUFJLGdCQUFKLENBQXFCLFVBQVUsRUFBRSxJQUFqQyxFQUF1QyxPQUF2QyxDQUErQyxhQUFLO0FBQ25ELElBQUUsS0FBRixDQUFRLE9BQVIsR0FBa0IsR0FBbEI7QUFDQSxFQUZEO0FBR0EsS0FBSSxnQkFBSixDQUFxQiwwQkFBMEIsRUFBRSxJQUFqRCxFQUF1RCxPQUF2RCxDQUErRCxhQUFLO0FBQ25FLElBQUUsS0FBRixDQUFRLE9BQVIsR0FBa0IsTUFBbEI7QUFDQSxFQUZEO0FBR0E7QUFDRCxTQUFTLFdBQVQsQ0FBcUIsQ0FBckIsRUFBdUI7QUFDdEIsS0FBSSw4QkFDSSxFQUFFLElBRE4scUNBRVUsRUFBRSxPQUZaLDhCQUdPLEVBQUUsSUFIVCw4QkFJTyxFQUFFLElBSlQsMkRBTW9CLEVBQUUsS0FOMUI7QUFPQSxLQUFJLGFBQWEsU0FBUyxjQUFULENBQXdCLGFBQXhCLENBQWpCO0FBQ0EsWUFBVyxTQUFYLENBQXFCLEdBQXJCLENBQXlCLFFBQXpCO0FBQ0EsWUFBVyxrQkFBWCxDQUE4QixXQUE5QixFQUEwQyxJQUExQztBQUVBO0FBQ0QsU0FBUyxXQUFULEdBQXNCO0FBQ3JCLEtBQUksYUFBYSxTQUFTLGNBQVQsQ0FBd0IsYUFBeEIsQ0FBakI7QUFDQSxZQUFXLFNBQVgsQ0FBcUIsTUFBckIsQ0FBNEIsUUFBNUI7QUFDQSxZQUFXLFlBQVU7QUFDcEIsYUFBVyxTQUFYLEdBQXVCLEVBQXZCO0FBQ0EsRUFGRCxFQUVFLEdBRkY7QUFJQTtBQUNELFNBQVMsV0FBVCxHQUFzQjtBQUNyQixLQUFJLGFBQWEsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWpCO0FBQ0EsWUFBVyxFQUFYLEdBQWdCLGFBQWhCO0FBQ0EsWUFBVyxTQUFYLEdBQXVCLCtCQUF2QjtBQUNBLEtBQUksYUFBYSxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBakI7QUFDQSxZQUFXLEVBQVgsR0FBZ0IsYUFBaEI7QUFDQSxZQUFXLFdBQVgsQ0FBdUIsVUFBdkI7QUFDQSxVQUFTLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUMsV0FBekMsQ0FBcUQsVUFBckQ7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsInZhciBzdmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWxhc2thLW1hcCcpO1xuY29uc29sZS5sb2coc3ZnKTtcblxuc3ZnLnF1ZXJ5U2VsZWN0b3JBbGwoJ2NpcmNsZScpLmZvckVhY2goYyA9PiB7XG5cdGNvbnNvbGUubG9nKGMpO1xuXHRjLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBmdW5jdGlvbigpe1xuXHRcdHNob3dMaW5rcyh0aGlzLmRhdGFzZXQpO1xuXHRcdHNob3dEZXRhaWxzKHRoaXMuZGF0YXNldCk7XG5cdH0pO1xuXHRjLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpe1xuXHRcdGhpZGVMaW5rcyh0aGlzLmRhdGFzZXQpO1xuXHRcdGhpZGVEZXRhaWxzKCk7XG5cdH0pO1xufSk7XG5cbmRhdGFPdmVybGF5KCk7XG5cbmZ1bmN0aW9uIHNob3dMaW5rcyhkKXtcblx0c3ZnLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmUuJyArIGQubmFtZSkuZm9yRWFjaChsID0+IHtcblx0XHRsLnN0eWxlLmRpc3BsYXkgPSAnaW5pdGlhbCc7XG5cdFx0bC5zdHlsZS5vcGFjaXR5ID0gMC42O1xuXHR9KTtcbn1cbmZ1bmN0aW9uIGhpZGVMaW5rcyhkKXtcblx0c3ZnLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmUuJyArIGQubmFtZSkuZm9yRWFjaChsID0+IHtcblx0XHRsLnN0eWxlLm9wYWNpdHkgPSAwLjM7XG5cdH0pO1xuXHRzdmcucXVlcnlTZWxlY3RvckFsbCgnbGluZS5iZWxvdy10aHJlc2hvbGQuJyArIGQubmFtZSkuZm9yRWFjaChsID0+IHtcblx0XHRsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdH0pO1xufVxuZnVuY3Rpb24gc2hvd0RldGFpbHMoZCl7XG5cdHZhciBodG1sID0gYDxici8+XG5cdFx0XHRcdDxiPiR7ZC5uYW1lfTwvYj48YnIgLz5cblx0XHRcdFx0U3BlY2llczogJHtkLnNwZWNpZXN9PGJyIC8+XG5cdFx0XHRcdEdlYXI6ICR7ZC5nZWFyfTxiciAvPlxuXHRcdFx0XHRBcmVhOiAke2QuYXJlYX08YnIgLz5cblx0XHRcdFx0PGJyIC8+XG5cdFx0XHRcdE51bWJlciBvZiBwZXJtaXRzOiAke2QuY291bnR9YDtcblx0dmFyIGNvbnRlbnREaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudC1kaXYnKTtcblx0Y29udGVudERpdi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0Y29udGVudERpdi5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsaHRtbCk7XG5cbn1cbmZ1bmN0aW9uIGhpZGVEZXRhaWxzKCl7XG5cdHZhciBjb250ZW50RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQtZGl2Jyk7XG5cdGNvbnRlbnREaXYuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRjb250ZW50RGl2LmlubmVySFRNTCA9ICcnO1xuXHR9LDUwMCk7XG5cbn1cbmZ1bmN0aW9uIGRhdGFPdmVybGF5KCl7XG5cdHZhciBvdmVybGF5RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdG92ZXJsYXlEaXYuaWQgPSAnb3ZlcmxheS1kaXYnO1xuXHRvdmVybGF5RGl2LmlubmVyVGV4dCA9ICdTZWxlY3QgYSBmaXNoZXJ5IGZvciBkZXRhaWxzLic7XG5cdHZhciBjb250ZW50RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdGNvbnRlbnREaXYuaWQgPSAnY29udGVudC1kaXYnO1xuXHRvdmVybGF5RGl2LmFwcGVuZENoaWxkKGNvbnRlbnREaXYpO1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwLWNvbnRhaW5lcicpLmFwcGVuZENoaWxkKG92ZXJsYXlEaXYpO1xufSJdfQ==
