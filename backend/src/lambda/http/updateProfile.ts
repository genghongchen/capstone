import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateProfileRequest } from '../../requests/UpdateProfileRequest'
import { createLogger } from '../../utils/logger';
import { UpdateProfile } from '../../businessLogic/profile'
import { getUserId } from '../utils'

const logger = createLogger ('Update Profile')

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try{
    logger.info("Processing event: " + event)

    const updatedProfile: UpdateProfileRequest = JSON.parse(event.body)
    const userId = getUserId(event)

    await UpdateProfile(updatedProfile, userId)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    }
  } catch (e) {
    logger.error("Error: " + e.message)
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
