# Crystalmethlabs

# Methods

__update([username], [callback])__ *-> cb(err)*

Updates cml profile

```js
// callback is optional
cml.update('lynx titan', (err) => {
	if(err) {
		console.log(err)
	}
})
```

__lastcheck([username], [callback])__ *-> cb(err, sec)*

Checks when a player was last checked

```js
cml.lastcheck('lynx titan', (err, sec) => {
	console.log('lynx titan was last checked ' + sec + ' seconds ago')
})
```

__lastchange([username], [callback])__ *-> cb(err, sec)*

Checks when a player was last changed

```js
cml.lastcheck('lynx titan', (err, sec) => {
	console.log('lynx titan was last changed ' + sec + ' seconds ago')
})
```

__stats([username], [callback])__ *-> cb(err, stats)*

Gets stats for a player
`stats` is an object containing objects for each skill
Each skill is an object containing keys: `level`, `xp` and `rank`

```js
cml.stats('lynx titan', (err, stats) => {
	console.log(stats)
	// { overall: { level: 2277, xp: 3825196121, rank: 1 },
	//	 attack: { level: 99, xp: 200000000, rank: 15 },
	// 	 ...
	// 	 ...
	//	 ehp: { hours: 14091.081052339, rank: 1 } }
})
```

__Note__ that the `ehp` object contains keys: `hours` and `rank`

__track([username], [timeperiod], [callback])__ *-> cb(err, stats)*

Gets gains for all skills over a certain `timeperiod`

```js
let week = 24 * 7 * 3600

cml.track('lynx titan', week, (err, stats) => {
	console.log(stats.overall)
	console.log(stats.attack)
	console.log(stats.ehp)
	// { xp: 3825196121,
	//   rank: 1,
	//   xpGained: 15727673,
	//   ranksGained: 0,
	//   levelsGained: 0,
	//   ehpGained: 73.17 }
	//
	// { xp: 200000000,
	//   rank: 15,
	//   xpGained: 0,
	//   ranksGained: 0,
	//   levelsGained: 0,
	//   ehpGained: 0 }
	//
	// { hours: 14091.08, ranksGained: 0, ehpGained: 73.17 }
})
```

__Note__ that negative `ranksGained` is good

__recordsOfPlayer([username], [callback])__ *-> cb(err, records)*

Gets daily, weekly and monthly records for all skills

```js
cml.recordsOfPlayer('lynx titan', (err, records) => {
	console.log(records.overall)
	console.log(records.attack)
	console.log(records.ehp)
	// { day: 28287598, week: 92926070, month: 273555794 }
	//
	// { day: 3159912, week: 15626903, month: 28985366 }
	//
	// { day: 27.94, week: 134.34, month: 544.07 }
})
```

__ttm([username], [callback])__ *-> cb(err, ttm)*

Gets efficient hours left for account to be maxed, and rank in terms of maxing
Can be used to find out who were first to max

```js
cml.ttm('lynx titan', (err, ttm) => {
	console.log(ttm)
	// { hours: 0, rank: 268 }
	// lynx titan was the 268th person to max in oldschool runescape
})
```

__previousName([username], [callback])__ *-> cb(err, previous)*

Checks if there was a previous username for the account
If there was, `previous` is set to the previous username
If there wasn't, `previous === false`

__search([username], [callback])__ *-> cb(err, res)*

Searches to see if an account exists
`res` is `true` if account exists and `false` if not
Even if Crystal Math Labs has no data for the account, `res === true`
