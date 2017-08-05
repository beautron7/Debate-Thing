import React, {Component} from 'react';
import PropTypes from 'prop-types';


export default class Searchbar extends Component {
  static propTypes = {
    title: PropTypes.string
  }
  render(){
    const {
      title
    } = this.props

    return (
      <div class="search-bar">
        <div class="input-group col-md-12">
          <input type="text" class="form-control input" placeholder={title}></input>
          <span class="input-group-btn">
            <button class="btn btn-info" type="button">
              <i class="glyphicon glyphicon-search"></i>
            </button>
          </span>
        </div>
      </div>
    )
  }
}
