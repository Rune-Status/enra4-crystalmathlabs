const got = require('got')

const errorHandling = require('./error-handling.js')

const osrs = require('./constants').osrs
const rs3 = require('./constants').rs3

const requestOptions = {family: 4}
// family: 4 is needed to avoid this weird error
// https://github.com/nodejs/node/issues/5436

module.exports = class Cml {
	constructor(game) {
		if (game === 'rs3') {
			this.game = 'rs3'
			this.skills = rs3.skills
			this.cmlURL = 'crystalmathlabs.com/tracker-rs3/api.php'
		} else {
			this.game = 'osrs'
			this.skills = osrs.skills
			this.cmlURL = 'crystalmathlabs.com/tracker/api.php'
		}
	}

	update(user) {
		return new Promise(resolve => {
			;(async () => {
				try {
					const url = `${this.cmlURL}?type=update&player=${user}`
					const res = await got(url, requestOptions)

					const err = errorHandling(res.body)
					resolve({err})
				} catch (error) {
					resolve({err: error})
				}
			})()
		})
	}

	lastcheck(user) {
		return new Promise(resolve => {
			;(async () => {
				try {
					const url = `${this.cmlURL}?type=lastcheck&player=${user}`
					const res = await got(url, requestOptions)

					const err = errorHandling(res.body)

					if (!err) {
						const sec = parseInt(res.body)
						resolve({err, sec})
					}

					resolve({err})
				} catch (error) {
					resolve({err: error})
				}
			})()
		})
	}

	lastchange(user) {
		return new Promise(resolve => {
			;(async () => {
				try {
					const url = `${this.cmlURL}?type=lastchange&player=${user}`
					const res = await got(url, requestOptions)

					const err = errorHandling(res.body)

					if (!err) {
						const sec = parseInt(res.body)
						resolve({err, sec})
					}

					resolve({err})
				} catch (error) {
					resolve({err: error})
				}
			})()
		})
	}

	// see if user exists
	search(user) {
		return new Promise(resolve => {
			;(async () => {
				try {
					const url = `${this.cmlURL}?type=search&player=${user}`
					const res = await got(url, requestOptions)

					const err = errorHandling(res.body)

					if (!err) {
						const exists = (parseInt(res.body) !== 0)
						resolve({err, exists})
					}

					resolve({err})
				} catch (error) {
					resolve({err: error})
				}
			})()
		})
	}

	recordsOfPlayer(user) {
		return new Promise(resolve => {
			;(async () => {
				try {
					const url = `${this.cmlURL}?type=recordsofplayer&player=${user}`
					const res = await got(url, requestOptions)

					const err = errorHandling(res.body)

					if (!err) {
						const records = {}
						const splitBody = res.body.split('\n')
						splitBody.pop()

						for (let i = 0; i < splitBody.length; i++) {
							const info = splitBody[i].split(',')
							records[this.skills[i]] = {
								day: parseFloat(info[0]),
								week: parseFloat(info[2]),
								month: parseFloat(info[4])
							}
						}

						resolve({err, records})
					}

					resolve({err})
				} catch (error) {
					resolve({err: error})
				}
			})()
		})
	}

	previousName(user) {
		return new Promise(resolve => {
			;(async () => {
				try {
					const url = `${this.cmlURL}?type=previousname&player=${user}`
					const res = await got(url, requestOptions)

					const err = errorHandling(res.body)

					if (!err) {
						const username = res.body
						resolve({err, username})
					}

					resolve({err})
				} catch (error) {
					resolve({err: error})
				}
			})()
		})
	}

	track(user, time) {
		return new Promise(resolve => {
			;(async () => {
				try {
					const url = `${this.cmlURL}?type=trackehp&player=${user}&time=${time}`
					const res = await got(url, requestOptions)

					const err = errorHandling(res.body)

					if (!err) {
						const stats = {}
						const splitBody = res.body.split('\n')
						stats.lastchanged = parseInt(splitBody[0])
						splitBody.shift()
						splitBody.pop()

						for (let i = 0; i < this.skills.length - 1; i++) {
							const skillInfo = splitBody[i].split(',')
							const afterLevel = this.convertXPtoLVL(parseInt(skillInfo[2]))
							const preLevel = this.convertXPtoLVL(parseInt(skillInfo[2]) - parseInt(skillInfo[0]))

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
						const ehpInfo = splitBody[this.skills.length - 1].split(',')
						stats.ehp = {
							hours: parseFloat(ehpInfo[2]),
							ranksGained: parseInt(ehpInfo[1]),
							ehpGained: parseFloat(ehpInfo[0])
						}

						resolve({err, stats})
					}

					resolve({err})
				} catch (error) {
					resolve({err: error})
				}
			})()
		})
	}

	compTotal(compID, skill) {
		return new Promise(resolve => {
			;(async () => {
				try {
					const url = `${this.cmlURL}?type=comptotal&competition=${compID}&skill=${skill}`
					const res = await got(url, requestOptions)

					const err = errorHandling(res.body)

					if (!err) {
						const xp = parseInt(res.body)
						resolve({err, xp})
					}

					resolve({err})
				} catch (error) {
					resolve({err: error})
				}
			})()
		})
	}

	compRankings(compID, skill) {
		return new Promise(resolve => {
			;(async () => {
				try {
					const url = `${this.cmlURL}?type=comprankings&competition=${compID}&skill=${skill}`
					const res = await got(url, requestOptions)

					const err = errorHandling(res.body)

					if (!err) {
						const rankings = []
						const splitBody = res.body.split('\n')
						splitBody.pop()

						for (let i = 0; i < splitBody.length; i++) {
							const info = splitBody[i].split(',')
							if (skill === 'ehp') {
								rankings.push({
									username: info[0],
									startEHP: parseFloat(info[1]),
									currentEHP: parseFloat(info[2]),
									gainedEHP: parseFloat(info[3])
								})
							} else {
								rankings.push({
									username: info[0],
									startXP: parseFloat(info[1]),
									currentXP: parseFloat(info[2]),
									gainedXP: parseFloat(info[3])
								})
							}
						}

						resolve({err, rankings})
					}

					resolve({err})
				} catch (error) {
					resolve({err: error})
				}
			})()
		})
	}

	records(skill, timeperiod, count = 30) {
		return new Promise(resolve => {
			;(async () => {
				try {
					const url = `
						${this.cmlURL}?type=records&timeperiod=${timeperiod}&skill=${skill}&count=${count}
					`
					const res = await got(url, requestOptions)

					const err = errorHandling(res.body)

					if (!err) {
						const records = []
						const splitBody = res.body.split('\n')
						splitBody.pop()

						for (const line of splitBody) {
							const info = line.split(',')

							if (skill === 'ehp') {
								records.push({
									username: info[0],
									hours: parseFloat(info[1])
								})
							} else {
								records.push({
									username: info[0],
									xp: parseFloat(info[1])
								})
							}
						}

						resolve({err, records})
					}

					resolve({err})
				} catch (error) {
					resolve({err: error})
				}
			})()
		})
	}

	currentTop(skill, timeperiod) {
		return new Promise(resolve => {
			;(async () => {
				try {
					const url = `${this.cmlURL}?type=currenttop&timeperiod=${timeperiod}&skill=${skill}`
					const res = await got(url, requestOptions)

					const err = errorHandling(res.body)

					if (!err) {
						const top = []
						const splitBody = res.body.split('\n')
						splitBody.pop()

						for (let i = 0; i < splitBody.length; i++) {
							const info = splitBody[i].split(',')
							top.push({
								username: info[0],
								gained: parseFloat(info[1])
							})
						}

						resolve({err, top})
					}

					resolve({err})
				} catch (error) {
					resolve({err: error})
				}
			})()
		})
	}

	stats(user) {
		return new Promise(resolve => {
			;(async () => {
				try {
					const url = `
						${this.cmlURL}?multiquery=[{"type": "stats", "player": "${user}"},
						{"type": "virtualhiscoresatplayer", "page": "timeplayed"}]
					`
					const res = await got(url, requestOptions)
					const err = errorHandling(res.body)

					if (!err) {
						const stats = {}
						const [normalStats, ehpStats] = res.body.split('~~')

						const normalStatsSplit = normalStats.split('\n')
						const overallInfo = normalStats.split(',')
						stats.overall = {
							level: 0,
							xp: parseInt(overallInfo[0].split('\n')[1]),
							rank: parseInt(overallInfo[1])
						}

						for (let i = 1; i < this.skills.length - 1; i++) {
							// i = 1 because stats.overall doesnt have level
							// skills.length - 1 because added ehp to osrs skills
							const skillInfo = normalStatsSplit[i + 1].split(',')
							const actualLevel = this.convertXPtoLVL(parseInt(skillInfo[0]), 99)

							stats[this.skills[i]] = {
								level: actualLevel,
								xp: parseInt(skillInfo[0]),
								rank: parseInt(skillInfo[1])
							}

							stats.overall.level += actualLevel
						}

						const ehpInfo = ehpStats.split(',')
						stats.ehp = {
							hours: parseFloat(ehpInfo[2]),
							rank: parseFloat(ehpInfo[0])
						}

						resolve({err, stats})
					}

					resolve({err})
				} catch (error) {
					resolve({err: error})
				}
			})()
		})
	}

	ttm(user) {
		return new Promise(resolve => {
			;(async () => {
				try {
					const multiquery = [
						{type: 'ttm', player: user},
						{type: 'ttmrank'}
					]
					const url = `${this.cmlURL}?multiquery=${JSON.stringify(multiquery)}`
					const res = await got(url, requestOptions)
					const err = errorHandling(res.body)

					if (!err) {
						const ttm = {}
						const splitBody = res.body.split('~~')
						ttm.hours = parseInt(splitBody[0])
						ttm.rank = parseInt(splitBody[1])

						resolve({err, ttm})
					}

					resolve({err})
				} catch (error) {
					resolve({err: error})
				}
			})()
		})
	}

	virtualHiscores(user) {
		return new Promise(resolve => {
			;(async () => {
				try {
					const multiquery = [
						{type: 'virtualhiscoresatplayer', player: user, page: 'virtualtotal'},
						{page: 'recordsheld'},
						{page: 'frontpagecount'}
					]
					const url = `${this.cmlURL}?multiquery=${JSON.stringify(multiquery)}`
					const res = await got(url, requestOptions)

					const err = errorHandling(res.body)

					if (!err) {
						const vh = {}
						const splitBody = res.body.split('~~')

						vh.total = {
							level: parseInt(splitBody[0].split(',')[2]),
							rank: parseInt(splitBody[0].split(',')[0])
						}

						vh.recordsHeld = {
							held: parseInt(splitBody[1].split(',')[2]),
							rank: parseInt(splitBody[1].split(',')[0])
						}

						vh.frontpageCount = {
							count: parseInt(splitBody[2].split(',')[2]),
							rank: parseInt(splitBody[2].split(',')[0])
						}

						resolve({err, vh})
					}

					resolve({err})
				} catch (error) {
					resolve({err: error})
				}
			})()
		})
	}

	convertXPtoLVL(xp, cap = 99) {
		// very inefficient, couldnt reverse formula
		// for getting the lvl out of xp..(wish i was good at math)
		// shoutout to http://rsdo.net/rsdonline/guides/Experience%20formula.html
		let points = 0

		for (let lvl = 1; lvl <= cap; lvl++) {
			points += Math.floor(lvl + (300 * Math.pow(2, lvl / 7)))

			if (Math.floor(points / 4) >= xp + 1) {
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

		for (let i = 1; i < lvl; i++) {
			points += Math.floor(i + (300 * Math.pow(2, i / 7)))
		}

		return Math.floor(points / 4)
	}
}
