describe('Burger constructor', () => {
  const bunName = 'Булка тестовая';
  const mainName = 'Начинка тестовая';
  const orderNumber = 12345;

  const modalsRoot = () => cy.get('#modals');
  const modalEl = () => modalsRoot().find('[class*="modal"]');

  const modalExists = () =>
    cy
      .get('body')
      .then(($body) => $body.find('#modals [class*="modal"]').length > 0);

  beforeEach(() => {
    cy.mockIngredients();
    cy.mockUser();
    cy.mockCreateOrder(orderNumber);
    cy.setAuthTokens();

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearAuthTokens();
  });

  it('adds bun and filling to constructor', () => {
    cy.addIngredient(bunName);
    cy.addIngredient(mainName);

    cy.contains(bunName).should('exist');
    cy.contains(mainName).should('exist');
  });

  it('opens and closes ingredient modal', () => {
    cy.openIngredientDetails(mainName);

    cy.contains('Детали ингредиента').should('exist');
    modalsRoot().contains(mainName).should('exist');

    modalExists().then((hasModal) => {
      if (hasModal) {
        modalEl().should('exist').and('be.visible');
        cy.closeModalByIcon();
        modalEl().should('not.exist');
      } else {
        cy.go('back');
        cy.location('pathname').should('eq', '/');
      }
    });

    cy.openIngredientDetails(mainName);

    cy.contains('Детали ингредиента').should('exist');
    modalsRoot().contains(mainName).should('exist');

    modalExists().then((hasModal) => {
      if (hasModal) {
        cy.closeModalByOverlay();
        modalEl().should('not.exist');
      } else {
        cy.go('back');
        cy.location('pathname').should('eq', '/');
      }
    });
  });

  it('creates order and clears constructor', () => {
    cy.addIngredient(bunName);
    cy.addIngredient(mainName);

    cy.contains('Оформить заказ').click();

    cy.wait('@getUser');
    cy.wait('@createOrder');

    cy.contains(String(orderNumber)).should('exist');

    modalExists().then((hasModal) => {
      if (hasModal) {
        cy.closeModalByIcon();
        modalEl().should('not.exist');
      }
    });

    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
