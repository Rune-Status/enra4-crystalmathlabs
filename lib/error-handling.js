module.exports = body => {
	// theyre apparently .length of 3 which is weird..
	// they used to be 2 before, which makes sense
	if (body.length === 3) {
		switch (parseInt(body)) {
			case -1:
				return 'That user does not exist in the CrystalMathLabs database. Have you tried using +update?'
			case -2:
				return 'That username is invalid.'
			case -3:
				return 'Database error'
			case -4:
				return 'The CrystalMathLabs API is currently offline. Please try again in 5 minutes.'
		}
	}

	return null
}
