describe('Flashcards Application', () => {
  beforeEach(() => {
    // Visit the flashcards page before each test
    cy.visit('flashcards.html')
  })

  describe('Initial Load Tests', () => {
    it('should load with correct initial state', () => {
      // Check initial card display
      cy.get('#question').should('be.visible')
      cy.get('#cardCount').should('contain', 'Card 1 of 10')
      cy.get('#progress').should('have.css', 'width', '34px')
      cy.get('#scoreCorrect').should('contain', '0')
      cy.get('#scoreIncorrect').should('contain', '0')
    })

    it('should have all buttons enabled initially', () => {
      cy.get('#prevBtn').should('be.enabled')
      cy.get('#nextBtn').should('be.enabled')
      cy.get('#correctBtn').should('be.enabled')
      cy.get('#incorrectBtn').should('be.enabled')
    })
  })

  describe('Card Flip Tests', () => {
    it('should flip card on click', () => {
      cy.get('.flashcard').click()
      cy.get('.flashcard').should('have.class', 'flipped')
      cy.get('#answer').should('be.visible')
    })

    it('should flip back when clicked again', () => {
      cy.get('.flashcard').click()
      cy.get('.flashcard').click()
      cy.get('.flashcard').should('not.have.class', 'flipped')
      cy.get('#question').should('be.visible')
    })

    it('should flip card on spacebar press', () => {
      cy.get('body').type(' ')
      cy.get('.flashcard').should('have.class', 'flipped')
    })
  })

  describe('Navigation Tests', () => {
    it('should navigate to next card', () => {
      cy.get('#nextBtn').click()
      cy.get('#cardCount').should('contain', 'Card 2 of 10')
      cy.get('#progress').should('have.css', 'width', '68px')
    })

    it('should navigate to previous card', () => {
      cy.get('#nextBtn').click()
      cy.get('#prevBtn').click()
      cy.get('#cardCount').should('contain', 'Card 1 of 10')
    })

    it('should loop from last to first card', () => {
      // Click next 10 times to reach the end
      for(let i = 0; i < 10; i++) {
        cy.get('#nextBtn').click()
      }
      cy.get('#cardCount').should('contain', 'Card 1 of 10')
    })

    it('should support keyboard navigation', () => {
      cy.get('body').type('{rightArrow}')
      cy.get('#cardCount').should('contain', 'Card 2 of 10')
      cy.get('body').type('{leftArrow}')
      cy.get('#cardCount').should('contain', 'Card 1 of 10')
    })
  })

  describe('Answer Marking Tests', () => {
    it('should mark answer as correct', () => {
      cy.get('#correctBtn').click()
      cy.get('#scoreCorrect').should('contain', '1')
      cy.get('#correctBtn').should('be.disabled')
      cy.get('#incorrectBtn').should('be.enabled')
    })

    it('should mark answer as incorrect', () => {
      cy.get('#incorrectBtn').click()
      cy.get('#scoreIncorrect').should('contain', '1')
      cy.get('#incorrectBtn').should('be.disabled')
      cy.get('#correctBtn').should('be.enabled')
    })

    it('should allow changing answer from correct to incorrect', () => {
      cy.get('#correctBtn').click()
      cy.get('#incorrectBtn').click()
      cy.get('#scoreCorrect').should('contain', '0')
      cy.get('#scoreIncorrect').should('contain', '1')
    })

    it('should auto-advance after marking answer', () => {
      cy.get('#correctBtn').click()
      cy.get('#cardCount').should('contain', 'Card 2 of 10')
    })
  })

  describe('Progress Tracking Tests', () => {
    it('should update progress bar correctly', () => {
      cy.get('#progress').should('have.css', 'width', '34px')
      cy.get('#nextBtn').click()
      cy.get('#progress').should('have.css', 'width', '68px')
    })

    it('should maintain scores during navigation', () => {
      cy.get('#correctBtn').click()
      cy.get('#prevBtn').click()
      cy.get('#scoreCorrect').should('contain', '1')
    })
  })

  describe('Perfect Score Tests', () => {
    it('should show confetti on perfect score', () => {
      // Mark all answers as correct
      for(let i = 0; i < 10; i++) {
        cy.get('#correctBtn').click()
        cy.wait(800) // Wait for auto-advance and state updates
      }
      cy.wait(2000) // Wait for confetti to appear
      cy.get('.confetti').should('exist')
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid card flipping', () => {
      for(let i = 0; i < 5; i++) {
        cy.get('.flashcard').click()
        cy.get('.flashcard').click()
      }
      cy.get('.flashcard').should('not.have.class', 'flipped')
    })

    it('should handle rapid navigation', () => {
      for(let i = 0; i < 5; i++) {
        cy.get('#nextBtn').click()
        cy.get('#prevBtn').click()
      }
      cy.get('#cardCount').should('contain', 'Card 1 of 10')
    })

    it('should handle rapid answer changes', () => {
      cy.get('#correctBtn').click()
      cy.get('#incorrectBtn').click()
      cy.get('#correctBtn').click()
      cy.get('#scoreCorrect').should('contain', '1')
      cy.get('#scoreIncorrect').should('contain', '0')
    })
  })

  describe('Visual Tests', () => {
    it('should have correct button states', () => {
      cy.get('#correctBtn')
        .should('have.css', 'background-color')
        .and('match', /rgb\(124, 58, 237\)/)
      
      cy.get('#correctBtn').click()
      cy.get('#correctBtn')
        .should('have.css', 'opacity', '0.6')
        .and('be.disabled')
    })

    it('should maintain card position during flip', () => {
      // Get initial position
      cy.get('.flashcard').then($card => {
        const initialPosition = $card[0].getBoundingClientRect()
        
        // Flip card
        cy.get('.flashcard').click()
        
        // Check position after flip
        cy.get('.flashcard').then($flippedCard => {
          const flippedPosition = $flippedCard[0].getBoundingClientRect()
          expect(initialPosition.x).to.equal(flippedPosition.x)
          expect(initialPosition.y).to.equal(flippedPosition.y)
        })
      })
    })
  })
}) 

