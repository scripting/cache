var myVersion = "0.4.0", myProductName = "davecache"; 

const utils = require ("daveutils");
const fs = require ("fs");

exports.start = start; 
exports.get = dbget; 
exports.set = dbset; 
exports.writecache = writecache; 

var config = {
	folder: "data/",
	fileExtension: ".json"
	};

var dbcache = new Object ();

function adrToFilePath (adr) {
	var f = config.folder + utils.replaceAll (adr, ".", "/") + config.fileExtension;
	return (f);
	}
function dbset (adr, val) {
	var ct = 1;
	if (dbcache [adr] !== undefined) {
		ct = dbcache [adr].ct + 1;
		}
	dbcache [adr] = {
		val: val,
		ct: ct,
		fldirty: true,
		when: new Date ()
		};
	}
function dbget (adr, callback) {
	if (dbcache [adr] !== undefined) {
		var obj = dbcache [adr];
		obj.when = new Date ();
		obj.ct++;
		callback (undefined, obj.val);
		}
	else {
		var f = adrToFilePath (adr);
		fs.readFile (f, function (err, data) {
			if (err) {
				callback (err);
				}
			else {
				try {
					var jstruct = JSON.parse (data);
					dbcache [adr] = {
						val: jstruct,
						fldirty: false,
						ct: 1,
						when: new Date ()
						};
					callback (undefined, jstruct);
					}
				catch (err) {
					callback (err);
					}
				}
			});
		}
	}
function writecache () {
	function writeobj (adr) {
		var obj = dbcache [adr];
		var f = adrToFilePath (adr);
		obj.fldirty = false; //we only try to write once
		utils.sureFilePath (f, function () {
			fs.writeFile (f, utils.jsonStringify (obj.val), function (err) {
				obj.err = err;
				console.log ("writeobj: " + utils.jsonStringify (obj));
				});
			});
		}
	for (var x in dbcache) {
		if (dbcache [x].fldirty) {
			writeobj (x);
			}
		}
	}


function everySecond () {
	writecache ();
	}
function start (options, callback) {
	if (options !== undefined) {
		for (var x in options) {
			config [x] = options [x];
			}
		}
	setInterval (everySecond, 1000); 
	if (callback !== undefined) {
		callback ();
		}
	}

