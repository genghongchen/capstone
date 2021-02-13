import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger';
import { GetProfile } from '../../businessLogic/profile'
import { getUserId } from '../utils'

const logger = createLogger ('Get Profile Items')

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {  
  try{
    logger.info('Processing event: ', event)

    const userId = getUserId(event)
    const profiles = await GetProfile(userId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: profiles
      })
    }
  } catch (e) {
    logger.error('Error: ' + e.message)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: e.message
    }
  }
}
