var svg = document.getElementById('alaska-map');
var timeoutShow,
	timeoutHide;
console.log(svg);

svg.querySelectorAll('circle').forEach(c => {
	console.log(c);
	c.addEventListener('mouseenter', function(){
		this.classList.add('active');
		showLinks(this.dataset);
		showDetails(this.dataset);
	});
	c.addEventListener('mouseleave', function(){
		this.classList.remove('active');
		hideLinks(this.dataset);
		hideDetails();
	});
});

dataOverlay();

function showLinks(d){
	svg.querySelectorAll('line.' + d.name).forEach(l => {
		l.style.display = 'initial';
		l.style.opacity = 0.6;
	});
}
function hideLinks(d){
	svg.querySelectorAll('line.' + d.name).forEach(l => {
		l.style.opacity = 0.3;
	});
	svg.querySelectorAll('line.below-threshold.' + d.name).forEach(l => {
		l.style.display = 'none';
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
	var html = 'Select a fishery for details.';
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
	overlayDiv.innerHTML = 'Select a fishery for details.';
	document.getElementById('map-container').appendChild(overlayDiv);
}