'use strict';

/**
 * last-recipient service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::last-recipient.last-recipient');
