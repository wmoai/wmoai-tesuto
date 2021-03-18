import * as fs from 'fs'

const stream = fs.createReadStream(`${__dirname}/../CHANGELOG.md`, {
  encoding: 'utf8',
  highWaterMark: 1024,
})
const outputPath = '/tmp/CURRENT_CHANGELOG.md'

let buffer = ''

stream.on('data', (chunk) => {
  buffer += chunk.toString('utf8')
  const matched = buffer.match(/#+\s\[?\d+\.\d+.\d+\]?/g)
  if (matched === null || matched.length < 2) {
    return
  }
  const prevHeader = matched[1]
  const prevHeaderIndex = buffer.indexOf(prevHeader)
  const currentChangelog = buffer.slice(0, prevHeaderIndex - 1)
  fs.writeFileSync(outputPath, currentChangelog)
  stream.destroy()
})

stream.on('error', (err) => {
  throw err
})

stream.on('end', () => {
  // This will only runs if two version headers are not found.
  fs.writeFileSync(outputPath, buffer)
})

