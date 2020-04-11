import React from 'react'

import { ExampleComponent, Slider } from 'scalable-slider-react'
import 'scalable-slider-react/dist/index.css'
const items2=[
		  {
		    src:"https://www1.bac-assets.com/homepage/spa-assets/images/assets-images-site-homepage-icons-contact_icon_locations_red-CSX54c6594a.svg",
		    locations:[55,67,98,5]
		  },
		  {
		    src:"https://upload.wikimedia.org/wikipedia/commons/b/b1/Yellow_card.svg",
		    locations:[2,5,14,24]
		  }
]

class App extends React.Component{
  	constructor() {
	    super();
	    this.state = {
			slider:{
			  	value:5, 
			  	options:{
			        ceil:1000,
			        floor:0,
			  	}
			},
			items:[
				{
					src:"https://www1.bac-assets.com/homepage/spa-assets/images/assets-images-site-homepage-icons-contact_icon_locations_red-CSX54c6594a.svg",
					locations:[22,29,36,25]
				},
				{
					src:"https://upload.wikimedia.org/wikipedia/commons/b/b1/Yellow_card.svg",
					locations:[2,5,14,24]
				}
			]
	    };
	    this.handleClick=this.handleClick.bind(this);
	    this.handleChange=this.handleChange.bind(this);
	}
	handleClick(){
		var state={...this.state}
		state.slider.value++
		this.setState({state})
	}
	handleChange(value){

		this.setState({slider:{...this.state.slider, value:value}})
	}
	render(){
		return (
		<>
			<ExampleComponent text="SLIDER IT IS 😄" />
			<p>slider value:{this.state.slider.value}</p>

			<Slider config={{height:300, tickCount:100}} fluid items={this.state.items} d3slider={this.state.slider} handleChange={this.handleChange} />
			<button onClick={this.handleClick}>increment</button>
			<button onClick={()=>this.setState({items:items2})}>change icons</button>

		</>	
		)
	}
}

export default App
