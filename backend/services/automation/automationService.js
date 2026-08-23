const logger = require('../../utils/logger');
const swytchcodeAdapter = require('../swytchcode/swytchcodeAdapter');

/**
 * Automation Adapter (Google Calendar, Asana)
 */
class AutomationService {
  async createCalendarEvent({ title, startTime, endTime, attendees }) {
    logger.info(`Automation service creating calendar event: "${title}"`);
    const result = await swytchcodeAdapter.execute('google_calendar.event.create', {
      title,
      startTime,
      endTime,
      attendees
    });
    return {
      success: true,
      service: 'google_calendar',
      eventId: `evt-${Date.now()}`,
      title,
      scheduledTime: startTime || new Date().toISOString(),
      details: result
    };
  }

  async createTask({ project = 'TrendForge', taskName, assignee, dueDate }) {
    logger.info(`Automation service creating task: "${taskName}"`);
    const result = await swytchcodeAdapter.execute('asana.task.create', {
      project,
      name: taskName,
      assignee,
      dueDate
    });
    return {
      success: true,
      service: 'asana',
      taskId: `tsk-${Date.now()}`,
      taskName,
      assignee,
      dueDate,
      details: result
    };
  }
}

module.exports = new AutomationService();
