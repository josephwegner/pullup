/**
 * This is where database migrations live.
 * Please put your migrations in reverse numerical order, so that the newest migrations live on top.
 *
 * As a description of the fields:
 *	version: The version number of the database. Just increment by 1 every time. 
 *		Sub versions (x.x or x.x.x) will just add unnecessary complexity. Integers only.
 *	description: Just a simple sentence explaining what your migration does. It's not used for anything
 *		other than logging, but it will make this list more readable
 *	migration: This is the actual file that contains the migration code.
 *		PLEASE store your migrations in /db/migrations. Your migrations file MUST export a run function.
 *		The run function will be called when the migration is run. It will be passed a callback function
 *		The callback should be called with a single parameter - error.  So, like, callback("this is an error");
 *		If there is no error, please return null. So like, callback(null);
 *		You can look at initialize.js for a simple example.
 *
 *
 *
 * PLEASE do your best to keep this file clean. This will grow exponentially over time, and in order to keep the
 * rest of us sane, it needs to stay somewhat readable.
**/

var migrations = exports.migrations = [
    {
        version: 1,
        description: "This is just an initialization migration. It doesn't actually do anything.",
        migration: require(__dirname+"/migrations/initialize.js")
    },
    {
        version: 2,
        description: "This is just an initialization migration. It doesn't actually do anything.",
        migration: require(__dirname+"/migrations/initialize.js")
    }
]


/**
 * Please stop editing now. This stuff is the actual code that makes migrations happen.
 * If you're just adding a new migration, there is no reason to edit below this line
**/

exports.runMigrationsSince = function(currentVersion, cb) {
	var migrationsToDo = [];

	for(var i=migrations.length - 1; i >= 0; i--) {
		if(migrations[i].version <= currentVersion) {
		  break;
		}

		migrationsToDo.splice(0, 0, migrations[i]);
	}

	console.log("Running "+migrationsToDo.length+" database migrations");

	var max = migrationsToDo.length;
	//we need this is a first-class variable, so that it can reference itself.  This, my friend, is async recursion.
	var migrationDone = function(err, newVersion) {
		if(err) {
			console.log("Migration error... Canceling the rest of the migrations");
			if(typeof(cb) === "function") {
				cb(err, currentVersion);
			}
		} else {
			currentVersion = newVersion;

			if(migrationsToDo.length) {
				runMigration(migrationsToDo.shift(), migrationDone);
			} else {
				console.log("Migrations done.");
				if(typeof(cb) === "function") {
					cb(null, currentVersion);
				}
			}
		}
	}

	runMigration(migrationsToDo.shift(), migrationDone);
}

var runMigration = exports.runMigration = function(migration, cb) {
	console.log("Migration to db version "+migration.version);
	console.log("Migration: " + migration.description);

	migration.migration.run(function(err) {
		if(err) {
			if(typeof(cb) === "function") {
				cb(err);
			}
		} else {
			if(typeof(cb) === "function") {
				cb(null, migration.version);
			}
		}
	})
}
