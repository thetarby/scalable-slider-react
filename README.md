# scalable-slider-react

> A d3 based slider that you can scale some part of 

[![NPM](https://img.shields.io/npm/v/scalable-slider-react.svg)](https://www.npmjs.com/package/scalable-slider-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save scalable-slider-react
```

## Usage

```jsx
import React from 'react'

import {Slider } from 'scalable-slider-react'
import 'scalable-slider-react/dist/index.css'
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
					src:"some-icon-link such as https://upload.wikimedia.org/wikipedia/commons/b/b1/Yellow_card.svg",
					locations:[22,29,36,25]
				},
				{
					src:"some-other-icon-link",
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
			<p>slider value:{this.state.slider.value}</p>

			<Slider fluid
      config={{height:300, tickCount:100}} 
      items={this.state.items} 
      d3slider={this.state.slider}
      handleChange={this.handleChange} />
      
			<button onClick={this.handleClick}>increment</button>
			<button onClick={()=>this.setState({items:items2})}>change icons</button>

		</>	
		)
	}
}

export default App

```

## License

MIT © [thetarby](https://github.com/thetarby)
