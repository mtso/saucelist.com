import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import request from 'superagent'
import Modal from './components/Modal'

// class SigninPage extends Component {
//   render() {
//     return (
//       <div>
//         <h1>Sign In</h1>
//         <a href='/auth/twitter'>Continue with Twitter</a>
//       </div>
//     )
//   }
// }

const SigninPage = () => (
  <Modal>
    <h1>Sign In</h1>
    <p>
      <a href='/auth/twitter'>Continue with Twitter</a>
    </p>
    <p>
      <a href='/auth/google'>Continue with Google</a>
    </p>
    
  </Modal>
)
    // <p>
    //   <a href='/auth/facebook'>Continue with Facebook</a>
    // </p>

    // <p>
    //   <a href='/auth/instagram'>Continue with Instagram</a>
    // </p>

module.exports = SigninPage