describe('Card Display and Content Tests', () => {
  beforeEach(() => {
    cy.visit('/flashcards.html');
  });

  describe('1. Initial Load', () => {
    it('1.1. Verify first question is displayed by default', () => {
      cy.get('#question').should('be.visible')
        .and('contain', 'Is \'null\' an object in JavaScript?');
    });

    it('1.2. Verify card count shows "Card 1 of 10"', () => {
      cy.get('#cardCount').should('contain', 'Card 1 of 10');
    });

    it('1.3. Verify progress bar shows 10% filled', () => {
      cy.getProgressWidth().then(width => {
        expect(width).to.be.closeTo(34, 1); // 10% of container width
      });
    });

    it('1.4. Verify score displays 0 for both correct and incorrect', () => {
      cy.verifyScore(0, 0);
    });

    it('1.5. Verify all buttons are enabled', () => {
      cy.get('#prevBtn').should('be.enabled');
      cy.get('#nextBtn').should('be.enabled');
      cy.get('#correctBtn').should('be.enabled');
      cy.get('#incorrectBtn').should('be.enabled');
    });
  });

  describe('2. Question Display', () => {
    it('2.1. Verify all 10 questions load correctly', () => {
      const questions = [
        'Is \'null\' an object in JavaScript?',
        'Does JavaScript support multiple inheritance?',
        'Is \'undefined\' a reserved word in JavaScript?',
        'Can you modify the value of \'const\' variables after declaration?',
        'Is \'NaN\' equal to itself in JavaScript?',
        'Does JavaScript have block scope for variables declared with \'var\'?',
        'Is \'this\' always bound to the object in which it is defined?',
        'Can you use \'await\' outside of an async function?',
        'Is JavaScript a single-threaded language?',
        'Does JavaScript have a built-in module system?'
      ];

      questions.forEach((question, index) => {
        if (index > 0) cy.get('#nextBtn').click();
        cy.get('#question').should('contain', question);
      });
    });

    it('2.2. Verify questions are displayed with proper formatting', () => {
      cy.get('#question')
        .should('have.css', 'font-size', '21.6px')
        .and('have.css', 'font-weight', '500');
    });

    it('2.3. Verify no HTML tags are visible in text', () => {
      cy.get('#question').invoke('html').should('not.match', /<[^>]*>/);
    });

    it('2.4. Verify long questions don\'t overflow card', () => {
      cy.get('.flashcard-front').then($card => {
        const cardHeight = $card[0].clientHeight;
        const textHeight = $card.find('#question')[0].clientHeight;
        expect(textHeight).to.be.lessThan(cardHeight);
      });
    });

    it('2.5. Verify question text is centered properly', () => {
      cy.get('.flashcard-front').should('have.css', 'justify-content', 'center')
        .and('have.css', 'align-items', 'center');
    });
  });

  describe('3. Answer Display', () => {
    it('3.1. Verify answers are hidden initially', () => {
      cy.get('#answer').should('not.be.visible');
    });

    it('3.2. Verify answers appear on card flip', () => {
      cy.get('.flashcard').click();
      cy.get('#answer').should('be.visible')
        .and('contain', 'No, it\'s a primitive value');
    });

    it('3.3. Verify answers are formatted correctly', () => {
      cy.get('.flashcard').click();
      cy.get('#answer')
        .should('have.css', 'font-size', '21.6px')
        .and('have.css', 'font-weight', '500');
    });

    it('3.4. Verify long answers don\'t overflow card', () => {
      cy.get('.flashcard').click();
      cy.get('.flashcard-back').then($card => {
        const cardHeight = $card[0].clientHeight;
        const textHeight = $card.find('#answer')[0].clientHeight;
        expect(textHeight).to.be.lessThan(cardHeight);
      });
    });

    it('3.5. Verify answer text is centered properly', () => {
      cy.get('.flashcard-back').should('have.css', 'justify-content', 'center')
        .and('have.css', 'align-items', 'center');
    });
  });
}); 

