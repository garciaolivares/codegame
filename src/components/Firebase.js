/////////// Firebase.js
//
//
// handles the connection to the real-time database called firebase
// more information about firebase: https://firebase.google.com/
//
//

import firebase from 'firebase';

// config to access firebase
var config = {
  apiKey: "AIzaSyB0iXtXrQXXQmMwaeeERPHYgj_5ML81NwY",
  authDomain: "codinggame-92aca.firebaseapp.com",
  databaseURL: "https://codinggame-92aca.firebaseio.com",
  projectId: "codinggame-92aca",
  storageBucket: "",
  messagingSenderId: "784209960982"
};

export class Firebase {
  	constructor(rootGame) {
  		this.root = rootGame;
    	this.fireDB = firebase.initializeApp(config); 
	} 

	// creates a user in the database
	// @param userName	name of the user
	// @param password  password of the user
	// @param role		role of the user, either teacher or student
	// @param component
	createUser(userName,password,role, component){
		if(role === "teacher"){
			this.fireDB.database().ref('teachers/'+userName).set({
			  password: password,  
			});
		}else{
			this.fireDB.database().ref('users/'+userName).set({
			  password: password,  
			});
		}
	}

	// get list of all levels from database
	getLevelList(){  
		let component = this;
	    this.fireDB.database().ref('levels').on('value', function(snapshot) { 
	     	component.root.setState({levels: snapshot.val()}) 
	    }); 
	}

	// handle student login
	// @param userName 	name of the user
	// @param password	corresponding password
	// @param component
	logStudent(userName, password, component){
  		// no access for users without a username or password
		if(userName === "" || password ===""){
			component.denyAccess();
			return
		}

		//otherwise check if user exists and if password is correct to grant access
	    this.fireDB.database().ref('users/'+userName).once('value').then(function(snapshot) { 
	     	let user = snapshot.val() || {password: ""};   

	     	if(user.password.toString() === password.toString() && user.password !== "" && password !== ""){
	    		user.userName = userName;
	     		component.grantAccess(user);  
	     	}else{
	     		component.denyAccess();
	     	} 
	    }); 
	}

	// look up progress data of a user
	// @param userName name of the user
	suscribeUser(userName){
		let component = this;
		this.fireDB.database().ref('users/'+userName).on('value', function(snapshot) {
			let user = snapshot.val();
			user.userName = userName;

			for(let level in user.progress){
				user.progress[level].id= level;
			}

		 	component.root.setState({user:user})
		}); 
	}

    // handle teacher login
    // @param userName 	name of the user
    // @param password	corresponding password
    // @param component
	logTeacher(userName , password, component){
        // no access for users without a username or password
		if(userName === "" || password ===""){
			component.denyAccess();
			return
		}

        //otherwise check if user exists and if password is correct to grant access
	    this.fireDB.database().ref('teachers/'+userName).once('value').then(function(snapshot) {
	    	let user = snapshot.val() || {password: ""};  
	    	if(user.password.toString() === password.toString() && user.password !== "" && password !== ""){
	    		user.userName = userName;
	    		component.grantAccess(user); 	
	    	}else{
	    		component.denyAccess();
	    	}
	    }); 
	}  

	// gets a list of students
	getStudentList(){
		let component = this;  
		this.fireDB.database().ref('users').on('value', function(snapshot) { 
		     component.root.setState({studentList: snapshot.val()})
		});
	}

	// update database with progress from a user
	// @param userName	name of the user
	// @param attempts	amount of attempts of a level
	// @param level		current level in int
	// @param score		score of the user for a level
	// @param hasFullScore 	bool if user earned all points for a level
	updateUserProgress(userName, attempts, level, score, hasFullScore){
		this.fireDB.database().ref('users/' + userName+'/progress/level'+level).set({
		  attempts: attempts, 
		  level: level,
		  score : score,
		  hasFullScore: hasFullScore
		});
	}

}