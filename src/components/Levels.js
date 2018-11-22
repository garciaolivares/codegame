/////////// Levels.js
//
//
// handles functions in connection with maps and levels of the game
//


import React from 'react';
import '../css/levelThumbnail.css';


// creates thumbnails for the levels in the overview page
class LevelThumbnail extends React.Component{ 
  constructor (props) {
    super(props); 
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {  
    this.props.global.setState({level:this.props.level}); 
    this.props.global.setState({topicsListElements:this.props.topicsListElements})
    this.props.global.setState({flow:"screenGame"});
    this.props.global.setState({grid:this.props.grid});
  }



  // render function for the thumbnails
  render () {   
    return (
      <div id={"level"+this.props.level} className={"levelThumbnail "+  (this.props.unlocked === true? "lockedLevel":"") }>
        <div className="level-header" onClick={this.handleClick}>
          <div className="col title">
            <p><b>{this.props.title}</b> <br/> {this.props.description } </p>
            <img className="completed" alt="" src={require('../images/ui/star.svg')} hidden={ (this.props.unlocked === true || this.props.level === this.props.global.state.checkPoint-1)? true:false }/> 
          </div> 
        </div>
        <div className="row level-image"> 
           <img alt="" src={require('../images/maps/'+this.props.map)} onClick={this.handleClick}/>
        </div>
        <div className="locked" hidden={this.props.unlocked === false? true:false }>
        </div>
      </div>
    )
  }
} 

  
// handling of the levels itself
export  class Levels extends React.Component {

 
  componentDidMount(){

    let checkPoint = (Object.keys(this.props.global.state.user.progress || {}).length) || 1; 
    console.log(checkPoint)

    let index = document.getElementById("level"+(checkPoint-1)); 
    this.refs.levelWrapperScroll.scrollLeft = index.getBoundingClientRect().left;
  }

  // render function for a chosen level
  render (){   
    return ( 
      <div className="container-fluid h-100 noOverflow">  
          <div  className='levelWrapper row h-100' style={{backgroundImage: `url(${require('../images/backgrounds/backgroud_purple.svg')})`}}> 
              <div ref="levelWrapperScroll" id="levelWrapperScroll" className="col carousel h-100">
                {this.props.global.state.levels.map(item => ( 
                  <React.Fragment key={item.id}>  
                 <LevelThumbnail 
                   global={this.props.global}
                   level = {item.id}
                   map={item.map}
                   background={require("../images/backgrounds/"+item.background)}
                   title = {item.title}
                   description = {item.description}
                   topicsListElements = {item.topics}
                   grid={item.grid}
                   wrapper = {this}
                   unlocked = {(item.id < this.props.global.state.checkPoint? false:true)} 
                 />

                  </React.Fragment>
                ))} 
              </div>  
          </div>           
        </div> 
    );
  }
};    



 