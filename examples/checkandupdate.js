// checks to see if a user has been checked in the last day
// and if not, update user and get the stats gained during last day
const CML = require('../lib/crystalmethlabs.js');

const meth = new CML();

(async () => {
	const {err, sec} = await meth.lastcheck('lynx titan');
	if (err) {
		console.log(err);
		return;
	}

	const day = 24 * 3600; // a day in seconds
	if (sec > day) {
		const {err: updateError} = await meth.update('lynx titan');
		if (updateError) {
			console.log(updateError);
			return;
		}

		const {err: trackError} = await meth.track('lynx titan');
		if (trackError) {
			console.log(trackError);
		}
	}
})();
