'use strict';

/**
 * requested-shift service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::requested-shift.requested-shift');
