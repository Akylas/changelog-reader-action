const utils = require('util')
const fs = require('fs')
const core = require('@actions/core')

const { parseEntry } = require('./parse-entry')
const { getEntries } = require('./get-entries')
const { getVersionById } = require('./get-version-by-id')

const readFile  = utils.promisify(fs.readFile)

exports.main = async function main() {
  try {
    const changelogPath = core.getInput('path') || './CHANGELOG.md'
    const targetVersion = core.getInput('version')

    const rawData = await readFile(changelogPath)
    const versions = getEntries(rawData)
      .map(parseEntry)

    if (targetVersion != null) {
      const entry = versions.find(version => version.id === targetVersion)

      if (entry != null) {
        core.setOutput('logEntry', entry.text)
        return
      }
    }

    const version = getVersionById(versions, targetVersion)

    if(version == null) {
      throw new Error('No log entry found.')
    }

    core.setOutput('logEntry', version.text)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}