'use strict';

/**
 * payment-status service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::payment-status.payment-status');
