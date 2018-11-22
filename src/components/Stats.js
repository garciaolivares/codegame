/////////// Stats.js
//
//
// handles and displays statistics of players
//
//

import React from 'react';
import Trend from 'react-trend';
import '../css/leaderboard.css';


export  class Stats extends React.Component {  
 
  constructor (props) {
      super(props);
      this.state = {  
                activeUser: {
                userName: "",
                points: 0,
                rank: -1
               },
            } 
      this.handleActiveUser = this.handleActiveUser.bind(this);
      this.handleLogOut = this.handleLogOut.bind(this); 
  }

  //logout, return to login screen
  handleLogOut(){ 
    window.location.reload();
  }

  componentDidMount(){ 
    this.setState({activeUser: this.renderLeaderboard()[0] || {userName: "", points: 0, rank: -1 } }) 
  }

  handleActiveUser(user){
    let activeUser = this.props.global.state.studentList[user];
    activeUser.userName = user;
    this.setState({activeUser: activeUser}) 
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

    // sort function for levels
    // @param a level a
    // @param b level b
    // @returns    -1 if a < b
    //             1 if a > b
    //             0 if a == b
  sortByLevel(a,b) {
    if (a.level < b.level)
      return -1;
    if (a.level > b.level)
      return 1;
    return 0;
  }


    // gets information from the database to set up position in the leaderboard
    // @returns students  list of students sorted by their score
  renderLeaderboard(){ 
    let students = []; 
    let rank = 0;
    for (let user in this.props.global.state.studentList) {  
        let userData = {};
        userData.userName = user;
        let coins = 0;
        let points = 0;
        userData.progress = this.props.global.state.studentList[user].progress;

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

  // renders chart with amount of attempts students needed to finish a levels
  // @returns html code to render the chart
  renderAttemptsChart(){
    let attempts = [];
    let levelsCompleted =[]; 
    //convert objects of objects into array of objects 
    for (let level in  this.state.activeUser.progress) {
      levelsCompleted.push( this.state.activeUser.progress[level])
    }

   levelsCompleted.sort(this.sortByLevel).map(function(level){ attempts.push(level.attempts) }) 
   if(attempts.length === 0){
      return <h4 className="warning">No data available</h4>
   }

   if(attempts.length === 1){
      attempts.push(0)
      attempts.reverse();
   } 

    return  (<Trend           
               autoDraw
               autoDrawDuration={3000}
               autoDrawEasing="ease-out"
               data= {attempts}
               gradient={['#1feaea', '#ffd200', '#f72047']}
               radius={2.7}
               strokeWidth={0.9}
               strokeLinecap={'round'}/>
             );
  }

    // renders chart with overall performance of a student
    // @returns html code to render the chart
  renderPerformanceChart(){
    let score = [0];
    let levelsCompleted =[]; 
    //convert objects of objects into array of objects 
    for (let level in  this.state.activeUser.progress) {
      levelsCompleted.push( this.state.activeUser.progress[level])
    }

   levelsCompleted.sort(this.sortByLevel).map(function(level){ score.push(level.score) }) 
   if(score.length === 0){
      return <h4 className="warning">No data available</h4>
   }

   if(score.length === 1){
      score.push(score[0]);
   }  
    return  (<Trend
                autoDraw
                autoDrawDuration={3000}
                autoDrawEasing="ease-out"
                data={score}
                gradient={['#f72047', '#ffd200', '#1feaea']}
                radius={2.7}
                strokeWidth={0.9}
                strokeLinecap={'round'}
              />
             );
  }

  // calculates the progress of a student
  // @returns list of completed levels or an empty set
  studentProgress(){ 
     let levelsCompleted =[]; 
     //convert objects of objects into array of objects 
     for (let level in  this.state.activeUser.progress) {
       let levelData = this.state.activeUser.progress[level];
       levelData.id = level;
       levelsCompleted.push(levelData)
     }

    levelsCompleted.sort(this.sortByLevel)
    return levelsCompleted || [];
  }

  // get earned badges for a student
  // @returns list of completed levels or an empty set
  getBadges(){
     let levelsCompleted =[];
     for (let level in  this.state.activeUser.progress) {
       if(this.state.activeUser.progress[level].score === 500  &&  this.state.activeUser.progress[level].attempts === 0){
          let badgesData = {};
          badgesData.id = level;
          badgesData.badge = "level"+this.state.activeUser.progress[level].level+".svg";
          levelsCompleted.push(badgesData) 
       } 
     } 
     levelsCompleted.sort(this.sortByLevel)
     return levelsCompleted || [];
  }

  // render function for the statistics page
  // @returns html code to render the page
  render(){   
    return ( 
      <div className="container-fluid h-100 noOverflow statsMainWrapper">
        <div className="row topBar">
          <div className="userName"><h4>{this.props.global.state.user.userName}</h4></div>
          <div  onClick={this.handleLogOut} className="btnIso float-right">
            <a >
              <img alt="" src={require("../images/ui/exit.svg")}/> &nbsp;Logout
            </a>
          </div>
        </div>
        <div className="row statsWrapper">
            <div className="topic-list h-100 col-sm-12 col-md-4 leaderboard">
              <div className="title-header">
                <img alt="" src={require('../images/ui/agenda.svg')}/>
                <h4 className="">
                  Leaderboard
                </h4> 
              </div>
              <ul className="list-group"> 
                 {this.renderLeaderboard().map(item => ( 
                     <React.Fragment key={item.userName}> 
                        <li className={"list-group-item row "+ (this.state.activeUser.userName === item.userName? "active":"")} onClick={() => this.handleActiveUser(item.userName)}>
                          <div className="col rank">{item.rank}</div>
                          <div className="col userPicture" ><img alt="" src={require("../images/ui/avatars/kid.svg")} /></div>
                          <div className="col name">{item.userName}</div>
                          <div className="col score">{item.points} Pts.</div> 
                          <div className="col info">
                          <div className="col statsPicture"><img alt="" src={require("../images/ui/stats.svg")} /></div>
                          </div>
                        </li> 
                     </React.Fragment>
                 ))}      
              </ul>  
            </div>
            <div className="topic-content h-100 col-sm-12 col-md-8 stats">
                    <h3 className="">{this.state.activeUser.userName}</h3>
                    <hr/>
                    <div className="row">
                      <div className="col"  style={{paddingRight: "15px"}}>
                          <div className="title">
                            <h4>Performance Per Levels</h4>
                          </div>
                          {this.renderPerformanceChart()}
                      </div> 
                      <div className="col" style={{paddingLeft: "15px"}}>
                          <div className="title">
                            <h4>Attempts Per Levels</h4>
                          </div>
                          {this.renderAttemptsChart()}
                      </div>
                    </div>
                    <div className="row progressChart">
                        <div className="col" style={{paddingRight: "15px"}}>
                            <div className="title">
                              <h4>Current Progress</h4>
                            </div>
                            
                            <div className="table-responsive" hidden={this.studentProgress().length === 0? true:false}>
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th scope="col">Level</th>
                                    <th scope="col">Score</th>
                                    <th scope="col">Attempts</th>
                                  </tr>
                                </thead>
                                <tbody> 
                                    {this.studentProgress().map(item => ( 
                                        <React.Fragment key={item.id}> 
                                          <tr>
                                            <th scope="row">{item.level}</th>
                                            <th>{item.score}</th>
                                            <th>{item.attempts}</th> 
                                          </tr>
                                        </React.Fragment>
                                    ))}   
                                </tbody>
                              </table>
                            </div> 
                            <h4 className="warning" hidden={this.studentProgress().length === 0? false:true} >No data available</h4>
                        </div> 
                        <div className="col" style={{paddingLeft: "15px"}}>
                          <div className="title">
                            <h4>Badges</h4>
                          </div>
                          <div className="row badgeList" hidden={this.getBadges().length === 0? true:false}>
                              {this.getBadges().map(item => ( 
                                  <React.Fragment key={item.id}> 
                                   <div className="badgeIcon">
                                    <img alt="" src={require('../images/ui/badges/'+item.badge)}/>
                                  </div>
                                  </React.Fragment>
                              ))}  
                          </div>
                          <h4 className="warning" hidden={this.getBadges().length === 0? false:true} >No Badges</h4>
                        </div>
                    </div>
            </div> 
        </div>  
      </div> 
    );
  }
};    