# scalable-slider-react

> A d3 based slider that you can scale some part of 

[![NPM](https://img.shields.io/npm/v/scalable-slider-react.svg)](https://www.npmjs.com/package/scalable-slider-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Demo

https://thetarby.github.io/scalable-slider-react

## Install

```bash
npm install --save scalable-slider-react
```

## Usage

```jsx
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
			        ceil:100,
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
			<p>Double click on slider when you want to scale to default</p>
			<p>slider value:{this.state.slider.value}</p>

			<Slider slider_id={1} config={{height:90}} fluid items={this.state.items} d3slider={this.state.slider} handleChange={this.handleChange} />
			<button onClick={this.handleClick}>increment</button>

			<Slider slider_id={2} config={{height:90, tickCount:100}} fluid items={this.state.items} d3slider={this.state.slider} handleChange={this.handleChange} />
			<button onClick={this.handleClick}>increment</button>

			
			<p>This is a fixed size slider unlike above ones it does not change its width when window resizes</p>
			<Slider slider_id={3} config={{width:500,height:90, tickCount:100}} items={this.state.items} d3slider={this.state.slider} handleChange={this.handleChange} />
			<button onClick={this.handleClick}>increment</button>

		</>	
		)
	}
}

export default App

```

## License

MIT © [thetarby](https://github.com/thetarby)
