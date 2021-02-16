import { apiEndpoint } from '../config'
import { Profile } from '../types/Profile';
import { CreateProfileRequest } from '../types/CreateProfileRequest';
import Axios from 'axios'
import { UpdateProfileRequest } from '../types/UpdateProfileRequest';

export async function getProfile(idToken: string): Promise<Profile[]> {
  console.log('Looking up profile')

  const response = await Axios.get(`${apiEndpoint}/profile`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Profile:', response.data)
  return response.data.items
}

export async function createProfile(
  idToken: string,
  newProfile: CreateProfileRequest
): Promise<Profile> {
  const response = await Axios.post(`${apiEndpoint}/profile`,  JSON.stringify(newProfile), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })

  return response.data.newItem
}

export async function patchProfile(
  idToken: string,
  updatedProfile: UpdateProfileRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/profile`, JSON.stringify(updatedProfile), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteProfile(
  idToken: string,
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/profile`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}
