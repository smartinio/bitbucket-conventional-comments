const suppressErrors = () => {
  cy.on('uncaught:exception', (err) => {
    return false
  })
}

// Set these in your cypress.env.json to run locally
const url = Cypress.env('PULL_REQUEST_URL')
const email = Cypress.env('BITBUCKET_EMAIL')
const password = Cypress.env('BITBUCKET_PASSWORD')

describe('chrome extension', () => {
  it('renders the buttons', () => {
    suppressErrors()
    cy.origin('https://id.atlassian.com', suppressErrors)

    cy.visit(url, { failOnStatusCode: false })

    cy.get('a').contains('Log in').click()

    cy.wait(2000)

    cy.get('input[type=email]').focus().type(email)

    cy.contains('Continue').click()

    cy.wait(2000)

    cy.get('input[type=password]').focus().type(password)

    cy.get('button').contains('Log in').click()

    cy.get('[aria-label=Diffs]').scrollIntoView()

    cy.get('[aria-label="Add file-level comment"]').click()

    // TODO: Assert extension is visible and working
  })
})
