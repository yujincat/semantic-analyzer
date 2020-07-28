// semantic
import report from 'vfile-reporter'
import unified from 'unified'
import english from 'retext-english'
import stringify from 'retext-stringify'
import passive from 'retext-passive'

// webhook
import express from 'express'
const app = express()
import bodyParser from 'body-parser'

const PORT = 3000

app.use(bodyParser.json())

app.post('/comment', function (req, res) {
  const jsonBody = req.body
  const comment = jsonBody.comment.body
  const commentAction = jsonBody.action
  if (comment && (commentAction === 'created' || commentAction === 'edited')) {
    const result = passiveAnalysis(comment)
    // const commentUrl = jsonBody.comment.html_url
    // later we want to make a row of comment, result, and url and report it once a week or something like that..
  }

  res.status(200).end('ok')
})

process.on('exit', function () {
})

var server = app.listen(PORT, function () {
  console.log(`Listening on port ${server.address().port}`)
})

function passiveAnalysis(content) {
  return unified()
    .use(english)
    .use(passive)
    .use(stringify)
    .process(content, function (err, file) {
      const result = report(err || file)
      console.log(result)
      return result
    })
}


