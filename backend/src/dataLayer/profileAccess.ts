import * as AWS  from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { ProfileItem } from '../models/ProfileItem'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger(XAWS)

export class ProfileAccess {
    constructor(
        private docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private profileTable = process.env.PROFILE_TABLE
        ) {
    }

    async GetProfile (userId: string): Promise<ProfileItem[]>{
      logger.info('Look for a profile...')

      const result = await this.docClient.query({
        TableName: this.profileTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false
      }).promise()

      return result.Items as ProfileItem[]
    }

    async CreateProfile (profileItem: ProfileItem): Promise<ProfileItem> {
      logger.info('Create a new profile...')
      
      await this.docClient.put({
          TableName: this.profileTable,
          Item: profileItem
      }).promise()

      return profileItem
    }

    async UpdateProfile (profileItem: ProfileItem): Promise<string> {      
      logger.info(`Update profile with ID: ${profileItem.userId}`)

      await this.docClient.update({
        TableName: this.profileTable,
        Key:{
          "userId": profileItem.userId,
        },
        ConditionExpression: "userId = :userId",
        UpdateExpression: "set userEmail = :userEmail, userName = :userName",
        ExpressionAttributeValues: {
          ":userId" : profileItem.userId,
          ":userEmail" : profileItem.userEmail,
          ":userName" : profileItem.userName
        },
        ReturnValues: "UPDATED_NEW"
      }).promise()

      return "Update Complete"
    }

    async DeleteProfile (userId: string): Promise<string>{
      logger.info(`Delete profile with ID: ${userId}`)
      await this.docClient.delete({
        TableName: this.profileTable,
        Key: {
          "userId": userId,
        },
        ConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId
        }
      }).promise()

      return userId
    }
  }