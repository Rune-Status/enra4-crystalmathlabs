const request = require('request')

const cmlURL = 'https://crystalmathlabs.com/tracker/api.php'

module.exports = class Cml {
	update(user) { // updates cml page for user
		if(typeof user === 'string') {
			let url = cmlURL + '?type=update&player=' + user

			request(url, (error, response, body) => {
				console.log(body)
				/*
					dont know what i should be doing here
					but maybe take care of error values from rest api
				*/
			})
		}
	}

	lastcheck(user, callback) { // returns when user was last checked in seconds
		if(typeof user === 'string') {
			let url = cmlURL + '?type=lastcheck&player=' + user

			request(url, (error, response, body) => {
				body = parseInt(body)
				callback(body)
			})
		}
	}

	lastchange(user, callback) { // returns when user was last changed in seconds
		if(typeof user === 'string') {
			let url = cmlURL + '?type=lastchange&player=' + user

			request(url, (error, response, body) => {
				body = parseInt(body)
				callback(body)
			})
		}
	}
}
