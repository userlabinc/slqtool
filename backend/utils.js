const readTables = () => `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG='Moocho' ORDER by TABLE_NAME ASC;`

const detailsTable = p => `select COLUMN_NAME from information_schema.columns where table_name = '${p.name}';`

const serializeDataToS3 = (data) => {
  let params = {
    query: data.query,
  }
  return params
}

const saveToS3 = async (body,dataToS3,S3 ) => {
  
  const paramsToS3 = {
    Body: JSON.stringify(dataToS3),
    Bucket: 'u.moocho.com/sqlSaved',
    Key: `${body.name}.json`,
    Tagging: new Date().toISOString(),
    Metadata: {'Content-Type' : 'application/json'}
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
    Bucket: 'u.moocho.com/sqlSaved',
    Key: '*.json'
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

const  allBucketKeys = async (s3) => {
  const params = {
    Bucket: 'u.moocho.com/sqlSaved',
  };
  
  let keys = [];
  for (;;) {
    let data = await s3.listObjects(params).promise();
    
    data.Contents.forEach((elem) => {
      keys = keys.concat(elem.Key);
    });
    
    if (!data.IsTruncated) {
      break;
    }
    params.Marker = data.NextMarker;
  }
  
  return keys;
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
  getDataFromS3,
  allBucketKeys
}