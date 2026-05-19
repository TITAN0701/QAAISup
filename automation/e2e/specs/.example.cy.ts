describe("example e2e suite", () => {
  it("loads application health page", () => {
    if (!Cypress.config("baseUrl")) {
      cy.log("CYPRESS_BASE_URL is not configured. Replace this example with a real test.");
      return;
    }

    cy.visit("/");
  });
});
