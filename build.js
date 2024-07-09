const config=require('./config.js');
const {qjs}=require('./util/rem_build.js');
const fs=require('fs');
const path=require('path');
const {minify}=require('./util/minijs')

var d=config.addon_details
var meta=`/*QUIK_ADDON 1|${d.name}|${d.version_code}|${d.version||''}|${d.desc||''}|${d.author||''}|${d.icon||''}|${d.website||''}|${d.update||''}|${d.signature} */`
qjs(config.main,function(code){
    minify(code,{
        toplevel: true
    }).then(function(result){
        fs.writeFileSync(path.join(__dirname,'out/index.js'),meta+'\n'+result.code);
        fs.writeFileSync(path.join(__dirname,'out',d.update),d.version_code);
    })
    
},__dirname)