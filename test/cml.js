const test = require('tape')
const rewire = require('rewire')
const Crystalmethlabs = rewire('../lib/crystalmethlabs')
Crystalmethlabs.__set__('request', require('./api'))

test('crystal meth labs module', (t) => {
	t.test('rs3', (t) => {
		const cml = new Crystalmethlabs('rs3')
		t.test('update', (t) => {
			t.plan(1)
			cml.update('lynx_titan', (err) => {
				t.equal(err, null)
			})
		})
		t.test('lastcheck', (t) => {
			t.plan(1)
			cml.lastcheck('lynx_titan', (err, body) => {
				// body should be a number
				t.ok(!isNaN(parseInt(body)))
			})
		})
		t.end()
	})

	t.test('osrs', (t) => {
		t.end()
	})
})
