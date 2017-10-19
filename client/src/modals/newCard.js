import Modal from '../components/Modal'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Async from '../components/Async'

export default function newCard(){
  new Modal("Add a card",
    <form ref={x=>window.modalForm=x}className="X" action="#">
      <div className="form-group">
        <label>Select database:</label>
        <Async promise={window.appStorage.DBlist} resolved={x=>{
          window.modalDBz = x;
          return <Modal.Picker name="DATABASENAME" items={x.map(x=>x.collectionName)}>
            Select Database
          </Modal.Picker>
        }}>
          <i className="fa fa-spinner fa-pulse"></i>
        </Async>
      </div>
      <div
        className="input-group date-published"
      >
        <label>
          Date Published
        </label>
        <select name="MONTH" className="form-control">
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
          name="DAY"
          type="text"
          className="form-control col-sm-6"
          id="exampleInputAmount"
          placeholder="Day" />
        <input
          name="YEAR"
          type="text"
          className="form-control col-sm-6"
          id="exampleInputAmount"
          placeholder="Year" />
      </div>

      <div className="author input-group">
        <label>Author[s]</label>
        <input
          name="AUTHORS"
          type="text"
          className="form-control"
          placeholder="Doe John, Trump Donald, ..."
          aria-describedby="basic-addon1" />
      </div>

      <div className="quals">
        <label>
          Author Qualifcations
        </label>
        <textarea
          name="QUALS"
          className="form-control col-sm-12"
          rows={3} />
      </div>

      <div className="keywords input-group">
        <label>Keywords</label>
        <input
          name="KEYWORDS"
          type="text"
          className="form-control"
          placeholder="US, China, Neg..."
          aria-describedby="basic-addon1" />
      </div>

      <div className="url input-group">
        <label>URL</label>
        <input
          name="URL"
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
          name="FULLTEXT"
          className="form-control col-sm-12"
          rows={8}
        />
      </div>
      <br />
      <button
        type="button"
        name="submit-btn"
        className="btn btn-primary btn-block"
        onClick={async ()=>{
          var form = window.modalForm
          var databases = {}
          window.modalDBz.forEach((x,i)=>{
            databases[x.collectionName]=x.collectionID;
          })
          databases.indexOf
          database_picker.hashes[database_picker.labels.length - 1 - form["database"].value]
          var data = {
            author: form["author"].value,
            datePublished: new Date(form.year.value, form.month.selectedIndex - 1, form.day.value),
            dateCaught: new Date(),
            text: form["fulltext"].value.split(/\n+/),
            title: form["title"].value,
            url: form["url"].value,
            keywords: form["keywords"].value.split(/\s*,\s*/),
            quals: form["quals"].value,
          }
          if (database === "") {
            form["submit-btn"].innerHTML = ("Please choose a database");
            return
          }
          for (var thing in data) {
            if (data.hasOwnProperty(thing)) {
              if (data[thing] === "") {
                form["submit-btn"].innerHTML = ("Please enter a(n) " + thing)
                setTimeout(() => {
                  form["submit-btn"].innerHTML = ("Add Card")
                }, 3000)
                return
              }
            }
          }
          appStorage.addCard(data, database)
        }}
      >
        Add Card
      </button>
    </form>
  )
  // database_picker.update()
}

// window.database_picker=database_picker
