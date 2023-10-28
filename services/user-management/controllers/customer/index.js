const LoginController = require('./login');
const AccountController = require('./account');
const ProfileController = require('./profile');
const RegisterController = require('./register');

class CustomerController {
  constructor (logger) {
    const login = new LoginController(logger);
    const profile = new ProfileController(logger);
    const account = new AccountController(logger);
    const register = new RegisterController(logger);

    this.login = login.login;
    this.verifyLogin = login.verify;
    this.register = register.register;
    this.verifyRegister = register.verify;
    this.getProfile = profile.get;
    this.updateProfile = profile.update;
    this.resetPassword = account.resetPassword;
    this.updatePassword = account.updatePassword;
  }
}

module.exports = CustomerController;
