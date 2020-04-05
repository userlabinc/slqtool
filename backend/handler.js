"use strict";
const sql = require("mssql");
const {
  response,
  readTables,
  detailsTable,
  serializeDataToS3,
  saveToS3,
  saveExcelToS3,
  getDataFromS3,
} = require("./utils");
const { db } = require("./db");
const AWS = require("aws-sdk");
const Stream = require("stream");
const ExcelJS = require("exceljs");

module.exports.run = async (event) => {
  try {
    if (event.body === null || event.body === undefined)
      throw Error("missing_params");

    let body = JSON.parse(event.body);

    if (!body || body.query === "") throw Error("missing_body");

    const connection = await sql.connect(db);
    const db_response = await sql.query(body.query);

    return await response(200, db_response, connection);
  } catch (e) {
    console.log(e, "<--- error");
    return await response(400, e.message, null);
  }
};

module.exports.tables = async (event) => {
  try {
    const connection = await sql.connect(db);
    const db_response = await sql.query(readTables());
    const tables = db_response.recordsets[0].map((x) => x.TABLE_NAME);
    return await response(200, tables, connection);
  } catch (e) {
    console.log(e, "<--- error");
    return await response(400, e.message, null);
  }
};

module.exports.details = async (event) => {
  try {
    const param = event.queryStringParameters;

    if (!param || !param.name) Error("missing_body");

    const connection = await sql.connect(db);
    const db_response = await sql.query(detailsTable(param));
    const columns = db_response.recordsets[0].map(
      (x) => `${x.COLUMN_NAME} (${x.DATA_TYPE})`
    );
    return await response(200, columns, connection);
  } catch (e) {
    console.log(e, "<--- error");
    return await response(400, e.message, null);
  }
};

module.exports.saveQuery = async (event) => {
  try {
    if (event.body === null || event.body === undefined)
      throw Error("missing_params ...");

    let body = JSON.parse(event.body);

    if (!body) throw Error("missing_body");

    const dataToS3 = serializeDataToS3(body);
    const S3 = new AWS.S3();
    await saveToS3(dataToS3, S3);

    return await response(200, dataToS3, null);
  } catch (e) {
    console.log(e, "<--- error");
    return await response(400, e.message, null);
  }
};

module.exports.getQueries = async (event) => {
  try {
    const S3 = new AWS.S3();
    const rp = await getDataFromS3(S3);
    return await response(200, rp, null);
  } catch (e) {
    console.log(e, "<--- error");
    return await response(400, e.message, null);
  }
};

module.exports.excel = async (event) => {
  try {
    if (event.body === null || event.body === undefined)
      throw Error("missing_params");

    let body = JSON.parse(event.body);

    if (!body || body.query === "") throw Error("missing_body");

    const connection = await sql.connect(db);
    const db_response = await sql.query(body.query);

    let workbook = new ExcelJS.Workbook();
    let creation_date = new Date();
    workbook.creator = "Moocho";
    workbook.modified = creation_date;
    workbook.lastPrinted = creation_date;

    let sheet = workbook.addWorksheet("My Sheet");
    const stream = new Stream.PassThrough();

    const { recordset } = db_response;
    if (!(recordset && recordset[0])) {
      throw Error("There is no recordset");
    }

    let first_reccord = recordset[0];
    let recordset_keys = Object.keys(first_reccord);

    sheet.columns = recordset_keys.map((element) => ({
      header: element,
      key: element,
    }));

    recordset.forEach((element) => {
      sheet.addRow(element);
    });
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
