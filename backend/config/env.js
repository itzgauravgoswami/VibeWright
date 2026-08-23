require('dotenv').config();

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || '',
  
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-3.6-flash'
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o'
  },
  
  swytchcode: {
    apiKey: process.env.SWYTCHCODE_API_KEY || '',
    baseUrl: process.env.SWYTCHCODE_BASE_URL || 'https://api.swytchcode.com'
  },
  
  weaviate: {
    url: process.env.WEAVIATE_URL || '',
    apiKey: process.env.WEAVIATE_API_KEY || ''
  },
  
  discovery: {
    jinaKey: process.env.JINA_API_KEY || '',
    firecrawlKey: process.env.FIRECRAWL_API_KEY || '',
    apifyToken: process.env.APIFY_API_TOKEN || ''
  },
  
  knowledge: {
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    notionApiKey: process.env.NOTION_API_KEY || '',
    githubToken: process.env.GITHUB_TOKEN || ''
  },
  
  communication: {
    slackBotToken: process.env.SLACK_BOT_TOKEN || '',
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
    resendApiKey: process.env.RESEND_API_KEY || ''
  },
  
  automation: {
    googleCalendarClientId: process.env.GOOGLE_CALENDAR_CLIENT_ID || '',
    asanaAccessToken: process.env.ASANA_ACCESS_TOKEN || ''
  },
  
  media: {
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || ''
  }
};

/**
 * Audit available capabilities and return their integration status (Real vs Demo/Mock)
 */
function getCapabilityMatrix() {
  return [
    {
      id: 'gemini',
      name: 'Gemini AI Reasoning Engine',
      category: 'LLM',
      configured: Boolean(env.gemini.apiKey),
      mode: env.gemini.apiKey ? 'REAL' : 'DEMO_DATA',
      description: 'Primary LLM for RAG synthesis, 4-factor trend scoring, and quality auditing'
    },
    {
      id: 'weaviate',
      name: 'Weaviate Vector RAG',
      category: 'RAG',
      configured: Boolean(env.weaviate.url && env.weaviate.apiKey),
      mode: (env.weaviate.url && env.weaviate.apiKey) ? 'REAL' : 'DEMO_DATA',
      description: 'Semantic vector database for document embeddings & source attribution'
    },
    {
      id: 'swytchcode',
      name: 'Swytchcode Execution Kernel',
      category: 'Kernel',
      configured: true,
      mode: env.swytchcode.apiKey ? 'REAL' : 'HYBRID_DEMO',
      description: 'Automates daily publishing workflows & channel distribution'
    },
    {
      id: 'jina',
      name: 'Jina Reader & Web Discovery',
      category: 'Discovery',
      configured: Boolean(env.discovery.jinaKey),
      mode: env.discovery.jinaKey ? 'REAL' : 'DEMO_DATA',
      description: 'Real-time web trend discovery & markdown article extraction'
    },
    {
      id: 'slack',
      name: 'Slack Channel Publishing',
      category: 'Publishing',
      configured: Boolean(env.communication.slackBotToken),
      mode: env.communication.slackBotToken ? 'REAL' : 'DEMO_DATA',
      description: 'Delivers scheduled trend summaries and approved posts'
    },
    {
      id: 'resend',
      name: 'Resend Email Distribution',
      category: 'Publishing',
      configured: Boolean(env.communication.resendApiKey),
      mode: env.communication.resendApiKey ? 'REAL' : 'DEMO_DATA',
      description: 'Sends automated newsletter content to subscribers'
    }
  ];
}

module.exports = {
  env,
  getCapabilityMatrix
};
