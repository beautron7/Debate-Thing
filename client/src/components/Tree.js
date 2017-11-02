export class Tree {
  constructor(data){
    var node = new Node(data);
    this._root = node;
  }
}

export class Point {
  constructor(data){
    this.data = data;
    this.key = window.qi;
  }
}

export class Node extends Point {
  constructor(data,parent){
    super(data)
    this.parent = parent;
    this.children = [];
  }

  addChildNode(node,index){
    node.parent=this
    this.children.splice(
      index,
      0,
      node
    );
  }
}

export class CardPoint extends Point {
  constructor(data){
    super(data);
    this.parent = null;
  }
};

export class SectionNode extends Node {
  constructor(title){
    super(title)
  }
};