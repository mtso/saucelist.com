import React, { Component } from 'react'
import request from 'superagent'

class SavorButton extends Component {
  constructor(props) {
    super(props)
//     const user_count = this.props.user_savor_count || 0
    
//     this.state = {
//       count: this.props.savor_count, // - user_count,
//       user_count,
//     }
  }
  
//   increment = (e) => {
//     e.preventDefault()
    
//     this.props.isAuthenticated(() => {
    
//       const setIncrement = (count) => {
//         if (this.state.user_count >= 50) {
//           return
//         }
//         this.setState({
//           user_count: count,
//         })
//       }

//       request
//         .post(`/api/foodstuff/${this.props.id}/savor`)
//         .then((d) => {
//           if (d.body.ok && d.body.savor) {
//             setIncrement(d.body.savor.count)
//           }
//         }).catch(console.log)
      
//     })
//   }
  
//   resetSavors = (e) => {
//     e.preventDefault()
    
//     this.props.isAuthenticated(
//       () => request
//         .delete(`/api/foodstuff/${this.props.id}/savor`)
//         .then((d) => {
//           if (d.status = 200) {
//             this.setState({
//               user_count: 0,
//             })
//           }
//         })
//         .catch(console.warn)
//     )
//   }
  
  render() {
    const isShowReset = this.props.user_savor_count > 0
    
    return (
      <span className='savor-container'>
        <span className='savor-count'>{this.props.savor_count}</span>
        <button
          onClick={this.props.onSavor}
          className='savor'
        >
          Savor {this.props.savor_count} ({this.props.user_savor_count})
        </button>
        {isShowReset && (
          <button 
            onClick={this.props.onResetSavors} 
            className='reset-savors'
          >
            X
          </button>
        )}
      </span>
    )
  }
}

export default SavorButton
