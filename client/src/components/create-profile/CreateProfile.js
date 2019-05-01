import React, { Component } from "react";
import { withRouter  } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextFieldGroup from "./../common/TextFieldGroup";
import InputGroup from "./../common/InputGroup";
import SelectListGroup from "./../common/SelectListGroup";

//profile actions
import { createProfile } from '../../actions/profileActions';

class CreateProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displaySocialInputs: false,
      handle: "",
      company: "",
      website: "",
      location: "",
      status: "",
      skills: "",
      githubusername: "",
      bio: "",
      twitter: "",
      facebook: "",
      linkedin: "",
      youtube: "",
      instagram: "",
      errors: {}
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.errors){
      this.setState({ errors: nextProps.errors })
    }

  }

  onSubmit = e => {
    e.preventDefault();

    const profileData = {
      handle: this.state.handle,
      company: this.state.company,
      website: this.state.website,
      location: this.state.location,
      status: this.state.status,
      skills: this.state.skills,
      githubusername: this.state.githubusername,
      bio: this.state.bio,
      twitter: this.state.twitter,
      facebook: this.state.facebook,
      linkedin: this.state.linkedin,
      youtube: this.state.youtube,
      instagram: this.state.instagram
    }

    this.props.createProfile(profileData, this.props.history); 
    // console.log(profileData);
    
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onDisplaySocialMediaInputs = e => {
    e.preventDefault();
    this.setState(prevState => ({
      displaySocialInputs: !prevState.displaySocialInputs
    }));
  };

  render() {
    const { errors, displaySocialInputs } = this.state;

    let socialInputs;

    if (displaySocialInputs) {
      socialInputs = (
        <div>
          <InputGroup
            placeholder="Twitter profile url"
            name="twitter"
            icon="fab fa-twitter"
            value={this.state.twitter}
            onChange={this.onChange}
            error={errors.twitter}
          />
          <InputGroup
            placeholder="Facebook profile url"
            name="facebook"
            icon="fab fa-facebook"
            value={this.state.facebook}
            onChange={this.onChange}
            error={errors.facebook}
          />
          <InputGroup
            placeholder="Linkedin profile url"
            name="linkedin"
            icon="fab fa-linkedin"
            value={this.state.linkedin}
            onChange={this.onChange}
            error={errors.linkedin}
          />
          <InputGroup
            placeholder="youtube profile url"
            name="youtube"
            icon="fab fa-youtube"
            value={this.state.youtube}
            onChange={this.onChange}
            error={errors.youtube}
          />
          <InputGroup
            placeholder="instagram profile url"
            name="instagram"
            icon="fab fa-instagram"
            value={this.state.instagram}
            onChange={this.onChange}
            error={errors.instagram}
          />
        </div>
      );
    }

    //select options for status
    const options = [
      { label: "* Select Profesional Status", value: 0 },
      { label: "Developer", value: "Developer" },
      { label: "Software Engineer", value: "Software Engineer" },
      { label: "Developer Engineer", value: "Developer Engineer" },
      { label: "Android Engineer", value: "Android Engineer" },
      { label: "Ios Engineer", value: "Ios Engineer" },
      { label: "Full Stack Engineer", value: "Full Stack Engineer" },
      { label: "System Engineer", value: "System Engineer" },
      { label: "Other", value: "Other" }
    ];

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Create Your Profile</h1>
              <p className="lead text-center">
                Let's get some information to make your profile standout
              </p>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder=" * Profile handle "
                  name="handle"
                  value={this.state.handle}
                  onChange={this.onChange}
                  error={errors.handle}
                  info="A unique handle for yout profile Url . You full name, company name, nickname "
                />

                <SelectListGroup
                  placeholder="status"
                  name="status"
                  value={this.state.status}
                  options={options}
                  error={errors.status}
                  info="Give me us your carrer"
                  onChange={this.onChange}
                />

                <TextFieldGroup
                  placeholder="Company "
                  name="company"
                  value={this.state.company}
                  onChange={this.onChange}
                  error={errors.company}
                  info="could be your own company or one you work for"
                />

                <TextFieldGroup
                  placeholder="Website "
                  name="website"
                  value={this.state.website}
                  onChange={this.onChange}
                  info="Add Your Site"
                />

                <TextFieldGroup
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  info="Add location"
                />

                <TextFieldGroup
                  placeholder="Add Your Skills"
                  name="skills"
                  value={this.state.skills}
                  onChange={this.onChange}
                  error={errors.skills}
                  info="Add your skills Example: Javascript, html, css "
                />

                <TextFieldGroup
                  placeholder="Github username"
                  name="githubusername"
                  value={this.state.githubusername}
                  onChange={this.onChange}
                  info="Enter your github username to integrated repository on devConnector"
                />

                <TextFieldGroup
                  placeholder="Bio"
                  name="bio"
                  value={this.state.bio}
                  onChange={this.onChange}
                />

                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      this.setState(prevState => ({
                        displaySocialInputs: !prevState.displaySocialInputs
                      }));
                    }}
                    className="btn btn-light"
                  >
                    Add Social Netwotk Links
                  </button>
                  <span className="text-muted">Optional</span>
                </div>
                {socialInputs}
                <input
                  type="submit"
                  className="btn btn-lg btn-info btn-block"
                  value="Create Profile"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.error
});

export default connect(
  mapStateToProps,
  { createProfile }
)( withRouter(CreateProfile));
