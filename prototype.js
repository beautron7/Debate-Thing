class Type {
  constructor(name, constraints) {
    var _this = this;//the instance of class `Type`
    _this.handler={};
    _this.name=name;
    _this.constraints=constraints;

    _this.handler = {
      set(target,property,value){
        var valid =
          Type.validateData(
            value,
            this.constraints[property],
          )

        if(valid){

          return true
        } else {
          throw TypeError("no.")
        }
      }
    }

    return class {
      constructor(data){
        if(_this.validateData(data,constraints)){
          return new Proxy(this.data=data,_this.handler)
        } else {
          throw new TypeError(`Invalid data for type ${name}`)
        }
      }
    }
  }

  validateData(data){
    return Type.validateData(data,this.constraints);
  }

  static validateData(data,constraint) {
    if(data instanceof Array){
      if(constraint instanceof Array){
        return data.find(                          //find the first item where
          item => !Type.validateData(item,constraint[0])//validateData returns false
        ) == undefined                             //if you cant find it (undef), data is good.
      } else {
        return false
      }
    } else {//not an array
      try {
        if (data instanceof constraint)return true;//handles most objects.
        if (constraint(data)===data) return true;  //HACK: handles primitives. may raise an error but we're in a try block.
      } catch (e){};
      var keys_in_data = false;
      for (key in data) {
        keys_in_data = true;
        if(!key in constraint || !Type.validateData(data[key],constraint[key])){
          return false
        }
      }
    }
    return keys_in_data //if there are no keys in the data (eg: empty object), then validateData returns false.
  }
}
/*
new Type('Card',{
  author:Person,
  id:String,
  datePublished:Date,
})

card1 = new Card({author:"beau",id:1,datePublished:new Date()})


var Person = new Type({
  picture:url,
  name:string,
  surname:string,
  articles:[[Article]],//array of
  iscool:Boolean,//2 possible values
})

var article

var people = new Accessor({
  type:[Person],
  data:[];
})

from(people).where({name:/.*ea.* /}).select('picture').then() //array of picture urls
from(people).where({name:/.*ea.* /}).select('{picture}').then() //array of objects with picture urls
from(people).where({name:name => name.length % 2}).select('{name,articles:{name}}').then()
from(people).where(person => person.name == person.surname).select("surname")

//
//
// $.from().where().select()
//
//
// class DescriptionChain {
//   constructor(args){
//     if(args) {
//       this.data=args
//     } else {
//       this.data = {}
//     }
//   }
//
//   static addProp(name){
//     DescriptionChain.prototype[name] = function(arg) {
//       return new DescriptionChain({[name]:arg,...this.data})
//     }
//   }
//
//   async select(query){
//     if(!$.sources.contains(this.data.from)) return [];
//     var source = $.sources[this.data.from]
//     if(!this.data.where){
//       this.data.where =()=> true;
//     } else if (this.data.where instanceof String){
//       this.data.where = SchemeToTest(this.data.where)
//     }
//     var entries =
//   }
// }
//
// ['from','where']
//   .forEach(DescriptionChain.addProp);
//
// var $ = new DescriptionChain();
// $.sources = [];
//
//
*/
