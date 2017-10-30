import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import './Sidebar.css'

export default class Sidebar extends Component {
  // static propTypes = {
  //   left: PropTypes.bool,
  //   right: PropTypes.bool,
  // }

  constructor(a,b,c){
    super(a,b,c)
    this.state={visibility:true}
  }

  toggleVis(){
    this.setState({visibility:!this.state.visibility})
  }

  render(){
    const {
      left,
      right,
      children,
    } = this.props;

    var className = "side-bar"
    if(left)className+=" left";
    if(right)className+=" right";

    if(this.state.visibility){
      return (
        <div className={className}>
          {children}
        </div>
      )
    }
    return null;
  }
}
