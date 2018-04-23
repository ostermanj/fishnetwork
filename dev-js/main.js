(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var svg = document.getElementById('alaska-map');
console.log(svg);
svg.querySelectorAll('circle').forEach(function (c) {
	console.log(c);
	c.addEventListener('mouseenter', function () {
		showLinks(this.dataset);
	});
	c.addEventListener('mouseleave', function () {
		hideLinks(this.dataset);
	});
});
function showLinks(d) {
	svg.querySelectorAll('line.below-threshold.' + d.name).forEach(function (l) {
		l.style.display = 'initial';
	});
}
function hideLinks(d) {
	svg.querySelectorAll('line.below-threshold.' + d.name).forEach(function (l) {
		l.style.display = 'none';
	});
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYtanMvbWFpbi5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksTUFBTSxTQUFTLGNBQVQsQ0FBd0IsWUFBeEIsQ0FBVjtBQUNBLFFBQVEsR0FBUixDQUFZLEdBQVo7QUFDQSxJQUFJLGdCQUFKLENBQXFCLFFBQXJCLEVBQStCLE9BQS9CLENBQXVDLGFBQUs7QUFDM0MsU0FBUSxHQUFSLENBQVksQ0FBWjtBQUNBLEdBQUUsZ0JBQUYsQ0FBbUIsWUFBbkIsRUFBaUMsWUFBVTtBQUMxQyxZQUFVLEtBQUssT0FBZjtBQUNBLEVBRkQ7QUFHQSxHQUFFLGdCQUFGLENBQW1CLFlBQW5CLEVBQWlDLFlBQVU7QUFDMUMsWUFBVSxLQUFLLE9BQWY7QUFDQSxFQUZEO0FBR0EsQ0FSRDtBQVNBLFNBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFxQjtBQUNwQixLQUFJLGdCQUFKLENBQXFCLDBCQUEwQixFQUFFLElBQWpELEVBQXVELE9BQXZELENBQStELGFBQUs7QUFDbkUsSUFBRSxLQUFGLENBQVEsT0FBUixHQUFrQixTQUFsQjtBQUNBLEVBRkQ7QUFHQTtBQUNELFNBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFxQjtBQUNwQixLQUFJLGdCQUFKLENBQXFCLDBCQUEwQixFQUFFLElBQWpELEVBQXVELE9BQXZELENBQStELGFBQUs7QUFDbkUsSUFBRSxLQUFGLENBQVEsT0FBUixHQUFrQixNQUFsQjtBQUNBLEVBRkQ7QUFHQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsInZhciBzdmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWxhc2thLW1hcCcpO1xuY29uc29sZS5sb2coc3ZnKTtcbnN2Zy5xdWVyeVNlbGVjdG9yQWxsKCdjaXJjbGUnKS5mb3JFYWNoKGMgPT4ge1xuXHRjb25zb2xlLmxvZyhjKTtcblx0Yy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oKXtcblx0XHRzaG93TGlua3ModGhpcy5kYXRhc2V0KTtcblx0fSk7XG5cdGMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCl7XG5cdFx0aGlkZUxpbmtzKHRoaXMuZGF0YXNldCk7XG5cdH0pO1xufSk7XG5mdW5jdGlvbiBzaG93TGlua3MoZCl7XG5cdHN2Zy5xdWVyeVNlbGVjdG9yQWxsKCdsaW5lLmJlbG93LXRocmVzaG9sZC4nICsgZC5uYW1lKS5mb3JFYWNoKGwgPT4ge1xuXHRcdGwuc3R5bGUuZGlzcGxheSA9ICdpbml0aWFsJztcblx0fSk7XG59XG5mdW5jdGlvbiBoaWRlTGlua3MoZCl7XG5cdHN2Zy5xdWVyeVNlbGVjdG9yQWxsKCdsaW5lLmJlbG93LXRocmVzaG9sZC4nICsgZC5uYW1lKS5mb3JFYWNoKGwgPT4ge1xuXHRcdGwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0fSk7XG59Il19
