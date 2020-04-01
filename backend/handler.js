'use strict';
const sql = require('mssql')
module.exports.hello = async event => {

    const config = {
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_HOST,
        database: process.env.DB_NAME,
    }

    const makeQuery = async (query = '') => {
        console.log(`Query inside: ${query}`)
        let results = []
        let errors = []
        try {
            // make sure that any items are correctly URL encoded in the connection string
            let pool = await sql.connect(config)
            const result = await sql.query(query)
            console.dir(result)
            results = result
        } catch (err) {
            console.log('There was an error in the connection', err)
            errors.push(errors)
        }

        return {results, errors}
    }




    if (event.body !== null && event.body !== undefined) {
        let body = JSON.parse(event.body)
        console.log(body)

        if(body.query) {
            const dbQueryObject = await makeQuery(body.query)
            return {statusCode: 200, body: JSON.stringify(dbQueryObject, null, 2) }
        }
    } else {
        return {
            statusCode: 400, body: JSON.stringify({results: {}, errors:[{message: "Bad request"}]})
        }


        // Use this code if you don't use the http event with the LAMBDA-PROXY integration
        // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
    }
}

