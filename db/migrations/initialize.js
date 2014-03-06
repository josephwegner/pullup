/**
 * This is the migration file. You can do whatever you like here, but you MUST export a run function
 * The run function is called with two parameters - a connected mongoose instance, and a callback
 * When you're done with the migration, please call that function. 
 * The callback expects a single paramter to be passed: error
 * If there is an error, pass it
 * If there isn't an error, just send back null.  Please.
**/

exports.run = function(mongoose, cb) {
	console.log("Doing initialization migration!");
	cb(null);
}