/////////// World.js
//
//
// sets up the world for environment and levels
//
//

import React from 'react';
 
export class World extends React.Component{
	constructor(props) { 
	    super(props);  
	    this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
	  this.props.game.setState({helpIsNeeded:true });
	  this.props.game.showGoal(); 
	}


	// render function for the world
	// sets up images for directions, hint button and error message
	// @returns html code for the world
	render(){   
	   	return( 
	    	<div className="worldWrapper" style={{backgroundImage: `url(${this.props.background})`}}>
	        	<img id="map" src={this.props.map} alt="" />
	        	<img className="directions" src={require('../images/ui/directions.svg')} alt="" />
	        	<div className="hintBtn btnIso">
					<a onClick={this.handleClick}>
						<img alt="" src={require("../images/ui/hint.svg")}/> &nbsp;Show Hints! 
					</a>
				</div>
	        	<div className={"feedback "+ (this.props.game.state.errorAt === 0? "":"shake")} style={{opacity:this.props.game.state.errorAt === 0? 0:1}}>
	        		It seems to be an incorrect instruction at line <b>{this.props.game.state.errorAt}</b>
	        	</div>
	      	</div>
	    );
	}
}