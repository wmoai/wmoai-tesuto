import * as fs from 'fs'

const stream = fs.createReadStream(`${__dirname}/../CHANGELOG.md`, {
  encoding: 'utf8',
  highWaterMark: 1024,
})

let buffer = ''

stream.on('data', (chunk) => {
  buffer += chunk.toString('utf8')
  // The changelog after the second release header is for old version.
  // Therefore, the part before that is considered as the changelog for current release.
  const matched = buffer.match(/#+\s\[?\d+\.\d+.\d+\]?/g)
  if (matched === null || matched.length < 2) {
    return
  }
  const prevHeader = matched[1]
  const prevHeaderIndex = buffer.indexOf(prevHeader)
  const currentChangelog = buffer.slice(0, prevHeaderIndex - 1)
  console.log(currentChangelog)
  stream.destroy()
})

stream.on('error', (err) => {
  // If error, output nothing.
})

stream.on('end', () => {
  // This will only runs if two version headers are not found.
  // In this case, the whole changelog is considered as the changelog for current release.
  console.log(buffer)
})

