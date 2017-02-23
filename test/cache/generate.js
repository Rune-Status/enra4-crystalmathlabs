// grab output from the live server and save it into a file

const fs = require('fs')
const request = require('request')
const types = require('./cachables')

let cache = {}

process.on('exit', (e) => {
	const json = JSON.stringify(cache)

	// must be sync, otherwise the process will exit since it's the last tick
	fs.writeFileSync(__dirname + '/cache.json', json, 'utf8')
	console.log('success! wrote data for ' + Object.keys(cache).length + ' url\'s.')
})

const endpoints = {
	'rs3': 'https://crystalmathlabs.com/tracker-rs3/api.php',
	'osrs': 'https://crystalmathlabs.com/tracker/api.php'
}

for (const type in types) {
	const tests = types[type]
	for (const test of tests) {
		for (const game in endpoints) {
			const endpoint = endpoints[game]

			let body = '?type=' + type + '&'
			let bodyArr = []

			for (const key in test) {
				const val = test[key]
				bodyArr.push(key + '=' + val)
			}
			body += bodyArr.join('&')
			const url = endpoint + body

			console.log('requesting: ' + url)
			request(url, (error, response, body) => {
				const o = {
					error: error,
					body: body
				}
				cache[url] = o
			})
		}
	}
}
