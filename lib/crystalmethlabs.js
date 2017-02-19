const request = require('request')
const errorHandling = require('./errorHandling')
const runescape = require('./runescape')

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

				for(let i = 0; i < runescape.skills.length; i++) {
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

	/*

	i have absolutely no clue whats going on here

	recordsOfPlayer(user, callback) {
		if(typeof user === 'string') {
			let url = cmlURL + '?type=recordsofplayer&player=' + user

			request(url, (error, response, body) => {
				callback(body)
			})
		}
	}
	*/

	previousName(user, callback) {
		if(typeof user === 'string') {
			let url = cmlURL + '?type=previousname&player=' + user

			request(url, (error, response, body) => {
				if(body === '-1') {
					body = false
				}

				errorValue = errorHandling(parseInt(body))

				callback(errorValue, body)
			})
		}
	}

	// shows total xp gained by all in any skill
	compTotal(compID, skill, callback) {
		let url = cmlURL + '?type=comptotal&competition=' + compID + '&skill=' + skill

		request(url, (error, response, body) => {
			body = parseInt(body)
			errorValue = errorHandling(body)

			callback(errorValue, body)
		})
	}

	compRankings(compID, skill, callback) {
		let url = cmlURL + '?type=comprankings&competition=' + compID + '&skill=' + skill

		request(url, (error, response, body) => {
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

			callback(comp)
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
			callback(body)
		})
	}

	currentTop(timeperiod, skill, callback) {
		let url = cmlURL + '?type=currenttop&timeperiod=' + timeperiod + '&skill=' + skill

		request(url, (error, response, body) => {
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
