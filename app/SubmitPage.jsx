import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import request from 'superagent'
import Modal from './components/Modal'

class FoodstuffForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: '',
      name: '',
    }
  }
  
  onSubmit = (e) => {
    e.preventDefault()
    
    request
      .post(`/api/foodstuff`)
      .send(this.state)
      .then((resp) => {
        if (resp.status === 200) {
          this.props.onSubmit()
        } else {
          throw new Error('Invalid POST request')
        }
      })
      .catch(console.warn)
  }
  
  onChange = (name) => (e) => {
    e.preventDefault()
    this.setState({[name]: e.target.value})
  }
  
  render() {
    return (
      <Modal>
        <h1>New Sauce</h1>
        <form 
          className='modal-form'
          onSubmit={this.onSubmit}>
          <input
            type='text'
            onChange={this.onChange('location')}
            placeholder='Restaurant'
            name='location'
          />
          <input
            type='text'
            onChange={this.onChange('name')}
            placeholder='Sauce'
            name='name'
          />
          <input
            type='submit'
            value='Submit'
          />
        </form>
      </Modal>
    )
  }
}

class SubmitPage extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      isSubmitted: false,
    }
  }
  
  onSubmit = () => {
    this.setState({isSubmitted: true})
  }
  
  render() {
    if (!this.props.isLoggedIn) {
      return (<Redirect to='/' />)
    }
    if (this.state.isSubmitted) {
      return (<Redirect from='/submit' to='/' push />)
    }
    return (
      <FoodstuffForm
        onSubmit={this.onSubmit}
      />
    )
  }
}

export default SubmitPage
