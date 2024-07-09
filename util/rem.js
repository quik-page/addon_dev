const path=require('path');
const fs=require('fs');

var reg = /_REQUIRE_\s*\(.*?\)/g;
var cache = {};
var qjs = function (src, cb, rootPath) {
  if (src[0] === '.' && rootPath) {
    src = path.join(rootPath, src);
  }
  var code=fs.readFileSync(src).toString();
  if(src.lastIndexOf('.js')==src.length-3){
    ijs(code, function (code) {
      cache[src] = code;
      cb(code, src);
    }, src)
  }else{
    cache[src] = code;
    cb(code, src);
  }
}
var ijs = function (code, cb, rootPath) {
  var bcbs = [];
  var matches = code.match(reg);
  if (matches) {
    matches.forEach(function (item, index) {
      var url=eval(item.substring(item.indexOf('(')+1,item.lastIndexOf(')')));
      if(cache[url]){
        if(url.lastIndexOf('.js')==url.length-3||url.lastIndexOf('.json')==url.length-5){
          code=code.replace(item,cache[url]);
        }else{
          code=code.replace(item,zhuanyi(cache[url]));
        }
      }else{
        bcbs.push(new Promise(function(r,j){
          qjs(url,function(codes){
            if(url.lastIndexOf('.js')==url.length-3||url.lastIndexOf('.json')==url.length-5){
              code=code.replace(item,codes);
            }else{
              code=code.replace(item,zhuanyi(codes));
            }
            r();
          },path.dirname(rootPath))
        }));
          
      }
    })
    if (bcbs.length == 0) {
      cb(code);
    } else {
      Promise.all(bcbs).then(function () {
        cb(code);
      })
    }
  } else {
    cb(code);
  }
}

function zhuanyi(code){
  return "\""+code.replace(/"/g,'\\"').replace(/\r\n/g,'\\n').replace(/\n/g,'\\n').replace(/\t/g,"\\t")+"\"";
}


module.exports={
    qjs
}