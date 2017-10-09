import Modal from '../components/Modal'
import React from 'react'

function openDB(){
  var remote = electron.remote;
  var path = remote.dialog.showOpenDialog({
    properties: ['openDirectory']
  })[0];
  document.forms.default["newDBpath"].value=path[0]
  window.appStorage.openDB(path)
    .then(database_picker.update)
    .error(function () {console.error("Couldn't open the database")});
}

var database_picker = {
  labels:[],
  hashes:[],
  selected:-1,

  async update(){
    database_picker.labels = [];
    database_picker.hashes = [];
    var data = await window.appStorage.DBlist;
    console.log(data)
    
    for (var i = 0; i < data.length; i++) {
      database_picker.labels[i]=data[i].collectionName
      database_picker.hashes[i]=data[i].collectionID
    }

    var buttons = database_picker.labels.slice().reverse().map((x,i)=>(
      <li><a href="javascript:database_picker.select(${i})">{x}</a></li>
    ))

    ReactDOM.render(
      <div>
        {buttons}
        <li role="separator" className="divider" />
        <li>
          <button>
            <i className="glyphicon glyphicon-open" /> Open Pre-Existing Database
            </button>
          </li>
          <li>
            <button>
              <i className="glyphicon glyphicon-save" /> Create New Database
              </button>
            </li>
          </div>
          ,database_picker.items_dom
        )

  },

  select(i){
    database_picker.button_text.html(database_picker.labels[database_picker.labels.length-1-i])
    document.forms.default["database"].value=i
  },

  submitForm(){
    var database= database_picker.hashes[
      (database_picker.labels.length - 1) -
      database_picker.form["database"].value
    ]
    var data = {
      author: database_picker.form["author"].value,
      datePublished: new Date(database_picker.form.year.value,database_picker.form.month.selectedIndex-1,database_picker.form.day.value),
      dateCaught: new Date(),
      text: database_picker.form["fulltext"].value.split(/\n+/),
      title: database_picker.form["title"].value,
      url: database_picker.form["url"].value,
      keywords: database_picker.form["keywords"].value.split(/\s*,\s*/),
      quals: database_picker.form["quals"].value,
    }
    if(database===""){
      database_picker.form["submit-btn"].innerHTML = ("Please choose a database");
      return
    }
    for (var thing in data) {
      if (data.hasOwnProperty(thing)) {
        if (data[thing] === ""){
          database_picker.form["submit-btn"].innerHTML = ("Please enter a(n) "+thing)
          setTimeout(()=>{
            database_picker.form["submit-btn"].innerHTML = ("Add Card")
          },3000)
          return
        }
      }
    }
    appStorage.addCard(data,database)
  }
}

export default function newCard(){
  new Modal("New Card",
    <form
      ref={x=>{database_picker.form=x}}
      className="X"
      action="#"
    >
      <span className="h1">
        Add a card
      </span>
      <br />
      <br />
      <div className="form-group">
        <label>
          Select database:
        </label>
        <div
          ref={x=>database_picker.dom=x}
          className="database-dropdown dropdown"
        >
          <div className="input-group">
            <button
              className="btn btn-default dropdown-toggle"
              ref={x=>database_picker.button_dom=x}
              type="button"
              id="dropdownMenu1"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span
                ref={x=>database_picker.button_text=x}
                className="text"
              >
                Select Database
              </span>
              <span className="caret" />
            </button>
            <ul
              ref={x=>database_picker.items_dom=x}
              className="dropdown-menu database-dropdown-menu"
              aria-labelledby="dropdownMenu"
            >

            </ul>
          </div>
        </div>
      </div>
      <input
        type="hidden"
        name="database"
        defaultValue
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
        onClick={database_picker.submitForm}
      >
        Add Card
      </button>
    </form>
  )
  database_picker.update()
}
