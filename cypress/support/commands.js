// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// ***********************************************
// Common Flashcard Commands
// ***********************************************

// Navigate to a specific card number
Cypress.Commands.add('navigateToCard', (cardNumber) => {
  while (true) {
    cy.get('#cardCount').invoke('text').then((text) => {
      const currentCard = parseInt(text.match(/Card (\d+)/)[1]);
      if (currentCard === cardNumber) return;
      if (currentCard < cardNumber) {
        cy.get('#nextBtn').click();
      } else {
        cy.get('#prevBtn').click();
      }
    });
  }
});

// Get progress bar width as a number
Cypress.Commands.add('getProgressWidth', () => {
  return cy.get('#progress')
    .invoke('css', 'width')
    .then(width => parseFloat(width));
});

// Mark all answers as specified (true for correct, false for incorrect)
Cypress.Commands.add('markAllAnswers', (correct = true) => {
  const btn = correct ? '#correctBtn' : '#incorrectBtn';
  for (let i = 0; i < 10; i++) {
    cy.get(btn).click();
    cy.wait(800); // Wait for auto-advance
  }
});

// Verify card face (front or back)
Cypress.Commands.add('verifyCardFace', (isFront) => {
  if (isFront) {
    cy.get('#question').should('be.visible');
    cy.get('#answer').should('not.be.visible');
  } else {
    cy.get('#answer').should('be.visible');
    cy.get('#question').should('not.be.visible');
  }
});

// Verify button states after marking
Cypress.Commands.add('verifyButtonStates', (correctMarked, incorrectMarked) => {
  if (correctMarked) {
    cy.get('#correctBtn').should('be.disabled').and('have.class', 'correct');
    cy.get('#incorrectBtn').should('be.enabled').and('not.have.class', 'incorrect');
  } else if (incorrectMarked) {
    cy.get('#incorrectBtn').should('be.disabled').and('have.class', 'incorrect');
    cy.get('#correctBtn').should('be.enabled').and('not.have.class', 'correct');
  } else {
    cy.get('#correctBtn').should('be.enabled').and('not.have.class', 'correct');
    cy.get('#incorrectBtn').should('be.enabled').and('not.have.class', 'incorrect');
  }
});

// Verify score values
Cypress.Commands.add('verifyScore', (correct, incorrect) => {
  cy.get('#scoreCorrect').should('contain', correct);
  cy.get('#scoreIncorrect').should('contain', incorrect);
});

// Verify card position during animation
Cypress.Commands.add('verifyCardPosition', () => {
  cy.get('.flashcard').then($card => {
    const initialRect = $card[0].getBoundingClientRect();
    cy.get('.flashcard').click()
      .then($flippedCard => {
        const flippedRect = $flippedCard[0].getBoundingClientRect();
        expect(initialRect.x).to.be.closeTo(flippedRect.x, 1);
        expect(initialRect.y).to.be.closeTo(flippedRect.y, 1);
      });
  });
});

// Verify animation duration
Cypress.Commands.add('verifyAnimationDuration', (selector, property, expectedDuration) => {
  cy.get(selector)
    .invoke('css', 'transition')
    .should('include', `${property} ${expectedDuration}s`);
}); 