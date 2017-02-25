# Crystalmethlabs

A JavaScript library for using Crystal Math Labs

```js
const Crystalmethlabs = require('crystalmethlabs')
const cml = new Crystalmethlabs()

cml.currentTop('ehp', 'week', (err, top) => {
	console.log(top)
	// [ { username: 'eg_froggen', gained: 106.69 },
	//   { username: 'razor_beast', gained: 102.32 },
	//   { username: 'fk_wmk', gained: 100.93 },
	//   ...
	//   ...
	//   { username: 'abekat', gained: 68.17 } ]
})
```

## Install

```sh
npm install crystalmethlabs --save
```

## Getting started

### __`new Crystalmethlabs([game])`__

* `game` *String* that can be set to `'osrs' | 'rs3'` (optional, default: `'osrs'`)

```js
const Crystalmethlabs = require('crystalmethlabs')

let osrsFirst = new Crystalmethlabs('osrs') // -> osrs
let osrsSecond = new Crystalmethlabs() // -> osrs
let osrsThird = new Crystalmethlabs('fghkfdjhkl') // -> osrs

let rs3 = new Crystalmethlabs('rs3') // -> rs3
```

## Methods

### __`.update(username, [callback])`__  *-> cb(err)*

Updates cml profile.

```js
// callback is optional
cml.update('lynx titan', (err) => {
	if(err) {
		console.log(err)
	}
})
```

### __`.lastcheck(username, callback)`__  *-> cb(err, sec)*

Checks when a player was last checked.

```js
cml.lastcheck('lynx titan', (err, sec) => {
	console.log('lynx titan was last checked ' + sec + ' seconds ago')
})
```

### __`.lastchange(username, callback)`__ *-> cb(err, sec)*

Checks when a player was last changed.

```js
cml.lastcheck('lynx titan', (err, sec) => {
	console.log('lynx titan was last changed ' + sec + ' seconds ago')
})
```

### __`.stats(username, callback)`__ *-> cb(err, stats)*

Gets stats for a player.
`stats` is an object containing objects for each skill.
Each skill is an object containing keys: `level`, `xp` and `rank`.

__Note__ that the `ehp` object contains keys: `hours` and `rank`

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

### __`.track(username, timeperiod, callback)`__ *-> cb(err, stats)*

Gets gains for all skills over a certain `timeperiod`.

__Note__ that negative `ranksGained` is good

```js
let week = 24 * 7 * 3600 // a week in seconds

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

### __`.recordsOfPlayer(username, callback)`__ *-> cb(err, records)*

Gets daily, weekly and monthly records for all skills.

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

### __`.virtualHiscores(username, callback)`__ *-> cb(err, vh)*

Virtual Hiscores for a player.

```js
cml.virtualHiscores('lynx titan', (err, vh) => {
	console.log(vh)
	// { total: { rank: 1, level: 2819 },
	//   recordsHeld: { held: 67, rank: 1 },
	//   frontpageCount: { count: 67, rank: 1 } }
	//
	// as you can see, very few virtual hiscores are supported
})
```

### __`.ttm(username, callback)`__ *-> cb(err, ttm)*

Gets efficient hours left for account to be maxed, and rank in terms of maxing.
Can be used to find out who were first to max.

```js
cml.ttm('lynx titan', (err, ttm) => {
	console.log(ttm)
	// { hours: 0, rank: 268 }
	// lynx titan was the 268th person to max in oldschool runescape
})
```

### __`.currentTop(skill, timeperiod, callback)`__ *-> cb(err, top)*

Gets the Current Top for any skill (top 30 players).

* `skill` *String* that can be set to any skill, including `'overall'` & `'ehp'`
* `timeperiod` *String* that can be set to `day`, `week` or `month`

```js
cml.currentTop('ehp', 'week', (err, top) => {
	console.log(top)
	// [ { username: 'eg_froggen', gained: 106.69 },
	//   { username: 'razor_beast', gained: 102.32 },
	//   { username: 'fk_wmk', gained: 100.93 },
	//   ...
	//   ...
	//   { username: 'abekat', gained: 68.17 } ]
})
```

### __`.records(obj, callback)`__ *-> cb(err, records)*

Gets records for any skill over a certain time.

* `obj` *Object* containing information for http request
	* `skill` *String* that can be set to any skill, including `'overall'` & `'ehp'`
	* `timeperiod` *String* that can be set to `day`, `week` or `month`
	* `count` *Number | String* for how many records to be shown (for example: top 5 or top 10)

```js
cml.records({
	skill: 'ehp',
	timeperiod: 'month',
	count: 3
}, (err, records) => {
	console.log(records)
	// [ { username: 'p_udding', hours: 621.6 },
	//   { username: 'lynx_titan', hours: 544.07 },
	//   { username: 'fredimmu', hours: 530.14 } ]
})
```

### __`.compTotal(compID, skill, callback)`__ *-> cb(err, xp)*

Gets total xp amongst all participants in any skill.

```js
cml.compTotal(7180, 'overall', (err, xp) => { // compID can also be a string
	console.log(xp)
	// 5701651
})
```

### __`.compRankings(compID, skill, callback)`__ *-> cb(err, rankings)*

Gets ranking amongst participants in any skill (who has gained the most xp/ehp).

```js
cml.compRankings(7180, 'overall', (err, rankings) => {
	console.log(rankings)
	// [ { username: 'awildcow',
	//     startXP: 76251226,
	//     currentXP: 78880141,
	//     gainedXP: 2628915 },
	//   ...
	//   ...
	//   { username: 'ge_tracker',
	//     startXP: 2686104,
	//     currentXP: 2954615,
	//     gainedXP: 268511 } ]
})
```

### __`.previousName(username, callback)`__ *-> cb(err, previous)*

Checks if there was a previous username for the account.
If there is, `previous` is set to the previous username.
If there wasn't, `previous === false`

### __`.search(username, callback)`__ *-> cb(err, res)*

Searches to see if an account exists.
`res === true` if account exists and `res === false` if not.
Even if Crystal Math Labs has no data for the account, `res === true`

### __`.convertXPtoLVL(xp, [cap])`__

Converts xp to level.

* `xp` *Number* you want to convert
* `cap` *Number* for a level you dont want the returned value to be above (optional, default: `99`)

```js
console.log(cml.convertXPtoLVL(13034431))
// 99
```

### __`.convertLVLtoXP(lvl)`__

Converts level to xp.

```js
console.log(cml.convertLVLtoXP(99))
// 13034431
```

## License

MIT
