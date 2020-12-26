import { v4 as uuid} from 'uuid';
import  AWS  from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
//import commonMiddleware from './lib/commonMiddleware';
import validator from '@middy/validator';
import createError from 'http-errors';  // this package helps write clean http errors
import createAuctionSchemas from './lib/schemas/createAuctionSchemas';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  
  //const { title } = JSON.parse(event.body)
  const { title } = event.body;   // now the json is parsed directly using httpJsonBodyParser
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1); 

  const auction = {
    id : uuid(),
    title,
    status : 'OPEN',
    createdAt : now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid : {      // highestBid is an object
      amount : 0,
    }
  }

  try{
    await dynamodb.put({
      TableName : process.env.AUCTIONS_TABLE_NAME,
      Item : auction
    }).promise();
  } catch(error){
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = middy(createAuction)
    .use(httpJsonBodyParser())
    .use(httpEventNormalizer())
    .use(httpErrorHandler())
    .use(validator({ inputSchema: createAuctionSchemas }));

//export const handler = commonMiddleware(createAuction);