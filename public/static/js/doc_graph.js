comp_graphs = function() {
	document.getElementById('light').style.display='block';
	// document.getElementById('fade').style.display='block';
	// document.getElementById('main-body').style.overflow='hidden';

	var doc1_svg = d3.select("#main-view");
	var doc2_svg = d3.select("#main-view2");

	//var check = document.querySelector('.doc-focus');

	doc1 = function() {
	  var box, color, currentDataset, force, getSvgBox, graph, lastChoice, last_detail_node, link, links, loaded, node, nodes, setMetaAnchor, showDetail, showLink, svg, update, years;

	  color = d3.scale.category10();

	  getSvgBox = function() {
	    var el;
	    el = document.querySelector('#svg-wrap');
	    return el.getBoundingClientRect();
	  };

	  svg = d3.select("#main-view");
	  box = getSvgBox();
	  force = d3.layout.force().charge(-150).linkDistance(100).size([box.width, box.height]).alpha(1);

	  links = force.links();
	  nodes = force.nodes();
	  link = svg.selectAll(".link");
	  node = svg.selectAll(".node");

	  graph = null;
	  currentDataset = null;
	  years = null;
	  last_detail_node = 3;

	//   showLink = function(data) {
	//     var html;
	//     html = '';
	//     if (data) {
	//       html += '<table>';
	//       html += '<tr>';
	//       html += "<th>源节点标签</th>";
	//       html += "<td>“" + data.source.name + "”</td>";
	//       html += '</tr>';
	//       html += '<tr>';
	//       html += "<th>目标节点标签</th>";
	//       html += "<td>“" + data.target.name + "”</td>";
	//       html += '</tr>';
	//       html += '<tr>';
	//       html += "<th>链接标签</th>";
	//       html += "<td>“" + (data.name || 'null') + "”</td>";
	//       html += '</tr>';
	//       html += '</table>';
	//     }
	//     return (document.getElementById('explaination-link')).innerHTML = html;
	//   };

	  showDetail = function(data) {
	    var html;
	    last_detail_node = data.id;
	    category_map = {
	      1: '句子节点',
	      2: '关系节点',
	      3: '实体节点',
	      4: '属性节点'
	    };
	    html = '<table>';
	    html += '<tr>';
	    html += "<th>类别</th>";
	    html += "<td>" + category_map[data.category] + "</td>";
	    html += '</tr>';
	    html += '<tr>';
	    html += "<th>标签</th>";
	    html += "<td>“" + data.name + "”</td>";
	    html += '</tr>';
	    html += '<tr>';
	    html += "<th valign=top>句子文本</th>";
	    html += "<td><i>" + (data.sent || '（请将鼠标移至句子节点用以查看）') + "</i></td>";
	    html += '</tr>';
	    html += '<tr>';
	    html += "<th valign=top>元组信息</th>";
	    html += "<td>“" + (data.tuples || '（请将鼠标移至非句子节点用以查看）') + "”</td>";
	    html += '</tr>';
	    html += '</table>';
	    return (document.getElementById('explaination-node')).innerHTML = html;
	  };

	  setMetaAnchor = function() {
	    var i, offset, y, _i, _results;
	    box = getSvgBox();
	    y = box.height * 0.5;
	    y_f = box.height * 0.2;
	    y_c = box.height * 0.8;
	    offset = box.width / 10;
	    nodes = currentDataset.nodes;
	    nodes[3].x = nodes[3].px = offset;
	    nodes[2].x = nodes[2].px = box.width / 2;
	    nodes[1].x = nodes[1].px = box.width / 2;
	    nodes[0].x = nodes[0].px = box.width - offset;
	    _results = [];

	    nodes[3].y = nodes[3].py = y;
	      _results.push(nodes[3].fixed = true);

	    nodes[2].y = nodes[2].py = y_c;
	      _results.push(nodes[2].fixed = true);

	    nodes[1].y = nodes[1].py = y_f;
	    _results.push(nodes[1].fixed = true);

	    nodes[0].y = nodes[0].py = y;
	    _results.push(nodes[0].fixed = true);

	    return _results;
	  };

	  loaded = [];

	  lastChoice = 0;

	  update = function() {
	    last_detail_node = 3;
	    var cur, nodeG, priority, year;
	    document.querySelector('svg').innerHTML = '';

	    cur = currentDataset = graph;
	    setMetaAnchor();
	    force.nodes(cur.nodes).links(cur.links).linkStrength(function(d) {
	      if (d.rate) {
	        return d.rate / 200;
	      }
	      return .1;
	    }).linkDistance(function(d) {
	      if (d.type === "inner") {
	        return 0.1;
	      } else if (d.type === "outer") {
	        return 200;
	      } else {
	        return 1;
	      }
	    });
	    force.start();
	    showDetail(cur.nodes[last_detail_node]);
	    // showLink();
	    link = svg.selectAll(".link").data(cur.links);
	    link.enter().append("line").attr("class", function(d) {
	      switch (d.type) {
	        case "inner":
	        case "outer":
	          return "link";
	        case "metalink":
	          return "metalink link";
	        default:
	          throw 'not support type';
	      }
	    });
	    link.exit().remove();
	    link.transition().duration(850).style("stroke-width", function(d) {
	      if (d.rate) {
	        // return d.rate;
	        return 0.4
	      }
	      return 0.4;
	    }).attr("class", function(d) {
	      switch (d.type) {
	        case "inner":
	        case "outer":
	          return "link";
	        case "metalink":
	          return "metalink link";
	        default:
	          throw 'not support type';
	      }
	    });

	    // link.on('mouseenter', function(d) {
	    //   var _ref2;
	    //   if ((_ref2 = d.type) === 'inner' || _ref2 === 'outer') {
	    //     return showLink(d);
	    //   }
	    // });

	    priority = {
	      inner: 0,
	      outer: 1,
	      normal: 10,
	      metalink: 0
	    };
	    svg.selectAll(".node, .link").sort(function(a, b) {
	      if (priority[a.type] > priority[b.type]) {
	        return 1;
	      }
	      return -1;
	    });
	    node = svg.selectAll(".node").data(cur.nodes, function(d) {
	      return d.id;
	    });
	    nodeG = node.enter().append("g").attr("class", function(d) {
	      switch (d.type) {
	        case "normal":
	          return "node";
	        case "meta":
	          return "meta node";
	        default:
	          throw 'not support type';
	      }
	    }).call(force.drag);
	    nodeG.append("circle").attr("r", 10).style("opacity", 1);
	    nodeG.append("text").attr("dy", ".35em").style("text-anchor", "middle").text(function(d) {
	      return d.name;
	    });
	    nodeG.append("title").text(function(d) {
	      return d.name;
	    });
	    node.exit().remove();
	    node.transition().duration(350).select("circle").attr("r", function(d,i) {
	      if (d.type === "meta") {
	        return 1;
	      }
	      if (d.rate) {
	        if (d.category == 1){
	          return 8 + d.rate * 3;
	        }
	        return 8 + d.rate * 5;
	      } else {
	        return 8;
	      }
	    }).style("opacity", function(d) {
	      if (d.type === "meta") {
	        return 0.2;
	      } else {
	        if (d.rate) {
	          return 1;
	        } else {
	          return 0.5;
	        }
	      }
	    }).attr("fill", function(d) {
	      return color(d.category);
	    });
	    node.on('mouseenter', function(d) {
	      return showDetail(d);
	    });

	    
	    node.on('mouseover', function(d) {
		//if (check.checked === false){
			      svg.selectAll('.node').style("opacity", function(dd) {return 0.08;});
			      svg.selectAll('.link').style("opacity", function(dd) {return 0.05;});
			      svg.selectAll('.node').filter(function (dd) { 
			        return d.tuple_indx.includes(dd.id);
			      }).style("opacity", function(dd) {return 1;});
			      svg.selectAll('.link').filter(function (dd) { 
			        return (d.tuple_indx.includes(dd.source.id) && d.tuple_indx.includes(dd.target.id));
			      }).style("opacity", function(dd) {return 1;});
		//	  };
	    });


	    node.on('mouseout', function(d) {
	    	//if (check.checked === false){
			      svg.selectAll('.node, .link').style("opacity", function(d) {
			        if (d.type === "meta") {
			          return 0.2;
			        } else {
			          if (d.rate) {
			            return 1;
			          } else {
			            return 0.5;
			          }
			        }
			      });
		//	  };
	    });
	    

	  };

	  var scigraph = JSON.parse(statements_graph.replace(/&#39;/g, '"'));

	  var offset
	  graph = scigraph;

	  update();

	  offset = {
	    3: -1,
	    4: -1,
	    2: 0,
	    1: 1
	  };
	  force.on("tick", function(e) {
	    var k;
	    k = 3 * e.alpha;
	    currentDataset.nodes.forEach(function(o) {
	      o.x += offset[o.category] * k;
	    });
	    link.attr("x1", function(d) {
	      return d.source.x;
	    }).attr("y1", function(d) {
	      return d.source.y;
	    }).attr("x2", function(d) {
	      return d.target.x;
	    }).attr("y2", function(d) {
	      return d.target.y;
	    });
	    node.attr("transform", function(d) {
	      return "translate(" + d.x + "," + d.y + ")";
	    });
	  });

	};
	
	doc2 = function() {
	  var box, color, currentDataset, force, getSvgBox, graph, lastChoice, last_detail_node, link, links, loaded, node, nodes, setMetaAnchor, showDetail, showLink, svg, update, years;

	  color = d3.scale.category10();

	  getSvgBox = function() {
	    var el;
	    el = document.querySelector('#svg-wrap2');
	    return el.getBoundingClientRect();
	  };

	  svg = d3.select("#main-view2");
	  box = getSvgBox();
	  force = d3.layout.force().charge(-150).linkDistance(100).size([box.width, box.height]).alpha(1);

	  links = force.links();
	  nodes = force.nodes();
	  link = svg.selectAll(".link");
	  node = svg.selectAll(".node");

	  graph = null;
	  currentDataset = null;
	  years = null;
	  last_detail_node = 3;

	  showLink = function(data) {
	    var html;
	    html = '';
	    if (data) {
	      html += '<table>';
	      html += '<tr>';
	      html += "<th>From</th>";
	      html += "<td>" + data.source.name + "</td>";
	      html += '</tr>';
	      html += '<tr>';
	      html += "<th>To</th>";
	      html += "<td>" + data.target.name + "</td>";
	      html += '</tr>';
	      html += '<tr>';
	      html += "<th>Type</th>";
	      html += "<td>" + (data.name || 'null') + "</td>";
	      html += '</tr>';
	      html += '</table>';
	    }
	    return (document.getElementById('graph-link')).innerHTML = html;
	  };

	  showDetail = function(data) {
	    var html;
	    last_detail_node = data.id;
	    category_map = {
	      1: 'Statement Node',
	      2: 'Predicate Node',
	      3: 'Concept Node',
	      4: 'Attribute Node'
	    };
	    html = '<table>';
	    html += '<tr>';
	    html += "<th>Category</th>";
	    html += "<td>" + category_map[data.category] + "</td>";
	    html += '</tr>';
	    html += '<tr>';
	    html += "<th>Name</th>";
	    html += "<td>" + data.name + "</td>";
	    html += '</tr>';
	    html += '<tr>';
	    html += "<th valign=top>句子文本</th>";
	    html += "<td><i>" + (data.sent || '(move to stmt node to see)') + "</i></td>";
	    html += '</tr>';
	    html += '<tr>';
	    html += "<th valign=top>元组信息</th>";
	    html += "<td>" + (data.tuples || '(move to non-stmt node to see)') + "</td>";
	    html += '</tr>';
	    html += '</table>';
	    return (document.getElementById('graph-node')).innerHTML = html;
	  };

	  setMetaAnchor = function() {
	    var i, offset, y, _i, _results;
	    box = getSvgBox();
	    y = box.height * 0.5;
	    y_f = box.height * 0.2;
	    y_c = box.height * 0.8;
	    offset = box.width / 10;
	    nodes = currentDataset.nodes;
	    nodes[3].x = nodes[3].px = offset;
	    nodes[2].x = nodes[2].px = box.width / 2;
	    nodes[1].x = nodes[1].px = box.width / 2;
	    nodes[0].x = nodes[0].px = box.width - offset;
	    _results = [];

	    nodes[3].y = nodes[3].py = y;
	      _results.push(nodes[3].fixed = true);

	    nodes[2].y = nodes[2].py = y_c;
	      _results.push(nodes[2].fixed = true);

	    nodes[1].y = nodes[1].py = y_f;
	    _results.push(nodes[1].fixed = true);

	    nodes[0].y = nodes[0].py = y;
	    _results.push(nodes[0].fixed = true);

	    return _results;
	  };

	  loaded = [];

	  lastChoice = 0;

	  update = function(doc) {
	    last_detail_node = 3;
	    var cur, nodeG, priority, year;
	    document.querySelector('#svg-wrap2').querySelector('svg').innerHTML = '';
	    lastChoice = doc
	    graph = docgraph[doc]
	    cur = currentDataset = graph;
	    setMetaAnchor();
	    force.nodes(cur.nodes).links(cur.links).linkStrength(function(d) {
	      if (d.rate) {
	        return d.rate / 200;
	      }
	      return .1;
	    }).linkDistance(function(d) {
	      if (d.type === "inner") {
	        return 0.1;
	      } else if (d.type === "outer") {
	        return 200;
	      } else {
	        return 1;
	      }
	    });
	    force.start();
	    showDetail(cur.nodes[last_detail_node]);
	    showLink();
	    link = svg.selectAll(".link").data(cur.links);
	    link.enter().append("line").attr("class", function(d) {
	      switch (d.type) {
	        case "inner":
	        case "outer":
	          return "link";
	        case "metalink":
	          return "metalink link";
	        default:
	          throw 'not support type';
	      }
	    });
	    link.exit().remove();
	    link.transition().duration(850).style("stroke-width", function(d) {
	      if (d.rate) {
	        // return d.rate;
	        return 0.4
	      }
	      return 0.4;
	    }).attr("class", function(d) {
	      switch (d.type) {
	        case "inner":
	        case "outer":
	          return "link";
	        case "metalink":
	          return "metalink link";
	        default:
	          throw 'not support type';
	      }
	    });
	    link.on('mouseenter', function(d) {
	      var _ref2;
	      if ((_ref2 = d.type) === 'inner' || _ref2 === 'outer') {
	        return showLink(d);
	      }
	    });

	    priority = {
	      inner: 0,
	      outer: 1,
	      normal: 10,
	      metalink: 0
	    };
	    svg.selectAll(".node, .link").sort(function(a, b) {
	      if (priority[a.type] > priority[b.type]) {
	        return 1;
	      }
	      return -1;
	    });
	    node = svg.selectAll(".node").data(cur.nodes, function(d) {
	      return d.id;
	    });
	    nodeG = node.enter().append("g").attr("class", function(d) {
	      switch (d.type) {
	        case "normal":
	          return "node";
	        case "meta":
	          return "meta node";
	        default:
	          throw 'not support type';
	      }
	    }).call(force.drag);
	    nodeG.append("circle").attr("r", 10).style("opacity", 1);
	    nodeG.append("text").attr("dy", ".35em").style("text-anchor", "middle").text(function(d) {
	      return d.name;
	    });
	    nodeG.append("title").text(function(d) {
	      return d.name;
	    });
	    node.exit().remove();
	    node.transition().duration(350).select("circle").attr("r", function(d,i) {
	      if (d.type === "meta") {
	        return 1;
	      }
	      if (d.rate) {
	        if (d.category == 1){
	          return 8 + d.rate * 3;
	        }
	        return 8 + d.rate * 5;
	      } else {
	        return 8;
	      }
	    }).style("opacity", function(d) {
	      if (d.type === "meta") {
	        return 0.2;
	      } else {
	        if (d.rate) {
	          return 1;
	        } else {
	          return 0.5;
	        }
	      }
	    }).attr("fill", function(d) {
	      return color(d.category);
	    });
	    node.on('mouseenter', function(d) {
	      return showDetail(d);
	    });

	    //var check = document.querySelector('.doc-focus');

		/*
	    node.on('mouseover', function(d) {
	    	if (check.checked === false){
	    		svg.selectAll('.node').style("opacity", function(dd) {return 0.08;});
		        svg.selectAll('.link').style("opacity", function(dd) {return 0.05;});
		        svg.selectAll('.node').filter(function (dd) { 
		          return d.tuple_indx.includes(dd.id);
		        }).style("opacity", function(dd) {return 1;});
		        svg.selectAll('.link').filter(function (dd) { 
		          return (d.tuple_indx.includes(dd.source.id) && d.tuple_indx.includes(dd.target.id));
		        }).style("opacity", function(dd) {return 1;});
	    	};
	      });

	    node.on('mouseout', function(d) {
	    	if (check.checked === false){
	      		svg.selectAll('.node, .link').style("opacity", function(d) {
		        if (d.type === "meta") {
		          return 0.2;
		        } else {
		          if (d.rate) {
		            return 1;
		          } else {
		            return 0.5;
		          }
		        }
		      });
	      	};
	    });

		 */

	  };

	  str = doc2graph.replace(/&#39;/g, '"')
	  var docgraph = JSON.parse(str); 
	  update(doc);
	  
	  var offset
	  offset = {
	    3: -1,
	    4: -1,
	    2: 0,
	    1: 1
	  };
	  force.on("tick", function(e) {
		    var k;
		    k = 3 * e.alpha;
		    currentDataset.nodes.forEach(function(o) {
		    o.x += offset[o.category] * k;
		  });
		  link.attr("x1", function(d) {
		    return d.source.x;
		  }).attr("y1", function(d) {
		    return d.source.y;
		  }).attr("x2", function(d) {
		    return d.target.x;
		  }).attr("y2", function(d) {
		    return d.target.y;
		  });
		  node.attr("transform", function(d) {
		    return "translate(" + d.x + "," + d.y + ")";
		  });
	  });
	};

	document.getElementById('doc1').style.top='100px';
	document.getElementById('doc1').style.height='600px';
	document.getElementById('doc2').style.display='none';
	doc1();
	// doc2();
	
	/*
	window.onresize = function(e) {
		check.checked=false;
		doc1();
	    // doc2();
	};
	*/
};
