// tracks user and logs what skills they have gained most xp
// can easily be adapted for ehpGained, levelsGained and ranksGained
const CML = require('../lib/crystalmethlabs.js');

const meth = new CML();

(async () => {
	const week = 24 * 7 * 3600;
	const {err, stats} = await meth.track('lynx titan', week);
	if (!err) {
		const mostXPGained = {
			skill: undefined,
			xp: 0
		};

		for (const skill of meth.skills) {
			if (stats[skill].xpGained > mostXPGained.xp && skill !== 'overall') {
				mostXPGained.skill = skill;
				mostXPGained.xp = stats[skill].xpGained;
			}
		}

		console.log(`Gained most xp in skill: ${mostXPGained.skill}`);
		console.log(`Gained xp: ${mostXPGained.xp}`);
		return;
	}

	console.log(err);
})();

/*
meth.track('lynx titan', week, (err, stats) => {
	const mostXPGained = {
		skill: undefined,
		xp: 0
	}

	for (const skill of meth.skills) {
		if (stats[skill].xpGained > mostXPGained.xp && skill !== 'overall') {
			mostXPGained.skill = skill
			mostXPGained.xp = stats[skill].xpGained
		}
	}

	console.log(`Gained most xp in skill: ${mostXPGained.skill}`)
	console.log(`xp: ${mostXPGained.xp}`)
})
*/
