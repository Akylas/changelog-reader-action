import { prerelease } from 'semver'

export interface ChangelogEntry {
  id: string
  date: string | undefined
  status: 'released' | 'prereleased' | 'unreleased' | 'yanked'
  text: string
  changes?: string
}

export function parseEntry(entry: string): ChangelogEntry {
  const [title, ...other] = entry
    .trim()
    .split('\n')

  const [versionPart, datePart] = title.split(' - ')
  const versionMatch = versionPart.match(/[a-zA-Z0-9.\-+]+/)
  const versionNumber = versionMatch ? versionMatch[0] : ''
  const dateMatch = datePart != null && datePart.match(/[0-9-]+/)
  const versionDate = dateMatch ? dateMatch[0] : undefined

  return {
    id: versionNumber,
    date: versionDate || undefined,
    status: computeStatus(versionNumber, title),
    text: other
      .filter(item => !/\[.*\]: http/.test(item))
      .join('\n')
  }
}

function computeStatus(version: string, title: string): ChangelogEntry['status'] {
  if (prerelease(version)) {
    return 'prereleased'
  }

  if (title.match(/\[yanked\]/i)) {
    return 'yanked'
  }

  if (title.match(/\[unreleased\]/i)) {
    return 'unreleased'
  }

  return 'released'
}
