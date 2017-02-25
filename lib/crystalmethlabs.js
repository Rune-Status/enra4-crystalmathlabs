let request = require('request')
const errorHandling = require('./errorHandling')
const osrs = require('./constants').osrs
const rs3 = require('./constants').rs3

module.exports = class Cml {
	constructor(game) {
		if(game === 'rs3') {
			this.game = 'rs3'
			this.skills = rs3.skills
			this.cmlURL = 'https://crystalmathlabs.com/tracker-rs3/api.php'
		} else {
			this.game = 'osrs'
			this.skills = osrs.skills
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

			if(!errorValue) {
				body = parseInt(body)

				callback(errorValue, body)
			} else {
				callback(errorValue)
			}
		})
	}

	lastchange(user, callback) { // returns when user was last changed in seconds
		let url = this.cmlURL + '?type=lastchange&player=' + user

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)

			if(!errorValue) {
				body = parseInt(body)

				callback(errorValue, body)
			} else {
				callback(errorValue)
			}
		})
	}

	stats(user, callback) {
		let url = this.cmlURL + '?type=stats&player=' + user

		request(url, (error, response, body) => { // need to have an if error thingy
			let errorValue = errorHandling(body)

			if(!errorValue) {
				body = body.split('\n')
				let stats = {}
				body.shift()
				body.pop() // now theres only skills left in body

				let overallInfo = body[0].split(',')
				stats.overall = {
					level: 0,
					xp: parseInt(overallInfo[0]),
					rank: parseInt(overallInfo[1])
				}

				for(let i = 1; i < this.skills.length - 1; i++) { // i = 1 because stats.overall doesnt have level
					// skills.length - 1 because added ehp to osrs skills
					let skillInfo = body[i].split(',')
					let actualLevel = this.convertXPtoLVL(parseInt(skillInfo[0]), 99)

					stats[this.skills[i]] = {
						level: actualLevel,
						xp: parseInt(skillInfo[0]),
						rank: parseInt(skillInfo[1])
					}

					stats.overall.level += actualLevel
				}

				// request gets ehp info
				url = this.cmlURL + '?type=virtualhiscoresatplayer&player=' + user + '&page=timeplayed'

				request(url, (error, response, body) => {
					errorValue = errorHandling(body)

					if(!errorValue) {
						body = body.split(',')
						stats.ehp = {
							hours: parseFloat(body[2]),
							rank: parseFloat(body[0])
						}

						callback(errorValue, stats)
					} else {
						callback(errorValue)
					}
				})
			} else {
				callback(errorValue)
			}
		})
	}

	ttm(user, callback) {
		let url = this.cmlURL + '?type=ttm&player=' + user
		let info = {}

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)

			if(!errorValue) {
				info.hours = parseInt(body)
				url = this.cmlURL + '?type=ttmrank&player=' + user

				request(url, (error, response, body) => {
					errorValue = errorHandling(body)

					if(!errorValue) {
						info.rank = parseInt(body)

						callback(errorValue, info)
					} else {
						callback(errorValue)
					}
				})
			} else {
				callback(errorValue)
			}
		})
	}

	// sees if user exist
	search(user, callback) {
		let url = this.cmlURL + '?type=search&player=' + user

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)

			if(!errorValue) {
				callback(errorValue, true)
			} else {
				callback(errorValue, false)
			}
		})
	}

	recordsOfPlayer(user, callback) {
		let url = this.cmlURL + '?type=recordsofplayer&player=' + user

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)

			if(!errorValue) {
				let records = {}
				body = body.split('\n')
				body.pop()

				for(let i = 0; i < body.length; i++) {
					let info = body[i].split(',')
					records[this.skills[i]] = {
						day: parseFloat(info[0]),
						week: parseFloat(info[2]),
						month: parseFloat(info[4])
						// ignoring time stuff
					}
				}

				callback(errorValue, records)
			} else {
				callback(errorValue)
			}
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

			if(!errorValue) {
				body = body.split('\n')
				let stats = {}
				stats.lastchanged = parseInt(body[0])
				body.shift()
				body.pop()

				for(let i = 0; i < this.skills.length - 1; i++) {
					// skills.length - 1 because added ehp to osrs skills
					let skillInfo = body[i].split(',')
					let afterLevel = this.convertXPtoLVL(parseInt(skillInfo[2]))
					let preLevel = this.convertXPtoLVL(parseInt(skillInfo[2]) - parseInt(skillInfo[0]))

					stats[this.skills[i]] = {
						xp: parseInt(skillInfo[2]),
						rank: parseInt(skillInfo[3]),
						xpGained: parseInt(skillInfo[0]),
						ranksGained: parseInt(skillInfo[1]), // negative ranksGained is good
						levelsGained: (afterLevel - preLevel),
						ehpGained: parseFloat(skillInfo[4])
					}

					stats.overall.levelsGained += (afterLevel - preLevel)
				}
				// .ehp looks a bit different
				let ehpInfo = body[this.skills.length - 1].split(',')
				stats.ehp = {
					hours: parseFloat(ehpInfo[2]),
					ranksGained: parseInt(ehpInfo[1]),
					ehpGained: parseFloat(ehpInfo[0])
				}

				callback(errorValue, stats)
			} else {
				callback(errorValue)
			}
		})
	}

	// shows total xp gained by all in any skill
	compTotal(compID, skill, callback) {
		let url = this.cmlURL + '?type=comptotal&competition=' + compID + '&skill=' + skill

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)

			if(!errorValue) {
				body = parseInt(body)

				callback(errorValue, body)
			} else {
				callback(errorValue)
			}
		})
	}

	compRankings(compID, skill, callback) {
		let url = this.cmlURL + '?type=comprankings&competition=' + compID + '&skill=' + skill

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)

			if(!errorValue) {
				let comp = []
				body = body.split('\n')
				body.pop()

				for(let i = 0; i < body.length; i++) {
					let info = body[i].split(',')
					if(skill !== 'ehp') {
						comp.push({
							username: info[0],
							startXP: parseFloat(info[1]),
							currentXP: parseFloat(info[2]),
							gainedXP: parseFloat(info[3])
						})
					} else {
						comp.push({
							username: info[0],
							startEHP: parseFloat(info[1]),
							currentEHP: parseFloat(info[2]),
							gainedEHP: parseFloat(info[3])
						})
					}
				}

				callback(errorValue, comp)
			} else {
				callback(errorValue)
			}
		})
	}

	records(obj, callback) {
		let url = this.cmlURL + '?type=records&timeperiod=' + obj.timeperiod
		url += '&skill=' + obj.skill + '&count=' + obj.count

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)

			if(!errorValue) {
				let arr = []
				body = body.split('\n')
				body.pop()

				for(let line of body) {
					let info = line.split(',')

					if(obj.skill !== 'ehp') {
						arr.push({
							username: info[0],
							xp: parseFloat(info[1])
						})
					} else {
						arr.push({
							username: info[0],
							hours: parseFloat(info[1])
						})
					}
				}

				callback(errorValue, arr)
			} else {
				callback(errorValue)
			}
		})
	}

	currentTop(skill, timeperiod, callback) {
		let url = this.cmlURL + '?type=currenttop&timeperiod=' + timeperiod + '&skill=' + skill

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)

			if(!errorValue) {
				let top = []
				body = body.split('\n')
				body.pop()

				for(let i = 0; i < body.length; i++) {
					let info = body[i].split(',')
					top.push({
						username: info[0],
						gained: parseFloat(info[1])
					})
				}

				callback(errorValue, top)
			} else {
				callback(errorValue)
			}
		})
	}

	virtualHiscores(user, callback) {
		let url = this.cmlURL + '?type=virtualhiscoresatplayer&player=' + user + '&page=virtualtotal'
		let info = {}

		request(url, (error, response, body) => {
			let errorValue = errorHandling(body)

			if(!errorValue) {
				body = body.split(',')
				info.total = {
					rank: parseInt(body[0]),
					level: parseInt(body[2])
				}

				url = this.cmlURL + '?type=virtualhiscoresatplayer&player=' + user + '&page=recordsheld'

				request(url, (error, response, body) => {
					errorValue = errorHandling(body)

					if(!errorValue) {
						body = body.split(',')
						info.recordsHeld = {
							held: parseInt(body[2]),
							rank: parseInt(body[0])
						}

						url = this.cmlURL + '?type=virtualhiscoresatplayer&player=' + user + '&page=recordsheld'

						request(url, (error, response, body) => {
							errorValue = errorHandling(body)

							if(!errorValue) {
								body = body.split(',')
								info.frontpageCount = {
									count: parseInt(body[2]),
									rank: parseInt(body[0])
								}

								callback(errorValue, info)
							} else {
								callback(errorValue)
							}
						})
					} else {
						callback(errorValue)
					}
				})
			} else {
				callback(errorValue)
			}
		})
	}

	convertXPtoLVL(xp, cap) {
		// very inefficient, couldnt reverse formula
		// for getting the lvl out of xp..(wish i was good at math)
		// shoutout to http://rsdo.net/rsdonline/guides/Experience%20formula.html
		if(cap === undefined) {
			cap = 99
		}

		let points = 0

		for(let lvl = 1; lvl <= cap; lvl++) {
			points += Math.floor(lvl + 300 * Math.pow(2, lvl / 7))

			if(Math.floor(points / 4) >= xp + 1) {
				return lvl
			}
			// why xp + 1? I HAVE NO FUCKING CLUE
			// I HAVE NO CLUE AND ITS SO FUCKING WEIRD
			// but it works
		}

		return cap // needed if virtual level > 99
	}

	convertLVLtoXP(lvl) {
		let points = 0

		for(let i = 1; i < lvl; i++) {
			points += Math.floor(i + 300 * Math.pow(2, i / 7))
		}

		return Math.floor(points / 4)
	}
}
