import {Point} from './Tree';

export class CardBundle {
  constructor(data){
    this.data=data;
  }

  static Data = class CardPoint extends Point {
    constructor(data){
      super(data);
      this.parent = null;
    }
  }
  
  static EditorComponent = class Card extends Component {
    static FormattingBar = class FormattingBar extends Component {
      render(){
        return (
          <div className="cardHeadFormatingBar">
            <RibbonButton
              icon="?"
              size="lg"
              onClick={this.getFormatting.bind(this)}
              />
            <RibbonButton
              icon={<i className="fa fa-bold fa-2x" />}
              size="lg"
              onClick={scope => document.execCommand("bold")}
              />
            <RibbonButton
              icon={<i className="fa fa-italic fa-2x"></i>}
              size="lg"
              onClick={scope => document.execCommand("italic")}
              />
            <RibbonButton
              icon={<i className="fa fa-underline fa-2x"></i>}
              size="lg"
              onClick={scope => {
                document.execCommand("underline")
              }}
              />
            <RibbonButton
              title="Underline"
              size="lg"
              onClick={scope => {
                FormattingBar.clearFormattingKeepHighlight();
                document.execCommand("underline");
              }}
              />
            <RibbonButton
              title="Emphasis"
              size="lg"
              onClick={scope => {
                FormattingBar.clearFormattingKeepHighlight();
                document.execCommand("underline");
                document.execCommand("bold")
              }}
              />
            <RibbonButton
              size="lg"
              icon={<i className="glyphicon glyphicon-text-size"></i>}
              />
            <RibbonButton
              icon={<img style={{filter:"brightness(0)"}} alt="hilite" src="img/hilite.ico"></img>}
              size="lg"
              onClick={scope=>FormattingBar.highlight()}
              />
            <RibbonButton
              icon={<i className="glyphicon glyphicon-erase"></i>}
              tooltip="Clear Formatting"
              size="lg"
              onClick={scope => {
                FormattingBar.clearFormattingKeepHighlight();
              }}
              />
          </div>
        )
      }

      static highlight(){
        if (document.queryCommandValue("backColor") === "rgb(0, 255, 255)"){
          document.execCommand("backColor",true,"rgba(0,0,0,0)")
        } else {
          document.execCommand("backColor",false,"cyan")
        }
      }

      static clearFormattingKeepHighlight(){
        document.execCommand("bold")
        document.execCommand("underline")
        document.execCommand("italic")
        if(document.queryCommandState("bold")){
          document.execCommand("bold")
        }
        if(document.queryCommandState("underline")){
          document.execCommand("underline")
        }
        if(document.queryCommandState("italic")){
          document.execCommand("italic")
        }
      }
    }

    constructor(props){
      super(props);

      var str = ""; //cant call generatetextdom
      for (var i=0; i < props.data.text.length; i++) {
        str+= props.data.text[i]+"¶ \n"
      }

      data.tag = data.title || "(No Title / Tag)"
      this.condensed = false;

      this.state={
        hideLinebreaks:false,
        mode:"view",
        text:<span>{str}</span>,
      };
    }

    static getFormattingFromComputedStyle(dom){
      var sty = window.getComputedStyle(dom);

      return {
        hilight: sty.backgroundColor !== "rgba(0, 0, 0, 0)",
        bold: sty.fontWeight === "bold",
        ital: sty.fontStyle === "italic",
      }
    }

    static isUnderlined(obj){
      if (obj.constructor === Text) {
        return false
      } else {
        return !!~window.getComputedStyle(obj).textDecoration.indexOf("underline")  
      }
    }

    toggleMode(){
      if(this.state.mode === "view"){
        this.setState({mode:"edit"})
        this.dom.children[0].children[2].style.height="2.75em"
        this.cardBodyDom.contentEditable = true;
        this.cardBodyDom.readonly = false;
      } else {
        this.setState({mode:"view"})
        console.log([this.cardBodyDom.children[0]])
        this.dom.children[0].children[2].style.height="0"//the editbar
        this.cardBodyDom.contentEditable = false;
        this.cardBodyDom.readonly = true
        this.saved_formatting = this.getFormatting()
      }
    }

    handleKey(event){
      var {key, ctrlKey} = event
      console.log("a key was pressed",key,event);

      var allowKey = (
        (
          !~["Delete","Backspace"].indexOf(key) //delete, backspace never ok.
        ) && (
          (
            ["Up","Right","Left","Down"]//allow arrow keys
              .map(x=>"Arrow"+x)
              .indexOf(key) !== -1
          ) || (
            ctrlKey && !~"xv".indexOf(key) //ctrl + anything but x
          ) || (
            ~["Home","End","PageUp","PageDown"].indexOf(key)
          )
        )
      )
      if(allowKey){return}

      if(key==="F9" || key === "F10" || key ==="F12"){//Apply stylesd
        Card.clearFormattingKeepHighlight()
        if(key === "F9" || key === "F10"){//Formatters that underline
          document.execCommand("underline")
        }
        if (key === "F10"){//formatters that bold
          document.execCommand("bold")
        }
        return
      } else if (key === "F11") {
        event.preventDefault()
        Card.highlight()
      }

      event.preventDefault()
      if(key === "Enter"){//mark the card
        var prev_mark = this.cardBodyDom.querySelector('.card-marker')
        prev_mark && prev_mark.remove()
        var sel, range;
        sel = window.getSelection();
        range = sel.getRangeAt(0);
        var el = document.createElement("div")
        range.insertNode(el);
        el.classList.add("card-marker")
        el.textContent=""
      }
    }

    getFormatting(){
      var root = this.cardBodyDom
      var progress = []
      root.childNodes.forEach(traverse)
      console.log(progress)

      function traverse(obj) {
        var is_underlined = Card.isUnderlined(obj);
        if(obj.childNodes.length){
          if(is_underlined) {
            var first_index = progress.length;
            obj.childNodes.forEach(traverse)
            for (var i = first_index; i < progress.length; i++){
              progress[i].sty.underline=true;
            }
          } else {
            obj.childNodes.forEach(traverse);
          }
        } else {
          progress.push({
            length:obj.textContent.length,
            sty: {underline: is_underlined, ...Card.getFormattingFromComputedStyle(obj.parentNode)}
          })
        }
      }

      this.setState({formatting:progress})
    }


    togglePilcrows(){
      this.condensed = !this.condensed
      this.cardBodyDom.style.whiteSpace = this.condensed? "normal":"pre-wrap"
    }

    get formattedYear(){
      var year = "[No Date]"
      try { //date
        function pad(n, width, z) {
          z = z || '0';
          n = n + '';
          return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }
        year = pad(new Date(this.props.data.datePublished).getFullYear()%100,2)
        if (year+"" === "NaN"){
          throw new Error()
        }
      } catch (e) {
        year = "[No Date]"
      }
      return year
    }

    generateTextDom(){
      var str = ""
      for (var i = 0; i < this.props.data.text.length; i++) {
        str+= this.props.data.text[i]+"¶ \n"
      }
      this.setState({text:<span>{str}</span>})
    }

    tagListener(x){
      if (x !== null && x !== undefined){
        x.textContent=this.props.data.tag
        x.addEventListener("input",()=>{
          this.props.data.tag=x.textContent;
        }, false)
      }
    }

    render(){
      return(
        <div draggable="false" ref={x=>this.dom=x} className="card animate-max-height">
          <div className="cardHead">
            <div
              ref={scope => this.tagListener(scope)}
              contentEditable="plaintext-only" className="cardHeadUpper">
            </div>
            <div className="cardHeadLower">
              <div className="cardAuthor">
                {this.props.author} {this.formattedYear}
              </div>
              <div className="cardButtons btn-group">
                <button className="btn btn-sm btn-primary">Quals</button>
                <button className="btn btn-sm btn-primary">Source</button>
                <button
                  onClick={scope => this.toggleMode()}
                  className="btn btn-sm btn-primary"
                >
                  {this.state.mode==="view"? "Edit":"View"}
                </button>
              </div>
            </div>
            <Card.FormattingBar/>
          </div>
          <div
            className="cardBody"
            onPaste={x=>x.preventDefault()}
            onCut={x=>x.preventDefault()}
            onDrop={x=>x.preventDefault()}
            contentEditable={true}
            ref={self => this.cardBodyDom = self}
          >
          </div>
        </div>
      )
    }

    componentDidMount(){
      ReactDOM.render(this.state.text,this.cardBodyDom)
      this.cardBodyDom.addEventListener("keypress",scope=>this.handleKey(scope))
      this.cardBodyDom.addEventListener("keydown",scope=>this.handleKey(scope))
    }
  }

  static NavComponent() {
    return (
      <div
        onClick={x=>this.forceUpdate()}
        className="Endpoint"
        >
        <div className="caret-placeholder"></div>
        <span className="name">
          {props.name}
        </span>
      </div>
    )
  }

  editor(props) {
    return <CardBundle.EditorComponent data={props.data}/>
  }

  nav(props) {
    return <CardBundle.NavComponent data={props.data}/>
  }

};
  //Static reactClass
  //Static navClass