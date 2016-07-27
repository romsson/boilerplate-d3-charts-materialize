function chart() {

  // Default values
  var vars = {
    width: 400,
    height: 100,
    margin: {top: 20, right: 20, bottom: 20, left: 20},
    title: '',
    type: 'linechart',
    yScale: d3.scaleLinear(),
    var_x: 'x',
    var_y: 'y',
    xScale: d3.scaleLinear(),
    yScale: d3.scaleLinear(),
    dispatch: d3.dispatch('click', 'hover'),
    renderDirty: true,
  };

  vars.xAxis = d3.axisBottom(vars.xScale).tickSize(6, 0);
  vars.yAxis = d3.axisBottom(vars.yScale).tickSize(6, 0);

  function chart(selection) {

    selection.each(function() {

      vars.xScale
          .domain(d3.extent(vars.data, function(d) { return d[vars.var_x]; }))
          .range([vars.margin.left, vars.width - vars.margin.left - vars.margin.right]);

      vars.yScale
          .domain(d3.extent(vars.data, function(d) { return d[vars.var_y]; }))
          .range([vars.height - vars.margin.top - vars.margin.bottom, vars.margin.top]);

      var gEnter = d3.select(this).selectAll("g").data([vars.data]).enter();

      vars.svg = d3.select(this);

      d3.select(this).selectAll(".title").data([vars.data])
        .enter()
          .append("text")
          .attr("class", "title")
          .attr("transform", "translate(" + vars.width / 2 + ", " + vars.margin.top / 2  + ")")
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .text(vars.title);

      d3.select(this).selectAll(".inner").data([vars.data])
        .enter()
          .append("rect")
          .attr("class", "inner")
          .attr("width", vars.width - vars.margin.left - vars.margin.right)
          .attr("height", vars.height - vars.margin.top - vars.margin.bottom)
          .attr("transform", "translate(" + vars.margin.left + "," + vars.margin.top + ")");

      d3.select(this).selectAll(".outer").data([vars.data])
        .enter()
          .append("rect")
          .attr("class", "outer")
          .attr("width", vars.width)
          .attr("height", vars.height);

      d3.select(this).selectAll('.dotsCircle').data(vars.data, function(d) { return d[vars.var_id]; })
        .enter()
          .append('circle')
          .attr('class', 'dotsCircle')
          .attr('r', 10)
          .attr('cx', function(d) { return vars.xScale(d[vars.var_x]); })
          .attr('cy', function(d) { return vars.yScale(d[vars.var_y]); })
          .on('click', function(d) {
            vars.dispatch.call("click", this, d);
          })
          .on("mouseover", function(d) {
            vars.dispatch.call("hover", this, d);
          })
          .on("mouseout", function(d) {
            vars.dispatch.call("hover", this, d);
          });

      if (vars.renderDirty) {
        vars.renderDirty = false;
      }

    });
  }

  // Private functions
  function merge(d, e) {

    var obj = {},
        i = 0,
        il = arguments.length,
        key;

    for (; i < il; i++) {
        for (key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                obj[key] = arguments[i][key];
            }
        }
    }
    return obj;
  };

  // Public functions
  chart.filter = function() {
    vars.renderDirty = true;
    return chart;
  }

  chart.highlight = function(data) {
    vars.renderDirty = true;
    return chart;
  }

  chart.params = function(x) {
    if(!arguments.length) return vars;
    vars = vars.user_vars = merge(vars, x);
    return chart;
  };

  chart.on = function() {
    var value = vars.dispatch.on.apply(vars.dispatch, arguments);
    return value === vars.dispatch ? chart : value;
  }

  return chart;
}
