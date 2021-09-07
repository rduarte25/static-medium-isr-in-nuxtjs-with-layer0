const { parse } = require('rss-to-json')
const { Router } = require('express')
const https = require('https')
const router = Router()

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const httpGet = (url) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        res.setEncoding('utf8')
        let body = ''
        res.on('data', (chunk) => (body += chunk))
        res.on('end', () => resolve(body))
      })
      .on('error', reject)
  })
}

router.use('/blogs/:username.json', async (req, res) => {
  const slug = req.params.username
  let rss = await parse(`https://medium.com/feed/@${slug}`)
  let resp = JSON.stringify(rss, null, 3)
  await timeout(1500)
  if (!resp) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        code: 0,
      })
    )
  }
  resp = JSON.parse(resp)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(
    JSON.stringify({
      resp,
      code: 1,
    })
  )
})

module.exports = router
