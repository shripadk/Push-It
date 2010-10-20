var PORT = 8080;

var PushIt = require (__dirname + '/../../server/push-it').PushIt,
    fs = require('fs'),
    connect = require('connect');

 try{
   var options = JSON.parse(fs.readFileSync(__dirname+"/options.json"))  
 }catch(e){
   console.error("Could not load the options file!: ", e.toString());
   process.exit()
 }
 

function helloWorld(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('hello world');
}


var server = connect.createServer( 
  connect.staticProvider(__dirname + '/static')
);

server.listen(PORT);
console.log("now connected and listening on "+ PORT);

var pi = new PushIt(server, options);

pi.onConnectionRequest = function(agent){
  console.log(agent.client.request.headers.origin);
  agent.connected();
}

pi.onPublicationRequest = function(channel, agent, message) {
	console.log(channel);
};

var rejectChannel = pi.channel("reject");

rejectChannel.onSubscriptionRequest = function(channel, agent){
  agent.subscriptionDenied(channel, "this is the reject channel");
}


