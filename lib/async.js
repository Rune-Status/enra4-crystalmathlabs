// lol i suck
// this is temporarily until new node version becomes stable
// for dealing with multiple requests with a single callback
module.exports = function(obj) {
	if(obj.requestsDone >= obj.requests) {
		let i = 0

		for(let value of obj.values) {
			if(value !== null) {
				i++
			}
		}

		if(i === 0) {
			obj.values = null
		}

		obj.callback(obj.values, obj.info)
	}
}
