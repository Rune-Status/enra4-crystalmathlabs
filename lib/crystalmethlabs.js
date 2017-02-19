const request = require('request')
const errorHandling = require('./errorHandling')
const runescape = require('./runescape')

const cmlURL = 'https://crystalmathlabs.com/tracker/api.php'

module.exports = class Cml {
	update(user, callback) { // updates cml page for user
		if(typeof user === 'string') {
			let url = cmlURL + '?type=update&player=' + user

			request(url, (error, response, body) => {
				if(body.length === 2) {
					let errorValue = errorHandling(parseInt(body))
				} else {
					let errorValue = null
				}

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
				if(body.length === 2) {
					let errorValue = errorHandling(parseInt(body))
				} else {
					let errorValue = null
				}

				body = parseInt(body)

				callback(errorValue, body)
			})
		}
	}

	lastchange(user, callback) { // returns when user was last changed in seconds
		if(typeof user === 'string') {
			let url = cmlURL + '?type=lastchange&player=' + user

			request(url, (error, response, body) => {
				if(body.length === 2) {
					let errorValue = errorHandling(parseInt(body))
				} else {
					let errorValue = null
				}

				body = parseInt(body)

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

				for(let i = 0; i < runescape.skills.length - 1; i++) {
					// skills.length - 1 because added ehp to runescape skills
					let skillInfo = body[i].split(',')

					stats[runescape.skills[i]] = {
						level: runescape.convertXpToLVL(parseInt(skillInfo[0])),
						xp: parseInt(skillInfo[0]),
						rank: parseInt(skillInfo[1])
					}
				}

				// this request gets timeToMax
				url = cmlURL + '?type=ttm&player=' + user

				request(url, (error, response, body) => {
					stats.ttm = parseInt(body)
				})

				// this request gets timeToMaxRank
				url = cmlURL + '?type=ttmrank&player=' + user

				request(url, (error, response, body) => {
					stats.ttmRank = parseInt(body)
				})

				callback(stats)
			})
		}
	}

	// sees if user exist
	search(user, callback) {
		if(typeof user === 'string') {
			let url = cmlURL + '?type=search&player=' + user

			request(url, (error, response, body) => {
				body = body.split(' ')
				body[0] = parseInt(body[0])
				let errorValue = errorHandling(body[0])

				callback(errorValue, body)
			})
		}
	}

	recordsOfPlayer(user, callback) {
		if(typeof user === 'string') {
			let url = cmlURL + '?type=recordsofplayer&player=' + user

			request(url, (error, response, body) => {
				if(body.length === 2) {
					let errorValue = errorHandling(parseInt(body))
				} else {
					let errorValue = null
				}

				let records = {}
				body = body.split('\n')
				body.pop()

				for(let i = 0; i < body.length; i++) {
					let info = body[i].split(',')
					records[runescape.skills[i]] = {
						day: parseFloat(info[0]),
						week: parseFloat(info[2]),
						month: parseFloat(info[4])
						// ignoring time stuff
					}
				}

				callback(errorValue, records)
			})
		}
	}

	previousName(user, callback) {
		if(typeof user === 'string') {
			let url = cmlURL + '?type=previousname&player=' + user

			request(url, (error, response, body) => {
				if(body === '-1') {
					body = false
				} else if(body.length === 2) {
					let errorValue = errorHandling(parseInt(body))
				} else {
					let errorValue = null
				}

				callback(errorValue, body)
			})
		}
	}

	// shows total xp gained by all in any skill
	compTotal(compID, skill, callback) {
		let url = cmlURL + '?type=comptotal&competition=' + compID + '&skill=' + skill

		request(url, (error, response, body) => {
			if(body.length === 2) {
				let errorValue = errorHandling(parseInt(body))
			} else {
				let errorValue = null
			}

			body = parseInt(body)

			callback(errorValue, body)
		})
	}

	compRankings(compID, skill, callback) {
		let url = cmlURL + '?type=comprankings&competition=' + compID + '&skill=' + skill

		request(url, (error, response, body) => {
			if(body.length === 2) {
				let errorValue = errorHandling(parseInt(body))
			} else {
				let errorValue = null
			}

			let comp = []
			body = body.split('\n')
			body.pop()

			for(let i = 0; i < body.length; i++) {
				let info = body[i].split(',')
				comp.push({
					username: info[0],
					startEHP: parseFloat(info[1]),
					currentEHP: parseFloat(info[2]),
					gainedEHP: parseFloat(info[3])
				})
			}

			callback(errorValue, comp)
		})
	}

	/* object looks like
		{
			timeperiod: ('day' | 'week' | 'month'),
			skill: (skill),
			player: (name)
		}
	*/

	records(obj, callback) {
		let url = cmlURL + '?type=records&timeperiod=' + obj.timeperiod
		url += '&skill=' + obj.skill + '&players=' + obj.player

		request(url, (error, response, body) => {
			if(body.length === 2) {
				let errorValue = errorHandling(parseInt(body))
			} else {
				let errorValue = null
			}

			callback(errorValue, body)
		})
	}

	currentTop(timeperiod, skill, callback) {
		let url = cmlURL + '?type=currenttop&timeperiod=' + timeperiod + '&skill=' + skill

		request(url, (error, response, body) => {
			if(body.length === 2) {
				let errorValue = errorHandling(parseInt(body))
			} else {
				let errorValue = null
			}
			
			let top = []
			body = body.split('\n')
			body.pop()

			for(let i = 0; i < body.length; i++) {
				let info = body[i].split(',')
				top.push({
					username: info[0],
					xp: parseFloat(info[1])
				})
			}

			callback(top)
		})
	}
}
