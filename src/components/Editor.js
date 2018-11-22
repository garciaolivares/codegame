/////////// Editor.js
//
//
// handles functions in connection to the coding editor
//
//


import React from 'react'; 
import AceEditor from 'react-ace';
import SplitPane from 'react-split-pane/lib/SplitPane';
//import keywords from './Keywords.js'

import 'brace/mode/javascript';
import 'brace/theme/monokai'; 

import 'brace/ext/language_tools';
import ace from 'brace';
let langTools = ace.acequire('ace/ext/language_tools');
var esprima = require('esprima');


export class Editor extends React.Component{
	constructor(props) { 
	    super(props); 
	    this.state = {
	    	errors:[],
	    	popover: {x:0,y:0},
	    	isPopoverVisible:false,

	    }; 
	    this.handleOnChange = this.handleOnChange.bind(this);
	    this.handleOnValidate = this.handleOnValidate.bind(this);
	    this.handleOnLoad = this.handleOnLoad.bind(this);
	    this.handleClick = this.handleClick.bind(this);
	    this.editor = null;
	    this.output = []; 
	}

	 uniqueErrors(myArr, prop) {
	    return myArr.filter((obj, pos, arr) => {
	        return arr.map(mapObj => mapObj["id"]).indexOf(obj["id"]) === pos;
	    });
	}

	componentDidMount() {
    	/*const customMode = new keywords();
    	this.refs.aceEditor.editor.getSession().setMode(customMode);*/
    	let component = this;
    	this.refs.aceEditor.editor.commands.on("afterExec", function (e) {
    	    if (e.command.name === "insertstring" && /^[\w.]$/.test(e.args)) {
    	        component.refs.aceEditor.editor.execCommand("startAutocomplete");
    	    }
    	});
 	}


 	 componentWillUnmount() {
 	 	let component = this;
    	window.removeEventListener("afterExec", function (e) {
    	    if (e.command.name === "insertstring" && /^[\w.]$/.test(e.args)) {
    	        component.refs.aceEditor.editor.execCommand("startAutocomplete");
    	    }
    	});
  	}

  	componentDidUpdate(prevProps, prevState){
  		var coord = this.refs.editorPortlet.getBoundingClientRect();
  		if(prevState.popover.x !== coord.right){
  			this.setState({popover:{x:coord.right, y:coord.top}})
  		}
  	}
//editor highlighting
   	highlightEditorRow(line){
   		this.editor.resize(true);
   		this.editor.gotoLine(line);
   		 
   	}
//when user writes anything
	handleOnChange(newValue , e) {  
		this.props.game.setState({code:newValue});
		this.editor.resize(); 
		this.setState({isPopoverVisible:false});
	}
//onLoad function
	handleOnLoad(editor){
		editor.focus();
		this.editor = editor; 
		this.editor.container.style.lineHeight = 1.4;
		this.editor.renderer.updateFontSize()

		langTools.setCompleters([]);

 		var completerTables = [
 		  {value: 'player', caption: 'player', meta: 'Object'}, 
 		];

 		 
 		let methods = this.props.global.state.levels[this.props.level].methods;
 	 	for(let i in methods){  
 			if(methods[i].parameter === "number"){
 				completerTables.push({value: methods[i].name+'();', caption: methods[i].name+'('+methods[i].parameter+');', meta: 'Method' });
 			}else{
 				completerTables.push({value: methods[i].name+'('+methods[i].parameter+');', caption: methods[i].name+'('+methods[i].parameter+');', meta: 'Method' });
 			}
 		} 
//preparing autocomplete values adding the tables containing our custom methods
 		// create a completer object with a required callback function:
 		var completers = {
 		  	getCompletions: function(editor, session, pos, prefix, callback) {
 		    	callback(null, completerTables.map(function(table) {
 		      		return {
 		        		value: table.value,
 		        		caption: table.caption,
 						meta: table.meta
 		      		};
 		    	}));	
 		  	}
 		};
 		// finally, bind to langTools:
 		langTools.addCompleter(completers); 

	}

//Error and Exception
	addErrorId(errors){
		for (var i = 0; i < errors.length; i++) {
			errors[i].id = "error-"+i;
		}
		return errors;
	}

	handleOnValidate(errors){ 
		errors = this.addErrorId(errors) 
		 
		this.setState({errors:errors});
		this.props.game.setState({errors:errors});
	}


	handleRefreshEditor(){
		if(this.editor !== null){
			this.editor.resize();
		}
	}

