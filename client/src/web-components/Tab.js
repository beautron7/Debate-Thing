import React, {Component} from 'react';
// import PropTypes from 'prop-types';
// import '../web-css/Tab.css'
// import '../web-css/noselect.css'

export default class Tab extends Component {
  // static propTypes = {
  //   name: PropTypes.string.isRequired,
  //   active: PropTypes.bool,
  //   onClick: PropTypes.func,
  // }

  render(){
    const {
      name,
      active,
      onClick,
    } = this.props
    var classes='noselect'

    if (active===true) {
      classes+= 'active '
    }

    return (
      <tab onClick={onClick} className={classes}><span>{name}</span></tab>
    )
  }
}
