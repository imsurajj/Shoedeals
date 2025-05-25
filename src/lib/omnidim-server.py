"""
OmniDimension SDK Integration for Shoe Deals AI Assistant

This file demonstrates how to use the OmniDimension Python SDK to create and manage
an AI voice agent for the Shoe Deals application.

In a production environment, this would be part of a server-side API or microservice.
"""

from omnidimension import Client
import os
import json

# Initialize the OmniDimension client with your API key
# In production, use environment variables for sensitive information
api_key = os.environ.get("OMNIDIM_API_KEY", "your_api_key_here")
client = Client(api_key)

# Agent configuration
agent_config = {
    "name": "Shoe Deals Assistant",
    "welcome_message": "Hello! I'm your shoe deals assistant. How can I help you find the perfect shoes within your budget?",
    "context_breakdown": [
        {
            "title": "Purpose",
            "body": "This agent helps customers find the best shoe deals within their budget, considering their style preferences and needs."
        },
        {
            "title": "Products",
            "body": "We offer a wide range of shoes including athletic shoes, casual shoes, formal shoes, and specialty footwear."
        },
        {
            "title": "Budget Ranges",
            "body": "We categorize shoes as budget (under $50), mid-range ($50-$100), premium ($100-$200), and luxury (over $200)."
        },
        {
            "title": "Brands",
            "body": "We carry popular brands including Nike, Adidas, New Balance, Puma, Converse, Vans, Reebok, and many more."
        }
    ],
    "model": {
        "model": "gpt-4o-mini",
        "temperature": 0.7
    },
    "voice": {
        "provider": "eleven_labs",
        "voice_id": "JBFqnCBsd6RMkjVDRZzb"  # This is a placeholder voice ID
    },
    "post_call_actions": {
        "extracted_variables": [
            {
                "key": "shoe_type",
                "prompt": "Identify the type of shoes the customer is looking for..."
            },
            {
                "key": "budget_range",
                "prompt": "Identify the customer's budget range for shoes..."
            },
            {
                "key": "size",
                "prompt": "Identify the customer's shoe size if mentioned..."
            },
            {
                "key": "brand_preference",
                "prompt": "Identify any brand preferences the customer mentioned..."
            }
        ]
    }
}

def create_agent():
    """Create a new OmniDimension agent with the shoe deals configuration"""
    try:
        response = client.agent.create(**agent_config)
        print(f"Agent created successfully with ID: {response['id']}")
        return response
    except Exception as e:
        print(f"Error creating agent: {e}")
        return None

def get_agent(agent_id):
    """Get details of an existing agent"""
    try:
        response = client.agent.get(agent_id)
        return response
    except Exception as e:
        print(f"Error getting agent: {e}")
        return None

def update_agent(agent_id, update_data):
    """Update an existing agent with new configuration"""
    try:
        response = client.agent.update(agent_id, update_data)
        print(f"Agent updated successfully: {response['id']}")
        return response
    except Exception as e:
        print(f"Error updating agent: {e}")
        return None

def delete_agent(agent_id):
    """Delete an existing agent"""
    try:
        response = client.agent.delete(agent_id)
        print(f"Agent deleted successfully")
        return response
    except Exception as e:
        print(f"Error deleting agent: {e}")
        return None

def initiate_call(agent_id, phone_number):
    """Initiate a call to a customer using the specified agent"""
    try:
        # This is a simplified example - actual implementation would depend on OmniDimension's API
        response = client.call.create(
            agent_id=agent_id,
            phone_number=phone_number,
            # Additional call parameters would go here
        )
        print(f"Call initiated with ID: {response['id']}")
        return response
    except Exception as e:
        print(f"Error initiating call: {e}")
        return None

def handle_chat_message(agent_id, message):
    """Handle a chat message from the customer"""
    try:
        # This is a simplified example - actual implementation would depend on OmniDimension's API
        response = client.chat.send(
            agent_id=agent_id,
            message=message
        )
        return response
    except Exception as e:
        print(f"Error handling chat message: {e}")
        return None

# Example usage
if __name__ == "__main__":
    # Create a new agent
    agent = create_agent()
    
    if agent:
        agent_id = agent['id']
        
        # Example: Update the agent
        update_data = {
            "welcome_message": "Hello there! I'm your personal shoe shopping assistant. How can I help you find the perfect pair today?"
        }
        update_agent(agent_id, update_data)
        
        # Example: Handle a chat message
        chat_response = handle_chat_message(agent_id, "I'm looking for running shoes under $100")
        if chat_response:
            print(f"AI response: {chat_response['message']}")
        
        # Example: Initiate a call
        call_response = initiate_call(agent_id, "+15551234567")
        if call_response:
            print(f"Call status: {call_response['status']}") 