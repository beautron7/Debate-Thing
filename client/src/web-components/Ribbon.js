import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import Modals from '../web-modals/AllModals'
import '../web-css/Ribbon.css'
import RibbonButton from './RibbonButton'
import RibbonGroup from './RibbonGroup'
import Row from './Row'
import Card from './Card'

window.Modals = Modals
export default class Ribbon extends Component {
  constructor(a,b,c){
    super(a,b,c)
    this.state={paneNumber:0}
  }

  static spools = [
    <spool
      ref={x=>this.dom=x}
      >
      <RibbonGroup title="Open"><buttongroup>
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
      </buttongroup></RibbonGroup>
      <RibbonGroup title ="Save/Send"><buttongroup>
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
      </buttongroup></RibbonGroup>
      <RibbonGroup title="Config"><buttongroup>
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
      </buttongroup></RibbonGroup>
      <RibbonGroup title="Print">
        <buttongroup>
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
        </buttongroup>
      </RibbonGroup>
    </spool>,
    <spool>
      <RibbonGroup title="Format">
        <buttongroup>
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
        </buttongroup>
        <buttongroup>
          <RibbonButton
            icon="F9"
            title={<u>Underline</u>}
            onClick={scope => {
              Card.clearFormattingKeepHighlight();
              document.execCommand("underline")
            }}
          />
          <RibbonButton
            icon="F10"
            title={<b><u>Emphasis</u></b>}
            onClick={scope => {
              Card.clearFormattingKeepHighlight();
              document.execCommand("underline");
              document.execCommand("bold")
            }}
          />
          <RibbonButton
            icon={<span>¶</span>}
            tooltip="Toggle condensed text mode"
            title="Condense All"
          />
        </buttongroup>
        <buttongroup>
          <RibbonButton
            icon="F11"
            title="Highlight"
            onClick={Card.highlight}
          />
          <RibbonButton
            icon="F12"
            title="Clear Formatting"
            onClick={Card.clearFormattingKeepHighlight}
          />
          <RibbonButton
            title="Shrink/Grow Text"
            icon={<i className="glyphicon glyphicon-text-size"></i>}
          />
        </buttongroup>
      </RibbonGroup>
      <RibbonGroup title="Research">
        <buttongroup>
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
        </buttongroup>
      </RibbonGroup>
    </spool>,
    <spool>
      <span>Settings</span>
    </spool>,
    <spool>
      <RibbonGroup title = "Panes">
        <buttongroup>
          <RibbonButton
            icon={<i className="fa fa-search"></i>}
            onClick={x=>window.App.LeftBar.toggleVis()}
            title="Nav"
            />
          <RibbonButton
            icon={<i className="glyphicon glyphicon-book"></i>}
            onClick={x=>window.App.RightBar.toggleVis()}
            title="Research"
            />
        </buttongroup>
      </RibbonGroup>
    </spool>,
  ]

  render(){
    return this.state.paneNumber !== -1? (
      <ribbon className='ribbon'>
        {Ribbon.spools[this.state.paneNumber]}
      </ribbon>
    ):null
  }
}
