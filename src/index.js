import React from 'react';
import ReactDOM from 'react-dom';
import './css/bootstrap.css';
import './css/index.css';
import './css/fonts.css';
import {Game} from './components/Game';  
import {Dashboard} from './components/Dashboard';
import {Login} from './components/Login'; 
import {Firebase} from './components/Firebase'; 
import {Stats} from './components/Stats'; 

class App extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {  
            level: 0, 
    				flow: "screenLogin",
            topicsListElements: {},
            user: {
                    userName: "",
                    progress:{}

                  },
            levels: [],
            studentList:{},
            attempts:0,
            checkPoint: 1,
	  			} 
         this.database = new Firebase(this);
  }

  componentDidMount(){
      this.database.getLevelList();
      this.database.getStudentList();  
  }

  getDatabase(){
    return this.database;
  }

  renderScreen(){
    switch(this.state.flow){
      case "screenLogin":  return( <Login global={this} />); 
      case "screenLevels":   return(<Dashboard global={this} user={this.state.user} />);
      case "screenGame": return( <Game global={this}  />);  
      case "screenStats": return(<Stats global={this} teacher={this.state.user} studentList={this.state.studentList}/>);
      default:  
    }
  }

  render(){    
    return(  
    	this.renderScreen()
    );
  }
}
 
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
