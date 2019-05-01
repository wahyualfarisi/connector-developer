import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { getCurrentProfile } from '../../actions/profileActions';
import  Spinner from '../common/Spinner';
import { Link } from 'react-router-dom';

class Dashboard extends Component {

componentDidMount() {
 if(!this.props.auth.isAuthenticated){
    this.props.history.push('/login');
 }


  this.props.getCurrentProfile();
} 


  render() {

    const { user } = this.props.auth;
    const {loading, profile} = this.props.profile

    let dashboardContent;

    if(profile === null || loading){
      dashboardContent = <Spinner />;
    }else{
      //check if logged in user has profile data
      if(Object.keys(profile).length > 0 ){
        dashboardContent = <h4>DISPLAY PROFILE</h4>
      }else{
        //user is logged in but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted"> Welcome { user.name } </p>
            <p>You have not yet setup a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">Create Profiles</Link>
          </div>
        )
      }
    }

    return (
      <div className="dashboard">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1 className="display-4">Dashboard </h1>
                {dashboardContent}
              </div>
            </div>
          </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})


export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);