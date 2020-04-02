'use strict';
const sql = require('mssql')
const { response, readTables, detailsTable, serializeDataToS3, saveToS3, getDataFromS3 } = require('./utils')
const { db } = require('./db')
const AWS = require('aws-sdk')

module.exports.run = async event => {
    try{
        if (event.body === null || event.body === undefined )
            throw Error('missing_params')
        
        let body = JSON.parse(event.body)
        
        if(!body || body.query === '') throw Error('missing_body')
        
        const connection = await sql.connect(db)
        const db_response = await sql.query(body.query)
        
        return await response(200, db_response, connection)
        
    }catch (e) {
        console.log(e, '<--- error')
        return await response(400,e.message, null)
    }
}

module.exports.tables = async event => {
    try{
        const connection = await sql.connect(db)
        const db_response = await sql.query(readTables())
        const tables = db_response.recordsets[0].map( x => x.TABLE_NAME)
        return await response(200, tables, connection)
    }catch (e) {
        console.log(e, '<--- error')
        return await response(400,e.message, null)
    }
}

module.exports.details = async event => {
    try{
        const param = event.queryStringParameters
        
        if(!param || !param.name ) Error('missing_body')
        
        const connection = await sql.connect(db)
        const db_response = await sql.query(detailsTable(param))
        const columns = db_response.recordsets[0].map( x => x.COLUMN_NAME)
        return await response(200, columns, connection)
    }catch (e) {
        console.log(e, '<--- error')
        return await response(400,e.message, null)
    }
}

module.exports.saveQuery = async event => {
    try{
        
        if (event.body === null || event.body === undefined )
            throw Error('missing_params')
    
        let body = JSON.parse(event.body)
    
        if(!body) throw Error('missing_body')
        
        const dataToS3 = serializeDataToS3(body)
        const S3 = new AWS.S3()
        await saveToS3(dataToS3, S3 )
        
        return await response(200, dataToS3, null)
    }catch (e) {
        console.log(e, '<--- error')
        return await response(400,e.message, null)
    }
}

module.exports.getQueries = async event => {
    try{
        const S3 = new AWS.S3()
        const rp = await getDataFromS3(S3)
        return await response(200, rp, null)
    }catch (e) {
        console.log(e, '<--- error')
        return await response(400,e.message, null)
    }
}

