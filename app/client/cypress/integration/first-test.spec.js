describe("First test", () => {
  it("should visit login page", () => {
    cy.visit("/login");

    cy.get(':nth-child(1) > .form-control').select('admin');
    cy.get(':nth-child(2) > .form-control').select('Hospital 1');
    cy.get(':nth-child(3) > .form-control').type(Cypress.config('adminUsernameHospital1'));
    cy.get(':nth-child(4) > .form-control').type(Cypress.config('adminPasswordHospital1'));
    cy.get('.btn').click();

    cy.url().should('include', '/admin/hosp1admin');
    cy.get('.text-ellipsis').should('contain', 'Admin hosp1admin');
    cy.get('.mr-auto > .nav-item > .nav-link').should('contain', 'Admin');
  });
});