	handleClick() { 
	  	//TODO: 
	  	// 1. Validate if code has no errors

	  	if(this.props.game.state.errors.length > 0 ){
	  		this.setState({isPopoverVisible:true});
	  		this.props.game.refs.alert.play();
	  	}else{
		 	this.output = []; 
		 	///TESTING CHARACTER ANIMATION
		 	let code = esprima.parseScript(this.props.game.state.code, {tokens:true, loc:true});

		 	if(code.body.length === 0){
		 		let errors = this.state.errors;
		 		errors.push({id: 100, row: 0 , text: "Type some lines of code first."}) 
		 		this.setState({errors: errors})
		 	}else{
				this.output = this.parseCode(code);   
				if(this.output !== false){			
					this.props.game.setState({codeSequence: this.output});
				 	this.props.game.executeCode();
				} 
		 	}

	  	}
	} 

//Parsing code according to execution or for statements
	  parseCode(output){ 
	  	for(let i = 0; i < output.body.length; i++ ){
	  		switch(output.body[i].type){
	  			case "ForStatement":
	  					if(this.solveForLoop(output.body[i]) === false){
	  						return false;
	  					}
	  					break;
				case "ExpressionStatement":
					
					let methodName = output.body[i].expression.callee.property || false;

					if(!methodName){
						let errors = this.state.errors;
						errors.push({id: 0, row: output.body[i].loc.start.line-1, text: "Wow something smells fishy, check again this line! "}); 
						this.setState({errors: errors})
						return false; 
					}

					if(output.body[i].expression.callee.object.name !== "player"){
						let errors = this.state.errors;
						errors.push({id: 0, row: output.body[i].loc.start.line-1, text: "Do you mean \"player\" instead of "+output.body[i].expression.callee.object.name}); 
						this.setState({errors: errors})
						return false;
					}


					if(output.body[i].expression.arguments.length > 0){
						if(this.expandWalkMethod(
							output.body[i].expression.callee.property.name,
							output.body[i].loc.start.line,
							output.body[i].expression.arguments[0].value 
							) === false){ 
							return false;
						}
					}else{
						this.output.push({action:output.body[i].expression.callee.property.name, line:output.body[i].loc.start.line})	
					}
					break;
				default: console.log("Oops something is wrong");
						 return false;

	  		}  
	  	}
	  	return this.output;  
	}
//Parsing for assignment expression and variable declaractions binary expression and updates
	solveForLoop(output){  
	  	let initSegment = "";
	  	let testSegment = "";
	  	let updateSegment ="";
	  	let forStatement ="";

	   	//Parsing init Segment of for structure
	  	switch(output.init.type){
	  		case 'AssignmentExpression':
	  			initSegment = output.init.left.name+" = "+output.init.right.value;
	  		break; 
	  		case 'VariableDeclaration': 
	  			initSegment = "let " + output.init.declarations[0].id.name+" = "+output.init.declarations[0].init.value;
	  		break;
	  		default:
	  				console.log("Oops something is wrong"); 
	  				return false;
	  	}

	  	//Parsing testSegment of for strucutre
	  	testSegment =  output.test.left.name + " " + output.test.operator  + " " +  output.test.right.value;

	  	//Parsing updateSegment of for strucutre
	  	switch(output.update.type){
	  		case 'BinaryExpression':
	  			updateSegment = output.update.left.name +" "+ output.update.operator +" "+output.update.right.value; 
	  		break; 
	  		case 'UpdateExpression': 
	  			updateSegment = output.update.argument.name +" "+output.update.operator; 
	  		break;
	  		/*case 'AssignmentExpression':*/
	  		default:
	  				console.log("Oops something is wrong"); 
	  				return false;
	  	}

	  	//Building for statement

	  	forStatement = "for( "+initSegment+"; "+testSegment+"; "+updateSegment+"){this.parseCode(output.body)}"
	  	eval(forStatement); 
	}

//function that governs movement of player
	expandWalkMethod(methodName, line, times){
	  	switch(methodName){
	  		case 'walkUp':
	  		case 'walkDown':
	  		case 'walkLeft':
	  		case 'walkRight':
	  			if(typeof times !== 'number'){
	  				let errors = this.state.errors;
	  				errors.push({id: (methodName+line), row: line-1, text: "Parameter is incorrect."}) 
	  				this.setState({errors: errors})
	  				return false;
	  			}
		  		for(let w = 0; w < times ;w++){
		  			this.output.push({action:methodName, line:line})
		  		}
		  		break;
	  		case 'jump':
	  			times = times || " ";

	  			times = times.charAt(0).toUpperCase() + times.slice(1);
	  			if(times === "Up" || times === "Down" || times === "Left" || times === "Right"){
	  				this.output.push({action:(methodName+times), line:line})
	  			}else{
	  				let errors = this.state.errors;
	  				errors.push({id: (times+line), row: line-1, text: "Parameter is incorrect."}) 
	  				this.setState({errors: errors})
	  				return false;
	  			}
	  			
	  			 
	  			break;
	  		default:
	  				let errors = this.state.errors;
	  				errors.push({id: methodName, row: line-1, text: "Function name is incorrect."}) 
	  				this.setState({errors: errors})
	  				return false;
	  	}
	}


