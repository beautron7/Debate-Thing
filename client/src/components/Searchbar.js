import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Searchbar.css'

export default class Searchbar extends Component {
  static propTypes = {
    title: PropTypes.string
  }

  render(){
    const {
      title
    } = this.props

    this.DOM = undefined;

    return (
      <div className="search-bar" ref={self => {this.DOM=self}}>
        <div className="input-group col-md-12">
          <input type="text" ref={self => this.textDOM=self} className="form-control input" placeholder={title}></input>
          <span className="input-group-btn">
            <button className="btn btn-info" onClick={console.log(this)} type="button">
              <i className="glyphicon glyphicon-search"></i>
            </button>
          </span>
        </div>
      </div>
    )
  }
}
