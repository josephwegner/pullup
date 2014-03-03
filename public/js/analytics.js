(function($) {

  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ]

  $(document).ready(function() {

    //Build data!
    var points = [];
    $(".news-item").each(function() {
      points.push({
        date: Date.parse($(this).data('posted-on')),
        type: "news",
        value: parseInt($(this).find(".vote-count").text())
      });
    });
    $(".comment-item").each(function() {
      points.push({
        date: Date.parse($(this).data('posted-on')),
        type: "comment"
      });
    });

    //points = [{"date":1393527010000,"type":"news","value":5},{"date":1393527010000,"type":"news","value":8},{"date":1393518983000,"type":"news","value":5},{"date":1393518983000,"type":"news","value":2},{"date":1392930571000,"type":"news","value":5},{"date":1392930571000,"type":"news","value":2},{"date":1392487653000,"type":"news","value":3},{"date":1392487653000,"type":"news","value":9},{"date":1393526963000,"type":"comment"},{"date":1393526963000,"type":"comment"},{"date":1392928519000,"type":"comment"},{"date":1392928515000,"type":"comment"}]

    var width = 960,
        height = 300;

    var fill = function(id) {
      switch(points[id].type) {
        case "news":
          return "#E64B4B";

        case "vote":
          return "#4B4BE6";

        case "comment":
          return "#4BE660";
      }
    }

    points.sort(function(a,b) {
      return a.date - b.date
    });

    var start = points[0].date;
    var end = points[points.length - 1].date;
    var numPoints = Math.floor((end - start) / 86400000);
    var startX = 50;
    var stepValue = (end - start) / numPoints;
    var stepLength = (width - (startX * 2)) / numPoints;
    var nodes = [];
    points.forEach(function(point, index) {
      points[index].targetX = (Math.floor((point.date - start) / 86400000) * stepLength) + startX 
      nodes.push({
        y: Math.floor(Math.random() * 300),
        x: Math.floor(Math.random() * width),
        id: index
      });
    });

    var getRadius = function(d) {
      if(typeof(points[d.id].value) !== "undefined" && points[d.id].type === "news") {
        return 3 * points[d.id].value;
      } 
      return 5;
    }

    var svg = d3.select("#analytics-bubble").append("svg")
        .attr("width", width)
        .attr("height", height);

    //Draw lines
    for(var i=0;i<=numPoints;i++) {
      var date = new Date(start + (i * stepValue));

      svg.append("svg:line")
        .attr("x1", (i * stepLength) + startX)
        .attr("y1", 0)
        .attr("x2", (i * stepLength) + startX)
        .attr("y2", height)
        .style("stroke", "#CCCCCC");

      svg.append("text")
        .attr("x", (i * stepLength) + startX)
        .attr("y", height + 5)
        .style("text-anchor", "left")
        .style("fill", "#CCCCCC")
        .attr("transform", "rotate(-90 "+((i * stepLength) + startX)+" "+(height - 10)+")")
        .text(months[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear())
    }

    var force = d3.layout.force()
        .nodes(nodes)
        .links([])
        .gravity(0)
        .charge(function(d) {
          return Math.pow(getRadius(d), 2.0) / -5
        })
        .size([width, height])
        .on("tick", tick);

    var node = svg.selectAll("circle");

    function tick(e) {
      var k = .1 * e.alpha

      nodes.forEach(function(o, i) {
        o.x += (points[o.id].targetX - o.x) * k;
        o.y += ((height / 2) - o.y) * k;
      });
      node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

    force.start();

    node = node.data(nodes);

    node.enter().append("circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", getRadius)
        .style("fill", function(d) { return fill(d.id); })
        .style("stroke", function(d) { return d3.rgb(fill(d.id)).darker(2); })
        .call(force.drag);

  });
})(jQuery);