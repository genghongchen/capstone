import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getProfile, createProfile, patchProfile, deleteProfile  } from '../api/profile-api'

interface EditProfileProps {
  auth: Auth
}

interface EditProfileState {
  userEmail: string
  userName: string
  newUserEmail: string
  newUserName: string
}

export class EditProfile extends React.PureComponent<
  EditProfileProps,
  EditProfileState
> {
  state: EditProfileState = {
    userEmail: "",
    userName: "",
    newUserEmail: "",
    newUserName: ""
  }

  async componentDidMount() {
    try {
      const profiles = await getProfile(this.props.auth.getIdToken())
      if (profiles.length === 0) {
        this.setState({
          userEmail: "", 
          userName: "",
          newUserEmail: "",
          newUserName: ""
        })
      } else {
        this.setState({
          userEmail: profiles[0].userEmail,
          userName: profiles[0].userName,
          newUserEmail: profiles[0].userEmail,
          newUserName: profiles[0].userName
        })
      }
    } catch (e) {
      alert(`Failed to fetch profile: ${e.message}`)
    }
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    if (!name) return

    this.setState({
      newUserName: name
    })
  }

  handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value
    if (!email) return

    this.setState({
      newUserEmail: email
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.newUserEmail) {
        alert('Email is require!')
        return
      }

      if (!this.state.newUserName) {
        alert('Name is require!')
        return
      }

      if (this.state.userEmail === "" && this.state.userName == "") {
        // Create Profile
        const newProfile = await createProfile(this.props.auth.getIdToken(), {
          userEmail: this.state.newUserEmail,
          userName: this.state.newUserName,
        })
  
        console.log(newProfile)
  
        this.setState({
          userEmail: this.state.newUserEmail,
          userName: this.state.newUserName,
        })  
      } else {
        // Update (Patch) Profile
        await patchProfile(this.props.auth.getIdToken(), {
          userEmail: this.state.newUserEmail,
          userName: this.state.newUserName
        })
        this.setState({
          userEmail: this.state.newUserEmail,
          userName: this.state.newUserName
        })
      }
    } catch (e) {
      alert('Could not create or update profile: ' + e.message)
    } finally {
      alert('Profile is successfully created or updated!')
    }
  }

  render() {
    return (
      <div>
        <h1>Update Profile</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Name</label>
            <input
              type = "text"
              value = {this.state.newUserName}
              onChange={this.handleNameChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <input
              type = "text"
              value = {this.state.newUserEmail}
              onChange={this.handleEmailChange}
            />
          </Form.Field>
          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {
    if (this.state.userEmail === "" && this.state.userName === "") {
      return (
        <div>
          <Button
            type="submit"
          >
            Create Profile
          </Button>
        </div>
      )
    } else {
      return (
        <div>
          <Button
            type="submit"
          >
            Update Profile
          </Button>
        </div>
      )
    }
  }
}