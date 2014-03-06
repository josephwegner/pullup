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
