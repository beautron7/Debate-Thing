import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Circle.css'

export default class Circle extends Component {
  static propTypes = {
    path:PropTypes.arrayOf(PropTypes.number).isRequired
  }

  // constructor(a,b,c){
  //   super(a,b,c)
  // }

  static onDrop=function (ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("card-url");
    console.log("Droped","Circle",ev.dataTransfer.getData("text/plain"));
    Circle.onDragLeave(ev)
  }
  static onDragOver=function (ev) {
    ev.preventDefault();
    // console.log("Over","Circle",ev);
    ev.target.style.width
    ev.dataTransfer.dropEffect = "link"
  }
  static onDragEnter=function (ev) {
    ev.target.style.width="2em"
    ev.target.style.height="2em"
  }
  static onDragLeave=function (ev) {
    ev.target.style.width="1em"
    ev.target.style.height="1em"
  }
  
  render(){
    const {
      path
    } = this.props

    return (
      <div
        className="circle"
        onDrop={Circle.onDrop}
        onDragOver={Circle.onDragOver}
        onDragEnter={Circle.onDragEnter}
        onDragLeave={Circle.onDragLeave}
      ></div>
    )
  }
}
