const readTables = () => `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG='Moocho' ORDER by TABLE_NAME ASC;`

const detailsTable = p => `select COLUMN_NAME from information_schema.columns where table_name = '${p.name}';`

const response = (status, body, connection) => {
  if (connection) connection.close();
  return new Promise(resolve => {
    resolve({
      statusCode: status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(body),
    });
  });
}

module.exports = {
  response,
  readTables,
  detailsTable
}