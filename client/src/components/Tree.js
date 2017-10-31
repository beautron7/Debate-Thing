export default class Tree {
  static Node = class Node {
    constructor(data,parent){
      this.data = data;
      this.key = window.qi+"";
      this.parent = parent;
      this.children = [];
    }

    static stdpad = 2
    
    visualize(padding){
      var padding_char = " ".repeat(Node.stdpad*padding)
      var str = (this.data);
      padding_char+=" ".repeat(Node.stdpad);
      for (var i = 0; i < this.children.length; i++) {
        str += "\n"+this.children[i].visualize(padding+1)
      }
      return str.slice(0,-1)
    }

    addNode(node,index){
      node.parent=this
      this.children.splice(
        index,
        0,
        node
      );
    }
  }

  constructor(data){
    var node = new Tree.Node(data);
    this._root = node;
  }
}

export class CardNode extends Tree.Node {
  constructor(data){
    super(data);
    delete this.children;
  }

  visualize(padding){
    return (this.data.title||"no title")+" (Card) "+this.key.slice(0,5)
  }
};

export class SectionNode extends Tree.Node {
  constructor(title){
    super(title)
    this.react=null;
  }
  visualize(padding){
    var str = (this.data+" (section) "+this.key.slice(0,5)+"\n");
    var padding_char = " ".repeat(padding * Tree.Node.stdpad)
    padding_char+=" ".repeat(Tree.Node.stdpad);

    for (var i = 0; i < this.children.length; i++) {
      str += padding_char+this.children[i].visualize(padding+1)+"\n"
    }
    return str.slice(0,-1)
  }
};