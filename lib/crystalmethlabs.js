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

	stats(user, callback) {
		if(typeof user === 'string') {
			let url = cmlURL + '?type=stats&player=' + user

			request(url, (error, response, body) => { // need to have an if error thingy
				body = body.split('\n')
				let stats = {}
				stats.lastchanged = parseInt(body[0])
				body.shift()
				body.pop() // now theres only skills left in body

				let skills = [ // probably move this into other file later
					'overall',
					'attack',
					'defence',
					'strength',
					'hitpoints',
					'ranged',
					'prayer',
					'magic',
					'cooking',
					'woodcutting',
					'fletching',
					'fishing',
					'firemaking',
					'crafting',
					'smithing',
					'mining',
					'herblore',
					'agility',
					'thieving',
					'slayer',
					'farming',
					'runecrafting',
					'hunter',
					'construction'
				]

				for(let i = 0; i < skills.length; i++) {
					let skillInfo = body[i].split(',')

					stats[skills[i]] = {
						'xp': parseInt(skillInfo[0]),
						'rank': parseInt(skillInfo[1])
					}
					// need to get level too
				}

				callback(skills)
			})
		}
	}

	/*
		maybe add both ttm and ttmrank and similar
		too the stats object and only under the stats method
	*/

	timeToMax(user, callback) {
		if(typeof user === 'string') {
			let url = cmlURL + '?type=ttm&player=' + user

			request(url, (error, response, body) => {
				body = parseInt(body)
				let errorValue = errorHandling(body)

				callback(errorValue, body)
			})
		}
	}

	timeToMaxRank(user, callback) {
		if(typeof user === 'string') {
			let url = cmlURL + '?type=ttmrank&player=' + user

			request(url, (error, response, body) => {
				body = parseInt(body)
				console.log(body)
				let errorValue = errorHandling(body)

				callback(errorValue, body)
			})
		}
	}
}
