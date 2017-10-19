import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import Modals from '../modals/AllModals'
import Modal from './Modal'
import './Ribbon.css'
import RibbonButton from './RibbonButton'
import ButtonGroup from './ButtonGroup'
import RibbonGroup from './RibbonGroup'
import Row from './Row'

window.Modals = Modals
export default class Ribbon extends Component {
  constructor(a,b,c){
    super(a,b,c)

    Ribbon.spools = [
      <div
        ref={x=>this.dom=x}
      >
        <RibbonGroup title="Open"><ButtonGroup>
          <RibbonButton
            title="Open file"
            icon={<i className="glyphicon glyphicon-floppy-open"></i>}
            size="md"
            tooltip="Open a file from the filesystem"
          />
          <RibbonButton
            title="Open from USB"
            icon={<i className="fa fa-usb"></i>}
            size="md"
            tooltip="Open the most recently modififed file on the usb drive"
          />
          <RibbonButton
            title="Open from box"
            icon={<i className="fa fa-cloud-download"></i>}
            size="md"
            tooltip="Open the most recently uploaded speech from the in-round airbox"
          />
        </ButtonGroup></RibbonGroup>
        <RibbonGroup title ="Save/Send"><ButtonGroup>
          <Row>
            <RibbonButton
              title="Save File"
              icon={<i className="glyphicon glyphicon-floppy-disk"></i>}
              size="md"
              tooltip="Save the file for use with %DEBATE_APP%."
            />
            <RibbonButton
              title="Save as"
              icon={<i className="glyphicon glyphicon-floppy-save"></i>}
              size="md"
              tooltip="Save the file for use with %DEBATE_APP%."
            />
          </Row>
          <Row>
            <RibbonButton
              title="USB"
              icon={<i className="fa fa-usb"></i>}
              size="md"
              tooltip="Save the file, a PDF copy, and a HTML copy to the root of the flash drive"
            />
            <RibbonButton
              title="Email"
              icon={<i className="fa fa-paper-plane-o"></i>}
              size="md"
              tooltip="Send the current document via email. Recipients can be set by clicking 'Configure Round'"
            />
          </Row>
          <Row>
            <RibbonButton
              title="Upload to box"
              icon={<i className="fa fa-cloud-upload"></i>}
              size="md"
              tooltip="Upload the current file to this round's box"
            />
          </Row>
        </ButtonGroup></RibbonGroup>
        <RibbonGroup title="Config"><ButtonGroup>
          <RibbonButton
            title="Set up Round"
            icon={<i className="fa fa-wrench"></i>}
            onClick={Modals["setupRound"]}
            size="md"
          />
          <RibbonButton
            title="Change ID"
            icon={<i className="fa fa-user"></i>}
            size="md"
          />
        </ButtonGroup></RibbonGroup>
        <RibbonGroup title="Print">
          <ButtonGroup>
            <RibbonButton
              title="Print"
              icon={<i className="fa fa-print"></i>}
              size="md"
            />
            <RibbonButton
              title="Save HTML"
              icon={<i className="fa fa-chrome"></i>}
              size="md"
            />
            <RibbonButton
              title="Save PDF"
              icon={<i className="fa fa-file-pdf-o"></i>}
              size="md"
            />
          </ButtonGroup>
        </RibbonGroup>
      </div>,
      <div>
        <RibbonGroup title="Format">
          <ButtonGroup>
            <RibbonButton
              icon={<i className="fa fa-bold" />}
              onClick={scope => document.execCommand("bold")}
            />
            <RibbonButton
              icon={<i className="fa fa-italic"></i>}
              onClick={scope => document.execCommand("italic")}
            />
            <RibbonButton
              icon={<i className="fa fa-underline"></i>}
              onClick={scope => {
                document.execCommand("underline")
              }}
            />
          </ButtonGroup>
          <ButtonGroup>
            <RibbonButton
              icon="F9"
              title={<u>Underline</u>}
            />
            <RibbonButton
              icon="F10"
              title={<b><u>Emphasis</u></b>}
            />
            <RibbonButton
              icon={<span>¶</span>}
              tooltip="Toggle condensed text mode"
              title="Condense All"
            />
          </ButtonGroup>
          <ButtonGroup>
            <RibbonButton
              icon="F11"
              title="Highlight"
            />
            <RibbonButton
              icon="F12"
              title="Clear Formatting"
            />
            <RibbonButton
              title="Shrink/Grow Text"
              icon={<i className="glyphicon glyphicon-text-size"></i>}
            />
          </ButtonGroup>
        </RibbonGroup>
        <RibbonGroup title="Research">
          <ButtonGroup>
            <RibbonButton
              title="Add Card"
              icon={<i className="fa fa-file-text-o"></i>}
              size="md"
              onClick={Modals["newCard"]}
            />
            <RibbonButton
              title="Open Database"
              icon={<i className="glyphicon glyphicon-open-file"></i>}
              size="md"
            />
            <RibbonButton
              title="New Database"
              icon={<i className="glyphicon glyphicon-save-file"></i>}
              size="md"
            />
          </ButtonGroup>
        </RibbonGroup>
      </div>,
      <div>
        <span>Settings</span>
      </div>,
      <div>
        <RibbonGroup title = "Panes">
          <ButtonGroup>
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
          </ButtonGroup>
        </RibbonGroup>
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
