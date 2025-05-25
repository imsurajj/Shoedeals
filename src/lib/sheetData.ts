// Utility functions to handle shoe deals data from Google Sheets

export interface ShoeDealsItem {
  seller: string;
  price: number;
  availability: string;
  delivery: string;
  email?: string;
  budget?: number;
  priority?: string;
  timestamp?: string;
}

// Mock data based on the Google Sheets shown in the screenshots
const mockShoeDealsData: ShoeDealsItem[] = [
  { seller: "SoleHub", price: 120, availability: "In stock", delivery: "4 days" },
  { seller: "KickCraze", price: 350, availability: "2 units", delivery: "3 days" },
  { seller: "StepForward", price: 290, availability: "In stock", delivery: "1 day" },
  { seller: "MetroKicks", price: 480, availability: "6 units", delivery: "5 days" },
  { seller: "AirVault", price: 190, availability: "In stock", delivery: "2 days" },
  { seller: "SpeedSole", price: 420, availability: "3 units", delivery: "4 days" },
  { seller: "UrbanFeet", price: 165, availability: "In stock", delivery: "3 days" },
  { seller: "FlightKicks", price: 380, availability: "1 unit", delivery: "2 days" },
  { seller: "PeakSteps", price: 390, availability: "In stock", delivery: "1 day" },
  { seller: "SoleSearch", price: 450, availability: "4 units", delivery: "6 days" },
  { seller: "KickLounge", price: 260, availability: "In stock", delivery: "3 days" },
  { seller: "FlexZone", price: 370, availability: "2 units", delivery: "4 days" },
  { seller: "StreetCore", price: 180, availability: "In stock", delivery: "2 days" },
  { seller: "RunVault", price: 320, availability: "5 units", delivery: "3 days" },
  { seller: "KixPoint", price: 440, availability: "In stock", delivery: "1 day" },
  { seller: "SneakSpot", price: 310, availability: "3 units", delivery: "5 days" },
  { seller: "StepStyle", price: 290, availability: "In stock", delivery: "2 days" },
  { seller: "FootFlex", price: 210, availability: "4 units", delivery: "3 days" },
  { seller: "SoleStash", price: 430, availability: "In stock", delivery: "4 days" }
];

/**
 * Get all shoe deals data
 */
export function getAllShoeDeals(): ShoeDealsItem[] {
  // In a real implementation, this would fetch data from Google Sheets API
  return mockShoeDealsData;
}

/**
 * Get shoe deals filtered by budget
 */
export function getShoeDealsWithinBudget(budget: number): ShoeDealsItem[] {
  return mockShoeDealsData.filter(item => item.price <= budget);
}

/**
 * Get shoe deals filtered by budget and sorted by price (ascending)
 */
export function getBestShoeDealsWithinBudget(budget: number): ShoeDealsItem[] {
  return mockShoeDealsData
    .filter(item => item.price <= budget)
    .sort((a, b) => a.price - b.price);
}

/**
 * Get shoe deals filtered by budget and sorted by delivery time (ascending)
 */
export function getFastestShoeDealsWithinBudget(budget: number): ShoeDealsItem[] {
  return mockShoeDealsData
    .filter(item => item.price <= budget)
    .sort((a, b) => {
      const deliveryA = parseInt(a.delivery.split(' ')[0]);
      const deliveryB = parseInt(b.delivery.split(' ')[0]);
      return deliveryA - deliveryB;
    });
}

/**
 * Get recommended shoe deals based on budget
 */
export function getRecommendedShoeDeals(budget: number): {
  cheapest: ShoeDealsItem | null;
  fastest: ShoeDealsItem | null;
  bestValue: ShoeDealsItem | null;
  options: ShoeDealsItem[];
} {
  const withinBudget = getShoeDealsWithinBudget(budget);
  
  if (withinBudget.length === 0) {
    return {
      cheapest: null,
      fastest: null,
      bestValue: null,
      options: []
    };
  }
  
  // Sort by price
  const sortedByPrice = [...withinBudget].sort((a, b) => a.price - b.price);
  
  // Sort by delivery time
  const sortedByDelivery = [...withinBudget].sort((a, b) => {
    const deliveryA = parseInt(a.delivery.split(' ')[0]);
    const deliveryB = parseInt(b.delivery.split(' ')[0]);
    return deliveryA - deliveryB;
  });
  
  // Calculate best value (simple algorithm: lower price + faster delivery = better value)
  const withScores = withinBudget.map(item => {
    const priceScore = 1 - (item.price / budget); // Higher score for lower price relative to budget
    const deliveryScore = 1 - (parseInt(item.delivery.split(' ')[0]) / 7); // Assuming max 7 days delivery
    const totalScore = priceScore * 0.7 + deliveryScore * 0.3; // Weighted score
    return { ...item, score: totalScore };
  });
  
  const sortedByValue = [...withScores].sort((a, b) => b.score - a.score);
  
  return {
    cheapest: sortedByPrice[0],
    fastest: sortedByDelivery[0],
    bestValue: sortedByValue[0],
    options: withinBudget.slice(0, 5) // Return top 5 options
  };
} 