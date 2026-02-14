describe('Burger constructor', () => {
  const bunName = 'Булка тестовая';
  const mainName = 'Начинка тестовая';
  const orderNumber = 12345;

  const modalsRoot = () => cy.get('#modals');

  const modalEl = () => modalsRoot().find('[class*="modal"]');

  const overlayEl = () => modalsRoot().find('[class*="overlay"]');

  const modalExists = () =>
    cy
      .get('body')
      .then(($body) => $body.find('#modals [class*="modal"]').length > 0);

  const closeModalByIcon = () => {
    modalsRoot().find('[class*="button"]').first().click({ force: true });
  };

  const closeModalByOverlay = () => {
    overlayEl().first().click({ force: true });
  };

  const openIngredientDetails = (name: string) => {
    cy.contains('li', name).within(() => {
      cy.get('a[href*="/ingredients/"]').first().click({ force: true });
    });
  };

  const closeIngredientDetailsWhateverWay = () => {
    modalExists().then((hasModal) => {
      if (hasModal) {
        closeModalByIcon();
        modalEl().should('not.exist');
      } else {
        cy.go('back');
        cy.location('pathname').should('eq', '/');
      }
    });
  };

  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients*', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user*', {
      statusCode: 200,
      body: { success: true, user: { email: 'test@test.com', name: 'Test' } }
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
    cy.contains('li', bunName).within(() => cy.contains('Добавить').click());
    cy.contains('li', mainName).within(() => cy.contains('Добавить').click());

    cy.contains(bunName).should('exist');
    cy.contains(mainName).should('exist');
  });

  it('opens and closes ingredient modal', () => {
    openIngredientDetails(mainName);
    cy.contains('Детали ингредиента').should('exist');

    modalExists().then((hasModal) => {
      if (hasModal) {
        modalEl().should('exist').and('be.visible');
        overlayEl().should('exist').and('be.visible');
      }
    });

    closeIngredientDetailsWhateverWay();

    openIngredientDetails(mainName);
    cy.contains('Детали ингредиента').should('exist');

    modalExists().then((hasModal) => {
      if (hasModal) {
        closeModalByOverlay();
        modalEl().should('not.exist');
      } else {
        cy.go('back');
        cy.location('pathname').should('eq', '/');
      }
    });
  });

  it('creates order and clears constructor', () => {
    cy.contains('li', bunName).within(() => cy.contains('Добавить').click());
    cy.contains('li', mainName).within(() => cy.contains('Добавить').click());

    cy.contains('Оформить заказ').click();

    cy.wait('@getUser');
    cy.wait('@createOrder');

    cy.contains(String(orderNumber)).should('exist');

    modalExists().then((hasModal) => {
      if (hasModal) {
        closeModalByIcon();
        modalEl().should('not.exist');
      }
    });

    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
