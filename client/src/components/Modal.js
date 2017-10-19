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

Modal.Dropdown = class Dropdown extends Component{
  constructor(props){
    super(props);
    this.visibility=false
    document.body.addEventListener("click", scope => this.hide, false)    
  }

  render(){
    var items = this.props.items.map((x,i)=>(<li key={i}>{x}</li>))
    return (
      <div
        className="dropdown"
      >
        <div
          className="dropdown-btn"
          onClick={scope => this.toggle()}
        >
          {this.props.children}
        </div>
        <ul
          onClick={scope => this.hide()}
          style={{
            visibility: this.visibility ?
              "visible" : "hidden"
          }}
        >
          {items}
        </ul>
      </div>
    )
  }
  toggle(){
    this.visibility = !this.visibility
    this.forceUpdate()
  }
  hide(){
    if(this.visibility){this.toggle()}
  }
}

Modal.Picker = class Picker extends Modal.Dropdown {
  constructor(...args){
    super(...args);
    this.selection=-1
  }

  render(){
    var items = this.props.items.map((x,i)=>(
      <li
        key={i}
        onClick={scope=>this.select(i)}
      >{x}</li>
     ))

    var hiddenInput = <select
      name={this.props.name}
      type="hidden"
      className="hidden"
      ref={x=> this.hiddenInput=x}
    >
      {this.props.items.map((x,i)=>(<option key={i}>{x}</option>))}
    </select>

    return(
      <div
      className = "dropdown"
      >
        {hiddenInput}
        <div
          className="dropdown-btn"
          onClick={scope => this.toggle()}
        >
          {this.selection==-1?
            <div>
              {this.props.children}
              <span className="caret"></span>
            </div>:
            this.props.items[this.selection]
          }
      </div>
        <ul
          onClick={scope => this.hide()}
          style={{
            visibility: this.visibility ?
              "visible" : "hidden"
          }}
        >
          {items}
        </ul>
      </div>
    )
  }

  select(x){
    if(0 <= x && x < this.props.items.length){
      this.selection = x;
      this.hiddenInput.selectedIndex = x;
    }
  }
}