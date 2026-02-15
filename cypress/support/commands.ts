export {};

import ingredientsFixture from '../fixtures/ingredients.json';

declare global {
  namespace Cypress {
    interface Chainable {
      mockIngredients(): Chainable<void>;
      mockUser(): Chainable<void>;
      mockCreateOrder(orderNumber?: number): Chainable<void>;
      visitApp(path?: string): Chainable<void>;
      clearAuthTokens(): Chainable<void>;
      addIngredient(name: string): Chainable<void>;
      openIngredientDetails(name: string): Chainable<void>;
      closeModalByIcon(): Chainable<void>;
      closeModalByOverlay(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('mockIngredients', () => {
  Cypress.env('mockIngredients', true);
});

Cypress.Commands.add('mockUser', () => {
  Cypress.env('mockUser', true);
});

Cypress.Commands.add('mockCreateOrder', (orderNumber = 12345) => {
  Cypress.env('mockCreateOrder', true);
  Cypress.env('mockOrderNumber', orderNumber);
});

Cypress.Commands.add('visitApp', (path = '/') => {
  const shouldMockIngredients = Boolean(Cypress.env('mockIngredients'));
  const shouldMockUser = Boolean(Cypress.env('mockUser'));
  const shouldMockCreateOrder = Boolean(Cypress.env('mockCreateOrder'));
  const orderNumber = Number(Cypress.env('mockOrderNumber') ?? 12345);

  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem('refreshToken', 'test-refresh');
      win.document.cookie = 'accessToken=Bearer test-access; path=/';

      const originalFetch = win.fetch.bind(win);

      win.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
        const url =
          typeof input === 'string'
            ? input
            : input instanceof URL
              ? input.toString()
              : input.url;

        const method = (init?.method || 'GET').toUpperCase();

        if (
          shouldMockIngredients &&
          method === 'GET' &&
          url.includes('/ingredients')
        ) {
          return Promise.resolve(
            new win.Response(JSON.stringify(ingredientsFixture), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            })
          );
        }

        if (shouldMockUser && method === 'GET' && url.includes('/auth/user')) {
          return Promise.resolve(
            new win.Response(
              JSON.stringify({
                success: true,
                user: { email: 'test@test.com', name: 'Test' }
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              }
            )
          );
        }

        if (
          shouldMockCreateOrder &&
          method === 'POST' &&
          url.includes('/orders')
        ) {
          return Promise.resolve(
            new win.Response(
              JSON.stringify({
                success: true,
                name: 'test order',
                order: { number: orderNumber }
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              }
            )
          );
        }

        return originalFetch(input, init);
      };
    }
  });
});

Cypress.Commands.add('clearAuthTokens', () => {
  cy.clearCookie('accessToken');
  cy.clearLocalStorage();

  Cypress.env('mockIngredients', false);
  Cypress.env('mockUser', false);
  Cypress.env('mockCreateOrder', false);
  Cypress.env('mockOrderNumber', undefined);
});

Cypress.Commands.add('addIngredient', (name: string) => {
  cy.contains('li', name).contains('Добавить').click();
});

Cypress.Commands.add('openIngredientDetails', (name: string) => {
  cy.contains('li', name)
    .find('a[href*="/ingredients/"]')
    .first()
    .click({ force: true });
});

Cypress.Commands.add('closeModalByIcon', () => {
  cy.get('#modals').find('[class*="button"]').first().click({ force: true });
});

Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get('#modals').find('[class*="overlay"]').first().click({ force: true });
});
