import Modal from '../components/Modal'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Async from '../components/Async'

export default function newCard(){
  new Modal("New Card",
    <form className="X" action="#">
      <span className="h1">Add a card</span>
      <br />
      <br />
      <div className="form-group">
        <label>Select database:</label>
        <div className="database-dropdown dropdown">
          <div className="input-group">
            <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
              <span className="text">Select Database</span>
              <span className="caret"></span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu">
              <Async
                promise={new Promise(()=>{})}
                pending={<li><i className="fa fa-spinner fa-pulse fa-fw"></i></li>}
              />
              <li role="separator" className="divider"></li>
              <li><a href="#" onclick="openDB()"><i className="glyphicon glyphicon-open"></i> Open Pre-Existing Database</a></li>
              <li><a href="#" onclick="newDB.show()"><i className="glyphicon glyphicon-save"></i> Create New Database</a></li>
            </ul>
          </div>
        </div>
      </div>
      <input
        type="hidden"
        name="database"
        defaultValue=""
      />
      <br />
      <div
        className="input-group date-published"
      >
        <label>
          Date Published
        </label>
        <select name="month" className="form-control">
          <option>Month:</option>
          <option>January</option>
          <option>Febuary</option>
          <option>March</option>
          <option>April</option>
          <option>May</option>
          <option>June</option>
          <option>July</option>
          <option>August</option>
          <option>September</option>
          <option>October</option>
          <option>November</option>
          <option>December</option>
        </select>
        <input
          name="day"
          type="text"
          className="form-control col-sm-6"
          id="exampleInputAmount"
          placeholder="Day" />
        <input
          name="year"
          type="text"
          className="form-control col-sm-6"
          id="exampleInputAmount"
          placeholder="Year" />
      </div>
      <br />
      <div className="author input-group">
        <label>Author[s]</label>
        <input
          name="author"
          type="text"
          className="form-control"
          placeholder="Doe John, Trump Donald, ..."
          aria-describedby="basic-addon1" />
      </div>
      <br />
      <div className="quals">
        <label>
          Author Qualifcations
        </label>
        <textarea
          name="quals"
          className="form-control col-sm-12"
          rows={3} />
      </div>
      <br />
      <div className="keywords input-group">
        <label>Keywords</label>
        <input
          name="keywords"
          type="text"
          className="form-control"
          placeholder="US, China, Neg..."
          aria-describedby="basic-addon1" />
      </div>
      <br />
      <div className="url input-group">
        <label>URL</label>
        <input
          name="url"
          type="url"
          className="form-control"
          placeholder="www.example.com"
          aria-describedby="basic-addon1" />
      </div>
      <br />
      <div className="full-text">
        <label>
          Full text
        </label>
        <textarea
          name="fulltext"
          className="form-control col-sm-12"
          rows={8}
        />
      </div>
      <br />
      <button
        type="button"
        name="submit-btn"
        className="btn btn-primary btn-block"
      >
        Add Card
      </button>
    </form>
  )
  // database_picker.update()
}

// window.database_picker=database_picker
