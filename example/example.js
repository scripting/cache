const davecache = require ("davecache"); 
const utils = require ("daveutils");

function test () {
	var val = {
		msg: "hooray for holly woo",
		randomNumber: utils.random (0, 10000)
		};
	davecache.set ("a.b.c", val);
	}

davecache.start (undefined, function () {
	setInterval (test, 1000); 
	});
