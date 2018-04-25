/* exported ForEach, NodeListForEach, ClassList */
import { ForEach } from '../js-exports/ForEach.js';
import { NodeListForEach } from '../js-exports/NodeListForEach.js';
import { ClassList } from '../js-exports/ClassList.js';

var svg = document.getElementById('alaska-map');
var timeoutShow,
	timeoutHide,
	listenersAreOn;



dataOverlay();
addEventListeners();

document.querySelector('body').addEventListener('click', addEventListeners);

function addEventListeners(){
	if ( listenersAreOn !== true ){
		listenersAreOn = true;
		document.querySelectorAll('line.active').forEach(l => { // need to handle line opacity via css class so that it can be selected here
			l.classList.remove('active');
		});
		var activeNode = document.querySelector('circle.active');
		if ( activeNode ) {
			activeNode.classList.remove('active');
		}
		svg.querySelectorAll('circle').forEach(c => {
			c.addEventListener('mouseenter', activate);
			c.addEventListener('mouseleave', deactivate);
			c.addEventListener('focus', activate);
			c.addEventListener('blur', deactivate);
			c.addEventListener('click', removeEventListeners);
		});
	}
}

function removeEventListeners(e){
	listenersAreOn = false;
	e.stopPropagation();
	svg.querySelectorAll('circle').forEach(c => {
		c.removeEventListener('mouseenter', activate);
		c.removeEventListener('mouseleave', deactivate);
		c.removeEventListener('click', removeEventListeners);
	});
}

function activate(e){
	if (e.type !== 'focus') {
		document.activeElement.blur();
	} else {
		let circle = document.querySelector('circle.active');
		if ( circle ) {
			deactivate.call(circle);
		}
	}
	this.classList.add('active');
	showLinks(this.dataset);
	showDetails(this.dataset);
}

function deactivate(){
	this.classList.remove('active');
	hideLinks(this.dataset);
	hideDetails();
}

function showLinks(d){
	svg.querySelectorAll('line.' + d.name).forEach(l => {
		l.classList.add('active');
		var attachedNodes = l.className.baseVal.match(/[A-Z]+-.*?-[^ ]/g);
		attachedNodes.forEach(ndId => {
			if ( ndId !== d.name ){
				let nd = svg.querySelector('circle[data-name="' + ndId + '"]');
				if ( nd ) {
					nd.classList.add('attached');
				}
			}
		});
	});
}
function hideLinks(d){
	svg.querySelectorAll('line.' + d.name).forEach(l => {
		l.classList.remove('active');
	});
	svg.querySelectorAll('circle.attached').forEach(c => {
		c.classList.remove('attached');
	});
}
function showDetails(d){
	clearTimeout(timeoutHide);
	var html = `<b>${d.name}</b><br /><b>Species</b>: ${d.species} | <b>Gear</b>: ${d.gear} | <b>Area</b>: ${d.area} | <b>Number of permits</b>: ${d.count}`;
	var overlayDiv = document.getElementById('overlay-div');
	overlayDiv.style.opacity = 0;
	timeoutShow = setTimeout(function(){
		overlayDiv.innerHTML = html;
		overlayDiv.style.opacity = 1;
	},250);
}
function hideDetails(){
	clearTimeout(timeoutShow);
	var html = 'Select a fishery or tab through for details.';
	var overlayDiv = document.getElementById('overlay-div');
	overlayDiv.style.opacity = 0;
	timeoutHide = setTimeout(function(){
		overlayDiv.innerHTML = html;
		overlayDiv.style.opacity = 1;
	},250);

}
function dataOverlay(){
	var overlayDiv = document.createElement('div');
	overlayDiv.id = 'overlay-div';
	overlayDiv.innerHTML = 'Select a fishery or tab through for details.';
	document.getElementById('map-container').appendChild(overlayDiv);
}