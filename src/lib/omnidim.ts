// OmniDimension SDK integration utilities
// This file provides a client-side interface to interact with the OmniDimension API

// Default agent ID - in a real app, you would get this from your OmniDimension dashboard
const DEFAULT_AGENT_ID = 'shoe-deals-agent';

/**
 * Send a chat message to the OmniDimension AI agent
 */
export async function sendChatMessage(message: string, conversationId?: string, budget?: number | null) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationId,
        budget
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    return {
      success: true,
      response: data
    };
  } catch (error) {
    console.error('Error sending chat message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Initialize a voice call with the OmniDimension AI agent
 */
export async function initializeCall(agentId: string = DEFAULT_AGENT_ID) {
  try {
    const response = await fetch('/api/omnidim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'initCall',
        agentId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error initializing call:', error);
    throw error;
  }
}

/**
 * End an active call with the OmniDimension AI agent
 */
export async function endCall(callId: string) {
  try {
    const response = await fetch('/api/omnidim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'endCall',
        callId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error ending call:', error);
    throw error;
  }
}

/**
 * Configuration for creating an OmniDimension agent
 * This would be used in a server-side environment with the Python SDK
 */
export const agentConfig = {
  name: "Shoe Deals Assistant",
  welcome_message: "Hello! I'm your shoe deals assistant. How can I help you find the perfect shoes within your budget?",
  context_breakdown: [
    {
      title: "Purpose",
      body: "This agent helps customers find the best shoe deals within their budget, considering their style preferences and needs."
    },
    {
      title: "Products",
      body: "We offer a wide range of shoes including athletic shoes, casual shoes, formal shoes, and specialty footwear."
    },
    {
      title: "Budget Ranges",
      body: "We categorize shoes as budget (under $50), mid-range ($50-$100), premium ($100-$200), and luxury (over $200)."
    }
  ],
  model: {
    model: "gpt-4o-mini",
    temperature: 0.7
  },
  voice: {
    provider: "eleven_labs",
    voice_id: "JBFqnCBsd6RMkjVDRZzb"
  },
  post_call_actions: {
    extracted_variables: [
      {
        key: "shoe_type",
        prompt: "Identify the type of shoes the customer is looking for..."
      },
      {
        key: "budget_range",
        prompt: "Identify the customer's budget range for shoes..."
      },
      {
        key: "size",
        prompt: "Identify the customer's shoe size if mentioned..."
      }
    ]
  }
};

// Voice call functions with WebRTC support
export async function startVoiceCall() {
  try {
    const response = await fetch('/api/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'start'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to start voice call');
    }

    const data = await response.json();
    return {
      success: true,
      callId: data.callId,
      rtcSessionId: data.rtcSessionId,
      iceServers: data.iceServers,
      answer: data.answer
    };
  } catch (error) {
    console.error('Error starting voice call:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start call'
    };
  }
}

export async function endVoiceCall(callId?: string) {
  try {
    const response = await fetch('/api/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'end',
        callId
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to end voice call');
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error ending voice call:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to end call'
    };
  }
} 