describe('Card Flip and Navigation Tests', () => {
  beforeEach(() => {
    cy.visit('/flashcards.html');
  });

  describe('1. Card Flip Animation', () => {
    it('1.1. Verify card flips on click', () => {
      cy.get('.flashcard').click();
      cy.get('.flashcard').should('have.class', 'flipped');
    });

    it('1.2. Verify card flips back on second click', () => {
      cy.get('.flashcard').click();
      cy.get('.flashcard').click();
      cy.get('.flashcard').should('not.have.class', 'flipped');
    });

    it('1.3. Verify flip animation duration', () => {
      cy.get('.flashcard').should('have.css', 'transition-duration', '0.3s');
    });

    it('1.4. Verify flip animation timing function', () => {
      cy.get('.flashcard').should('have.css', 'transition-timing-function', 'cubic-bezier(0.4, 0, 0.2, 1)');
    });

    it('1.5. Verify card faces are properly positioned during flip', () => {
      cy.get('.flashcard').click();
      cy.get('.flashcard-inner').should('have.css', 'transform', 'matrix3d(-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1)');
    });
  });

  describe('2. Navigation Controls', () => {
    it('2.1. Verify next button navigates forward', () => {
      cy.get('#nextBtn').click();
      cy.get('#cardCount').should('contain', 'Card 2 of 10');
      cy.get('#question').should('contain', 'Does JavaScript support multiple inheritance?');
    });

    it('2.2. Verify previous button navigates backward', () => {
      cy.get('#nextBtn').click();
      cy.get('#prevBtn').click();
      cy.get('#cardCount').should('contain', 'Card 1 of 10');
      cy.get('#question').should('contain', 'Is \'null\' an object in JavaScript?');
    });

    it('2.3. Verify navigation updates progress bar', () => {
      cy.get('#progress').should('have.css', 'width', '34px');
      cy.get('#nextBtn').click();
      cy.get('#progress').should('have.css', 'width', '68px');
    });

    it('2.4. Verify card flips back when navigating', () => {
      cy.get('.flashcard').click();
      cy.get('#nextBtn').click();
      cy.get('.flashcard').should('not.have.class', 'flipped');
    });

    it('2.5. Verify circular navigation', () => {
      // Navigate to last card
      for (let i = 0; i < 9; i++) {
        cy.get('#nextBtn').click();
      }
      cy.get('#cardCount').should('contain', 'Card 10 of 10');
      
      // Go next should wrap to first card
      cy.get('#nextBtn').click();
      cy.get('#cardCount').should('contain', 'Card 1 of 10');
      
      // Go previous should wrap to last card
      cy.get('#prevBtn').click();
      cy.get('#cardCount').should('contain', 'Card 10 of 10');
    });
  });

  describe('3. Navigation Edge Cases', () => {
    it('3.1. Verify navigation during flip animation', () => {
      cy.get('.flashcard').click();
      cy.get('#nextBtn').click();
      cy.get('.flashcard').should('not.have.class', 'flipped');
      cy.get('#cardCount').should('contain', 'Card 2 of 10');
    });

    it('3.2. Verify rapid navigation clicks', () => {
      for (let i = 0; i < 5; i++) {
        cy.get('#nextBtn').click();
      }
      cy.get('#cardCount').should('contain', 'Card 6 of 10');
    });

    it('3.3. Verify navigation with keyboard arrows', () => {
      cy.get('body').type('{rightArrow}');
      cy.get('#cardCount').should('contain', 'Card 2 of 10');
      cy.get('body').type('{leftArrow}');
      cy.get('#cardCount').should('contain', 'Card 1 of 10');
    });

    it('3.4. Verify navigation state persistence', () => {
      cy.get('#nextBtn').click();
      cy.reload();
      cy.get('#cardCount').should('contain', 'Card 1 of 10');
    });

    it('3.5. Verify navigation with marked answers', () => {
      cy.get('#correctBtn').click();
      cy.get('#nextBtn').click();
      cy.get('#cardCount').should('contain', 'Card 2 of 10');
      cy.get('#prevBtn').click();
      cy.verifyButtonStates(true, false);
    });
  });
}); 

