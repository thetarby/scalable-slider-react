import React from 'react'
import * as d3 from "d3";
import './slider.css'

export class Slider extends React.Component {
  constructor(props) {
    super();
    this.state = {
      count: 0,
      zoomceil:0,
      zoomfloor:0,
    };
    this.config={
      margin:{left: 20, right: 20},
      width:1000,
      height:90,
      step:1,
      //these values can be overriden by user props
      ...props.config
    }
    this.componentDidMount=this.componentDidMount.bind(this);
    this.componentDidUpdate=this.componentDidUpdate.bind(this);
    this.dragged=this.dragged.bind(this);
    this.handleResize=this.handleResize.bind(this);
    this.handleReset=this.handleReset.bind(this);
  }


  updateDOMSlider(value){
    console.log("updateDOM")
    var cx = this.xScale(value);
    this.handle.attr('cx', cx);
    this.handleText.attr("x",cx).text(this.props.d3slider.value);    
  }
  handleResize(x){
    //d3.select('#d3slider').selectAll("*").remove()
    var margin = this.config.margin,
        width = x,
        height = this.config.height,
        range = [this.state.zoomfloor,this.state.zoomceil]
        var step = this.config.step; // change the step and if null, it'll switch back to a normal slider
        console.log('range: '+range)
        this.step=step;
    var svg = d3.select('#d3slider').select('svg').transition()
        .attr('width', width)
        .attr('height', height);

    var slider = svg.select('g')
        .transition()
        .attr('transform', 'translate(' + margin.left +', '+ (height/2) + ')');
    // using clamp here to avoid slider exceeding the range limits
    this.xScale = d3.scaleLinear()
        .domain(range)
        .range([0, width - margin.left - margin.right])
        .clamp(true);
    var xScale=this.xScale
    
    // array useful for step sliders
    this.rangeValues = d3.range(range[0], range[1], step || 1).concat(range[1]);
    var rangeValues=this.rangeValues

    if(this.config.tickCount){
      var tickCount=this.config.tickCount*(range[1]-range[0])/(this.props.d3slider.options.ceil-this.props.d3slider.options.floor)
      var tickRange=d3.ticks(range[0], range[1],tickCount)
      var xAxis = d3.axisBottom(xScale).tickValues(tickRange).tickFormat(function (d) {
          return "";
      });

      var ticks = slider.select('g').attr('class', 'ticks').attr('transform', 'translate(0, 4)')
          .call(xAxis);
    }

    xScale.clamp(true);
    // drag behavior initialization
    var thisOfClass=this;
    var drag = d3.drag()
        .on('start.interrupt', function () {
            slider.interrupt();
        }).on('start drag', function () {
            thisOfClass.dragged(d3.event.x);
        });

    // this is the main bar with a stroke (applied through CSS)
    slider.select('.track').attr('class', 'track').transition()
        .attr('x1', xScale.range()[0])
        .attr('x2', xScale.range()[1]);

    slider.selectAll("image")
      .style("visibility", function(d){
            if(d < thisOfClass.state.zoomfloor || d > thisOfClass.state.zoomceil){
              return "hidden"
            }
            return "visible"
          })
      .attr('x', function(d){return xScale(d)-15/2})



    slider.select('.track-inset').transition()
            .attr('x1', xScale.range()[0])
            .attr('x2', xScale.range()[1]);


    // this is the bar on top of above tracks with stroke = transparent and on which the drag behaviour is actually called
    // try removing above 2 tracks and play around with the CSS for this track overlay, you'll see the difference
    slider.select('.track-overlay')
      .transition()
      .attr('x1', xScale.range()[0])
      .attr('x2', xScale.range()[1]);
  }
  dragged(value) {
    var x = this.xScale.invert(value), index = null, midPoint, cx, xVal;
    var rangeValues=this.rangeValues
    if(this.step) {
        // if step has a value, compute the midpoint based on range values and reposition the slider based on the mouse position
        for (var i = 0; i < rangeValues.length - 1; i++) {
            if (x >= rangeValues[i] && x <= rangeValues[i + 1]) {
                index = i;
                break;
            }
        }
        midPoint = (rangeValues[index] + rangeValues[index + 1]) / 2;
        if (x < midPoint) {
            cx = this.xScale(rangeValues[index]);
            xVal = rangeValues[index];
        } else {
            cx = this.xScale(rangeValues[index + 1]);
            xVal = rangeValues[index + 1];
        }
    } else {
        // if step is null or 0, return the drag value as is
        cx = this.xScale(x);
        xVal = x.toFixed(3);
    }
    // use xVal as drag value

    this.props.handleChange(xVal)
  }
  handleReset(){
    this.setState({
      zoomfloor:this.props.d3slider.options.floor,
      zoomceil:this.props.d3slider.options.ceil
    })
  }

