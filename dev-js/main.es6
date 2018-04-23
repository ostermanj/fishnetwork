var svg = document.getElementById('alaska-map');
console.log(svg);
svg.querySelectorAll('circle').forEach(c => {
	console.log(c);
	c.addEventListener('mouseenter', function(){
		showLinks(this.dataset);
	});
	c.addEventListener('mouseleave', function(){
		hideLinks(this.dataset);
	});
});
function showLinks(d){
	svg.querySelectorAll('line.below-threshold.' + d.name).forEach(l => {
		l.style.display = 'initial';
	});
}
function hideLinks(d){
	svg.querySelectorAll('line.below-threshold.' + d.name).forEach(l => {
		l.style.display = 'none';
	});
}