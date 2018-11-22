/////////// Game.js
//
//
// handles game mechanics, feedback and learning materials
//
//


import React from 'react';
import {World} from './World'; 
import {Editor} from './Editor';
import {Character} from './Character'; 
import ReactTooltip from 'react-tooltip'; 
import '../css/world.css';
import '../css/editor.css';
import '../css/game.css';
import SplitPane from 'react-split-pane/lib/SplitPane';
import Confetti from 'react-dom-confetti';

let confetti_colors = [
  '#E68F17',
  '#FAB005',
  '#FA5252',
  '#E64980',
  '#BE4BDB',
  '#0B7285',
  '#15AABF',
  '#EE1233',
  '#40C057'
];
let confettis_conf = [
  // 1
  {
    angle: 90,
    spread: 45,
    startVelocity: 20,
    elementCount: 10,
    decay: 0.7,
    colors: confetti_colors
  },
  // 2
  {
    angle: 90,
    spread: 90,
    startVelocity: 30,
    elementCount: 30,
    decay: 0.73,
    colors: confetti_colors
  },
  // 3
  {
    angle: 90,
    spread: 180,
    startVelocity: 40,
    elementCount: 200,
    decay: 0.75,
    colors: confetti_colors
  },
  // 4
  {
    angle: 90,
    spread: 270,
    startVelocity: 50,
    elementCount: 300,
    decay: 0.77,
    colors: confetti_colors
  },
  // 5
  {
    angle: 90,
    spread: 380,
    startVelocity: 60,
    elementCount: 600,
    decay: 0.80,
    colors: confetti_colors
  }
]
/* ********************* Feedback  ********************************** */
class Modal extends React.Component{

	constructor (props) {
	    super(props);    
	    this.handleCloseClick = this.handleCloseClick.bind(this);
	    this.handleNextLevel = this.handleNextLevel.bind(this);
	}

	handleCloseClick() {  
  		this.props.game.setState(prevState => ({
  			isModalVisible: !prevState.isModalVisible,
  			attempts: 0
  		}));  

  	}

  	// function for clicking next level button after finishing a level
  	handleNextLevel(){ 
  		this.props.global.setState({flow:"screenLevels"});
  	}

  	// renders the score after finishing a level
  	renderScore(){
  		var indents = [];
  		for (var i = 0; i < this.props.game.state.remainingLives; i++) {
  		  indents.push(<span className="coin" key={"coin-"+i}>
  	   						<img alt=""  src={require("../images/ui/coin.svg")} />
  	   					</span>);
  		}
  		 for (var j = i; j < this.props.game.state.defaultNumberOfLives; j++) {
  		  indents.push(<span className="coin" key={"coin-"+j}>
  	   						<img alt="" src={require("../images/ui/coinOff.svg")} />
  	   					</span>);
  		} 
  		return indents;
  	}

  	// render function for the score after finishing a level
	render(){ 
		let progress =  this.props.global.state.user.progress || [] 

		let attempts =  progress.length > 0 ? progress["level"+this.props.global.state.level].attempts : -1;
		  
		let score = this.props.game.calculateScore()
		return (
			<div className={"modal fade "+(this.props.game.state.isModalVisible === true? "show":"")}>
				<div className="confettiWrapper">	      		
					<Confetti active={ this.props.game.state.isModalVisible } config={confettis_conf[this.props.game.state.remainingLives-1]}/>
				</div>
			  	<div className="modal-dialog modal-dialog-centered">
			    	<div className="modal-content">
			      		<div className="modal-header">
			        		<h5 className="modal-title">{score.message}</h5>
			        		<div className="closeBtn" onClick={this.handleCloseClick}>
			          			<span >&times;</span>
			        		</div>
			      		</div>
			      		<div className="modal-body modalScore">
			      			<div className="row"  >
			      				<div className="col-12">
			      					<div className="row">
			      						<div className="col score">{score.value}</div>
									</div>
					      			<div className="row">
					      					<div className="col coins" data-for="score value" data-tip="">{this.renderScore()}
                                                <ReactTooltip id="score value" place="right"/>
					      					</div>

					      			</div>
					      			<div className="row badgeModal" hidden={(score.value < 500  || attempts > -1)? true:false }>
					      				<h5 className="col-12">YOU EARN A NEW BADGE!</h5>
					      				<img className="col-12" alt="" src={require("../images/ui/badges/level"+this.props.game.state.level+".svg")}/>
					      			</div>
					      			<div className="row">
					      				<div className="col">
					      					<div className="btnIso">
					      						<a onClick={this.handleNextLevel}>
					      							<img alt="" src={require("../images/ui/play.svg")}/> &nbsp;Play Next Level
					      						</a>
					      					</div>
					      				</div>
					      			</div>
			      				</div> 
			      			</div>
			      		</div> 
			    	</div>
			  	</div>
			</div>
		);
	}
}
/* ********************* Feedback  ********************************** */
/* ******************* Learning Material  *************************** */
class Topic extends React.Component{ 
  	constructor (props) {
    	super(props);  
    	this.handleClick = this.handleClick.bind(this);
	}

