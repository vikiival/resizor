import express from 'express'
import sharp from 'sharp'
import { $fetch } from 'ohmyfetch'

const app = express()
app.use(express.json())

const port = 3000

app.post('/border', async ({ body }, res) => {
  // const collection = createCollection('HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F', 'CHNK', 'Chunkies', 'ipfs://ipfs/bafkreibzeyetfssguxrzoltvluyjac7hp3bzvzgpa27jkbpek23tqkfpmi', 10000)
  const { url } = body
  const input = await $fetch(url, { responseType: 'blob' })
  const buffer = sharp(input)
  .resize(180)
  .background({r: 100, g: 0, b: 0})
  .extend({top: 10, left: 10, bottom: 20, right: 10})
  .toBuffer()
  
  // send that as image to the client
  res.type('image/png')
  res.send(buffer)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
