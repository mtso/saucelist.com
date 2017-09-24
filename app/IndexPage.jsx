import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import List from './components/List'

class IndexPage extends Component {
  constructor(props) {
    super(props)
  }
  
          // {this.props.location.pathname === '/new' ? (
          //   <Link
          //     className='nav-link'
          //     to='/'
          //   >
          //     Trending
          //   </Link>
          // ) : (
          //   <Link
          //     className='nav-link'
          //     to='/new'
          //   >
          //     New
          //   </Link>
          // )}
  render() {
    const nav = (this.props.isLoggedIn) ? (
      <nav>
        <Link
          className='nav-link'
          to='/submit'>Submit</Link>
        <Link
          className='nav-link'
          to='/logout'>Log Out</Link>
      </nav>
    ) : (
      <nav>
        <Link
          className='nav-link'
          to='/signin'
        >
          Sign In
        </Link>
      </nav>
    )

    return (
      <div>
        <Link to='/'><h4>Sauce List</h4></Link>
        {nav}
        <List {...this.props} />
      </div>
    )
  }
}

export default withRouter(IndexPage)