  	handleClick() {   
  		this.props.game.setState({topicContent: this.props.topic.content });
  		this.props.game.setState({topicTitle: this.props.topic.title });
  		this.props.game.setState({topicId: this.props.topic.id });  
  	} 
   
  render () {  
    return (
    	<li className={"list-group-item "+ (this.props.topic.id=== this.props.game.state.topicId? "active":"")}  onClick={this.handleClick}>{this.props.topic.title}</li>
    )
  }
} 




class ToggleMenuBtn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isOpen: this.props.game.isMenuOpen};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() { 
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    })); 
    this.props.game.setState({isMenuOpen: !this.state.isOpen });
  }

  render() { 
    return (  
  		<div className="btnIso float-right learningMaterial"  data-for='lm' data-tip="Learning Material" onClick={this.handleClick}>
  			<a onClick={this.handleNextLevel}>
                { this.state.isOpen ? <img alt="" src={require("../images/ui/navPrev.svg")}/> :  <img alt="" src={require("../images/ui/agenda.svg")} />}
  			</a>
  			<ReactTooltip  id="lm" place="left" type="dark" effect="solid"/>
  		</div>
    );
  } 
}
/* ******************* Learning Material  *************************** */
export class Game extends React.Component{
	constructor(props) { 
	    super(props); 
	    this.state = {
	    	isMenuOpen: false,
	    	isCodeRunning: false,
	    	isModalVisible: false,
	       	level: this.props.global.state.level || 0,
	       	code:  this.props.global.state.levels[this.props.global.state.level].codeBase,
	    	errors:[],
	       	topicContent:this.props.global.state.topicsListElements[0].content || "",
	       	topicTitle:this.props.global.state.topicsListElements[0].title || "", 
	       	topicId:this.props.global.state.topicsListElements[0].id || "", 
	       	defaultNumberOfLives:5,
            remainingLives:5,
             
            startingPositionCharacter: {x:0,y:0},
            startingPositionAssistant: {x:0,y:0},


            // Table of values ​​to identify states and attributes of the map
            //-2 character falls down the map
            //-1 obstacle
            // 1 starting point
            // 2 goal
            // 3 path
            // 0 freePath, character can walk on it however they want
			grid: this.props.global.state.grid,

			codeSequence: [],

			solutionSequence:  this.props.global.state.levels[this.props.global.state.level].solutionSequence,
			codeSequencePosition: -1,
			solutionSequencePosition: -1,
			helpIsNeeded: false,
			errorAt:0,
			isLevelCompleted: false,
			attempts:0
	    }; 
	    this.explosion = null; 
	    this.levels =  this.props.global.state.levels;
	    this.handleNavButtonClick = this.handleNavButtonClick.bind(this);

	}


	componentWillMount(){  
		this.setState({startingPositionCharacter: this.findCharactersStartingPosition()});
		this.setState({startingPositionAssistant: this.findCharactersStartingPosition()});
		this.setState({attempts: 0});
	}

	findCharactersStartingPosition(){
		for (var i = 0; i < this.state.grid.length; i++) {
			for (var j = 0; j < this.state.grid[0].length; j++) { 
				 if(this.state.grid[j][i]===1){
				 	return {x:j,y:i}; 
				}  
			}
		} 
	}