	renderEditor(){
		return( 
	    	<AceEditor
	    		ref="aceEditor"
	    		showGutter={true}
			  	mode="javascript"
			  	height= "100%"
			  	width= "100%"
			  	theme="monokai"
			  	name="parser" 
			  	onLoad={this.handleOnLoad}
			  	onChange={this.handleOnChange}
			  	onValidate={this.handleOnValidate} 
			  	fontSize={18}
			  	showPrintMargin={false} 
			  	commands={["read"]}
			  	highlightActiveLine={true} 
			   	value={this.props.game.state.code}
			  	setOptions={{
				  	enableBasicAutocompletion: true,
				  	enableLiveAutocompletion: true, 
				  	enableSnippets: true,
				  	showLineNumbers: true,
				  	tabSize: 2,
				  	showPrintMargin: false,
				  	highlightActiveLine:true
				}}
				/>	 
		) 
	}

	renderErrorInPopover(){
		let lines=[]
		for (var i = 0; i < this.state.errors.length; i++) {
			lines.push(this.state.errors[i].row+1);
		}

		lines = lines.filter((elem, pos, arr) => {
	    	return arr.indexOf(elem) === pos;
	  	});

	  	lines = lines.toString(); 
		return(
			<span><b>{lines}</b></span>
		);
	} 

	render(){  
	   	return( 

				<div>
					<SplitPane 	split="horizontal" 
								minSize={window.innerHeight/2} 
								maxSize={window.innerHeight/1.5} 
								onDragFinished={this.handleRefreshEditor()}>
				    	{/*Editor Panel*/}
				    	<div className="portlet w-100">
				    		<div className="row portlet-head" ref ="editorPortlet">
				    			<img alt="" className="icon" src={require('../images/ui/code.svg')}/>
				    			<h4 className="col title">Code Editor</h4>
				    			
				    			<div className="runBtn btnIso">
				    				<a onClick={this.handleClick}>
				    					<img alt="" src={require("../images/ui/play.svg")}/> &nbsp;Run Code
				    				</a>
				    			</div>
				    			
				    		</div>
				    		<div className="row portlet-body splitEditor">
				    			<div className={"col h-100 "+(this.props.isCodeRunning === true? "isCodeRunning":"")}>  
				    			    	{this.renderEditor()}   
				    			</div>
				    		</div>
				    	</div> 

					    {/*Debug Panel*/}
					    <div className="portlet">
					    	<div className="row portlet-head">
					    		<img alt="" className="icon" src={require('../images/ui/terminal.svg')}/>
					    		<h4 className="col title">Console</h4> 
					    	</div>
							<div className="debugger w-100">
								<ul>
		    						{this.uniqueErrors(this.state.errors).map(item => ( 
					                    <React.Fragment key={item.id}> 
					                      	<li><b>Error at line {item.row+1}:</b>&emsp;{item.text}</li>
					                    </React.Fragment>
					                ))}
				                </ul>
							</div>
					    </div>  
					</SplitPane>
					<div className={"popover bs-popover-right "+(this.state.isPopoverVisible===true? "shake":"")}  style={{left: `calc(${this.state.popover.x}px - 1rem)`,
																	   opacity:(this.state.isPopoverVisible===true? 1:0)}}> 
						<div className="arrow" style={{top: "5px"}}>
						</div> 
						<div className="popover-body">
							<p>Something doesn't look good, <br/>
							Have a look at line{this.state.errors.length>1? "s ": " "}
	  	 	 					   {this.renderErrorInPopover()}
	  	 	 				</p> 
						</div>
					</div>
				</div>
	    );
	}
} 


 