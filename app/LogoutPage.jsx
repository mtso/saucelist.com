import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import request from 'superagent'

class LogoutPage extends Component {
  constructor(props) {
    super(props)
  }
  
  componentDidMount() {
    this.props.onLogout()
      .catch(console.warn)
  }
  
  // componentDidUpdate() {
  //   this.props.onLogout()
  //     .catch(console.warn)
  // }
  
  render() {
    if (this.props.isLoggedIn) {
      return (<div></div>)
    } else {
      return (<Redirect to='/' />)
    }
  }
}

export default withRouter(LogoutPage)
