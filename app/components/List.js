import React, { Component } from 'react'
import request from 'superagent'
import SavorButton from './SavorButton'
import Tags from './Tags'
import { toTitleCase } from '../utils'

const reorder = (foodstuffs) => foodstuffs.sort((a, b) => b.savor_count - a.savor_count)

const Item = (props) => (
  <div className='list-item'>
    <SavorButton
      {...props}
      onSavor={props.onSavor(props.id)}
      onResetSavors={props.onResetSavors(props.id)}
    />
    <span className='foodstuff-title'><a
      title= "Find on Yelp"
      href={props.yelpUrl}
      target="_blank"
    >
      {props.location}'s
    </a> {props.name}
    </span>
    <Tags
      {...props}
      onTag={props.onTag(props.id)}
    />
  </div>
) 

class List extends Component {
  constructor(props) {
    super(props)
    
    const foodstuffs = (this.props.foodstuffs || [])
      // .map((f) => {
      //   f.name = toTitleCase(f.name)
      //   f.location = toTitleCase(f.location)
      //   return f
      // })
    
    this.state = {
      foodstuffs,
    }
  }
  
  componentDidMount() {
    // request
    //   .get('/api/foodstuff')
    //   .then((d) => d.body)
    //   .then((r) => r.foodstuffs)
    //   .then((foodstuffs) => {
    //     this.setState({foodstuffs})
    //   })
    //   .catch(console.warn)
  }
  
  savorAction(id) {
    return (e) => {
      this.setState({
        foodstuffs: this.state.foodstuffs.map((f) => {
          if (f.id === id) {
            f.user_savor_count += 1
          }
          return f
        }),
      })
    }
  }
  
  // Pass into Tags component
  tagHandlerFactory(id) {
    // Call with tag value and set as tag's onClick handler.
    return (tagName) => {
      return (e) => {
        e.preventDefault()
        let method = 'POST'
        
        const foodstuffs = this.state.foodstuffs.map((f) => {
          if (f.id === id) {
            const newTags = f.user_tags.filter((t) => t === tagName)
            
            (newTags.length === f.user_tags.length)
              ? newTags.push(tagName)
              : method = 'DELETE'
            
            f.user_tags = newTags
          }
          
          return f
        })
        
        request[method]
          ('/api/foodstuff/' + id + '/tag/' + tagName)
          .then((d) => {
            this.setState({
              foodstuffs,
            })
          })
          .catch(console.warn)
      }
    }
  }
  
          // <div key={f.id}>
          //   <div>
          //     <SavorButton
          //       {...f}
          //       isAuthenticated={this.props.isAuthenticated}
          //       onSavor={this.props.onSavor(f.id)}
          //       onResetSavors={this.props.onResetSavors(f.id)}
          //     /> <a
          //       title= "Find on Yelp"
          //       href={yelpUrl}
          //       target="_blank"
          //     >{f.location}'s
          //     </a>
          //       {f.name}
          //     <Tags
          //       {...f}
          //       isAuthenticated={this.props.isAuthenticated}
          //       onTag={this.props.onTag(f.id)}
          //     />
          //   </div> 
          // </div>
  render() {
    return (
      <div>
        {this.props.foodstuffs.map((f, i) => {
         const yelpUrl = 'https://www.yelp.com/search?find_desc=' + encodeURIComponent(f.location)// f.location.replace(/\s/, '+')
         return (
           <Item
             {...f}
             key={f.id}
             yelpUrl={yelpUrl}
             {...this.props}
             browserLocation={this.props.location}
             location={f.location}
           />
         )
        })}
        {this.props.isLoading && (
          <div>
            Loading...
          </div>
        )}
      </div>
    )
  }
}

export default List