describe('Answer Marking and Progress Tests', () => {
  beforeEach(() => {
    cy.visit('/flashcards.html');
  });

  describe('1. Answer Marking', () => {
    it('1.1. Verify marking answer as correct', () => {
      cy.get('#correctBtn').click();
      cy.verifyScore(1, 0);
      cy.verifyButtonStates(true, false);
    });

    it('1.2. Verify marking answer as incorrect', () => {
      cy.get('#incorrectBtn').click();
      cy.verifyScore(0, 1);
      cy.verifyButtonStates(false, true);
    });

    it('1.3. Verify changing answer from correct to incorrect', () => {
      cy.get('#correctBtn').click();
      cy.get('#incorrectBtn').click();
      cy.verifyScore(0, 1);
      cy.verifyButtonStates(false, true);
    });

    it('1.4. Verify changing answer from incorrect to correct', () => {
      cy.get('#incorrectBtn').click();
      cy.get('#correctBtn').click();
      cy.verifyScore(1, 0);
      cy.verifyButtonStates(true, false);
    });

    it('1.5. Verify answer state persists after navigation', () => {
      cy.get('#correctBtn').click();
      cy.get('#nextBtn').click();
      cy.get('#prevBtn').click();
      cy.verifyButtonStates(true, false);
      cy.verifyScore(1, 0);
    });
  });

  describe('2. Progress Tracking', () => {
    it('2.1. Verify progress bar updates with correct answers', () => {
      cy.get('#progress').should('have.css', 'width', '34px')
      cy.get('#correctBtn').click()
      cy.wait(800) // Wait for state update
      cy.get('#nextBtn').click()
      cy.get('#progress').should('have.css', 'width', '102px')
    });

    it('2.2. Verify progress bar updates with incorrect answers', () => {
      cy.get('#progress').should('have.css', 'width', '34px')
      cy.get('#incorrectBtn').click()
      cy.wait(800) // Wait for state update
      cy.get('#nextBtn').click()
      cy.get('#progress').should('have.css', 'width', '102px')
    });

    it('2.3. Verify progress bar color changes', () => {
      cy.get('.progress').should('have.css', 'background-color', 'rgb(124, 58, 237)');
      cy.get('#correctBtn').click();
      cy.get('.progress').should('have.css', 'background-color', 'rgb(124, 58, 237)');
    });

    it('2.4. Verify progress persistence after reload', () => {
      cy.get('#correctBtn').click();
      cy.get('#nextBtn').click();
      cy.get('#correctBtn').click();
      cy.reload();
      cy.verifyScore(0, 0); // Score should reset on reload
    });

    it('2.5. Verify progress updates in real-time', () => {
      // Mark first 3 cards as correct (they should all be correct according to flashcards data)
      for (let i = 0; i < 3; i++) {
        cy.get('#correctBtn').click()
        cy.wait(500) // Wait for auto-advance
        cy.get('#scoreCorrect').should('contain', i + 1)
        cy.get('#scoreIncorrect').should('contain', '0')
        cy.get('#cardCount').should('contain', `Card ${i + 2} of 10`)
      }
      
      // Mark next 2 cards as correct (cards 4 and 5 are also correct)
      for (let i = 0; i < 2; i++) {
        cy.get('#correctBtn').click()
        cy.wait(500) // Wait for auto-advance
        cy.get('#scoreCorrect').should('contain', i + 4)
        cy.get('#scoreIncorrect').should('contain', '0')
        cy.get('#cardCount').should('contain', `Card ${i + 5} of 10`)
      }
    });
  });

  describe('3. Completion Tracking', () => {
    it('3.1. Verify completion status updates', () => {
      cy.get('#correctBtn').click();
      cy.get('#nextBtn').click();
      cy.get('#incorrectBtn').click();
      cy.get('#cardCount').should('contain', 'Card 2 of 10');
      cy.verifyScore(1, 1);
    });

    it('3.2. Verify all cards can be marked', () => {
      // Mark first 5 cards as correct (they should all be correct)
      for (let i = 0; i < 5; i++) {
        cy.get('#correctBtn').click()
        cy.wait(500) // Wait for auto-advance
        cy.get('#scoreCorrect').should('contain', i + 1)
        cy.get('#scoreIncorrect').should('contain', '0')
        cy.get('#cardCount').should('contain', `Card ${i + 2} of 10`)
      }
    });

    it('3.3. Verify perfect score tracking', () => {
      // Mark all cards as correct
      for (let i = 0; i < 10; i++) {
        cy.get('#correctBtn').click({ force: true });
        cy.wait(300); // Wait for button state to update
        if (i < 9) {
          cy.get('#nextBtn').click();
          cy.wait(300); // Wait for navigation to complete
        }
      }
      cy.wait(2000); // Wait for confetti to appear
      cy.get('.confetti').should('exist');
    });
  });

  describe('4. Stress Testing', () => {
    it('4.1. Rapid answer changes', () => {
      // Mark the first card as correct
      cy.get('#correctBtn').click();
      cy.wait(350); // Wait for auto-advance
      
      // Go back to first card and mark as incorrect
      cy.get('#prevBtn').click();
      cy.get('#incorrectBtn').click({ force: true });
      
      // Verify final state after auto-advance
      cy.wait(350);
      cy.get('#cardCount').should('contain', 'Card 2 of 10');
      cy.get('#scoreCorrect').should('contain', '0');
      cy.get('#scoreIncorrect').should('contain', '1');
    });

    it('4.2. Rapid navigation while marking answers', () => {
      // Mark first card as correct
      cy.get('#correctBtn').click();
      cy.wait(350); // Wait for auto-advance
      
      // Go back to first card
      cy.get('#prevBtn').click();
      
      // Change answer to incorrect
      cy.get('#incorrectBtn').click({ force: true });
      cy.wait(350); // Wait for auto-advance
      
      // Verify final state
      cy.get('#cardCount').should('contain', 'Card 2 of 10');
      cy.get('#scoreCorrect').should('contain', '0');
      cy.get('#scoreIncorrect').should('contain', '1');
    });

    it('4.3. Multiple rapid card flips', () => {
      // Rapidly flip the card multiple times
      for (let i = 0; i < 10; i++) {
        cy.get('#flashcard').click();
        cy.wait(100);
      }
      
      // Verify card is still interactive
      cy.get('#flashcard').click();
      cy.get('.flashcard').should('have.class', 'flipped');
    });

    it('4.4. Stress test auto-advance behavior', () => {
      // Mark answers rapidly and verify auto-advance works
      for (let i = 0; i < 5; i++) {
        cy.get('#correctBtn').click();
        cy.wait(350); // Wait for auto-advance
        cy.get('#cardCount').should('contain', `Card ${i + 2} of 10`);
      }
      
      // Verify score is accurate after rapid interactions
      cy.get('#scoreCorrect').should('contain', '5');
      cy.get('#scoreIncorrect').should('contain', '0');
    });

  

    it('4.5. Stress test progress bar updates', () => {
      // Rapidly mark answers and verify progress bar
      for (let i = 0; i < 5; i++) {
        cy.get('#correctBtn').click();
        cy.wait(350); // Wait for auto-advance
        cy.get('#progress').should('have.css', 'width', `${((i + 2) * 34)}px`);
      }
    });

    it('4.6. Concurrent button interactions', () => {
      // Mark first card as correct
      cy.get('#correctBtn').click();
      cy.wait(350); // Wait for auto-advance
      
      // Go back to first card
      cy.get('#prevBtn').click();
      
      // Change answer to incorrect
      cy.get('#incorrectBtn').click({ force: true });
      cy.wait(350); // Wait for auto-advance
      
      // Verify final state
      cy.get('#cardCount').should('contain', 'Card 2 of 10');
      cy.get('#scoreCorrect').should('contain', '0');
      cy.get('#scoreIncorrect').should('contain', '1');
    });
  });
}); 