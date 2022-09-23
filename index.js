import * as http from 'http';
import fetch from 'node-fetch';
import * as fs from 'fs';

const sahmRuleMap = new Map();

http.createServer(async function (req, res){
    if(req.url === '/favicon.ico'){
        sendFavicon(res);
    }
    else{
        sendSahmRuleIndex(res);
    }    
}).listen(8081);

function sendFavicon(res){    
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    fs.createReadStream('favicon.ico').pipe(res);
}

async function sendSahmRuleIndex(res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    var isRecessionText = '';
    var divStyle = 'color: white; text-align: center; position:fixed; width:100%; height:100%; top:0px; left:0px; margin-left: auto; margin-right: auto;';
    var h1Style = 'font-size: 30.0vw; margin: 0; position: absolute; top: 50%; left: 50%; -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%);'

    if(/*await recessionCheck()*/true){
        isRecessionText = 'yes.'
        divStyle += 'background-image: url(\'https://cacheblasters.nyc3.digitaloceanspaces.com/thisisfine.webp\'); background-repeat: no-repeat; background-size:100% 100%; -webkit-text-stroke-width: 10px; -webkit-text-stroke-color: black;';
    }
    else{
        isRecessionText = 'no.'
        divStyle += 'background-color: black;';
    }
    var html = `<!DOCTYPE html>
    <head>
    <style>
    a { color: inherit; text-decoration: none;}
    a:hover { color: inherit; text-decoration: none; cursor:pointer; }
    </style>
    </head>
    <body>
    <div style="${divStyle}">
        <h1 style="${h1Style}"><a href="https://fred.stlouisfed.org/series/SAHMREALTIME"/>${isRecessionText}</h1>
    </div>
    </body>
    </html>`;
    res.end(html);
}

async function recessionCheck(){
    var isRecession;
    const now = new Date();
    var dateKey = `${now.getYear()}-${now.getMonth()}-${now.getDay()}-${now.getHours()}`;
    
    if(sahmRuleMap.has(dateKey)){
        return sahmRuleMap.get(dateKey);
    }

    await fetch('https://panopticon.cacheblasters.com/sahm')
    .then((response) => {return response.json();})
    .then(function(json) {
      isRecession = json.isRecession;
      sahmRuleMap.set(dateKey, isRecession);
    });

    return isRecession;
}