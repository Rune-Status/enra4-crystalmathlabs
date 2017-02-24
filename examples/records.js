// checks for recordsOfPlayer and finds record for skill that has
// been gained the most for day, week and month

const CML = require('../lib/crystalmethlabs')
const meth = new CML()

meth.recordsOfPlayer('lynx titan', (err, records) => {
	let timePeriod = ['day', 'week', 'month']
	let best = {
		day: {
			skill: undefined,
			xp: 0
		},
		week: {
			skill: undefined,
			xp: 0
		},
		month: {
			skill: undefined,
			xp: 0
		}
	}

	for(let period of timePeriod) {
		for(let i = 1; i < meth.skills.length - 1; i++) { // - 1 because doesnt want to include ehp
			if(records[meth.skills[i]][period] > best[period].xp) {
				best[period].skill = meth.skills[i]
				best[period].xp = records[meth.skills[i]][period]
			}
		}
	}

	console.log(best)
})
