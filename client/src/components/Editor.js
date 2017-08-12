import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Editor.css'

export default class Editor extends Component {
  static propTypes = {
    shrinkTopMargin:PropTypes.bool,
    shrinkLeftMargin:PropTypes.bool,
    shrinkRightMargin:PropTypes.bool,
  }

  render(){
    const {
      shrinkTopMargin,
      shrinkLeftMargin,
      shrinkRightMargin,
    }=this.props
    var style={
      top: shrinkTopMargin()? '1.8em':'7.8em',
      left: shrinkLeftMargin? '0em':'23%',
      right: shrinkRightMargin? '0em':'23%',
      bottom: '0em',
    }
    return (
      <div id ="editor">
        <div className="circle"></div>
      </div>
    )
  }
}
