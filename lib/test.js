const cml = require('./crystalmethlabs')

let test = new cml()

test.previousName('Seeeenzeeee', (result) => {
	console.log(result)
})
