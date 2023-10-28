class CustomerRoutes {
  constructor (controller) {
    this.routes = [
      {
        method: 'POST',
        path: '/v1/customer/register',
        access: 'public',
        handler: controller.register
      },
      {
        method: 'PUT',
        path: '/v1/customer/register/verify',
        access: 'public',
        handler: controller.verifyRegister
      },
      {
        method: 'POST',
        path: '/v1/customer/login',
        access: 'public',
        handler: controller.login
      },
      {
        method: 'PUT',
        path: '/v1/customer/login/verify',
        access: 'public',
        handler: controller.verifyLogin
      },
      {
        method: 'POST',
        path: '/v1/customer/password/reset',
        access: 'public',
        handler: controller.resetPassword
      },
      {
        method: 'PUT',
        path: '/v1/customer/password/update',
        access: 'public',
        handler: controller.updatePassword
      },
      {
        method: 'GET',
        path: '/v1/customer/profile',
        access: 'private',
        handler: controller.getProfile
      },
      {
        method: 'PUT',
        path: '/v1/customer/profile',
        access: 'private',
        handler: controller.updateProfile
      }
    ];
  }

  resolve () {
    return this.routes;
  }
}

module.exports = CustomerRoutes;
