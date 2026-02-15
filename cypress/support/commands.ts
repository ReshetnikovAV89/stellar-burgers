export {};

declare global {
  namespace Cypress {
    interface Chainable {
      mockIngredients(): Chainable<void>;
      mockUser(): Chainable<void>;
      mockCreateOrder(orderNumber?: number): Chainable<void>;
      setAuthTokens(): Chainable<void>;
      clearAuthTokens(): Chainable<void>;
      addIngredient(name: string): Chainable<void>;
      openIngredientDetails(name: string): Chainable<void>;
      closeModalByIcon(): Chainable<void>;
      closeModalByOverlay(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('mockIngredients', () => {
  cy.intercept('GET', '**/api/ingredients*', {
    fixture: 'ingredients.json'
  }).as('getIngredients');
});

Cypress.Commands.add('mockUser', () => {
  cy.intercept('GET', '**/api/auth/user*', {
    statusCode: 200,
    body: { success: true, user: { email: 'test@test.com', name: 'Test' } }
  }).as('getUser');
});

Cypress.Commands.add('mockCreateOrder', (orderNumber = 12345) => {
  cy.intercept('POST', '**/api/orders*', {
    statusCode: 200,
    body: { success: true, name: 'test order', order: { number: orderNumber } }
  }).as('createOrder');
});

Cypress.Commands.add('setAuthTokens', () => {
  cy.setCookie('accessToken', 'Bearer test-access');
  cy.window().then((win) => {
    win.localStorage.setItem('refreshToken', 'test-refresh');
  });
});

Cypress.Commands.add('clearAuthTokens', () => {
  cy.clearCookie('accessToken');
  cy.clearLocalStorage();
});

Cypress.Commands.add('addIngredient', (name: string) => {
  cy.contains('li', name).within(() => cy.contains('Добавить').click());
});

Cypress.Commands.add('openIngredientDetails', (name: string) => {
  cy.contains('li', name).within(() => {
    cy.get('a[href*="/ingredients/"]').first().click({ force: true });
  });
});

Cypress.Commands.add('closeModalByIcon', () => {
  cy.get('#modals').find('[class*="button"]').first().click({ force: true });
});

Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get('#modals').find('[class*="overlay"]').first().click({ force: true });
});
