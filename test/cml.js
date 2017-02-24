const test = require('tape')
const rewire = require('rewire')
const Crystalmethlabs = rewire('../lib/crystalmethlabs')
Crystalmethlabs.__set__('request', require('./api'))

let games = ['osrs', 'rs3']

test('crystal meth labs module', (t) => {
	for(let game of games) {
		t.test(game, (t) => {
			const cml = new Crystalmethlabs(game)

			t.test('update', (t) => {
				t.plan(1)

				cml.update('lynx_titan', (err) => {
					t.equal(err, null)
				})
			})

			t.test('expecting integer', (t) => {
				let n

				if(game === 'osrs') {
					n = 3
				} else {
					n = 2
				}

				t.plan(n)

				cml.lastcheck('lynx_titan', (err, sec) => {
					t.true(!isNaN(sec))
				})

				cml.lastchange('lynx_titan', (err, sec) => {
					t.true(!isNaN(sec))
				})

				// not gonna bother finding comp for rs3 and such
				if(game === 'osrs') {
					cml.compTotal('7235', 'magic', (err, xp) => {
						t.true(!isNaN(xp))
					})
				}
			})

			if(game === 'osrs') {
				t.test('stats and tracking', (t) => {
					t.plan(6)

					cml.stats('lynx_titan', (err, stats) => {
						let attack = stats.attack

						t.true(!isNaN(attack.level))
						t.true(!isNaN(attack.xp))
						t.true(!isNaN(attack.rank))
					})

					cml.track('lynx_titan', 24 * 7 * 3600, (err, stats) => {
						let attack = stats.attack

						t.true(!isNaN(attack.xpGained))
						t.true(!isNaN(attack.ranksGained))
						t.true(!isNaN(attack.levelsGained))
					})
				})
			}

			t.end()
		})
	}
})
