function basicFuzz(needle,haystack){
  if(~needle.indexOf("/")){return false}
  for(var i = 0, j = 0; i < haystack.length; i++){
    if(haystack[i] == needle[j]){
      j++
      if(j==needle.length){
        return i-needle.length+1 //1 means perfect match, higher numbers mean looser matches
      }
    }
  }
  return 0;//0 means no match (also it's falsey)
}

function pathFuzz(needle,haystack){
  var stop_at = haystack.lastIndexOf("/"),
      i = haystack.length-1,
      j = needle.length-1;

  while(--i > stop_at)
    if(haystack[i] == needle[j] && --j == -1)
      return {
        match:true,
        pos: i,
        type:2,
        score: false,
      };
  if (j == needle.length-1){
    return {
      match: false,
      pos: -1,
      score: -1,
    }
  }
  while(--i>= 0){
    if(haystack[i] == needle[j] && --j=-1){
      return {
        match:true,
        type: 1,
        pos: i,
        score: haystack.length-i-needle.length
      }
    }
  }
  return {
    match: false,
    pos: -1,
    score: -1,
  }
}

function matchSinglePathObject(needle,path){
  var PM = pathFuzz(needle,path.full)
  if(PM.match){//if weak match, check to see if strong.
    var NM = basicFuzz(needle,path.name);
    if (NM.match) {
      return {
        type:2,
        score: NM.score,
        pos: NM.pos
      }
    } else {
      return {
        type:1,
        score: PM.score,
        pos: PM.pos
      }         //Second number [0-∞] higher is worse, lower is stronger
    }
  } else {
    return {
      type:0,
      score: 0,
      pos: 0,
    }
  }
}

function matchMultiplePathObjects(needle,items){
  needle.replace(/\s/g, '');

  var return_val = {needle:needle,results:[]};
  var results = return_val.results;

  for (var i = 0; i < items.length; i++){
    var result = matchSinglePathObject(needle,items[i])
    if(result.type){
      results.push({item:items[i],match:result})
    }
  }

  results.sort((a,b)=>{
    if(a.match.type==b.match.type){//Are they the same class of score
      if(a.match.score==b.match.score){//Do they have the same subscore?
        return a.item.full.length-b.item.full.length;
        //ok, then prefer the shorter pathed one because less clarification oppertunites for shorter names
      }
      return a.match.score - b.match.score
    }
    return b.match.type - a.match.type
  })
  return return_val
}

var items = [
  {full:"~/neg/af bacropes",name:"afropes"},
  {full:"~/aff/2ac",name:"2ac"},
  {full:"~/aff/2ac_extra/afropes",name:"afropes"},
  {full:"~/aff/2ac_extra/wierdfiles/afropes",name:"afropes"},
  {full:"~/aff/texas_2ac",name:"texas_2ac"},
  {full:"~/aff/2ac_texas",name:"2ac_texas"},
]

console.log(matchMultiplePathObjects("texas",items))//.map(x=>x.item.full);
