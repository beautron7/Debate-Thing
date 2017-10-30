export default class Tree {
  static Node = class Node {
    constructor(data,parent){
      this.data = data;
      this.key = window.qi;
      this.parent = parent;
      this.children = [];
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

Tree.Node.CardNode = class CardNode extends Tree.Node {
  constructor(data){
    super(data);
  }
};

Tree.Node.SectionNode = class SectionNode extends Tree.Node {
  constructor(title){
    super(title)
  }
};