import  AWS  from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
//import commonMiddleware from './lib/commonMiddleware';
import validator from '@middy/validator';
import createError from 'http-errors';  // this package helps write clean http errors
import getAuctionsSchemas from './lib/schemas/getAuctionsSchemas';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  const { status } = event.queryStringParameters;
  let auctions;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };

  try{
    const result = await dynamodb.query(params).promise();
    /*const result = await dynamodb.scan({
        TableName : process.env.AUCTIONS_TABLE_NAME
    }).promise();*/

    auctions = result.Items;

  }catch(error){
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = middy(getAuctions)
    .use(httpJsonBodyParser())
    .use(httpEventNormalizer())
    .use(httpErrorHandler())
    .use(validator({ inputSchema: getAuctionsSchemas, useDefaults: true}));

//export const handler = commonMiddleware(getAuctions)