import  React, {Component} from 'react';
import ReactDOM from 'react-dom'
import './Modal.css'

export default class Modal {
  constructor(title,body){
    if(Modal.instance){
      throw new Error("Modal already showing, check Modal.alreadyExists before calling the constructor");
    }

    this.dom = document.createElement("div");
    this.dom.classList.add("modal-back")
    document.body.appendChild(this.dom)
    ReactDOM.render(
      <div
        className="modal-back"
        onClick={scope => this.remove()}
      >
        <div
          className="modal-title"
          onClick={ev=>ev.stopPropagation()}
        >
          <span>{title}</span>
          <i
            onClick={scope => this.remove()}
            className="fa fa-times"
          />
        </div>
        <div
          className="modal-body"
          onClick={ev=>ev.stopPropagation()}
        >
          {body}
        </div>
      </div>
    ,this.dom);
    Modal.instance = this;
  }

  remove(){
    Modal.instance = null
    this.dom.remove()
    delete this
  }
}

Modal.alreadyExists = false

Modal.HalfButton =(props)=> (
  <button className="col-xs-11 col-sm-5 btn HalfButton" {...props}>
    {props.children}
  </button>
)

Modal.Input =(props)=>(
  <div class="form-group">
    <label for={props.name}>{props.friendlyName}</label><br/>
    <input class="form-control" type={props.type} name={props.name} placeholder={props.defaultValue}></input>
  </div>
)
