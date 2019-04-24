import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { getCurrentProfile } from '../../actions/profileActions';

class Dashboard extends Component {

componentDidMount() {
 if(!this.props.auth.isAuthenticated){
    this.props.history.push('/login');
 }


  this.props.getCurrentProfile();
} 


  render() {
    return (
      <div>
            <h1>Dashboard</h1>
      </div>
    )
  }
}

const mapStateToProps = state => ({
    auth: state.auth
})


export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);