// zie package.json for header size https://github.com/cloudfoundry/nodejs-buildpack/issues/176 => atm unused
const https = require('https');
//const http = require('http');
 const fs = require('fs');
var os = require( 'os' );
const path = require('path');

const { parse } = require('querystring');

const options = {
  key: fs.readFileSync('testkey.pem'),
  cert: fs.readFileSync('test.crt')//cert.pem
};
 
 
 
const directoryPath = path.join(__dirname, 'static');

 var port = 8010;
 var ip= "127.0.0.1";
 require('dns').lookup(require('os').hostname(), function (err, add, fam) {
 // console.log('addr: '+add);
  ip = add; // if netwerk allows it - Windows  Firewall - https://stackoverflow.com/questions/5489956/how-could-others-on-a-local-network-access-my-nodejs-app-while-its-running-on/5490033
 	console.log("HTTPS server started at https://"+ip+":" + port.toString());
	
	launchServer();
 
});
 
 
function launchServer(){
https.createServer(options, function (req, res) { 
  if (req.url === '/') {//REF: https://stackoverflow.com/questions/4720343/loading-basic-html-in-node-js
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream('index.html').pipe(res);
    } 
	 
  else{  
  fs.readFile(__dirname + req.url, function (err,data) {//REF:https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
  
  }
  
}).listen(port,"0.0.0.0");}
