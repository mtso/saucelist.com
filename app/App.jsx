import React, { Component } from 'react'
import { Switch, Route, Link, withRouter } from 'react-router-dom'
import request from 'superagent'
import IndexPage from './IndexPage.jsx'
import SubmitPage from './SubmitPage.jsx'
import SigninPage from './SigninPage.jsx'
import LogoutPage from './LogoutPage.jsx'
import TermsPage from './TermsPage.jsx'
import PrivacyPage from './PrivacyPage.jsx'
import List from './components/List'
import { removeDuplicates } from './utils'

const Main = (props) => (
  <div>
    <Link to="/signin">Sign In</Link>
    <Link to="/submit">Submit</Link>

    <List {...props} />
  </div>
)

const pages = {
  '/submit': SubmitPage,
  '/signin': SigninPage,
  '/logout': LogoutPage,
  '/new': IndexPage,
  '/privacy': PrivacyPage,
  '/terms': TermsPage,
  '/': IndexPage,
}

class AppActions extends Component {
  onTag = (id) => (text) => (e) => {
    e.preventDefault()
    this.isAuthenticated(() => {
      let isTagExists = false
      
      const foodstuffs = this.normalize(
        this.state.foodstuffs.map((f) => {
          if (f.id === id) {
            isTagExists = f.user_tags.includes(text)
            
            f.user_tags = isTagExists 
              ? f.user_tags.filter((t) => t !== text)
              : f.user_tags.concat(text) 
            
            if (!f.tags.includes(text)) {
              f.tags = f.tags.concat(text)
            }
            
            console.log(f)
          }
          
          return f
        })
      )
    
      const method = isTagExists ? 'delete' : 'post'

      request[method]
         (`/api/foodstuff/${id}/tag/${text}`)
        .then((data) => {
          if (data.status === 200) {
            this.setState({
              foodstuffs,
            })
          }
        })
        .catch(console.warn)
    })
  }
  
  onSavor = (id) => (e) => {
    e.preventDefault()
    
    this.isAuthenticated(() => {
    
      const setIncrement = (count) => {
        const foodstuffs = this.normalize(
          this.state.foodstuffs.map((f) => {
            if (f.id === id && f.user_savor_count <= 50) {
              f.user_savor_count = count
              f.savor_count += 1
            }
            return f
          })
        )
        
        // const foodstuffs = this.state.foodstuffs.map((f) => {
        //   if (f.id === id && f.user_savor_count <= 50) {
        //     f.user_savor_count = count
        //     f.savor_count += 1
        //   }
        //   return f
        // }).sort((a, b) => b.savor_count - a.savor_count)
        
        this.setState({
          foodstuffs,
        })
      }

      request
        .post(`/api/foodstuff/${id}/savor`)
        .then((d) => {
          if (d.body.ok && d.body.savor) {
            setIncrement(d.body.savor.count)
          }
        }).catch(console.warn)
      
    })
  }
  
  onResetSavors = (id) => (e) => {
    e.preventDefault()
    
    this.isAuthenticated(
      () => request
        .delete(`/api/foodstuff/${id}/savor`)
        .then((d) => {
          if (d.status = 200) {
            const foodstuffs = this.normalize(
              this.state.foodstuffs.map((f) => {
                if (f.id === id) {
                  f.savor_count -= f.user_savor_count
                  f.user_savor_count = 0
                }
                return f
              })
            )
            
            // const foodstuffs = this.state.foodstuffs.map((f) => {
            //   if (f.id === id) {
            //     f.savor_count -= f.user_savor_count
            //     f.user_savor_count = 0
            //   }
            //   return f
            // }).sort((a, b) => b.savor_count - a.savor_count)
            
            this.setState({
              foodstuffs,
            })
          }
        })
        .catch(console.warn)
    )
  }
  
  normalize = (foodstuffs) => {
    const table = foodstuffs.reduce((tbl, el) => {
      if (!tbl[el.id]) {
        tbl[el.id] = el
      }
      return tbl
    }, {})

    const unique = Object.keys(table).map((k) => table[k])
    
    return unique.sort((a, b) => b.savor_count - a.savor_count)
  }
}

class App extends AppActions {
  constructor(props) {
    super(props)
    
    this.state = {
      ...this.props.state,
      page: 1,
      isLoading: false,
      isAllLoaded: false,
    }
      
    this.onLogout = this.onLogout.bind(this)
    // this.onSavor = this.isAuthenticated(this.onSavor)
    
    // console.log(this.props.location)
  }
  
  getQuery = () => {
    const isNew = this.props.location.pathname === '/new'
    return isNew ? '?newest=1' : ''
  }
  
  // Passed Handlers
  
  // onSavor
  // onResetSavors
  // onTag = (text) => {}
  
  
  loadNextPage = (e) => {
    if (this.state.isAllLoaded) {
      return
    }
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if (this.state.isLoading && this.state.isAllLoaded) { return }

      this.setState({
        isLoading: true,
      }, () => {
        request
          .get(`/api/foodstuff?page=${this.state.page + 1}` + this.getQuery())
          .then((data) => {
            if (data.body.foodstuffs.length < 1) {
              return this.setState({
                isAllLoaded: true,
                isLoading: false,
              })
            }
          
            const foodstuffs = this.normalize(
              this.state.foodstuffs.concat(data.body.foodstuffs)
            )

            this.setState({
              page: this.state.page + 1,
              foodstuffs,
            }, () => setTimeout(() => {
              this.setState({
                isLoading: false,
              })
            }, 1000))
          })
          .catch(console.warn)
      }, )
    }
  }
    
  componentDidMount() {
    window.addEventListener('scroll', this.loadNextPage)
  }
    
//   reloadData = () => {
//     return request
//       .get('/api/foodstuff')
//       .then((response) => {
//         return new Promise((resolve, reject) => {
          
//           this.setState({
//             foodstuffs: response.body.foodstuffs,
//           }, resolve)
//         })
//       })
//       .catch(console.warn)
//   }
    
  onLogout() {
    return request
      .get('/auth/logout')
      .then(() => request
        .get('/api/foodstuff' + this.getQuery())
        .then((response) => {
          this.setState({
            isLoggedIn: false,
            foodstuffs: response.body.foodstuffs,
          })
        }))
        .catch(console.warn)
    .catch(console.warn)
  }
    
  isAuthenticated = (done) => {
    if (this.state.isLoggedIn) {
      return done()
    }
    
    this.props.history.push('/signin')
  }
  
  applyProps = (Component) => () => {
    return (
      <Component
        {...this.state}
        isAuthenticated={this.isAuthenticated}
        onLogout={this.onLogout}
        onSavor={this.onSavor}
        onResetSavors={this.onResetSavors}
        onTag={this.onTag}
      />
    )
  }
  
  render() {
    return (
      <Switch>
        {Object.keys(pages).map((path) => {
          const component = pages[path]
          const withProps = this.applyProps(component)
          
          return (
            <Route
              key={path}
              path={path}
              component={withProps}
              exact={path === '/' ? true : false}
            />
          )
        })}
      </Switch>
    )
  }
}

export default withRouter(App)
