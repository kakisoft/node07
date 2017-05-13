const PORT = 1337

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var jade = require('jade');

var index = fs.readFileSync('./index.jade','utf8');
var style = fs.readFileSync('./style.css','utf8');

var datas = [];

var server = http.createServer();
server.on('request',doRequest);
server.listen(PORT);

function doRequest(req, res){
    var path = url.parse(req.url);

    switch(path.pathname){
        case '/':
            var fn = jade.compile(index);

            if(req.method == "POST"){
                var reqBody = '';
                req.on('data', function(data){
                    reqBody += data;
                });
                req.on('end', function(){
                    var form = qs.parse(reqBody);
                    datas.push(form);
                    var tmp = fn({
                        title:"Index Page",
                        msg2:"your data:",
                        form:form,
                        datas:datas
                    });
                    res.setHeader('Content-Type','text/html');
                    res.write(tmp);
                    res.end();
                });
            }else{
                var tmp = fn({
                    title:"Index Page",
                    msg:"enter your data:",
                    form:{myname:'',mail:'',age:''},
                    //form:null,
                    datas:datas
                });
                res.setHeader('Content-Type','text/html')
                res.write(tmp);
                res.end();
            }
            break;
            //ちゃんと末尾に break;書かないと、/style.cssあたりでエラー出て嵌った。
            //  Error: Can't set headers after they are sent.
            //    at ServerResponse.setHeader (_http_outgoing.js:371:11)

        case '/style.css': //
            res.setHeader('Content-Type','text/css');
            res.write(style);
            res.end();
            break;

        case '/favicon.ico':
            break;

        default:
            res.setHeader('Content-Type','text/plain');
            res.write('NO PAGE!');
            res.end();
            break;
    }
}
console.log('Server running at http://127.0.0.1'+PORT)
