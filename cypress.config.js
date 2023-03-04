const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    screenshotsFolder: 'cypress/out/screenshots',
    videosFolder: 'cypress/out/videos',
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        launchOptions.extensions.push('./')
        return launchOptions
      })
    },
  },
})
