describe('Class diagram', () => {
  it('loads without errors', () => {
    cy.visit('/');
  });

  // TODO: add data seeding or use storybook
  it('embeds node', () => {
    cy.visit('/');

    const from = 'Имя пользователя: xsd:dateTime';
    const to = 'Требование';

    cy.contains(from).trigger('mousedown', { button: 0 });
    // click simulates move from previos pos to clicking position
    cy.contains(to).click().trigger('mouseup');

    cy.contains(from)
      .invoke('width')
      .then((width) => cy.contains(to).invoke('width').should('be.gte', width));
    cy.contains(from)
      .invoke('position')
      .then((pos) => cy.contains(to).invoke('position').its('top').should('be.lt', pos.top));
  });
});
