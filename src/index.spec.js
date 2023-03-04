import path from 'path'

describe('index', () => {
  beforeAll(() => {
    const root = __dirname.replace('/src', '')
    chrome.runtime.getURL.mockImplementation((url) => path.join(root, url))
  })

  it('boots the extension without error', async () => {
    expect(() => import('./index')).not.toThrow()
  })
})
