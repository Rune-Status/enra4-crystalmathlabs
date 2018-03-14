import test from 'ava'

const Crystalmethlabs = require('../lib/crystalmethlabs.js')

const games = ['osrs', 'rs3']
for (const game of games) {
	const cml = new Crystalmethlabs(game)

	test(`update for ${game}`, async t => {
		const {err} = await cml.update('lynx titan')
		t.deepEqual(err, null)
	})

	test(`last check for ${game}`, async t => {
		const {err, sec} = await cml.lastcheck('lynx titan')
		t.deepEqual(err, null)
		t.deepEqual(isNaN(sec), false)
	})

	test(`last change for ${game}`, async t => {
		const {err, sec} = await cml.lastchange('lynx titan')
		t.deepEqual(err, null)
		t.deepEqual(isNaN(sec), false)
	})

	test(`search for ${game}`, async t => {
		let {err, exists} = await cml.search('lynx titan')
		t.deepEqual(err, null)
		t.deepEqual(exists, true)

		// this person doesnt exist (hopefully when you run test as well)
		// lol fuck js
		;({err, exists} = await cml.search('asofkjddlkhcaaa'))
		t.deepEqual(err, null)
		t.deepEqual(exists, false)
	})

	test(`records of player for ${game}`, async t => {
		// says lynx titan isnt in database for rs3
		// which is clearly false..
		// whatever
		const username = (game === 'osrs') ? 'lynx titan' : 'zezima'
		const {err, records} = await cml.recordsOfPlayer(username)
		t.deepEqual(err, null)
		t.deepEqual(typeof records, 'object')

		const skillLength = (game === 'osrs') ? 25 : 29
		t.deepEqual(Object.entries(records).length, skillLength)
	})

	test(`track for ${game}`, async t => {
		const week = 7 * 24 * 3600
		let {err, stats} = await cml.track('lynx titan', week)
		const attack = stats.attack
		t.deepEqual(err, null)
		t.deepEqual(isNaN(attack.levelsGained), false)
		t.deepEqual(isNaN(attack.ranksGained), false)
		t.deepEqual(isNaN(attack.xpGained), false)

		;({err, stats} = await cml.track('asofkjddlkhcaaa', week))
		t.deepEqual(err, 'User not in database')
		t.deepEqual(stats, undefined)
	})

	test(`records for ${game}`, async t => {
		let {err, records} = await cml.records('overall', 'day', 10)
		t.deepEqual(err, null)
		t.deepEqual(typeof records, 'object')
		t.deepEqual(records.length, 10)
		t.deepEqual(typeof records[0].username, 'string')
		t.deepEqual(isNaN(records[0].xp), false)

		// ehp looks a bit different
		;({err, records} = await cml.records('ehp', 'week', 10))
		t.deepEqual(err, null)
		t.deepEqual(isNaN(records[0].hours), false)

		// testing default value for count
		;({err, records} = await cml.records('ehp', 'month'))
		t.deepEqual(err, null)
		t.deepEqual(records.length, 30)
	})

	test(`current top for ${game}`, async t => {
		const {err, top} = await cml.currentTop('fishing', 'day')
		t.deepEqual(err, null)
		t.deepEqual(typeof top, 'object')
		t.deepEqual(top.length, 30)
		t.deepEqual(typeof top[0].username, 'string')
		t.deepEqual(isNaN(top[0].gained), false)
	})

	test(`stats for ${game}`, async t => {
		const {err, stats} = await cml.stats('lynx titan')
		t.deepEqual(err, null)

		// everything deep down is a number
		for (const skill of cml.skills) {
			for (const measurement in stats[skill]) {
				t.deepEqual(isNaN(stats[skill][measurement]), false)
			}
		}
	})

	test(`ttm for ${game}`, async t => {
		const {err, ttm} = await cml.ttm('lynx titan')
		t.deepEqual(err, null)
		t.deepEqual(isNaN(ttm.hours), false)
		t.deepEqual(isNaN(ttm.rank), false)
	})

	test(`virtual hiscores for ${game}`, async t => {
		// some of this stuff doesnt exists for lynx
		const username = (game === 'osrs') ? 'lynx titan' : 'zezima'
		const {err, vh} = await cml.virtualHiscores(username)
		t.deepEqual(err, null)

		for (const page in vh) {
			for (const measurement in vh[page]) {
				t.deepEqual(isNaN(vh[page][measurement]), false)
			}
		}
	})
}

const cml = new Crystalmethlabs()

test('previous username (osrs only)', async t => {
	// friends username
	let {err, username} = await cml.previousName('sjipez')
	t.deepEqual(err, null)
	t.deepEqual(typeof username, 'string')

	// ive never changed username
	;({err, username} = await cml.previousName('kryddern'))
	t.deepEqual(err, 'User not in database')
	t.deepEqual(username, undefined)
})

test('comp total (osrs only)', async t => {
	const {err, xp} = await cml.compTotal(7235, 'magic')
	t.deepEqual(err, null)
	t.deepEqual(isNaN(xp), false)
})

test('comp rankings, (osrs only)', async t => {
	const {err, rankings} = await cml.compRankings(7235, 'magic')
	t.deepEqual(err, null)
	t.deepEqual(typeof rankings, 'object') // actually array but, isNaN([]) => 'object'
})

test('xp and lvl converting', t => {
	t.deepEqual(cml.convertXPtoLVL(0), 1)
	t.deepEqual(cml.convertXPtoLVL(50), 1)
	t.deepEqual(cml.convertXPtoLVL(83), 2)
	t.deepEqual(cml.convertXPtoLVL(13034431), 99)

	t.deepEqual(cml.convertLVLtoXP(99), 13034431)
	t.deepEqual(cml.convertLVLtoXP(2), 83)
	t.deepEqual(cml.convertLVLtoXP(1), 0)
	t.deepEqual(cml.convertLVLtoXP(0), 0)
})
