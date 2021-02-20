import * as React from 'react'
import { Form, Button, Grid } from 'semantic-ui-react'
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

    this.setState({
      newUserName: name
    })
  }

  handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value

    this.setState({
      newUserEmail: email
    })
  }

  handleDelete = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (this.state.userEmail !== "" || this.state.userName !== "") {
        await deleteProfile(this.props.auth.getIdToken())
        this.setState({
          userEmail: "",
          userName: "",
          newUserEmail: "",
          newUserName: ""
        })
      }
    } catch (e) {
      alert('Could not delete profile: ' + e.message)
    } finally {
      alert('Profile is successfully deleted!')
    }
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    if (!this.state.newUserEmail) {
      alert('Email is require!')
      return
    }

    if (!this.state.newUserName) {
      alert('Name is require!')
      return
    }

    if (this.state.userEmail === "" && this.state.userName === "") {
      try {
        // Create Profile
        const newProfile = await createProfile(this.props.auth.getIdToken(), {
          userEmail: this.state.newUserEmail,
          userName: this.state.newUserName,
        })
  
        console.log(newProfile)
  
        this.setState({
          userEmail: this.state.newUserEmail,
          userName: this.state.newUserName
        })
      } catch (e) {
        alert('Could not create profile: ' + e.message)
      } finally {
        alert('Profile is successfully created!')
      } 
    } else {
      try {
        // Update (Patch) Profile
        await patchProfile(this.props.auth.getIdToken(), {
          userEmail: this.state.newUserEmail,
          userName: this.state.newUserName
        })
        this.setState({
          userEmail: this.state.newUserEmail,
          userName: this.state.newUserName
        })
      } catch (e) {
        alert('Could not update profile: ' + e.message)
      } finally {
        alert('Profile is successfully updated!')
      }
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
          <div>
            {this.renderButton()}
            {this.renderDelButton()}
          </div>
        </Form>
      </div>
    )
  }

  renderButton() {
    if (this.state.userEmail === "" && this.state.userName === "") {
      return (
        <Button
          type="submit"
        >
          Create Profile
        </Button>
      )
    } else {
      return (
        <Button
          type="submit"
        >
          Update Profile
        </Button>
      )
    }
  }

  renderDelButton() {
    if (this.state.userEmail === "" && this.state.userName === "") {
      return (
        null
      )
    } else {
      return (
        <Button
           type="submit"
           onClick={this.handleDelete}
        >
          Delete Profile
        </Button>
      )
    }
  }
}
