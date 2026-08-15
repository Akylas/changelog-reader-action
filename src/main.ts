import { promisify } from 'util'
import { readFile as fsReadFile } from 'fs'
import * as core from '@actions/core'

import { validateEntry } from './validate-entry'
import { parseEntry } from './parse-entry'
import { getEntries } from './get-entries'
import { getVersionById } from './get-version-by-id'

const readFile = promisify(fsReadFile)

export async function main(): Promise<void> {
  try {
    const changelogPath = core.getInput('path') || './CHANGELOG.md'
    const targetVersion = core.getInput('version') || null
    const validationDepth = parseInt(core.getInput('validation_depth') || '0', 10)

    if (targetVersion == null) {
      core.warning(`No target version specified. Will try to return the most recent one in the changelog file.`)
    }

    core.startGroup('Parse changelog data')
    const rawData = await readFile(changelogPath)
    const versions = getEntries(rawData)
      .map(parseEntry)

    core.info(`versions: ${versions}`)

    if (validationDepth != 0) {
      const releasedVersions = versions.filter(version => version.status != 'unreleased')
      releasedVersions
        .reverse()
        .slice(Math.max(0, releasedVersions.length - validationDepth))
        .forEach(validateEntry)
    }

    core.info(`${versions.length} version logs found`)
    core.endGroup()

    const version = getVersionById(versions, targetVersion)

    if (version == null) {
      throw new Error(`No log entry found${
        targetVersion != null
          ? ` for version ${targetVersion}`
          : ''
      }`)
    }

    core.setOutput('version', version.id)
    core.setOutput('date', version.date)
    core.setOutput('status', version.status)
    core.setOutput('changes', version.text)
  }
  catch (error) {
    core.setFailed((error as Error).message)
  }
}
