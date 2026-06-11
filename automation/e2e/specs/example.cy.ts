describe("example e2e suite", () => {
  it("can reach the configured base URL", () => {
    const baseUrl = Cypress.config("baseUrl");

    if (!baseUrl) {
      throw new Error("CYPRESS_BASE_URL is not configured.");
    }

    cy.request({
      url: "/",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.lessThan(500);
    });
  });
});
