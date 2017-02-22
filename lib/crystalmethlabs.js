const request = require('request')
const errorHandling = require('./errorHandling')
const osrs = require('./constants').osrs
const rs3 = require('./constants').rs3

module.exports = class Cml {
	constructor(game) {
		if(game === 'rs3') {
			this.game = 'rs3'
			this.cmlURL = 'https://crystalmathlabs.com/tracker-rs3/api.php'
		} else {
			this.game = 'osrs'
			this.cmlURL = 'https://crystalmathlabs.com/tracker/api.php'
		}
	}

	update(user, callback) { // updates cml page for user
		let url = this.cmlURL + '?type=update&player=' + user

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)

			if(callback) { // checks if callback function was provided
				callback(errorValue) // although dont know if most optimal solution
			}
		})
	}

	lastcheck(user, callback) { // returns when user was last checked in seconds
		let url = this.cmlURL + '?type=lastcheck&player=' + user

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)
			body = parseInt(body)

			callback(errorValue, body)
		})
	}

	lastchange(user, callback) { // returns when user was last changed in seconds
		let url = this.cmlURL + '?type=lastchange&player=' + user

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)
			body = parseInt(body)

			callback(errorValue, body)
		})
	}

	stats(user, callback) {
		let errors = []
		let url = this.cmlURL + '?type=stats&player=' + user

		request(url, (error, response, body) => { // need to have an if error thingy
			let firstError = errorHandling(body)

			if(firstError) {
				errors.push(firstError)
			}

			body = body.split('\n')
			let stats = {}
			body.shift()
			body.pop() // now theres only skills left in body
			let skills

			if(this.game === 'osrs') {
				skills = osrs.skills
			} else {
				skills = rs3.skills
			}

			let overallInfo = body[0].split(',')
			stats.overall = {
				xp: parseInt(overallInfo[0]),
				rank: parseInt(overallInfo[1])
			}

			for(let i = 1; i < skills.length - 1; i++) { // i = 1 because stats.overall doesnt have level
				// skills.length - 1 because added ehp to osrs skills
				let skillInfo = body[i].split(',')
				let actualLevel = this.convertXPtoLVL(parseInt(skillInfo[0]), 99)

				stats[skills[i]] = {
					level: actualLevel,
					xp: parseInt(skillInfo[0]),
					rank: parseInt(skillInfo[1])
				}
			}

			// request gets ehp info
			url = this.cmlURL + '?type=virtualhiscoresatplayer&player=' + user + '&page=timeplayed'

			request(url, (error, response, body) => {
				let secondError = errorHandling(body)

				if(secondError) {
					errors.push(secondError)
				}

				body = body.split(',')
				stats.ehp = {}
				stats.ehp.hours = parseFloat(body[2])
				stats.ehp.rank = parseFloat(body[0])

				if(!errors.length > 0) {
					errors = null
				}

				callback(errors, stats)
			})
		})
	}

	ttm(user, callback) {
		let errors = []
		let url = this.cmlURL + '?type=ttm&player=' + user
		let info = {}

		request(url, (error, response, body) => {
			let firstError = errorHandling(body)

			if(firstError) {
				errors.push(firstError)
			}

			info.hours = parseInt(body)
			url = this.cmlURL + '?type=ttmrank&player=' + user

			request(url, (error, response, body) => {
				let secondError = errorHandling(body)

				if(secondError) {
					errors.push(secondError)
				}

				info.rank = parseInt(body)

				if(!errors.length > 0) {
					errors = null
				}

				callback(errors, info)
			})
		})
	}

	// sees if user exist
	search(user, callback) {
		let url = this.cmlURL + '?type=search&player=' + user

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)
			body = body.split(' ')
			body[0] = parseInt(body[0])

			callback(errorValue, body)
		})
	}

	recordsOfPlayer(user, callback) {
		let url = this.cmlURL + '?type=recordsofplayer&player=' + user

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)
			let records = {}
			body = body.split('\n')
			body.pop()
			let skills

			if(this.game === 'osrs') {
				skills = osrs.skills
			} else {
				skills = rs3.skills
			}

			for(let i = 0; i < body.length; i++) {
				let info = body[i].split(',')
				records[skills[i]] = {
					day: parseFloat(info[0]),
					week: parseFloat(info[2]),
					month: parseFloat(info[4])
					// ignoring time stuff
				}
			}

			callback(errorValue, records)
		})
	}

	previousName(user, callback) {
		let url = this.cmlURL + '?type=previousname&player=' + user

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)

			if(body === '-1') {
				errorValue = null
				body = false
			}

			callback(errorValue, body)
		})
	}

	track(user, time, callback) {
		let url = this.cmlURL + '?type=trackehp&player=' + user + '&time=' + time

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)
			body = body.split('\n')
			let stats = {}
			stats.lastchanged = parseInt(body[0])
			body.shift()
			body.pop()
			let skills

			if(this.game === 'osrs') {
				skills = osrs.skills
			} else {
				skills = rs3.skills
			}

			for(let i = 0; i < skills.length - 1; i++) {
				// skills.length - 1 because added ehp to osrs skills
				let skillInfo = body[i].split(',')

				stats[skills[i]] = {
					xp: parseInt(skillInfo[2]),
					rank: parseInt(skillInfo[3]),
					xpGained: parseInt(skillInfo[0]),
					rankGained: parseInt(skillInfo[1]), // negative rank is good
					ehpGained: parseFloat(skillInfo[4])
				}
			}
			// .ehp looks a bit different
			let ehpInfo = body[skills.length - 1].split(',')
			stats.ehp = {
				ehp: parseFloat(ehpInfo[2]),
				ehpGained: parseFloat(ehpInfo[0]),
				rankGained: parseInt(ehpInfo[1])
			}

			callback(errorValue, stats)
		})
	}

	// shows total xp gained by all in any skill
	compTotal(compID, skill, callback) {
		let url = this.cmlURL + '?type=comptotal&competition=' + compID + '&skill=' + skill

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)
			body = parseInt(body)

			callback(errorValue, body)
		})
	}

	compRankings(compID, skill, callback) {
		let url = this.cmlURL + '?type=comprankings&competition=' + compID + '&skill=' + skill

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)
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

	/* obj is to be formatted as
		{
			player: (name),
			skill: (skill),
			timeperiod: ('day' | 'week' | 'month')
		}
	*/

	records(obj, callback) {
		let url = this.cmlURL + '?type=records&timeperiod=' + obj.timeperiod
		url += '&skill=' + obj.skill + '&players=' + obj.player

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)
			body = body.split(',')
			body = parseFloat(body[1])

			callback(errorValue, body)
		})
	}

	currentTop(timeperiod, skill, callback) {
		let url = this.cmlURL + '?type=currenttop&timeperiod=' + timeperiod + '&skill=' + skill

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)
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

			callback(errorValue, top)
		})
	}

	virtualHiscores(user, callback) {
		let errors = []
		let url = this.cmlURL + '?type=virtualhiscoresatplayer&player=' + user + '&page=virtualtotal'
		let info = {}

		request(url, (error, response, body) => {
			let firstError = errorHandling(body)

			if(firstError) {
				errors.push(firstError)
			}

			body = body.split(',')
			info.total = {
				rank: parseInt(body[0]),
				level: parseInt(body[2])
			}

			url = this.cmlURL + '?type=virtualhiscoresatplayer&player=' + user + '&page=recordsheld'

			request(url, (error, response, body) => {
				let secondError = errorHandling(body)

				if(secondError) {
					errors.push(secondError)
				}

				body = body.split(',')
				info.recordsHeld = {
					held: parseInt(body[2]),
					rank: parseInt(body[0])
				}

				url = this.cmlURL + '?type=virtualhiscoresatplayer&player=' + user + '&page=recordsheld'

				request(url, (error, response, body) => {
					let thirdError = errorHandling(body)

					if(thirdError) {
						errors.push(thirdError)
					}

					body = body.split(',')
					info.frontpageCount = {
						count: parseInt(body[2]),
						rank: parseInt(body[0])
					}

					if(!errors.length > 0) {
						errors = null
					}

					callback(errors, info)
				})
			})
		})
	}

	convertXPtoLVL(xp, cap) {
		// very inefficient, couldnt reverse formula
		// for getting the lvl out of xp..(wish i was good at math)
		// shoutout to http://rsdo.net/rsdonline/guides/Experience%20formula.html
		let points = 0

		for(let lvl = 1; lvl <= cap; lvl++) {
			points += Math.floor(lvl + 300 * Math.pow(2, lvl / 7))
			if(Math.floor(points / 4) > xp) {
				return lvl
			}
		}
	}
}
