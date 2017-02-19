// contains stuff thats relevant to runescape
module.exports = {
	skills: [ // probably move this into other file later
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
	],
	convertXpToLVL: function(xp) {
		// very inefficient, couldnt reverse formula
		// for getting the lvl out of xp..(wish i was good at math)
		// shoutout to http://rsdo.net/rsdonline/guides/Experience%20formula.html
		let actualLevel = false
		let points = 0

		for(let lvl = 1; lvl <= 99; lvl++) {
			points += Math.floor(lvl + 300 * Math.pow(2, lvl / 7))
			if(Math.floor(points / 4) > xp) {
				actualLevel = lvl
				break
			}
		}

		if(!actualLevel) {
			actualLevel = 99
		}

		return actualLevel
	}
}
