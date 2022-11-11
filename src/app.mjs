import express from 'express'
import sharp from 'sharp'
import { $fetch } from 'ohmyfetch'

const app = express()
app.use(express.json())

const port = 3000

const svgBuffer = (text = '1') => {
  const sn = text.padStart(4, '0')
  const magic = `
  <svg width="130" height="70">
  <style>
    @font-face {
      font-family: Kamikaze;
      src: url(Kamikaze.ttf);
    }

    .title { font-size: 43px; font-weight: bold; font-family: Kamikaze; fill: #E6007A; }
  </style>
  <text x="50%" y="50%" text-anchor="middle" class="title">#${sn}</text>
</svg>
`

  return Buffer.from(magic)
}

app.post('/border', async ({ body }, res) => {
  const { url, id } = body
  const input = await $fetch(url, { responseType: 'blob' })
  const magic = await input.arrayBuffer()
  const view = new Uint8Array(magic)
  const data = await sharp(view)
    .resize(512, 512)
    .extend({
      bottom: 60,
      background: { r: 0, g: 0, b: 0, alpha: 0.1 },
    })
    .composite([
      {
        input: 'k-da.svg',
        top: 525,
        left: 10,
      },
      {
        input: 'sub0.svg',
        top: 522,
        left: 180,
      },
      {
        input: svgBuffer(id || '1'),
        top: 522,
        left: 372,
      },
    ])
    .toBuffer()

  // send that as image to the client
  // res.type('image/png')
  // res.send(buffer)
  res.type('png').send(data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
