let svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

let parseDate = d3.timeParse("%Y");

let x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(['#4682B4', '#1E90FF', '#000080', '#4B0082']);

let stack = d3.stack();

let area = d3.area()
    .x((d) => x(d.data.Year))
    .y0((d) => y(d[0]))
    .y1((d) => y(d[1]));

let type = (d, i, columns) => {
  d.Year = parseDate(d.Year);
  return d;
}

let g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("region_data.csv", type, (error, data) => {
  if (error) throw error;
  let keys = data.columns.slice(1);

  x.domain(d3.extent(data, (d) => d.Year));
  z.domain(keys);
  stack.keys(keys);
  stack.order(d3.stackOrderDescending);

  let layer = g.selectAll(".layer")
    .data(stack(data))
    .enter().append("g")
      .attr("class", "layer");

  layer.append("path")
      .attr("class", "area")
      .style("fill", (d) => z(d.key))
      .attr("d", area);

  layer.append("text")
      .attr("x", width - 6)
      .attr("y", (d) => y((d[d.length - 1][0] + d[d.length - 1][1]) / 2))
      .attr("dy", ".35em")
      .style("font", "10px sans-serif")
      .style("text-anchor", "end")
      .style('fill', '#fff')
      .text((d) => d.key);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"));
});
