class ActivityService {
  constructor() {
    this.logs = [
      {
        id: 'act-101',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
        action: 'TrendForge Platform Online',
        detail: 'Gemini 3.6 Flash & Swytchcode Execution Kernel initialized cleanly',
        status: 'ACTIVE',
        badgeType: 'success'
      }
    ];
  }

  logActivity({ action, detail, status = 'COMPLETED', badgeType = 'primary' }) {
    const entry = {
      id: `act-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
      action,
      detail,
      status,
      badgeType
    };
    this.logs.unshift(entry);
    if (this.logs.length > 50) this.logs.pop();
    return entry;
  }

  getLogs() {
    return this.logs;
  }
}

module.exports = new ActivityService();
