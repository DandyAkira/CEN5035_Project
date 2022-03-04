describe('Visit Gatorchat', () => {
  it('Visit Gatorchat', () => {
    cy.visit('127.0.0.1')
  })
})

describe('Register/Login', () => {
  /*beforEach(()=>{
      cy.visit('127.0.0.1')
  })*/
  it('Register', () => {    
    cy.visit('127.0.0.1')

    //register
    cy.contains('Register').click()
    cy.url().should('include', '/user/register.shtml')
    cy.get('input[name=form_email]')
      .type('toto@gmail.com')
    cy.get('input[name=form_nickname]')
      .type('toto')
    cy.get('input[name=form_pwd]')
      .type('toto')
    cy.contains('Register').click()
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Register Success!');
    });
  })
  it('Login', () => {
    cy.visit('127.0.0.1')
    cy.get('input[name=form_email]')
      .type('{selectall}{backspace}toto@gmail.com')
    cy.get('input[name=form_pwd]')
      .type('{selectall}{backspace}toto')

    cy.contains('Login').click()
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Login Success');
    });
    cy.url().should('include', '/chat/index.shtml')
  })
})

describe('Add friend', () => {
  it('Register friend', () => {    
    cy.visit('127.0.0.1')

    //register
    cy.contains('Register').click()
    cy.url().should('include', '/user/register.shtml')
    cy.get('input[name=form_email]')
      .type('titi@gmail.com')
    cy.get('input[name=form_nickname]')
      .type('titi')
    cy.get('input[name=form_pwd]')
      .type('titi')
    cy.contains('Register').click()
  })
  it('Add friend', () => {
    //login
    cy.visit('127.0.0.1')
    cy.get('input[name=form_email]')
      .type('{selectall}{backspace}toto@gmail.com')
    cy.get('input[name=form_pwd]')
      .type('{selectall}{backspace}toto')
    cy.contains('Login').click()

    cy.get('span[name=btn_profile]').click()
    cy.get('a[name=btn_addF]').click()

    /*cy.get('input[placeholder=Input Friends ID]')
      .type('2')*/

    //handling prompt alert
    cy.window().then(($win) => {
        //stubbing prompt window
        cy.stub($win, "prompt")
          .returns('1');
        cy.pause()
        cy.contains('Confirm').click()
    });
  })
})