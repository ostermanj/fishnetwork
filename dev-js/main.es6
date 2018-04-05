/* exported arrayFind */
import { arrayFind } from '../js-exports/polyfills';
 
(function(){ 
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
        top:0,
        right:0,
        bottom:0,
        left:0
      },
      width = 100 - margin.right - margin.left,
      height = 100 - margin.top - margin.bottom;

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var rScale = d3.scaleLog().range([0.3,3]);
  var strengthScale = d3.scaleLinear().range([1,5]);
  var simulation = d3.forceSimulation()
    .velocityDecay([0.5])
    .force("link", d3.forceLink())
    .force("charge", d3.forceManyBody().strength(-1))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(function(d) { return rScale(d.count); }).iterations(2));

  d3.csv('matrix-headers.csv', function(data){
    console.log(data);
    fishLinks = data;
    goGate();
  });
  d3.csv('fisheries-nodes.csv', function(data){
    console.log(data);
    data.forEach(function(each){
      for (var key in each){
        if ( each.hasOwnProperty(key) ){
          if ( !isNaN(+each[key]) ){
            each[key] = +each[key];
          }
        }
      }
    });
    fishNodes = data;
    goGate();
  });

  function goGate(){
    if ( fishNodes !== null && fishLinks !== null ){
      go();
    } else {
      return;
    }
  }

  var newLinks = [],
  network = {};
  
  function go(){
    function isMatch(key){
      return fishNodes.find(function(obj){
        return obj.id === key;
      });
    }
    fishLinks.forEach(function(each,i){
      for (var key in each){
        if ( each.hasOwnProperty(key) ){
          let match = isMatch(key);
          let index = fishNodes.indexOf(match);
          if (index !== i && each[key] !== "0" ){ // if source and target are not the same
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

    rScale.domain(d3.extent(network.nodes, d => d.count));
    strengthScale.domain([1, d3.mean(network.links, d => d.value) + d3.deviation(network.links, d => d.value) * 2 ]);

    var radius = 2;
    function count(node){
      var i = 0;
      network.links.forEach(link => {
        if ( link.source === node || link.target === node ){
          i++;
        }
      });
      return i;
    }
    simulation
        .nodes(network.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(network.links)
        .strength(d => {
        //  console.log(d);
          return d.target.cluster === d.source.cluster ?  1 / Math.min(count(d.source), count(d.target)) : ( 1 / Math.min(count(d.source), count(d.target)) ) / 10; // reporoduce the default value for links that meet the criteria
        });
    var svg = d3.select('body')
      .append('svg')
      .attr('width', '100%')
      .attr('xmlns','http://www.w3.org/2000/svg')
      .attr('version','1.1')
      .attr('viewBox', '0 0 100 100')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(network.links)
      .enter().append("line")
      .attr('stroke', d => {
        
        return d.source.cluster === d.target.cluster ? color(d.target.cluster) : '#999';
      })
      .attr("stroke-width", function(d) { return d.value > 9 || d.source.cluster === d.target.cluster ? Math.sqrt(d.value) / 20 : 0; }); 

    var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(network.nodes)
      .enter().append("circle")
        .attr("r", d => rScale(d.count))
        .attr("fill", function(d) { return color(d.cluster); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.id; });


  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) {
          d.x = Math.max(radius, Math.min(width - radius, d.x));
          return d.x;
        })
        .attr("cy", function(d) {
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
})();