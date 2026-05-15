describe("example e2e suite", () => {
  it("loads application health page", () => {
    const baseUrl = Cypress.env("BASE_URL");

    if (!baseUrl) {
      cy.log("BASE_URL is not configured. Replace this example with a real test.");
      return;
    }

    cy.visit(baseUrl);
  });
});
