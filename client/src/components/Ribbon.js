import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import './Ribbon.css'
import RibbonButton from './RibbonButton.js'
import ButtonGroup from './ButtonGroup.js'
import RibbonGroup from './RibbonGroup.js'
import Row from './Row.js'
export default class Ribbon extends Component {

  constructor(a,b,c){
    super(a,b,c)

    Ribbon.spools = [
      <div>
        <RibbonGroup title="Open">
        </RibbonGroup>
      </div>,
      <div>
        <span>Edit</span>
      </div>,
      <div>
        <span>Settings</span>
          <RibbonGroup title="Open">
            <ButtonGroup>
                <RibbonButton
                  title="Open"
                  icon={<i className="glyphicon glyphicon-open-file"></i>}
                  size="md"
                />
                <RibbonButton
                  title="Save"
                  icon={<i className="glyphicon glyphicon-save-file"></i>}
                  size="md"
                />
                <RibbonButton
                  title="4"
                  icon={<i className="glyphicon glyphicon-save-file"></i>}
                  size="md"
                />
            </ButtonGroup>
            <ButtonGroup>
              <Row>
                <RibbonButton
                  title="Open"
                  icon={<i className="glyphicon glyphicon-open-file"></i>}
                  size="md"
                />
                <RibbonButton
                  title="Save"
                  icon={<i className="glyphicon glyphicon-save-file"></i>}
                  size="md"
                />
              </Row>
              <Row>
                <RibbonButton
                  title="Open"
                  icon={<i className="glyphicon glyphicon-open-file"></i>}
                  size="md"
                />
                <RibbonButton
                  title="Save"
                  icon={<i className="glyphicon glyphicon-save-file"></i>}
                  size="md"
                />
              </Row>
              <Row>
                <RibbonButton
                  title="4"
                  icon={<i className="glyphicon glyphicon-save-file"></i>}
                  size="md"
                  />
              </Row>
            </ButtonGroup>
            <ButtonGroup>
              <Row>
                <RibbonButton
                  title="Open"
                  icon={<i className="glyphicon glyphicon-open-file"></i>}
                  size="md"
                />
                <RibbonButton
                  title="Save"
                  icon={<i className="glyphicon glyphicon-save-file"></i>}
                  size="md"
                />
              </Row>
              <Row>
                <RibbonButton
                  title="4"
                  icon={<i className="glyphicon glyphicon-save-file"></i>}
                  size="md"
                  />
              </Row>
            </ButtonGroup>
            <ButtonGroup>
              <Row>
                <RibbonButton
                  title="Open"
                  icon={<i className="glyphicon glyphicon-open-file"></i>}
                  size="md"
                />
                <RibbonButton
                  title="Save"
                  icon={<i className="glyphicon glyphicon-save-file"></i>}
                  size="md"
                />
              </Row>
            </ButtonGroup>
            <ButtonGroup>
                <RibbonButton
                  title="Open"
                  icon={<i className="glyphicon glyphicon-open-file"></i>}
                  size="md"
                />
                <RibbonButton
                  title="Save"
                  icon={<i className="glyphicon glyphicon-save-file"></i>}
                  size="md"
                />
                <RibbonButton
                  title="4"
                  icon={<i className="glyphicon glyphicon-save-file"></i>}
                  size="md"
                />
            </ButtonGroup>
          </RibbonGroup>
      </div>,
      <div>

          <RibbonButton
            icon={<i className="fa fa-search"></i>}
            onClick={x=>window.App.leftBar.toggleVis()}
            title="Nav"
          />
          <RibbonButton
            icon={<i className="glyphicon glyphicon-book"></i>}
            onClick={x=>window.App.rightBar.toggleVis()}
            title="Research"
          />
      </div>,
    ]
  }

  get show(){
    if (typeof window.App.Tabbar === "undefined" || window.App.Tabbar === null)
      return true
    return  window.App.Tabbar.paneNumber !== -1
  }

  render(){
    return this.show? (
      <div className='ribbon'>
        {Ribbon.spools[window.App.Tabbar.paneNumber]}
      </div>
    ):null
  }
}