	isLevelCompletedBefore(){
		for(let level in this.props.global.state.user.progress){
			if(this.props.global.state.user.progress[level].level === this.state.level){
				return true;
			} 
		}
		return false;
	}

	getLevelInfo(levelId){
		for(let level in this.props.global.state.user.progress){
			if(this.props.global.state.user.progress[level].level === levelId){
				return this.props.global.state.user.progress[level];
			} 
		}
		return false;

	}


	saveProgress(){ 
		let hasFullScore =  this.calculateScore().value === 500 ? true:false; 

		if(!this.isLevelCompletedBefore()){
			this.props.global.getDatabase().updateUserProgress(this.props.global.state.user.userName, this.state.attempts, this.state.level, this.calculateScore().value, hasFullScore);
		}else if(!this.props.global.state.user.progress["level"+this.state.level].hasFullScore){
		 	this.props.global.getDatabase().updateUserProgress(this.props.global.state.user.userName, 
		 	this.props.global.state.user.progress["level"+this.state.level].attempts + this.state.attempts+1, 
		 	this.state.level, this.calculateScore().value,
		 	hasFullScore);
		}
	}


	calculateScore(){
		let message ="";
		switch(this.state.remainingLives){
			case 5: message = "Perfect!";
					break;
			case 4: message = "Good!";
					break;
			case 3: message = "OK";
					break;
			case 2: message = "Try harder next time";
					break; 
			default: message = "Have a look at the theoretical section"; 
		}
		return {value: this.state.remainingLives * 100, message:message};
	}

	executeCode(){
		this.refs.editor.highlightEditorRow(1);
		this.setState({codeSequencePosition:-1});
		this.setState({isCodeRunning:true});
		this.setState({startingPositionCharacter:this.findCharactersStartingPosition()});
		this.setState({errorAt: 0});
		let component = this; 
		setTimeout(function(){
			component.startAnimationMainCharacter();
			component.refs.player.startTimer();
			component.stopTimerAssistant();
		},1000);
	}

	stopCodeExecution(){
		this.setState({isCodeRunning:false});
		this.setState({errorAt: this.state.codeSequence[this.state.codeSequencePosition].line});
		if(this.state.remainingLives > 0){
			this.setState({remainingLives: this.state.remainingLives-1 });
		}
		this.setState({attempts:  this.state.attempts+1})
		clearInterval(this.timer);
		let component = this;
		setTimeout(function(){
			component.refs.warning.play();
		},400);
	}

	tickMainCharacter() {    
		this.state.codeSequencePosition >= this.state.codeSequence.length-1 ? 
		this.stopAnimationMainCharacter(): this.setState({codeSequencePosition: (this.state.codeSequencePosition + 1)});
		
		let currentLine = this.state.codeSequence[this.state.codeSequencePosition] || {};
		if(Object.keys(currentLine).length !== 0){
			this.refs.editor.highlightEditorRow(currentLine.line || 0);
		}
		 
	}
	startAnimationMainCharacter() {
	  clearInterval(this.timer);
	  this.timer = setInterval(this.tickMainCharacter.bind(this), 800);
	}
	stopAnimationMainCharacter() {
	  clearInterval(this.timer);
	  this.refs.player.stopTimer();
	}	 

	//Assistant Character Animation and Trigger Functions//

	showGoal(){
		this.setState({solutionSequencePosition: -1});  
		this.setState({startingPositionAssistant:this.findCharactersStartingPosition()});
 		let component = this; 
 		setTimeout(function(){
 			component.startTimerAssistant();
 			component.refs.assistant.startTimer();
 		},1000); 
	}

	tickAssistant() { 
		this.state.solutionSequencePosition >= this.state.solutionSequence.length-1 ? 
		this.stopTimerAssistant(): this.setState({solutionSequencePosition: (this.state.solutionSequencePosition + 1)});
	}

	startTimerAssistant() {
	  	clearInterval(this.timerAssistant);
	  	this.timerAssistant = setInterval(this.tickAssistant.bind(this), 800);
	}

	stopTimerAssistant() { 
	  	clearInterval(this.timerAssistant);
	  	this.refs.assistant.stopTimer();
	  	this.setState({helpIsNeeded:false}); 
	}
	
