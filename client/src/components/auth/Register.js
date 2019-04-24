import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "./../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
    this.changeValue = this.changeValue.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  };

  componentDidMount() {
    document.all[9].textContent = "Register | DevConnector";

    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  changeValue(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const newUSer = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUSer, this.props.history);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your DevConnector account
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.changeValue}
                  error={errors.name}
                  placeholder="Enter Your Name"
                />

                <TextFieldGroup
                  type="text"
                  name="email"
                  value={this.state.email}
                  onChange={this.changeValue}
                  error={errors.email}
                  placeholder="Enter Email Address"
                  info="This site uses Gravatar so if you want a profile image, use
                  a Gravatar email"
                />

                <TextFieldGroup
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.changeValue}
                  error={errors.password}
                  placeholder="Enter Password"
                />

                <TextFieldGroup
                  type="password"
                  name="password2"
                  value={this.state.password2}
                  onChange={this.changeValue}
                  error={errors.password2}
                  placeholder="Confirm Your Password"
                />

                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.error
});

const mapDispatchToProps = dispatch => {
  return {
    registerUser: (data, history) => dispatch(registerUser(data, history))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Register));
