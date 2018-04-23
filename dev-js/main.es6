var svg = document.getElementById('alaska-map');
console.log(svg);

svg.querySelectorAll('circle').forEach(c => {
	console.log(c);
	c.addEventListener('mouseenter', function(){
		showLinks(this.dataset);
		showDetails(this.dataset);
	});
	c.addEventListener('mouseleave', function(){
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
	var html = `<br/>
				<b>${d.name}</b><br />
				Species: ${d.species}<br />
				Gear: ${d.gear}<br />
				Area: ${d.area}`;
	
	document.getElementById('content-div').insertAdjacentHTML('beforeend',html);

}
function hideDetails(){
	document.getElementById('content-div').innerHTML = '';
}
function dataOverlay(){
	var overlayDiv = document.createElement('div');
	overlayDiv.id = 'overlay-div';
	overlayDiv.innerText = 'Select a fishery for details.';
	var contentDiv = document.createElement('div');
	contentDiv.id = 'content-div';
	overlayDiv.appendChild(contentDiv);
	document.getElementById('map-container').appendChild(overlayDiv);
}