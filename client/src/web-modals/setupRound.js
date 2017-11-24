import Modal from '../web-components/Modal'
import React from 'react'
// import ReactDOM from 'react-dom'
// import Async from '../web-components/Async'

export default function setupRound() {
  new Modal(
    "Set up Round-Share",
    <div>
      <Modal.HalfButton>
        Use Email
      </Modal.HalfButton>
      <Modal.HalfButton>
        Use EvidenceX (Prepd)
      </Modal.HalfButton>
      <form>
        <Modal.Input
          name="emails"
          friendlyName="Emails of other debaters"
          defaultValue="john@doe.org; jane@doe.org"
        />
      </form>
    </div>
  )
}