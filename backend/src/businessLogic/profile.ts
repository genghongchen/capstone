import { ProfileItem } from '../models/ProfileItem'
import { CreateProfileRequest } from '../requests/CreateProfileRequest'
import { UpdateProfileRequest } from '../requests/UpdateProfileRequest'
import { ProfileAccess } from '../dataLayer/profileAccess'
import { createLogger } from '../utils/logger'

const profileAccess = new ProfileAccess()
const logger = createLogger('profile')

export async function GetProfile(userId: string): Promise<ProfileItem[]>{
    logger.info('GetProfile() invoked.')
    return await profileAccess.GetProfile(userId)
}

export async function CreateProfile(createProfileRequest: CreateProfileRequest, userId: string): Promise<ProfileItem>{    
    logger.info('CreateProfile() invoked.')
    
    return await profileAccess.CreateProfile({
        userId: userId,
        userEmail: createProfileRequest.userEmail,
        userName: createProfileRequest.userName
    })
}

export async function UpdateProfile(updatedProfile: UpdateProfileRequest, userId: string): Promise<string>{
    logger.info('UpdateProfile() invoked.')
    return await profileAccess.UpdateProfile({
        userId: userId,
        userEmail: updatedProfile.userEmail,
        userName: updatedProfile.userName
    })
}

export async function DeleteProfile(userId: string): Promise<string>{
    logger.info('DeleteProfile() invoked.')
    return await profileAccess.DeleteProfile(userId)
}
