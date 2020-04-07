'use strict';

const sql = require('mssql')
const {   saveExcelToS3, response, readTables, detailsTable, serializeDataToS3, saveToS3, getDataFromS3, verifyGroup,detailFile,wakeUpLambda } = require('./utils')
const { db } = require('./config/db')
const AWS = require('aws-sdk')
const Stream = require("stream");


module.exports.run = async event => {
    try{
        if(wakeUpLambda(event)) return await response(200, {message: 'just warnUp me'}, null)
        
        const group = await verifyGroup(event)

        if (!group)
            throw Error('group_not_valid.')

        if (event.body === null || event.body === undefined )
            throw Error('missing_params..')

        let body = JSON.parse(event.body)

        if(!body || body.query === '') throw Error('missing_body')
        
        const connection = await sql.connect(db(group))
        const db_response = await sql.query(body.query)
        return await response(200, db_response, connection)

    }catch (e) {
        console.log(e, '<--- error')
        return await response(400,e.message, null)
    }
}

module.exports.tables = async event => {
    try{
        if(wakeUpLambda(event)) return await response(200, {message: 'just warnUp me'}, null)
        const connection = await sql.connect(db(null))
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
        if(wakeUpLambda(event)) return await response(200, {message: 'just warnUp me'}, null)
        const param = event.queryStringParameters

        if(!param || !param.name ) Error('missing_body')

        const connection = await sql.connect(db(null))
        const db_response = await sql.query(detailsTable(param))
        const columns = db_response.recordsets[0].map( x => `${x.COLUMN_NAME} (${x. DATA_TYPE})`)
        return await response(200, columns, connection)
    }catch (e) {
        console.log(e, '<--- error')
        return await response(400,e.message, null)
    }
}

module.exports.saveQuery = async event => {
    try{
        if(wakeUpLambda(event)) return await response(200, {message: 'just warnUp me'}, null)
        
        if (event.body === null || event.body === undefined )
            throw Error('missing_params ...')

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
        if(wakeUpLambda(event)) return await response(200, {message: 'just warnUp me'}, null)
        const S3 = new AWS.S3()
        const rp = await getDataFromS3(S3)
        return await response(200, rp, null)
    }catch (e) {
        console.log(e, '<--- error')
        return await response(400,e.message, null)
    }
}

module.exports.excel = async (event) => {
    try {
        if(wakeUpLambda(event)) return await response(200, {message: 'just warnUp me'}, null)
        if (event.body === null || event.body === undefined) {
            throw Error("missing_params");
        }
        
        let body = JSON.parse(event.body);
        if (!body || body.query === "") throw Error("missing_body");
    
        const connection = await sql.connect(db(null));
        const stream = new Stream.PassThrough();
        const db_response = await sql.query(body.query);
        const { recordset } = db_response;
        if (!(recordset && recordset[0])) {
            throw Error("There is no recordset");
        }
        
        let workbook =  await detailFile(recordset)
        const S3 = new AWS.S3();
        const random = Math.floor(Math.random() * 100);
        const key = `recordset_${new Date().getTime()}_${random}.xlsx`;

        let download_link = "";
        await workbook.xlsx.write(stream);
        await saveExcelToS3(stream, key, S3);

        download_link = S3.getSignedUrl("getObject", {
            Key: key,
            Bucket: process.env.BUCKET,
        });

        return await response(200, { link: download_link }, connection);
    } catch (e) {
        console.log(e, "<--- error");
        return await response(400, e.message, null);
    }
};
