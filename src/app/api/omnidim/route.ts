import { NextRequest, NextResponse } from 'next/server';
import { getRecommendedShoeDeals, getShoeDealsWithinBudget } from '@/lib/sheetData';

// This is a placeholder for the actual OmniDimension SDK integration
// In a real implementation, you would use the Python SDK via a backend service
// or use their REST API directly

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, message, agentId, budget } = body;
    
    // Mock responses for development purposes
    // In production, this would call the OmniDimension API
    
    if (action === 'chat') {
      // Check if the message contains budget information
      const budgetMatch = message.match(/(\$?\d+)/);
      const extractedBudget = budgetMatch ? parseInt(budgetMatch[0].replace('$', '')) : null;
      const userBudget = budget || extractedBudget;
      
      if (userBudget) {
        // Get shoe deals based on budget
        const recommendations = getRecommendedShoeDeals(userBudget);
        
        if (recommendations.options.length === 0) {
          return NextResponse.json({
            success: true,
            response: {
              message: `I'm sorry, but I couldn't find any shoe deals within your budget of $${userBudget}. Would you like to explore options in a higher price range?`,
              agentId,
              recommendations: null
            }
          });
        }
        
        // Format response with recommendations
        const cheapestOption = recommendations.cheapest ? 
          `${recommendations.cheapest.seller} at $${recommendations.cheapest.price} (${recommendations.cheapest.availability}, ${recommendations.cheapest.delivery} delivery)` : '';
        
        const fastestOption = recommendations.fastest ? 
          `${recommendations.fastest.seller} at $${recommendations.fastest.price} (${recommendations.fastest.availability}, ${recommendations.fastest.delivery} delivery)` : '';
        
        const bestValueOption = recommendations.bestValue ? 
          `${recommendations.bestValue.seller} at $${recommendations.bestValue.price} (${recommendations.bestValue.availability}, ${recommendations.bestValue.delivery} delivery)` : '';
        
        const responseMessage = `Great! I found several options within your budget of $${userBudget}:
        
Best value: ${bestValueOption}
Cheapest: ${cheapestOption}
Fastest delivery: ${fastestOption}

Would you like more details about any of these options, or would you prefer to see more alternatives?`;
        
        return NextResponse.json({
          success: true,
          response: {
            message: responseMessage,
            agentId,
            recommendations: recommendations
          }
        });
      } else {
        // No budget provided, ask for budget
        return NextResponse.json({
          success: true,
          response: {
            message: `I'd be happy to help you find the perfect shoes! Could you please let me know your budget so I can find the best deals for you?`,
            agentId
          }
        });
      }
    } 
    else if (action === 'initCall') {
      // Simulate initiating a call
      return NextResponse.json({
        success: true,
        callId: 'mock-call-' + Date.now(),
        status: 'initiated'
      });
    }
    else if (action === 'endCall') {
      // Simulate ending a call
      return NextResponse.json({
        success: true,
        callId: body.callId,
        status: 'ended'
      });
    }
    else {
      return NextResponse.json({
        success: false,
        error: 'Invalid action'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in OmniDimension API route:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
} 