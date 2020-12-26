import  AWS  from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
//import commonMiddleware from './lib/commonMiddleware';
import createError from 'http-errors';  // this package helps write clean http errors
import validator from '@middy/validator';
import { getAuctionById } from './getAuction';
import placeBidSchemas from './lib/schemas/placeBidSchemas';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  
  const { id } = event.pathParameters;
  //const { amount } = JSON.parse(event.body);
  const { amount } = event.body; 
  //console.log(amount); 

  const auction = await getAuctionById(id);

  if(auction.status !== 'OPEN'){
    throw new createError.Forbidden(`You cannot bid on closed auctions!`);
  }

  if(amount <= auction.highestBid.amount){
    throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}!`);
  }

  const params = {
      TableName : process.env.AUCTIONS_TABLE_NAME,
      Key : { id },
      UpdateExpression : 'set highestBid.amount = :amount',
      ExpressionAttributeValues : {
        ':amount' : amount,
      },
      ReturnValues : 'ALL_NEW',    
  }

  let updatedAuction;

  try{
    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes;
  }catch(error){
    console.log(error);
    throw new createError.InternalServerError(error);
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = middy(placeBid)
    .use(httpJsonBodyParser())
    .use(httpEventNormalizer())
    .use(httpErrorHandler())
    .use(validator({ inputSchema: placeBidSchemas }));

//export const handler = commonMiddleware(placeBid);