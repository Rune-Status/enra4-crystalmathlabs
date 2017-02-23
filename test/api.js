const fs = require('fs')

if (!fs.existsSync(__dirname + '/cache/cache.json')) {
	console.log('do \'npm run cache-gen\' before running the tests!')
	process.exit(1)
}

const cache = require('./cache/cache.json')

module.exports = (url, cb) => {
	const r = cache[url]

	if(r === undefined) {
		console.log('missing data for url ' + url)
	}

	cb(r.error, null, r.body)
}
