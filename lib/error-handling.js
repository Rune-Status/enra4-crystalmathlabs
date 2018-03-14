module.exports = body => {
	// theyre apparently .length of 3 which is weird..
	// they used to be 2 before, which makes sense
	if (body.length === 3) {
		switch (parseInt(body)) {
			case -1:
				return 'User not in database'
			case -2:
				return 'Invalid username'
			case -3:
				return 'Database error'
			case -4:
				return 'Server under heavy load; api temporarily disabled'
		}
	}

	return null
}
