import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateProfileRequest } from '../../requests/CreateProfileRequest'
import { CreateProfile } from '../../businessLogic/profile'
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils'

const logger = createLogger ('Create Profile')

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try{
    logger.info('Processing event: ', event)

    const newProfile: CreateProfileRequest = JSON.parse(event.body)
    const userId = getUserId(event)

    const newItem = await CreateProfile(newProfile, userId)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        newItem
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
