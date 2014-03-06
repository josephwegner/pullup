var mongoose = require('mongoose'), Schema = mongoose.Schema;

var systemSchema = new mongoose.Schema({
  db: {
     version: { type: Number, default: 0 },
  }
});

systemSchema.static('getSystem', function(cb) {
  this.findOne(function(err, system) {
  	  if(err) {
  	  	if(typeof(cb) === "function") {
  	  		cb(err);
  	  	}
  	  	return false;
  	  }

	  if(!system) {
	    system = new System({});
	    system.save(cb);
	  } else {
	  	if(typeof(cb) === "function") {
	  		cb(err, system);
	  	}
	  }
  });



  return true;
});

module.exports = System = mongoose.model('system_meta', systemSchema);
