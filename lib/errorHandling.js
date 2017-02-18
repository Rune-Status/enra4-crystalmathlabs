module.exports = function(number) {
	if(typeof number === 'number') {
		switch(number) {
			case -1:
				return 'User not in database'
				break
			case -2:
				return 'Invalid username'
				break
			case -3:
				return 'Database error'
				break
			case -4:
				return 'Server under heavy load; api temporarily disabled'
				break
			default:
				return undefined
				break
		}
	}
}
