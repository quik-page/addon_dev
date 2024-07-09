const http=require('http');
const config=require('./config.js');
const {qjs}=require('./util/rem.js');

http.createServer((req,res)=>{
    var u=new URL('http://127.0.0.1:'+config.port+req.url);
    if(u.pathname=='/'){
        res.setHeader('Content-Type','text/html;charset=utf-8')
        res.writeHead(200);
        res.end('<p>QUIK 2.0，焕新归来！</p>')
    }else if(u.pathname=='/index.js'){
        res.setHeader('Content-Type','application/javascript;charset=utf-8')
        res.writeHead(200);
        qjs(config.main,function(code){
            res.end(code)
        },__dirname)
    }else{
        res.setHeader('Content-Type','text/html;charset=utf-8')
        res.writeHead(404);
        res.end('<p>404</p>')
    }
    
}).listen(config.port,()=>{
    console.log('开发端口已打开，请粘贴到开发者端口：\n\thttp://127.0.0.1:'+config.port+'/');
})