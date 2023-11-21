'use strict';

/**
 * payments-table service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::payments-table.payments-table');