	handleNavButtonClick(){
  		this.props.global.setState({flow: "screenLevels"});
	} 



	render(){  
		let map = (this.levels[this.state.level].map) || ( "map"+this.props.global.state.level.map+".svg");
		let background = (this.levels[this.state.level].background) || ( "backgroud_blue.svg");
		let description = (this.levels[this.state.level].description) || "";
	   	return(  
			<div className="gameWrapper container-fluid h-100 noOverflow">
				<audio ref="warning">
				   	<source src={require('../audio/warning.mp3')} type="audio/mpeg" >
				   	</source>
				</audio>
				<audio ref="win">
				    <source src={require('../audio/win.mp3')}  type="audio/mpeg" >
				    </source>
				</audio>
				<audio ref="alert">
				   <source src={require('../audio/alert.mp3')}  type="audio/mpeg" >
				   </source>
				 </audio>

				<div className={this.state.isModalVisible===true? "h-100 modalBlurEffect ":"h-100"}>
		      	 	<header className={"container-header " + (this.state.isMenuOpen === true?"nav-is-visible":"")} >
		      	 	 	<div className="navBtn" hidden = {this.state.isMenuOpen === true? true:false}>
	   						<a onClick={this.handleNavButtonClick}>
	   							<img alt="" src={require("../images/ui/navPrev.svg")}/>
	   						</a>
	   					</div>
	   					<div className="profile" hidden = {this.state.isMenuOpen === true? true:false}>
	   						<div className="picture">
	   							<img alt="" src={require("../images/ui/avatars/kid.svg")} />
	   						</div> 
	   					</div>
	   					 
		      	 	 	<ToggleMenuBtn game={this}/>
		      	 	 	<div className="level">
		      	 	 		LEVEL {this.props.global.state.level}<br/> 
		      	 	 		{description}
		      	 	 	</div>
		      	 	</header> 
		     
		      	 	<main className={this.state.isMenuOpen === true?"nav-is-visible":""}>
		      	 	 	<div className="container-fluid h-100">  
	 	 	   				<div className="row h-100"> 
	 	 	   					 <div className="col-9">
	 	 	    			        <SplitPane split="vertical" maxSize={window.innerWidth/2} minSize={window.innerWidth/3.8} >
	 	 	    			            <div className="editorWrapper h-100">
	 	 	    			            	<Editor ref="editor" game={this} isCodeRunning={this.state.isCodeRunning} level={this.props.global.state.level} global={this.props.global}/> 	
	 	 	    			            </div>
	 	 	    			            <div className="mapWrapper">
			 	    			            	<Character  ref="player"
			 	    			            				sequence={["stepUp-Up", "stepDown-Up"]}  
		 	 	    			            				startingPosition={this.state.startingPositionCharacter}
		 	 	    			            				grid={this.state.grid}  
		 	 	    			            				codeKeySequence = {this.state.codeSequence[this.state.codeSequencePosition]}
		 	 	    			            				codeSequencePosition = {this.state.codeSequencePosition}
		 	 	    			            				xPixelUnit= {55.3333333}
		  				 									yPixelUnit={31.72}
		  				 									character={"main"}
		  				 									characterVisible= {!this.state.helpIsNeeded}
		  				 									game={this} 
		 	 	    			            	/>
			 	    			            	<Character  ref="assistant"
			 	    			            				sequence={["flyer1", "flyer2","flyer3","flyer4","flyer5","flyer4","flyer3","flyer2"]} 
			 	    			            				 
			 	    			            				startingPosition={this.state.startingPositionAssistant}
			 	    			            				grid={this.state.grid}  
			 	    			            				codeKeySequence = {this.state.solutionSequence[this.state.solutionSequencePosition]}
			 	    			            				codeSequencePosition = {this.state.solutionSequencePosition}
			 	    			            				xPixelUnit= {55.3333333}
		 				 									yPixelUnit={31.72}
		 				 									character={"assistant"}
		 				 									characterVisible= {this.state.helpIsNeeded}
		 				 									game={this}
			 	    			            	/>

		 	    			            				
	 	 	    			            	<World 
	 	 	    			            		map={require('../images/maps/'+map)}
	 	 	    			            		background={require("../images/backgrounds/"+background)}
	 	 	    			            		game={this}/>	
	 	 	    			            </div> 
	 	 	    			        </SplitPane>
	 	 	 	        		</div>
	 	 	 	        		<div className="col-3">
	 	 	 	        			<SplitPane split="horizontal" minSize={window.innerHeight/3} maxSize={window.innerHeight/1.5}>
	 	 			               		<div className="w-100">
	 	 			            			<div className="portlet heartbeatEffect">
	 	 			            				<div className="row portlet-head">
	 	 			            					<img alt="" className="icon" src={require('../images/ui/goals.svg')}/>
	 	 			            					<h4 className="col title">Goals</h4>
	 	 			            				</div>
	 	 			            				<div className="row portlet-body">
	 	 			            					<div className=" col">
	 	 			            				    	<ul className="portlet-list yellow">
    				    		    						{this.levels[this.state.level].goals.map(item => ( 
    				    					                    <React.Fragment key={item.id}> 
    				    					                      	<li>
    				    					                      		{item.description} 
    				    					                      	</li>
    				    					                    </React.Fragment>
    				    					                ))} 
	 	 			            				    	</ul> 
	 	 			            					</div>
	 	 			            				</div>
	 	 			            			</div>
	 	 			               		</div>
	 	 	               		   		<div className="w-100">
	 	 	               					<div className="portlet">
	 	 	               						<div className="row portlet-head">
	 	 	               							<img alt="" className="icon" src={require('../images/ui/methods.svg')}/>
	 	 	               							<h4 className="col title">Available Methods</h4>
	 	 	               						</div>
	 	 	               						<div className="row portlet-body">
	 	 	               							<div className=" col">
	 	 	               						    	<ul className="portlet-list noListStyle greenFont">
					    		    						{this.levels[this.state.level].methods.map(item => ( 
					    					                    <React.Fragment key={item.id}> 
					    					                      	<li data-tip={item.description} >
					    					                      		{item.object}
					    					                      		<span className="dot">.</span>
					    					                      		<span className="green">{item.name}</span>
					    					                      		(<span className="purple">{item.parameter}</span>)
					    					                      	</li> 
					    					                      	<ReactTooltip className='tooltipMethod' place="left" type="dark" effect="solid"/>
					    					                    </React.Fragment>
					    					                ))}
	 	 	               						    	</ul> 
	 	 	               							</div>
	 	 	               						</div>
	 	 	               					</div>
	 	 	               		   		</div>  
	 	 	 	        			</SplitPane>
	 	 	 	        		</div>
	 	 	   				</div> 
	 	 	   		  	</div>
		      	 	</main>
		      	 	 
		      	 	<nav className={"nav-container " + (this.state.isMenuOpen === true?"nav-is-visible":"")} >
		      	 	 	<div className="nav"> 
		      	 	 		<div className="nav-content"> 
		      	 	 			<div className="row h-100">
		      	 	 				<div className="topic-list h-100 col-4">
		      	 	 					<div className="title-header">
		      	 	 						<img alt="" src={require('../images/ui/agenda.svg')}/>
		      	 	 						<h4 className="">
		      	 	 							Learning Material
		      	 	 						</h4> 
		      	 	 					</div>
		      	 	 					<ul className="list-group">
		      	 	 					   {this.props.global.state.topicsListElements.map(item => ( 
							                    <React.Fragment key={item.id}> 
							                      	<Topic topic={item} game={this}/>
							                    </React.Fragment>
							                ))}
		      	 	 					</ul>
		      	 	 				</div>
		      	 	 				<div className="topic-content h-100 col-8">
					                  	<h3 className="">{this.state.topicTitle}</h3>
					                  	<hr/>
					                  	<div className="row">
					                  		<div className="col" dangerouslySetInnerHTML={{__html: this.state.topicContent}}>
					                  			 
					                  		</div>
					                  	</div>
		      	 	 				</div>
		      	 	 			</div> 
		      	 	 		</div>
		      	 	 	</div>  
		      	 	</nav>
		      	</div>
		      	<Modal game={this} global={this.props.global} />
		       
	      	</div>
	    );
	}
} 
