const readTables = () => `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG='Moocho' ORDER by TABLE_NAME ASC;`

const detailsTable = p => `select COLUMN_NAME, DATA_TYPE from information_schema.columns where table_name = '${p.name}';`

const serializeDataToS3 = (data) => {
  let params = { queries:data }
  return params
}

const saveToS3 = async (dataToS3,S3 ) => {
  
  const paramsToS3 = {
    Body: JSON.stringify(dataToS3),
    Bucket: process.env.BUCKET,
    Key: `store.json`,
    Tagging: new Date().toISOString()
  }
  
  const P = await new Promise((resolve, reject) => {
    S3.putObject(paramsToS3, function(err, data) {
      if (err) {
        console.log(err)
        reject(err) // an error occurred
      } else {
        console.log(data)
        resolve(data)
      }
    })
  })
  
  return P
  
}

const getDataFromS3 = async (S3) => {
  const params = {
    Bucket: process.env.BUCKET,
    Key: 'store.json'
  };
  
  let p = await new Promise(((resolve, reject) => {
     S3.getObject(params, function(err, data) {
      if (err){
        console.log(err)
        reject(err); // an error occurred
      }
      else{
         resolve(data.Body.toString())
      }
    });
  }))
  
  return JSON.parse(p)
}

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
  detailsTable,
  serializeDataToS3,
  saveToS3,
  getDataFromS3
}