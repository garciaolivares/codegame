/////////// Login.js
//
//
// handles login for students and teachers
//
//

import React from 'react';

import '../css/login.css';
 
export class Login extends React.Component{
	constructor(props) { 
	    super(props);
	    this.state = {
	    	isNewUser: false,
	    	role: "",
	    	error:"",
	    }; 
	    this.handleTypeUser = this.handleTypeUser.bind(this); 
	    this.handleRole = this.handleRole.bind(this); 
	}

	handleSubmit(e){
		e.preventDefault();

		//Grant Access
		let component = this;
		if(this.isNewUser){ 
			this.props.global.database.createUser(this.user.value, this.pass.value, this.state.role, this );
		}

		setTimeout(function(){
			if(component.state.role === "teacher"){
				component.props.global.database.logTeacher(component.user.value, component.pass.value, component); 
			}else if(component.state.role === "student"){ 
				component.props.global.database.logStudent(component.user.value, component.pass.value, component); 
			}
		},1000) 	
	} 

	// grand access according to user
	// teacher see the statistics while students can play the game
	// @param 	user 	either teacher or student
	grantAccess(user){  
		this.props.global.setState({user:user}) 
		if(this.state.role === "teacher"){ 
			this.props.global.setState({flow:"screenStats"}); 
			this.props.global.database.getStudentList();
		}else if(this.state.role === "student"){
			this.props.global.setState({flow:"screenLevels"}); 
			this.props.global.database.suscribeUser(user.userName);
		} 
	}

	// deny access for wrong user name or password
	denyAccess(){
		this.setState({error: "User Name or Password is incorrect"});
		this.user.value="";
		this.pass.value=""; 
		this.user.focus();
	}

	handleTypeUser() { 
    	this.setState({isNewUser: !this.state.isNewUser});
  	}

	handleRole(role) {
    	this.setState({role: role});
  	}

  	// render function for the login
	// @returns html code for the login screen
	render(){    
	   	return( 
	    	<div className="container-fluid loginWrapper">
	    	    <div className="row h-100">
	    	        <div className="col-md-12 h-100">
	    	            <div className="well login-box"> 
	    	            	<div className="role" hidden={this.state.role ===""? false:true}>
	    	            		<div className="btn btn-login-submit student" onClick={()=>this.handleRole("student")}>
	    	            			<img alt=""  src={require('../images/ui/student.svg')}/><span>I'm a Student</span>
	    	            		</div>
	    	            		<div className="btn btn-login-submit teacher" onClick={()=>this.handleRole("teacher")}>
	    	            			<img alt=""  src={require('../images/ui/teacher.svg')}/><span>I'm a Teacher</span>
	    	            		</div>
	    	            	</div>
	    	                <form onSubmit={this.handleSubmit.bind(this)} hidden={this.state.role ===""? true:false}>
	    	                    <legend>Login</legend>
	    	                    <div className="form-group">
	    	                        <label>Username</label>
	    	                        <input placeholder="Username" type="text" className="form-control"  ref={ user => this.user = user }/>
	    	                    </div>
	    	                    <div className="form-group">
	    	                        <label>Password</label>
	    	                        <input  placeholder="Password" type="password" className="form-control"  ref={ pass => this.pass = pass }/>
	    	                    </div>
	    	                    <div className="form-check">
	    	                        <input type="checkbox" className="form-check-input" onChange={this.handleTypeUser}  ref={ isNewUser => this.isNewUser = this.state.isNewUser }/>
	    	                        <label  className="form-check-label">I am a new user</label>
	    	                    </div>
	    	                    <div className="invalid-feedback" style={{display: "block"}}>{this.state.error}</div>
	    	                    <div className="form-group text-center"> 
	    	                        <input type="submit" className="btn btn-login-submit" value={this.state.isNewUser === true? "Sign In": "Log In"}  />
	    	                    </div>
	    	                </form>
	    	            </div> 
	    	        </div>
	    	    </div>
	    	</div>
	    );
	}
}