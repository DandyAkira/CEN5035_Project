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
    //login
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


describe('Footbar check', () => {
  it('Footbar check', () => {
    //login
    cy.visit('127.0.0.1')
    cy.get('input[name=form_email]')
      .type('{selectall}{backspace}titi@gmail.com')
    cy.get('input[name=form_pwd]')
      .type('{selectall}{backspace}titi')

    cy.contains('Login').click()    

    //footbar check
    cy.get('span[name=btn_contacts]').click()
    cy.contains('Contacts')
    cy.get('span[name=btn_groups]').click()
    cy.contains('Groups')
    cy.get('span[name=btn_profile]').click()
    cy.contains('Profile')

  })
})

describe('Add friend/Create group', () => {
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

  it('Add friend/Create group', () => {
    //login
    cy.visit('127.0.0.1')
    cy.get('input[name=form_email]')
      .type('{selectall}{backspace}toto@gmail.com')
    cy.get('input[name=form_pwd]')
      .type('{selectall}{backspace}toto')
    cy.contains('Login').click()

    cy.get('span[name=btn_profile]').click()
    cy.get('a[name=btn_addF]').click()

    /*cy.get("input[placeholder=Input Friend's Email]")
      .type('titi@gmail.com')*/

    //handling prompt alert
    cy.window().then(($win) => {
        //stubbing prompt window
        //cy.stub($win, "prompt").returns("1");
        cy.contains('Cancel').click()
      }
    );

    //create group
    cy.get('a[name=btn_newG]').click({force: true})
    cy.get('input[name=input_GN]')
      .type('Test group')
    cy.contains('Confirm').click()
    /*cy.on('window:alert', (text) => {
      expect(text).to.contains('Create New Group Success');
    });*/
    //cy.url().should('include', '/chat/index.shtml')
  })
})

describe('Join group & Logout', () => {
  it('Join group & Logout', () => {
    //login
    cy.visit('127.0.0.1')
    cy.get('input[name=form_email]')
      .type('{selectall}{backspace}titi@gmail.com')
    cy.get('input[name=form_pwd]')
      .type('{selectall}{backspace}titi')

    cy.contains('Login').click()    

    //join group
    cy.get('span[name=btn_profile]').click()
    cy.get('a[name=btn_joinG]').click()

    /*cy.get('input[placeholder=Input Group ID]')
      .type('1')*/
    //handling prompt alert
    cy.window().then(($win) => {
        //stubbing prompt window
        //cy.stub($win, "prompt").returns("1");
        cy.contains('Cancel').click()
      }
    )

  })
})

describe('Change nickname & Logout', () => {
  it('Change nickname & Logout', () => {
    //login
    cy.visit('127.0.0.1')
    cy.get('input[name=form_email]')
      .type('{selectall}{backspace}titi@gmail.com')
    cy.get('input[name=form_pwd]')
      .type('{selectall}{backspace}titi')

    cy.contains('Login').click()    

    //change nickname
    cy.get('span[name=btn_profile]').click()
    cy.get('a[name=btn_changeName]').click()

    //cy.type('toto_newname')

    //handling prompt alert
    cy.window().then((win) => {
        //stubbing prompt window
        //cy.stub(win, "prompt").withArgs("Input New Nickname").returns("toto_newname");
        cy.contains('Cancel').click()
      }
    )

    //logout
    cy.get('span[name=btn_profile]').click()
    cy.contains('Logout').click()
    cy.url().should('include', '/user/login.shtml')

  })
})