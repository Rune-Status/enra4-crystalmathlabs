// checks to see if a user has been checked in the last day
// and if not, update user and get the stats gained during last day

const CML = require('../lib/crystalmethlabs')
const meth = new CML()

meth.lastcheck('lynx titan', (err, sec) => {
	const day = 24 * 360 // a day in seconds

	if (sec > day) {
		meth.update('lynx titan', err => {
			meth.track('lynx titan', day, (err, stats) => {
				console.log(stats)
			})
		})
	} else {
		console.log('lynx titan has recently been updated.')
	}
})
