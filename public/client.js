// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  document.getElementById('tag-form')
    .addEventListener('submit', function(e) {
    console.log(e)
    e.preventDefault()
    var foodstuff_id = e.target.elements['foodstuff_id'].value
    var text = e.target.elements['tag'].value
    superagent
      .post('/api/foodstuff/' + foodstuff_id + '/tag')
      .send({text: text})
      .then(function(d) {
            console.log(d.body)
            })
      .catch(console.warn)
  })
  
  document.getElementById('del-tag-form')
    .addEventListener('submit', function(e) {
    console.log(e)
    e.preventDefault()
    var foodstuff_id = e.target.elements['foodstuff_id'].value
    var text = e.target.elements['tag'].value
    superagent
      .delete('/api/foodstuff/' + foodstuff_id + '/tag/' + text)
      // .send({text: text})
      .then(function(d) {
            console.log(d.body)
            })
      .catch(console.warn)
  })
});
