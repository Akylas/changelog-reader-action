import { describe, test, expect } from 'vitest'
import { getVersionById } from './get-version-by-id'
import { ChangelogEntry } from './parse-entry'

describe('getVersionById', () => {
  test('get latest if no version provided', () => {
    const input: ChangelogEntry[] = [
      {
        id: 'Unreleased',
        date: undefined,
        status: 'unreleased',
        text: `blablabla`
      },
      {
        id: 'v2.0.2',
        date: '2019-12-08',
        status: 'released',
        text: `blablabla`
      },
      {
        id: 'v2.0.1',
        date: '2019-12-02',
        status: 'released',
        text: `blablabla`
      }
    ]
    const output = getVersionById(input)

    expect(output!.id).toEqual(input[1].id)
  })

  test('return null if bad version provided', () => {
    const input: ChangelogEntry[] = [
      {
        id: 'Unreleased',
        date: undefined,
        status: 'unreleased',
        text: `blablabla`
      },
      {
        id: 'v2.0.2',
        date: '2019-12-08',
        status: 'released',
        text: `blablabla`
      },
      {
        id: 'v2.0.1',
        date: '2019-12-02',
        status: 'released',
        text: `blablabla`
      }
    ]
    const output = getVersionById(input, 'v1.2.12')

    expect(output).toBeUndefined()
  })

  test('support X.X.X version patern', () => {
    const input: ChangelogEntry[] = [
      {
        id: 'Unreleased',
        date: undefined,
        status: 'unreleased',
        text: `blablabla`
      },
      {
        id: 'v2.0.2',
        date: '2019-12-08',
        status: 'released',
        text: `blablabla`
      },
      {
        id: '2.0.1',
        date: '2019-12-02',
        status: 'released',
        text: `blablabla`
      },
      {
        id: '1.13.2',
        date: '2019-12-02',
        status: 'released',
        text: `blablabla`
      }
    ]
    const output = getVersionById(input, '2.0.1')

    expect(output!.id).toEqual('2.0.1')
  })

  test('get the correct version', () => {
    const input: ChangelogEntry[] = [
      {
        id: 'Unreleased',
        date: undefined,
        status: 'unreleased',
        text: `blablabla`
      },
      {
        id: 'v2.1.1',
        date: '2019-12-08',
        status: 'released',
        text: `blablabla`
      },
      {
        id: 'v2.1.0',
        date: '2019-12-02',
        status: 'released',
        text: `blablabla`
      },
      {
        id: 'v2.0.0',
        date: '2019-12-02',
        status: 'released',
        text: `blablabla`
      },
      {
        id: 'v1.2.12',
        date: '2019-12-02',
        status: 'released',
        text: `blablabla`
      },
    ]
    const output = getVersionById(input, 'v2.1.0')

    expect(output!.id).toEqual(input[2].id)
  })

  test('get the unreleased version', () => {
    const input: ChangelogEntry[] = [
      {
        id: 'Unreleased',
        date: undefined,
        status: 'unreleased',
        text: `blablabla`
      },
      {
        id: 'v2.1.1',
        date: '2019-12-08',
        status: 'released',
        text: `blablabla`
      },
      {
        id: 'v2.1.0',
        date: '2019-12-02',
        status: 'released',
        text: `blablabla`
      },
      {
        id: 'v2.0.0',
        date: '2019-12-02',
        status: 'released',
        text: `blablabla`
      },
      {
        id: 'v1.2.12',
        date: '2019-12-02',
        status: 'released',
        text: `blablabla`
      },
    ]
    const output = getVersionById(input, 'Unreleased')

    expect(output!.id).toEqual(input[0].id)
  })
})
