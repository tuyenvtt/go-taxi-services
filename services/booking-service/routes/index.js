class BookingRoutes {
  constructor (controller) {
    this.routes = [
      {
        method: 'POST',
        path: '/v1/booking/book',
        access: 'private',
        handler: controller.book
      },
      {
        method: 'POST',
        path: '/v1/booking/scheduled/book',
        access: 'private',
        handler: controller.scheduledBook
      },
      {
        method: 'POST',
        path: '/v1/booking/dispatcher/book',
        access: 'private',
        handler: controller.dispatcherBook
      },
      {
        method: 'GET',
        path: '/v1/booking/details/:booking_uuid',
        access: 'private',
        handler: controller.getBookingById
      },
      {
        method: 'GET',
        path: '/v1/booking/status/:booking_uuid',
        access: 'private',
        handler: controller.getBookingStatus
      },
      {
        method: 'PUT',
        path: '/v1/booking/cancel',
        access: 'private',
        handler: controller.cancelBooking
      },
      {
        method: 'PUT',
        path: '/v1/booking/confirm-arrival',
        access: 'private',
        handler: controller.confirmArrival
      },
      {
        method: 'PUT',
        path: '/v1/booking/confirm-receipt',
        access: 'private',
        handler: controller.confirmReceipt
      },
      {
        method: 'PUT',
        path: '/v1/booking/confirm-complete',
        access: 'private',
        handler: controller.confirmComplete
      },
      {
        method: 'GET',
        path: '/v1/booking/history',
        access: 'private',
        handler: controller.getBookingHistory
      },
      {
        method: 'GET',
        path: '/v1/booking/recent',
        access: 'private',
        handler: controller.getRecentBookings
      },
      {
        method: 'GET',
        path: '/v1/booking/vehicle-pricing',
        access: 'private',
        handler: controller.calculateVehiclePricing
      },
      {
        method: 'GET',
        path: '/v1/booking/payment-method',
        access: 'private',
        handler: controller.getPaymentMethods
      }
    ];
  }

  resolve () {
    return this.routes;
  }
}

module.exports = { BookingRoutes };
