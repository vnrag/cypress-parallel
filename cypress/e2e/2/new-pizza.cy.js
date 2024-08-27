describe('Create pizza', () => {
  beforeEach(() => {
    
    cy.fixture('pizzas').then((pizzas) => {
      cy.intercept('GET', '/api/pizzas', pizzas).as('getPizzas');
    });

    cy.intercept({ method: 'POST', url: '/api/pizzas' }).as('postNewPizza');

    cy.visit('');
  });

  it('should have the right placeholder', () => {
    cy.wait(5000);

    cy.get('.products__new a').click();
    cy.get('.pizza-form__input').should('have.value', '');
    cy.get('.pizza-form__input')
      .invoke('attr', 'placeholder')
      .should('eq', 'e.g. Pepperoni');
  });

  it('should show an error when pizza has no name ', () => {
    cy.get('.products__new a').click();
    cy.get('.pizza-form__input').focus('');
    cy.get('.pizza-form__input').blur();

    cy.get('.pizza-form__error').should('contain', 'Pizza must have a name');
  });

  it('should create a new pizza correctly', () => {
    cy.get('.products__new a').click();

    cy.get('.pizza-form__input').type('My new pizza');
    cy.get('.pizza-toppings-item').contains('bacon').click();
    cy.get('.pizza-toppings-item').contains('basil').click();
    cy.get('.pizza-toppings-item').contains('tomato').click();

    cy.get('button').contains('Create Pizza').click();

    // This test intentionally fail
    cy.wait('@postNewPizza')
      .its('request.body')
      .then((res) => {
        expect(res.name).to.equal('My new pizza');
        expect(res.toppings).to.deep.equal([
          { id: 2, name: 'bacon' },
          { id: 3, name: 'basil' },
          { id: 12, name: 'tomato' }
        ]);
      });
  });
});
