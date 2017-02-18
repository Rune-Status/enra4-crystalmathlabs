const request = require('request')
const errorHandling = require('./errorHandling')

const cmlURL = 'https://crystalmathlabs.com/tracker/api.php'

module.exports = class Cml {
	update(user, callback) { // updates cml page for user
		if(typeof user === 'string') {
			let url = cmlURL + '?type=update&player=' + user

			request(url, (error, response, body) => {
				body = parseInt(body)
				let errorValue = errorHandling(body)

				if(callback) { // checks if callback function was provided
					callback(errorValue) // although dont know if most optimal solution
				}
			})
		}
	}

	lastcheck(user, callback) { // returns when user was last checked in seconds
		if(typeof user === 'string') {
			let url = cmlURL + '?type=lastcheck&player=' + user

			request(url, (error, response, body) => {
				body = parseInt(body)
				let errorValue = errorHandling(body)

				callback(errorValue, body)
			})
		}
	}

	lastchange(user, callback) { // returns when user was last changed in seconds
		if(typeof user === 'string') {
			let url = cmlURL + '?type=lastchange&player=' + user

			request(url, (error, response, body) => {
				body = parseInt(body)
				let errorValue = errorHandling(body)

				callback(errorValue, body)
			})
		}
	}
}
