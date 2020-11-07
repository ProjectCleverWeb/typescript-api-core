'use strict'

module.exports.application = async event => {
	return {
		statusCode : 200,
		body       : JSON.stringify(
			{
				message : 'Hello World!',
				input   : event,
			},
			null,
			2,
		),
	}
}
