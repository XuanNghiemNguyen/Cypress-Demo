import setting from "../../setting.json"

describe("Đăng nhập", () => {
  before(() => {
    cy.viewport(1000, 700)
  })
  it("Kiểm thử API login", () => {
    cy.request({
      method: "POST",
      url: "/graphqltranslate", // baseUrl is prepended to url
      form: true, // indicates the body should be form urlencoded and sets Content-Type: application/x-www-form-urlencoded headers
      body: {
        query: `mutation login($loginInput: LoginInput!) {
          login(loginInput: $loginInput) { 
              token   
              __typename 
            }
          }`,
        variables: { loginInput: { username: "admin", password: "12345678" } },
      },
    }).then((res) => {
      cy.wrap(res.body.data).its("login.token").should('be.a', 'string')
    })
  })
  it("Kiểm tra phần tử page login", () => {
    cy.visit("/")
    // Check su ton tai cua cac thanh phan
    cy.get(".title")
      .should("be.visible")
      .then(($div) => {
        expect($div).to.have.text("Đăng nhập")
      })
    cy.get("label[for=login-form_username]")
      .should("be.visible")
      .then(($label) => {
        expect($label).to.have.text("Tên đăng nhập")
      })
    cy.get("#login-form_username").should("exist")

    cy.get("label[for=login-form_password]")
      .should("be.visible")
      .then(($label) => {
        expect($label).to.have.text("Mật khẩu")
      })
    cy.get("#login-form_password").should("exist")

    cy.get("input[id=login-form_staySignedIn]").should("be.visible")
    cy.contains("Duy trì đăng nhập").should("be.visible")
    cy.contains("Quên mật khẩu?").should("be.visible")
  })

  it("Đăng nhập thành công", () => {
    cy.visit("/")

    cy.get("#login-form_username")
      .should("be.visible")
      .type("admin", { delay: 200 })
    cy.get("#login-form_password")
      .should("be.visible")
      .type("12345678", { delay: 200 })
    cy.get("button[name=btn-login]").click()
    cy.wait(3000)
    //Kiem tra dang nhap thanh cong
    cy.window().its('localStorage.TOKEN').should('be.a', 'string')
    cy.contains("Tổng hợp").should("be.visible")
  })
})
