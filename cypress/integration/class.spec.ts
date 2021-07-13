describe('Class diagram', () => {
  // Note the use of `before`
  before(() => {
    // Visit the storybook iframe page once per file
    cy.visitStorybook();
  });

  // Note the use of `beforeEach`
  beforeEach(() => {
    // The first parameter is the category. This is the `title` in CSF or the value in `storiesOf`
    // The second parameter is the name of the story. This is the name of the function in CSF or the value in the `add`
    // This does not refresh the page, but will unmount any previous story and use the Storybook Router API to render a fresh new story
    cy.loadStory('GraphEditor/ClassDiagram', 'LocalData');
  });

  // TODO: add data seeding or use storybook
  it('embeds node', () => {
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
