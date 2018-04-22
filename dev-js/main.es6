/* exported d3Tip */
window.d3 = require('d3');
const d3Tip = require('d3-tip');

var nodeTooltip = d3Tip()
  .attr("class", "d3-tip label-tip")
  .direction('n')
  .offset([4, 0])
  .html(d => {
    return `${d.name}<br />
      <br />
      Species: ${d.species}<br />
      Gear: ${d.gear}<br />
      Area: ${d.area}<br />
      <br />
      Cluster: ${d.cluster}
      `;
  });


            /*${d.id}<br />
            <br />
            Species: ${species[d.species]}<br />
            Gear: ${gear[d.gear.toString()]}<br />
            Area: ${regions[d.area]}<br />
            <br />
            Cluster: ${d.cluster}

            `); */ 

d3.select('svg .nodes')
  .call(nodeTooltip);

d3.selectAll('svg .nodes circle')
	.on('mouseenter', function(){
    console.log(this.dataset);
    nodeTooltip.show(this.dataset);
  })
	.on('mouseleave', nodeTooltip.hide);
