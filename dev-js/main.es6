/* exported arrayFind, d3Tip */
import { arrayFind } from '../js-exports/polyfills';
import { d3Tip } from '../js-vendor/d3-tip';
 
(function(){ 
  "use strict";

  var species = {
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

  var fishNodes = null,
      fishLinks = null,
      margin = { // expressed as percentages
        top:0,
        right:0,
        bottom:0,
        left:0
      },
      width = 100 - margin.right - margin.left,
      height = 100 - margin.top - margin.bottom,
      threshold = 20;

  var colors = ['#30653a','#7d4f00','#4e597d','#2a616e','#a3301e','#81447f','#005fa9'];

  var rScale = d3.scaleSqrt().range([1,5]); // percentages
  var strengthScale = d3.scaleLinear().range([1,10]);
  var simulation = d3.forceSimulation()
    .velocityDecay([0.5])
    .force("link", d3.forceLink())
    .force("charge", d3.forceManyBody().strength(-0.5))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(2).iterations(2));//.radius(function(d) { return rScale(d.count); }).iterations(2));

  d3.csv('adjacency-cx.csv', function(data){
    console.log(data);
    fishLinks = data;
    goGate();
  });
  d3.csv('fisheries-nodes-no-count-no-index.csv', function(data){
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
          //if (index !== i && each[key] !== "0" ){ // if source and target are not the same and no
            newLinks.push({
              source: i,
              target: index, 
              value: +each[key]
            });
          // }
        }
      }
    }); // end forEach
    network.nodes = fishNodes;
    network.links = newLinks;
    console.log(network);
    render(network); // TO DO : for the force directed graph, filter
  } // end go()

  function render(network) {
   /* if (true){
      return;
    }*/
    network.links.forEach(function(link) {
      if ( link.target === link.source ) {
        network.nodes[link.target].count = link.value;
      }
    });
    simulation
        .nodes(network.nodes)
        .on("tick", ticked);

    var linkForce = simulation.force("link")
        .links(network.links.filter(d => d.value !== 0));

    rScale.domain(d3.extent(network.nodes, d => d.count));
    //options 1–3
    //strengthScale.domain([0, d3.mean(network.links, d => d.value) + d3.deviation(network.links, d => d.value) ]);
    //option 4
    strengthScale.domain([0,1]);

    
    function count(node){
      var i = 0;
      network.links.forEach(link => {
        if ( link.source === node || link.target === node ){
          i++;
        }
      });
      return i;
    }
    

        linkForce
        .strength(d => {
          /* d3's default link strength is:

            function strength(link) {
              return 1 / Math.min(count(link.source), count(link.target));
            }

          "This default was chosen because it automatically reduces the
          strength of links connected to heavily-connected nodes, improving stability."
          https://github.com/d3/d3-force

          The return values below reproduce that default but with a factor based on the value (d.value)
          of the link, here representing the number of permits shared between fisheries.

          For options 1–3: the domain of the scale function is between 0 and 1 stdev above the mean value, with
          the range being 1–10.

          For option 4 the domain in 0 to 1 and the range is 0 to 10.

          Option 1: Based on absolute value of shared permits; treats all nodes the same, whether they belong to
          the same cluster or not.

          Option 2: same as option one but applies the value only to nodes of the same cluster. Nodes of different
          clusters get the default strength, uninformed by d.value.

          Option 3: same as option two but weakens the force between nodes of different cluster by a factor of 1/10th.
          That separates out the clusters more.

          Option 4: Scales by the relative value, number of shared permits divided by the number of permits in the smaller
          of the two nodes. Still divided by count of links. Treats nodes the same regardless of cluster.

          */
          // 1
          //return strengthScale(d.value) / Math.min(count(d.source), count(d.target)); 
          // 2
          //return d.target.cluster === d.source.cluster ?  strengthScale(d.value) / Math.min(count(d.source), count(d.target)) : ( 1 / Math.min(count(d.source), count(d.target)) ); 
          // 3
          // return d.target.cluster === d.source.cluster ?  strengthScale(d.value) / Math.min(count(d.source), count(d.target)) : ( 1 / Math.min(count(d.source), count(d.target)) ) / 10; 
          //4
          return d.target.cluster === d.source.cluster ? strengthScale(d.value / Math.min(d.source.count, d.target.count)) / Math.min(count(d.source), count(d.target)) : ( strengthScale(d.value / Math.min(d.source.count, d.target.count)) / Math.min(count(d.source), count(d.target)) ) / 20; 
          
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
      .data(network.links.filter(d => d.value !== 0))
      .enter().append("line")
      .attr('stroke', d => {
        
        return d.source.cluster === d.target.cluster ? colors[d.target.cluster - 1] : '#5a5a5a';
      })
      .attr("stroke-width", function(d) { return d.value > threshold || d.source.cluster === d.target.cluster ? Math.sqrt(d.value) / 20 : 0; }); 

    var nodeTooltip = d3.tip()
      .attr("class", "d3-tip label-tip")
      .direction('n')
      .offset([4, 0])
      .html(d => `
          ${d.id}<br />
          <br />
          Species: ${species[d.species]}<br />
          Gear: ${gear[d.gear.toString()]}<br />
          Area: ${regions[d.area]}<br />
          <br />
          Cluster: ${d.cluster}

          `); 

    var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(network.nodes)
      .enter().append("circle")
        .attr("r", d => rScale(d.count))
        .attr("fill", function(d) { return colors[d.cluster -1]; })
        .call(nodeTooltip);
    
    node
        .on('mouseenter', function(e){
          nodeTooltip.show(e);
        })
        .on('mouseleave', nodeTooltip.hide);
        /*.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));*/

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
          d.x = Math.max(rScale(d.count), Math.min(width - rScale(d.count), d.x));
          return d.x;
        })
        .attr("cy", function(d) {
          d.y = Math.max(rScale(d.count), Math.min(height - rScale(d.count), d.y));
          return d.y;
        });
  }

    
  } // end render()
 /* function dragstarted(d) {
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
}*/
})();