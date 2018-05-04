// **** Your JavaScript code goes here ****
d3.csv('./data/real_estate.csv', function(error, dataset) {
  //settign margins and width
  var margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
    },
    width = 800 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;


  var minDate = d3.min(dataset, function(d) {
    return +d['year_built']
  });

  var maxDate = d3.max(dataset, function(d) {
    return +d['year_built']
  });

  var maxPrice = d3.max(dataset, function(d) {
    return +d['price_per_sqft']
  });

  var dataLocation = d3.nest()
    .key(function(d) {
      return d.location;
    })
    // .rollup(function(v) {
    //   return v.map(function(d) {
    //     return {
    //       price_per_sqft: d.price_per_sqft,
    //       beds: d.beds
    //     };
    //   });
    // })
    .entries(dataset);

  var svg = d3.select("body").select("div").select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  var legend = d3.selectAll('.legend')
      .attr("transform", "translate("+ ( width/2- margin.left) +" ," + (height / 2 + margin.top ) + ")");



  var trellisGraphs = svg.selectAll('.trellis')
    .data(dataLocation)
    .enter()
    .append('g')
    .attr('class', 'trellis')
    .attr('transform', function(d, i) {
      var tx = (i % 2) * width / 2 + margin.left;
      var ty = Math.floor(i / 2) * height / 2 + margin.top;
      return 'translate(' + [tx, ty] + ')';
    })

  var xScale = d3.scaleTime()
    .domain([minDate, maxDate])
    .rangeRound([0, width / 2 - margin.left - margin.right]);

  var yScale = d3.scaleLinear()
    .domain([maxPrice, 0])
    .range([0, height / 2 - margin.top - margin.bottom])

  trellisGraphs.append("g")
    .attr("transform", "translate(0 ," + (height / 2 - margin.top - margin.bottom) + ")")
    .attr("class", "xScale")
    .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.formatPrefix(".0", 20)))

  trellisGraphs.append("g")
    .attr("transform", "translate(0 ,0)")
    .call(d3.axisLeft(yScale).ticks(9).tickFormat(d3.formatPrefix(".0", 500)))

  trellisGraphs.append("text") // text label for the x axis
    .attr("x", margin.top + margin.bottom + 100)
    .attr("y", height / 2 - margin.top)
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Year Built");


  trellisGraphs.append("text") // text label for the y axis
    .attr("x", height / 2 - margin.top - margin.bottom - margin.left - margin.bottom)
    .attr("y", width / 2 - margin.left - margin.right - margin.bottom - margin.top + 8)
    .attr("transform", "rotate(-90 " + margin.left / 2 + " " + height / 2 + ")")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Price per Square Foot(USD)");

//titles
    trellisGraphs.append("text")
      .attr("x", (width / 4) - margin.right)
      .attr("y", margin.top)
      .attr("text-anchor", "middle")
      .style("font-size", "15px")
      .text(function(d) {
        return d.key });


  //setup fill color

  trellisGraphs.selectAll(".dot")
    .data(function(d){
      return d.values;
    })
    .enter().append("circle")
    .attr("class", function(d) {
      return d.location
    })
    .attr("r", 3)
    .attr("cx", function(d) {
      return xScale(d.year_built);
    })
    .attr("cy", function(d) {
      return yScale(d.price_per_sqft);
    })
    .style("fill",function(d){
      if(d.beds > 2){
        return "#2e5d90";
      } else {
        return "499936"
      }
    });



  // dataLocation.forEach(function(d) {
  //   d.price_per_sqft = parseInt(d.price_per_sqft);
  // });
  // var max = d3.max(dataLocation, function(d) {
  //   return d.value;
  // });
  // console.log(dataLocation.price_per_sqft);
  // aggrating the data set for category and coffee sales


});
