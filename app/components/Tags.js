import React, { Component } from 'react'
import request from 'superagent'

class Tags extends Component {
  constructor(props) {
    super(props)
    
    const tags = this.props.user_tags || []
    
    const table = tags.reduce((t, tag) => {
      t[tag] = true
      return t
    }, {})
    
    this.state = {
      user_tags: table,
      isCreateTag: true,
      new_tag: '',
      isShowMore: false,
    }
  }
  
//   onToggle = (text) => (e) => {
//     e.preventDefault()
//     this.props.isAuthenticated(() => {
    
//       const user_tags = Object.assign(
//         {},
//         this.state.user_tags,
//         {[text]: this.state.user_tags[text] ? undefined : true}
//       )

//       // const user_tags = this.state.user_tags[text]
//       //   ? Object.assign({}, this.state.user_tags, {[text]: undefined})
//       //   : Object.assign({}, this.state.user_tags, {[text]: true})

//       const method = this.state.user_tags[text]
//         ? 'delete' : 'post'

//       request[method]
//          (`/api/foodstuff/${this.props.id}/tag/${text}`)
//         .then((data) => {
//           if (data.status === 200) {
//             this.setState({
//               user_tags,
//             })
//           }
//         })
//         .catch(console.warn)
      
//     })
//   }
  
  onChange = (e) => {
    e.preventDefault()
    this.setState({
      new_tag: e.target.value,
    })
  }

  render() {
    let tagCreator = (<button>+</button>)
    if (this.state.isCreateTag) {
      tagCreator = (
        <form
          onSubmit={this.props.onTag(this.state.new_tag)}
          className='new-tag'
        >
          <input
            type='text'
            value={this.state.new_tag}
            onChange={this.onChange}
            placeholder='New Tag'
          />
          <input type='submit' value='+' />
        </form>
      )
    }

    
    const renderInlineTag = (t) => (
      <button
        key={t}
        className={this.state.user_tags[t] ? 'bold inline-tag' : 'inline-tag'}
        onClick={this.props.onTag(t)}
      > {t}</button>
    )
    
    const renderTag = (t) => (
      <button
        key={t}
        className={this.state.user_tags[t] ? 'bold' : ''}
        onClick={this.props.onTag(t)}
      > {t}</button>
    )
    
    return (
      <span className='tags'>
        {this.props.tags.slice(0, 3).map(renderInlineTag)}
    {(
      <button
        className='more-button'
        onClick={() => this.setState({isShowMore: !this.state.isShowMore})}
      >•••</button>
    )}
        {this.state.isShowMore && (
          <div className='overflow-tags'>
            {this.props.tags.slice(3).map(renderTag)}
            {tagCreator}
          </div>
        )}
      </span>
    )
  }
}

export default Tags
