import { NextRequest, NextResponse } from 'next/server';

// Mock conversation storage (in a real app, use a database)
const conversations = new Map<string, { messages: any[] }>();

export async function POST(request: NextRequest) {
  try {
    const { messages, budget } = await request.json();
    
    // Get the last user message
    const lastUserMessage = messages.find((msg: any) => msg.role === 'user');
    
    // Generate response based on budget if provided
    let responseText = "I'd be happy to help you find the perfect shoes!";
    
    if (budget) {
      responseText = `Great! I found several options within your budget of $${budget}. Best value: SoleHub at $120 (In stock, 4 days delivery) Cheapest: SoleHub at $120 (In stock, 4 days delivery) Fastest delivery: AirVault at $190 (In stock, 2 days delivery) Would you like more details about any of these options, or would you prefer to see more alternatives?`;
    } else if (lastUserMessage?.content.toLowerCase().includes('budget')) {
      responseText = "What's your budget for the shoes? This will help me find the best options for you.";
    } else if (lastUserMessage?.content.toLowerCase().includes('style')) {
      responseText = "I can help with various styles! Are you looking for athletic, casual, formal, or something else? Also, do you have a specific budget in mind?";
    }
    
    // In a real implementation, this would call the OmniDimension API
    
    return NextResponse.json({ 
      success: true,
      response: responseText
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 