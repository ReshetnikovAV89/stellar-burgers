describe('Burger constructor', () => {
  const bunName = 'Булка тестовая';
  const mainName = 'Начинка тестовая';
  const orderNumber = 12345;

  const modal = () =>
    cy.get('#modals').find('[class*="modal"]').should('be.visible');
  const closeByIcon = () =>
    modal().find('[class*="header"] button').first().click({ force: true });
  const closeByOverlay = () =>
    cy.get('#modals').find('[class*="overlay"]').first().click({ force: true });

  const openIngredientModal = (name: string) => {
    cy.contains(name)
      .parents('li')
      .find('a[href^="/ingredients/"]')
      .first()
      .click({ force: true });

    cy.location('pathname').should('eq', '/');
    modal();
  };

  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients*', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user*', {
      statusCode: 200,
      body: {
        success: true,
        user: { email: 'test@test.com', name: 'Test' }
      }
    }).as('getUser');

    cy.intercept('POST', '**/api/orders*', {
      statusCode: 200,
      body: {
        success: true,
        name: 'test order',
        order: { number: orderNumber }
      }
    }).as('createOrder');

    cy.setCookie('accessToken', 'Bearer test-access');
    window.localStorage.setItem('refreshToken', 'test-refresh');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('adds bun and filling to constructor', () => {
    cy.contains(bunName).parents('li').find('button').click();
    cy.contains(mainName).parents('li').find('button').click();

    cy.contains(bunName).should('exist');
    cy.contains(mainName).should('exist');
  });

  it('opens and closes ingredient modal', () => {
    openIngredientModal(mainName);
    cy.contains('Детали ингредиента').should('exist');
    cy.contains(mainName).should('exist');

    closeByIcon();
    cy.get('#modals').find('[class*="modal"]').should('not.exist');

    openIngredientModal(mainName);
    cy.contains('Детали ингредиента').should('exist');

    closeByOverlay();
    cy.get('#modals').find('[class*="modal"]').should('not.exist');
  });

  it('creates order and clears constructor', () => {
    cy.contains(bunName).parents('li').find('button').click();
    cy.contains(mainName).parents('li').find('button').click();

    cy.contains('Оформить заказ').click();

    cy.wait('@getUser');
    cy.wait('@createOrder');

    modal();
    cy.contains(orderNumber).should('exist');

    closeByIcon();
    cy.get('#modals').find('[class*="modal"]').should('not.exist');

    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
