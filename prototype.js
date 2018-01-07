//FROM users WHERE {} SELECT {}

class Type {
  constructor(constraints) {
    return class __TypeInstance__ extends Proxy {
      constructor(data){

      }
    }
  }

  function validateData(data,constraint) {
    if(data instanceof Array){
      if(constraint instanceof Array){
        return !data.find(item => !validateData(item,constraint[0]))
      } else {
        return false
      }
    } else {
      try {
        if (data instanceof constraint)return true;
      } catch (e){};
      var invalid = true;
      for (key in data) {
        invalid = false;
        if(!key in constraint || !validateData(data[key],constraint[key])){
          return false
        }
      }
    }
    return !invalid
  }
}

const Card = new Type({
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

from(people).where({name:/.*ea.*/}).select('picture').then() //array of picture urls
from(people).where({name:/.*ea.*/}).select('{picture}').then() //array of objects with picture urls
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
