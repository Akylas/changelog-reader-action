import { ChangelogEntry } from './parse-entry'

export function getVersionById(
  versions: ChangelogEntry[],
  id: string | null = null
): ChangelogEntry | undefined {
  if (id != null) {
    return versions.find(version => version.id === id)
  }

  return [...versions]
    .filter(version => !['Unreleased', 'unreleased'].includes(version.id))
    .shift()
}
