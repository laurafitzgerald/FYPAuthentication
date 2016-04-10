var nats = require('nats');
var servers = ['nats://nats.default:4222'];
var nc = nats.connect({'servers': servers});
console.log("Connected to " + nc.currentServer);

var sessiontable = '{ "columns": { "username": "text" ,"timestamp" : "text" , "sessionkey":"text" },"primary": ["sessionkey"], "indexes": ["timestamp, username"]}';
nc.request('data.register.session', sessiontable, function(response){});



//{"username": "", "password": "", "key": ""};
nc.subscribe('session.authenticate', function(msg, reply, sub){
//at the api
//get a request with username and password or session key
//if login create a key and return it
//it validating session check the key has not expired and return the username
//{"fields", [list of columns returned], "filters": ["username='value'"]} is the array part right
console.log("session service - authenticate called");
var obj = JSON.parse(msg);
if(obj.hasOwnProperty('sessionkey')){
	console.log("if called, session key should be sent = " + obj.sessionkey);
	var query = {};
	query.filters = ["sessionkey='"+obj.sessionkey+"'"];
	nc.request('data.query.session', JSON.stringify(query), function(response){

		var sessions = JSON.parse(response);
		if(sessions.length >0){
			nc.publish(reply, sessions[0].username);
		}
		else{
			nc.publish(reply, "");
		}
	});


}else{
	console.log("else called, username and password should be sent");
	console.log(msg);
	nc.request('user.confirm.auth', msg, function(response){
		console.log("response form user.confirm.auth : " + response);
		if(response==""){

			nc.publish(reply, "");
		}else{

			var session = {};
			session.username = obj.username;
			session.sessionkey = (new Date).getTime().toString();
			session.timestamp = new Date().toLocaleString();

			nc.request('data.write.session', JSON.stringify(session), function(response){

				
				nc.publish(reply, session.sessionkey);


			})
		

		}

	});



}



});

