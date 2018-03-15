# Crystalmethlabs

A JavaScript library for using Crystal Math Labs

A bit rebellious when it comes to async functions, with inspiration from how to deal with errors from golang. Using destructuring assignment syntax, which you can read more about [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

```js
const Crystalmethlabs = require('crystalmethlabs');
const cml = new Crystalmethlabs();

(async () => {
	const {err, top} = await cml.currentTop('ehp', 'week');
	if (!err) {
		console.log(top);
	}
	// [ { username: 'eg_froggen', gained: 106.69 },
	//   { username: 'razor_beast', gained: 102.32 },
	//   { username: 'fk_wmk', gained: 100.93 },
	//   ...
	//   ...
	//   { username: 'abekat', gained: 68.17 } ]
})();
```

## Install

**Requires node version ``8.0.0`` or above**

If you want to use and older *and possibly more broken* version,
[here you go](https://github.com/enra4/crystalmethlabs/tree/old)

```
$ npm install crystalmethlabs
```

## Getting started

### __`new Crystalmethlabs([game])`__

* `game` *String* that can be set to `'osrs' || 'rs3'` (optional, default: `'osrs'`)

Sadly, use of API keys are not supported because theyre not documented on crystalmathlabs.

```js
const Crystalmethlabs = require('crystalmethlabs')

const osrsFirst = new Crystalmethlabs('osrs'); // -> osrs
const osrsSecond = new Crystalmethlabs(); // -> osrs
const osrsThird = new Crystalmethlabs('fghkfdjhkl'); // -> osrs

const rs3 = new Crystalmethlabs('rs3'); // -> rs3
```

## Properties

### __`.skills`__

*Array* containing all the skills, including `overall` and `ehp`.
Differentiates depending on if `game` is `'osrs'` or `'rs3'`.

```js
const Crystalmethlabs = require('crystalmethlabs');

const osrs = new Crystalmethlabs('osrs');
const rs3 = new Crystalmethlabs('rs3');

console.log(osrs.skills);
// [ 'overall',
//   'attack',
//   ...
//   ...
//   'construction',
//   'ehp' ]
console.log(osrs.skills.length); // 25

console.log(rs3.skills);
// [ 'overall',
//   'attack',
//   ...
//   ...
//   'invention',
//   'ehp' ]
console.log(rs3.skills.length); // 29
```

## Methods

### __`.update(username)`__  *-> {err}*

Updates cml profile.

```js
(async () => {
	const {err} = await cml.update('lynx titan');
	if (err) {
		console.log(err);
	}
})();
```

### __`.lastcheck(username)`__  *-> {err, sec}*

Checks when a player was last checked.

```js
(async () => {
	const {err, sec} = await cml.lastcheck('lynx titan');
	if (!err) {
		console.log(`lynx titan was last checked ${sec} seconds ago`);
	}
})();
```

### __`.lastchange(username)`__ *-> {err, sec}*

Checks when a player was last changed.

```js
(async () => {
	const {err, sec} = await cml.lastchange('lynx titan');
	if (!err) {
		console.log(`lynx titan was last changed ${sec} seconds ago`);
	}
})();
```

### __`.stats(username)`__ *-> {err, stats}*

Gets stats for a player.
`stats` is an object containing objects for each skill.
Each skill is an object containing keys: `level`, `xp` and `rank`.

__Note__ that the `ehp` object contains keys: `hours` and `rank`

```js
(async () => {
	const {err, stats} = await cml.stats('lynx titan');
	if (!err) {
		console.log(stats);
	}
	// { overall: { level: 2277, xp: 3825196121, rank: 1 },
	//	 attack: { level: 99, xp: 200000000, rank: 15 },
	// 	 ...
	// 	 ...
	//	 ehp: { hours: 14091.081052339, rank: 1 } }
})();
```

### __`.track(username, timeperiod)`__ *-> {err, stats}*

Gets gains for all skills over a certain `timeperiod`.

__Note__ that negative `ranksGained` is good

```js
(async () => {
	const week = 24 * 7 * 3600; // a week in seconds
	const {err, stats} = await cml.track('lynx titan', week);
	if (!err) {
		console.log(stats.overall);
		console.log(stats.attack);
		console.log(stats.ehp);
	}
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
})();
```

### __`.recordsOfPlayer(username)`__ *-> {err, records}*

Gets daily, weekly and monthly records for all skills.

```js
(async () => {
	const {err, records} = await cml.recordsOfPlayer('lynx titan');
	if (!err) {
		console.log(records.overall);
		console.log(records.attack);
		console.log(records.ehp);
	}
	// { day: 28287598, week: 92926070, month: 273555794 }
	//
	// { day: 3159912, week: 15626903, month: 28985366 }
	//
	// { day: 27.94, week: 134.34, month: 544.07 }
})();
```

### __`.virtualHiscores(username)`__ *-> {err, vh}*

Virtual Hiscores for a player.

```js
(async () => {
	const {err, vh} = await cml.virtualHiscores('lynx titan');
	if (!err) {
		console.log(vh);
	}
	// { total: { rank: 1, level: 2819 },
	//   recordsHeld: { held: 67, rank: 1 },
	//   frontpageCount: { count: 67, rank: 1 } }
	//
	// as you can see, very few virtual hiscores are supported
})();
```

### __`.ttm(username)`__ *-> {err, ttm}*

Gets efficient hours left for account to be maxed, and rank in terms of maxing.
Can be used to find out who was first to max.

```js
(async () => {
	const {err, ttm} = await cml.ttm('lynx titan');
	if (!err) {
		console.log(ttm);
		// { hours: 0, rank: 268 }
		// lynx titan was the 268th person to max in oldschool runescape
	}
})();
```

### __`.currentTop(skill, timeperiod)`__ *-> {err, top}*

Gets the Current Top for any skill (top 30 players).

* `skill` *String* that can be set to any skill, including `'overall'` & `'ehp'`
* `timeperiod` *String* that can be set to `day`, `week` or `month`

```js
(async () => {
	const {err, top} = await cml.currentTop('ehp', 'week');
	if (!err) {
		console.log(top);
	}
	// [ { username: 'eg_froggen', gained: 106.69 },
	//   { username: 'razor_beast', gained: 102.32 },
	//   { username: 'fk_wmk', gained: 100.93 },
	//   ...
	//   ...
	//   { username: 'abekat', gained: 68.17 } ]
})();
```

### __`.records(skill, timeperiod, [count])`__ *-> {err, records}*

Gets records for any skill over a certain time.

* `skill` *String* that can be set to any skill, including `'overall'` & `'ehp'`
* `timeperiod` *String* that can be set to `day`, `week` or `month`
* `count` *Number | String* for how many records to be shown (optional, default: `30`)

```js
(async () => {
	const {err, records} = await cml.records('ehp', 'month', 3);
	if (!err) {
		console.log(records);
	}
	// [ { username: 'p_udding', hours: 621.6 },
	//   { username: 'lynx_titan', hours: 544.07 },
	//   { username: 'fredimmu', hours: 530.14 } ]
})();
```

### __`.compTotal(compID, skill)`__ *-> {err, xp}*

Gets total xp amongst all participants in any skill.

```js
(async () => {
	const {err, xp} = await cml.compTotal(7180, 'overall');
	if (!err) {
		console.log(xp);
	}
	// 5701651
})();
```

### __`.compRankings(compID, skill)`__ *-> {err, rankings}*

Gets ranking amongst participants in any skill (who has gained the most xp/ehp).

```js
(async () => {
	const {err, rankings} = await cml.compRankings(7180, 'overall');
	if (!err) {
		console.log(rankings);
	}
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
})();
```

### __`.previousName(username)`__ *-> {err, username}*

Checks if there was a previous username for the account.
If there is, `username` is set to the previous username.
If given person has never changed username, there will be an ``err`` that says
``'User not in database'``, and ``username`` will be ``undefined``

### __`.search(username)`__ *-> {err, exists}*

Searches to see if an account exists.

### __`.convertXPtoLVL(xp, [cap])`__

Converts xp to level.

* `xp` *Number* you want to convert
* `cap` *Number* for a level you dont want the returned value to be above (optional, default: `99`)

```js
console.log(cml.convertXPtoLVL(13034431));
// 99
```

### __`.convertLVLtoXP(lvl)`__

Converts level to xp.

```js
console.log(cml.convertLVLtoXP(99));
// 13034431
```

## License

MIT
