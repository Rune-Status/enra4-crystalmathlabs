// tracks user and logs what skills they have gained most xp
// can easily be adapted for ehpGained, levelsGained and ranksGained

const CML = require('../lib/crystalmethlabs')
const meth = new CML()

let week = 24 * 7 * 3600

meth.track('lynx titan', week, (err, stats) => {
	let mostXPGained = {
		skill: undefined,
		xp: 0
	}

	for(let skill of meth.skills) {
		if(stats[skill].xpGained > mostXPGained.xp && skill !== 'overall') {
			mostXPGained.skill = skill
			mostXPGained.xp = stats[skill].xpGained
		}
	}

	console.log(`Gained most xp in skill: ${mostXPGained.skill}`)
	console.log(`xp: ${mostXPGained.xp}`)
})
