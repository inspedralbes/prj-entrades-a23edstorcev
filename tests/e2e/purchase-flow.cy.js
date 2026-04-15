describe('High-Demand Ticketing Full Flow', () => {
  beforeEach(() => {
    // We assume the user is already registered or we use a test user
    cy.visit('/login');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password');
    cy.get('button').contains('Accedir').click();
  });

  it('completes a full purchase flow successfully', () => {
    // 1. Redirect to Seat Map
    cy.url({ timeout: 10000 }).should('include', '/seats');
    cy.contains("Selecció de Terminal").should('be.visible');

    // 2. Select an available seat
    // My SeatItem has a button with the seat number. We'll pick the first available.
    // In my logic, available seats have a specific class or border.
    // Let's use the text content for simplicity if we know the numbers.
    cy.get('button').not(':disabled').first().click();

    // 3. Confirm Modal
    cy.contains("Confirmar Ticket").should('be.visible');
    cy.contains("Sincronitzar Pagament").click();

    // 4. Verify local lock state (My selection color is bg-primary)
    // The modal closes after selection in my current SeatMap.vue
    // The seat should now show my lock.
    cy.get('button.bg-primary').should('exist');
    
    // 5. In this prototype, purchase is immediate after clicking Sincronitzar
    // Wait for the seat to become SOLD (bg-outline-variant)
    cy.get('button.bg-outline-variant', { timeout: 10000 }).should('exist');
  });

  it('shows disconnection overlay on socket disconnect', () => {
    cy.visit('/seats');
    // Force disconnect
    cy.window().then((win) => {
      if (win.socket) win.socket.disconnect();
    });
    
    cy.contains("Connexió Interrompuda").should('be.visible');
    cy.contains("Estem restablint el canal segur").should('be.visible');
  });
});
