import Modal from '../components/Modal'
import React from 'react'
import Async from '../components/Async'
var self = {};
export default function newCard(){
  self.modal = new Modal("Add a card",
    <form ref={x=>self.modalForm=x}className="X" action="#">
      <div className="form-group">
        <label>Select database:</label>
        <Async promise={window.appStorage.DBlist} resolved={x=>{
          self.databases = x;
          return <Modal.Picker
            name="database"
            items={x.map(x=>x.collectionName)}
            ref={x=>self.dbPicker=x}
          >
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
        <select name="month" className="form-control">
          <option>Month:</option>
          <option>01 - January</option>
          <option>02 - Febuary</option>
          <option>03 - March</option>
          <option>04 - April</option>
          <option>05 - May</option>
          <option>06 - June</option>
          <option>07 - July</option>
          <option>08 - August</option>
          <option>09 - September</option>
          <option>10 - October</option>
          <option>11 - November</option>
          <option>12 - December</option>
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

      <div className="author input-group">
        <label>Author[s]</label>
        <input
          name="author"
          type="text"
          className="form-control"
          placeholder="Doe John, Trump Donald, ..."
          aria-describedby="basic-addon1" />
      </div>

      <div className="title input-group">
        <label>Title</label>
        <input
          name="title"
          type="text"
          className="form-control"
          placeholder="Global warming is real."
          aria-describedby="basic-addon1" />
      </div>

      <div className="quals">
        <label>
          Author Qualifcations
        </label>
        <textarea
          name="quals"
          className="form-control col-sm-12"
          rows={3} />
      </div>

      <div className="keywords input-group">
        <label>Keywords</label>
        <input
          name="keywords"
          type="text"
          className="form-control"
          placeholder="US, China, Neg..."
          aria-describedby="basic-addon1" />
      </div>

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
          rows={20}
        />
      </div>
      <br />
      <button
        type="button"
        name="submit-btn"
        className="btn btn-primary btn-block"
        onClick={submitForm}
      >
        Add Card
      </button>
    </form>
  )
}
function submitForm(){
  var form = self.modalForm;

  if (self.dbPicker.selected === -1) {
    form["submit-btn"].innerHTML = ("Please choose a database");
    setTimeout(() => {
      form["submit-btn"].innerHTML = ("Add Card")
    }, 3000)
    return
  }

  var database = self.databases[self.dbPicker.selection].collectionID
  var data = {
    author: form["author"].value,
    datePublished: new Date(form.year.value, form.month.selectedIndex - 1, form.day.value),
    dateCaught: new Date(),
    text: form["fulltext"].value.split(/\n+/),//CHECK
    title: form["title"].value,
    url: form["url"].value,
    keywords: form["keywords"].value.split(/\s*,?\s+/),
    quals: form["quals"].value,
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
  var card_added_and_received = 
    window.appStorage.addCard(data, database)
      .then(x=> window.appStorage.getRecentCards(10))
  card_added_and_received.then(data=>window.App.cardFrame.updateData(data,0))
  card_added_and_received.then(self.modal.close)
}
// window.database_picker=database_picker
