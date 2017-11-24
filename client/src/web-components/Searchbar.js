import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../web-css/Searchbar.css'

export default class Searchbar extends Component {
  static propTypes = {
    title: PropTypes.string,
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
  }

  get text(){
    return this.textDOM.value;
  }

  render(){
    const title = this.props.title;
    this.onSubmit = this.props.onSubmit? (()=>{this.props.onSubmit(this.text)}):(()=>{});
    this.onChange = this.props.onChange? (()=>{this.props.onChange(this.text)}):(()=>{});

    this.DOM = undefined;
    this.textDOM = undefined;

    return (
      <div className="search-bar-container">
        <div className="search-bar" ref={self => {this.DOM=self}}>
          <div className="input-group">
            <input type="text" onChange={this.onChange} ref={self => this.textDOM=self} className="form-control input" placeholder={title}></input>
            <span className="input-group-btn">
              <button className="btn btn-info" onClick={this.onSubmit} type="button">
                <i className="glyphicon glyphicon-search"></i>
              </button>
            </span>
          </div>
        </div>
      </div>
    )
  }
}
