import React, { Component } from 'react'
import List from './components/List'
import { Switch, Route } from 'react-router-dom'
import SubmitPage from './SubmitPage.jsx'

const Main = () => (
  <div>
    <a href="/auth/twitter">Log In</a>
    <List />
  </div>
)

// const App = ({ state }) => (
//   <Switch>
//     <Route exact path='/' component={Main} />
//     <Route path='/submit' component={SubmitPage} />
//   </Switch>
// )

class App extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      ...this.props,
    }
  }
    
  render() {
    <Switch>
      <Route exact path='/' component={Main} {...this.state} />
      <Route path='/submit' component={SubmitPage} {...this.state} />
    </Switch>
  }
}

export default App
