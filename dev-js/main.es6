/* exported ForEach, NodeListForEach, ClassList */
import { ForEach } from '../js-exports/ForEach.js';
import { NodeListForEach } from '../js-exports/NodeListForEach.js';
import { ClassList } from '../js-exports/ClassList.js';

var svg = document.getElementById('alaska-map');
var timeoutShow,
	timeoutHide,
	nodes,
	cycleIndex = -1;

catalogNodes();
dataOverlay();
addEventListeners();

function addEventListeners(){
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
	});
}

function activate(e){
	console.log(e);
	if (e.type !== 'focus') {
		document.activeElement.blur();
	} 
	let circle = document.querySelector('circle.active');
	console.log(circle);
	if ( circle ) {
		deactivate.call(circle);
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
	var html = `<b>Fishery: </b>${d.name}<br /><b>Species</b>: ${d.species} | <b>Gear</b>: ${d.gear} | <b>Area</b>: ${d.area} | <b>Number of permits</b>: ${d.count}`;
	var details = document.querySelector('#detail-div');
	details.style.opacity = 0;
	timeoutShow = setTimeout(function(){
		details.innerHTML = html;
		details.style.opacity = 1;
	},250);
}
function hideDetails(){
	clearTimeout(timeoutShow);
	var details = document.querySelector('#detail-div');
	details.style.opacity = 0;
	timeoutHide = setTimeout(function(){
		details.innerHTML = '<em>Select a fishery or cycle through for details.</em>';
		details.style.opacity = 1;
	},250);
}
function dataOverlay(){
	var overlayDiv = document.createElement('div');
	overlayDiv.id = 'overlay-div';
	var detailWrapper = document.createElement('div');
	detailWrapper.id = 'detail-wrapper';
	var details = document.createElement('div');
	details.id = 'detail-div';
	details.setAttribute('aria-live','polite');
	details.innerHTML = '<em>Select a fishery or cycle through for details.</em>';
	detailWrapper.appendChild(details);
	overlayDiv.appendChild(detailWrapper);
	var btn = document.createElement('button');
	btn.id = 'cycle-through-btn';
	btn.setAttribute('aria-label','Select the next fishery on the map for details.');
	btn.setAttribute('aria-controls','detail-div');
	btn.innerHTML = 'Next';
	overlayDiv.appendChild(btn);
	document.getElementById('map-outer-container').insertAdjacentHTML('afterbegin',overlayDiv.innerHTML);
	document.getElementById('cycle-through-btn').addEventListener('click', cycleNext);
}

function cycleNext(){
	cycleIndex++;
	if ( cycleIndex === nodes.length ) {
		cycleIndex = 0;
	}
	activate.call(nodes[cycleIndex],'btn');
}

function catalogNodes(){
	nodes = document.querySelectorAll('#alaska-map .nodes circle');
}