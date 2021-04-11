var http =  require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

function send404(res){
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.write('Error 404: resurce not fount.');
    res.end();
}

function sendFile(res, filePath, fileContents){
    res.writeHead(
        200,
        {"constent-type": mime.lookup(path.basename(filePath))}
    );
    res.end(fileContents);
}

function serveStatic(res, cache, absPath){
    if(cache[absPath]){
        sendFile(res, absPath, cache[absPath]);
    } else{
        fs.exists(absPath, (exists)=> {
            if(exists){
                fs.readDile(absPath, function(err, data){
                    if(err){
                        send404(res);
                    }
                    else{
                        cache[absPath] = data;
                        sendFile(res, absPath, data);
                    }
                });
            } else {
                send404(res);
            }
        });
    }
}

var server = http.createServer((req, res)=> {
    var filePath = false;
    if(req.url == '/'){
        filePath = 'public/index.html';
    }else{
        filePath = 'public'+req.url;
    }
    var absPath = './' + filePath;
    serveStatic(res, cache, absPath);
});

server.listen(3000, () => {
    console.log('Server listening on port 3000.');
});
