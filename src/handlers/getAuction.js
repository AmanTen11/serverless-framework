import  AWS  from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
//import commmonMiddleware from './lib/commonMiddleware';
import createError from 'http-errors';  // this package helps write clean http errors

const dynamodb = new AWS.DynamoDB.DocumentClient();

//refactoring code to make it reuable 

export async function getAuctionById(id){
  let auction; 
  try{
    const result = await dynamodb.get({
        TableName : process.env.AUCTIONS_TABLE_NAME,
        Key : { id }
    }).promise();
    auction = result.Item;

  }catch(error){
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if(!auction){
    throw new createError.NotFound(`Auction with ID : "${id}" not found!`);
  }

  return auction;
}

async function getAuction(event, context) {
  //let auction;
  const { id } = event.pathParameters;
  // refactored code 
  const auction = await getAuctionById(id);
  // try{
  //   const result = await dynamodb.get({
  //       TableName : process.env.AUCTIONS_TABLE_NAME,
  //       Key : { id }
  //   }).promise();
  //   auction = result.Item;

  // }catch(error){
  //   console.error(error);
  //   throw new createError.InternalServerError(error);
  // }

  // if(!auction){
  //   throw new createError.NotFound(`Auction with ID : "${id}" not found!`);
  // }

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = middy(getAuction)
    .use(httpJsonBodyParser())
    .use(httpEventNormalizer())
    .use(httpErrorHandler());

//export const handler = commmonMiddleware(getAuction)