  /*
  gets slider object and put icons on locations
  */
  attachImages(slider ,items){
    var thisOfClass=this
    slider.selectAll("items").data(items.locations).enter()
      .append("image")
      .attr("href",items.src)
      .style("width","15")
      .style("height","20")
      .attr('x', function(d){return thisOfClass.xScale(d)-15/2})
      .attr("y","-30px")
  }
  componentDidMount(){
    
    //it prop fluid is set set resize event handler
    if(this.props.fluid){
      window.addEventListener("resize", ()=>this.handleResize(+(d3.select('#d3slider').style("width")).slice(0,-2)-margin.left-margin.right));
    }

    var margin = this.config.margin,
        width = +(d3.select('#d3slider').style("width")).slice(0,-2)-margin.left-margin.right,
        height = this.config.height,
        range = [this.state.zoomfloor,this.state.zoomceil]
    
    var step = this.config.step; // change the step and if null, it'll switch back to a normal slider
    console.log(range)
    this.step=step;
    var thisOfClass=this; // in d3 'this' will be shadowed so put it to variable

    this.step=step;

    var svg = d3.select('#d3slider').append('svg')
        .attr('width', width)
        .attr('height', height);

    // using clamp here to avoid slider exceeding the range limits
    this.xScale = d3.scaleLinear()
        .domain(range)
        .range([0, width - margin.left - margin.right])
        .clamp(true);
    
    var xScale=this.xScale

    /*
      initialize drag behaviour for selecting an area by dragging


    */
    this.dragStartx;
    this.dragFinishx;
    this.dragStarty;
    this.dragFinishy;
    function dragstarted(d) {
      thisOfClass.dragStartx=d3.event.x;
      thisOfClass.dragStarty=d3.event.y;
      d3.select(this)
        .select(".rect").remove();
      d3.select(this)
        .append("rect")
        .attr("class", "rect");
    }
    function dragged(d) {
      d3.select(this)
        .select(".rect")
        .attr("x", thisOfClass.dragStartx)
        .attr("y", d3.min([thisOfClass.dragStarty, d3.event.y]))
        .attr("height", Math.abs(d3.event.y-thisOfClass.dragStarty) )
        .attr("width", d3.event.x-thisOfClass.dragStartx)
        .attr("fill", "black")
        .style("opacity", "0.3")
    }
    function dragended(d) {
      d3.select(this).select(".rect").remove();
      thisOfClass.dragFinishx=d3.event.x;
      thisOfClass.setState({
        zoomceil:Math.ceil(thisOfClass.xScale.invert(thisOfClass.dragFinishx-margin.left)),
        zoomfloor:Math.floor(thisOfClass.xScale.invert(thisOfClass.dragStartx-margin.left))
      })

      console.log(thisOfClass.state.zoomfloor, thisOfClass.state.zoomceil)
    }

    svg.call(d3.drag()
                 .on("start", dragstarted)
                 .on("drag", dragged)
                 .on("end", dragended))

    //Append svg slider to dom with d3
    var slider = svg.append('g')
        .attr('slider', true)
        .attr('transform', 'translate(' + margin.left +', '+ (height/2) + ')');

    xScale.clamp(true);
    // drag behavior initialization
    var drag = d3.drag()
        .on('start.interrupt', function () {
            slider.interrupt();
        }).on('start drag', function () {
            thisOfClass.dragged(d3.event.x);
        });

    // this is the main bar with a stroke (applied through CSS)
    var track = slider.append('line').attr('class', 'track')
        .attr('x1', xScale.range()[0])
        .attr('x2', xScale.range()[1]);

    //add icons 
    this.props.items.forEach(item=>
      this.attachImages(slider, item)
    ) 

    var trackInset = d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-inset');
    
    // array useful for step sliders
    this.rangeValues = d3.range(range[0], range[1], step || 1).concat(range[1]);
    var rangeValues=this.rangeValues
    
    if(this.config.tickCount){
      var tickCount=this.config.tickCount
      var tickRange=d3.ticks(range[0], range[1],tickCount)
      var xAxis = d3.axisBottom(xScale).tickValues(tickRange).tickFormat(function (d) {
          return "";
      });
      var ticks = slider.append('g').attr('class', 'ticks').attr('transform', 'translate(0, 4)')
          .call(xAxis);
    }

    // drag handle
    this.handle = slider.append('circle').classed('handle', true)
        .attr('r', 8);
    var handle=this.handle;
    this.handleText= slider.append("text").style("text-anchor","middle").attr("y","-10px").text(range[0]);
    // this is the bar on top of above tracks with stroke = transparent and on which the drag behaviour is actually called
    // try removing above 2 tracks and play around with the CSS for this track overlay, you'll see the difference
    var trackOverlay = d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-overlay')
        .call(drag);


    this.setState({
    zoomceil:this.props.d3slider.options.ceil,
    zoomfloor:this.props.d3slider.options.floor
    })

  }
  componentDidUpdate(){
    if(this.props.size){

    }
    else if(this.props.fluid){
      this.handleResize(+(d3.select('#d3slider').style("width")).slice(0,-2))

    }
    else{
      this.handleResize(1000)
    }
    this.updateDOMSlider(this.props.d3slider.value)
  }

  render() {
    return (
     <div> 
      <div id='d3slider'></div>
      <button onClick={this.handleReset}>reset</button>
      <button onClick={()=>this.handleResize(1000)}>zoomIn</button>    
      <button onClick={()=>this.handleResize(500)}>zoomOut</button>    
    </div>
    );
  }
}