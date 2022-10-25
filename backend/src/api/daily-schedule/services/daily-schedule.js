'use strict';

/**
 * daily-schedule service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::daily-schedule.daily-schedule');
