/////////// Dashboard.js
//
//
// handles all code and rendering of the dashboard
// displays player avatar, coins, points, badges, leaderboards
//
//


import React from 'react';
import {Levels} from './Levels';  
import '../css/dashboard.css';
import ReactTooltip from 'react-tooltip';


export  class Dashboard extends React.Component {  
 
  constructor (props) {
      super(props); 
      this.handleLogOut = this.handleLogOut.bind(this); 
  }

  componentDidMount(){
    let checkPoint = (Object.keys(this.props.global.state.user.progress || {}).length+1) || 1; 
    if(this.props.global.state.checkPoint < checkPoint){
      this.props.global.setState({checkPoint: checkPoint});
    }
  }

  // sort function for the scores
  // @param a score a
  // @param b score b
  // @returns    1 if a < b
  //            -1 if a > b
  //             0 if a == b
  sortByScore(a,b) {
    if (a.points < b.points)
      return 1;
    if (a.points > b.points)
      return -1;
    return 0;
  }

  // gets information from the database to set up position in the leaderboard
  // @returns students  students rendered in the leaderboard near the player
  renderLeaderboard(){ 
    let students = []; 
    let rank = 0;

    // get coins/points/etc for the user
    for (let user in this.props.global.state.studentList) {  
        let userData = {};
        userData.userName = user;
        let coins = 0;
        let points = 0;

        for (let score in this.props.global.state.studentList[user].progress) {
          coins += this.props.global.state.studentList[user].progress[score].score;
        }
        points = coins/this.props.global.state.levels.length; 
        userData.points = points;

        students.push(userData);
    }
    //Sort users by points and add rank position
    students.sort(this.sortByScore).forEach(function(obj) { obj.rank = ++rank; });
    return students;
  } 

  // get badges for the user
  // @returns  badges or empty set depending on what the user earned so far
  getBadges(){
     let badges =[];
     let i = 0;
     // look for badges according to the users's progress
     for (let level in  this.props.global.state.user.progress) {
       if( this.props.global.state.user.progress[level].score === 500 &&  this.props.global.state.user.progress[level].attempts === 0){
          let badgesData = {};
          badgesData.id = level;
          badgesData.i = i;
          badgesData.badge = "level"+ this.props.global.state.user.progress[level].level+".svg";
          badges.push(badgesData);
          i++;
       } 
     }
     // sort displayed badges according to the levels
     badges.sort(this.sortByLevel)
     return badges || [];
  }

  // pressing logout button
  handleLogOut(){
    // return to login screen
    window.location.reload();
  }

  // render function for the dashboard
  // @return html code for the content in the dashboard
  render (){  
   
    let progress = ((Object.keys(this.props.user.progress|| []).length/this.props.global.state.levels.length)*100) || 0;
    let coins = 0;
    let points = 0;

    for (let score in this.props.user.progress) {
      coins += this.props.user.progress[score].score;
    }
    points = coins/this.props.global.state.levels.length;
   
    return ( 
      <div className="container-fluid h-100 noOverflow">
        <div className="row h-100">
          <div className="dashboardWrapper col h-100">
            <div className="row">
              <div className="profile">
                <div className="picture">
                  <img alt="" src={require("../images/ui/avatars/kid.svg")} />
                </div> 
              </div>
            </div>

            <div className="row">
              <div className="col name"><h3>{this.props.global.state.user.userName}</h3></div>
            </div>
            <div className="row line">
              <div className="col">Progress</div>
              <div className="col">
                <div className="progress">
                  <div className="progress-bar progress-bar-striped bg-success" style={{width: progress+"%"}}>{progress}%</div>
                </div>
              </div>
            </div>
            <div className="row line" data-tip="your overall performance" data-for="score meaning">
              <div className="col">Score</div>
                <ReactTooltip id="score meaning"/>
              <div className="col">
               {points} pts
              </div>
            </div>
            <div className="row line" data-tip="how well you completed a level" data-for="coins meaning">
              <div className="col">Coins</div>
                <ReactTooltip id="coins meaning"/>
              <div className="col">
               {coins} 
              </div>
            </div>
            <div className="row badgeList line" hidden={this.getBadges().length === 0? true:false}>
              {this.getBadges().map(item => ( 
                  <React.Fragment key={item.id}>
                   <div data-tip={"Earned for finishing level " + item.i + " perfectly."} data-for="badges-text" className="badgeIcon">
                    <img alt="" src={require('../images/ui/badges/'+item.badge)}/>
                  </div>
                      <ReactTooltip id="badges-text"/>
                  </React.Fragment>
              ))}   
            </div> 
            <div className="leaderboard">
              <div className="row">
                <h4>Leaderboard</h4>
              </div>
              <ul> 
                 {this.renderLeaderboard().map(item => ( 
                     <React.Fragment key={item.userName}> 
                        <li className={"row " + (this.props.global.state.user.userName === item.userName? "active":"")}>
                          <div className="col rank">{item.rank}</div>
                          <div className="col userPicture" ><img alt="" src={require("../images/ui/avatars/kid.svg")} /></div>
                          <div className="col name">{item.userName}</div>
                          <div className="col score">{item.points} Pts.</div>  
                        </li> 
                     </React.Fragment>
                 ))}      
              </ul> 
            </div>

          </div> 
          <div className="col h-100 noOverflow"> 
              <div className="row topBar">
                 <div  onClick={this.handleLogOut} className="btnIso" style={{position: "absolute", right: "0"}}>
                   <a >
                     <img alt="" src={require("../images/ui/exit.svg")}/> &nbsp;Logout
                   </a>
                 </div>

              </div>
              <div className="row levelWrapper">
                <Levels global={this.props.global}/>   
              </div>
          </div>
        </div>  
      </div> 
    );
  }
};    


 