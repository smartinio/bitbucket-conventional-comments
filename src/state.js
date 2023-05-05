export const state = {
  set(key, value) {
    chrome.storage.sync.set({ [key]: value })
  },
  async get(key) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(key, (result) => resolve(result[key]))
    })
  },
  async getAll() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(null, (result) => resolve(result))
    })
  },
  subscribe(value, notify) {
    state.get(value).then(notify)

    const listener = (changes) => {
      if (value in changes) {
        notify(changes[value].newValue)
      }
    }

    chrome.storage.onChanged.addListener(listener)
    return () => chrome.storage.onChanged.removeListener(listener)
  },
}
