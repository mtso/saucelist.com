import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

    // <h4
    //   onClick={() => history.goBack()}
    // >Sauce List</h4>
const Modal = ({ children, history }) => (
  <div>
    <Link to='/'><h4 className='site-title'>Sauce List</h4></Link>
    {children}
  </div>
)

export default withRouter(Modal)
