const logger = require('../../utils/logger');

let currentBrandProfile = {
  identity: {
    brandName: 'TrendForge',
    industry: 'AI & Technology',
    targetAudience: 'Enterprise Executives, Founders, and Tech Leaders',
    description: 'Autonomous trend intelligence platform delivering evidence-grounded insights and brand-safe publishing.'
  },
  voices: ['Professional', 'Authoritative', 'Educational', 'Confident'],
  rules: {
    sentenceLength: 'Medium & Concise',
    formality: 'High',
    technicalDepth: 'Intermediate to Advanced',
    jargonLevel: 'Moderate',
    storytellingPreference: 'Data-driven & Evidence-first',
    preferredCTA: 'Thought-provoking call to discussion',
    doList: [
      'Use verified evidence excerpts',
      'Explain complex AI concepts simply',
      'Maintain an executive, professional tone',
      'Include actionable strategic implications'
    ],
    avoidList: [
      'Clickbait or hyperbolic headlines',
      'Unsubstantiated statistics or claims',
      'Overly casual slang or spammy hashtags',
      'Excessive promotional language'
    ]
  },
  customInstructions: 'Always present TrendForge as an authoritative, research-backed platform. Ground every statement in empirical data and emphasize agentic reliability.'
};

class BrandProfileService {
  getProfile() {
    return currentBrandProfile;
  }

  updateProfile(newProfile) {
    logger.info('Updating Brand Profile settings');
    currentBrandProfile = {
      ...currentBrandProfile,
      ...newProfile,
      identity: { ...currentBrandProfile.identity, ...(newProfile.identity || {}) },
      rules: { ...currentBrandProfile.rules, ...(newProfile.rules || {}) }
    };
    return currentBrandProfile;
  }
}

module.exports = new BrandProfileService();
