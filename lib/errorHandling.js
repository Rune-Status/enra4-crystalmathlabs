module.exports = function(number) {
	if(number.length === 2) {
		switch(number) {
			case '-1':
				return 'User not in database'
				break
			case '-2':
				return 'Invalid username'
				break
			case '-3':
				return 'Database error'
				break
			case '-4':
				return 'Server under heavy load; api temporarily disabled'
				break
			default:
				return null
				break
		}
	} else {
		return null
	}
}
