// Mock shoe deals data (simulating data from Google Sheets)
type ShoeDeal = {
  store: string;
  price: number;
  inStock: boolean;
  deliveryDays: number;
  style?: string;
  brand?: string;
};

const mockShoeDeals: ShoeDeal[] = [
  { store: 'SoleHub', price: 120, inStock: true, deliveryDays: 4, style: 'Athletic', brand: 'Nike' },
  { store: 'AirVault', price: 190, inStock: true, deliveryDays: 2, style: 'Running', brand: 'Adidas' },
  { store: 'UrbanFeet', price: 165, inStock: true, deliveryDays: 3, style: 'Casual', brand: 'New Balance' },
  { store: 'KickMaster', price: 210, inStock: true, deliveryDays: 3, style: 'Basketball', brand: 'Jordan' },
  { store: 'StepStyle', price: 95, inStock: true, deliveryDays: 5, style: 'Casual', brand: 'Vans' },
  { store: 'RunnersPro', price: 175, inStock: true, deliveryDays: 2, style: 'Running', brand: 'Brooks' },
  { store: 'SportyStep', price: 145, inStock: true, deliveryDays: 4, style: 'Athletic', brand: 'Under Armour' },
  { store: 'ComfortSole', price: 85, inStock: true, deliveryDays: 6, style: 'Walking', brand: 'Skechers' },
  { store: 'HikerGear', price: 220, inStock: true, deliveryDays: 3, style: 'Hiking', brand: 'Merrell' },
  { store: 'FashionFoot', price: 250, inStock: true, deliveryDays: 4, style: 'Formal', brand: 'Cole Haan' },
];

/**
 * Get shoe deals filtered by budget
 * @param budget Maximum budget for shoes
 * @returns Array of shoe deals within budget
 */
export function getShoeDeals(budget: number): ShoeDeal[] {
  // Filter deals by budget
  const filteredDeals = mockShoeDeals.filter(deal => deal.price <= budget);
  
  // Sort by price (lowest first)
  return filteredDeals.sort((a, b) => a.price - b.price);
}

/**
 * Get shoe deals with recommendations
 * @param budget Maximum budget for shoes
 * @returns Object with best value, cheapest, fastest delivery, and all options
 */
export function getShoeDealsWithRecommendations(budget: number) {
  const filteredDeals = getShoeDeals(budget);
  
  if (filteredDeals.length === 0) {
    return {
      bestValue: null,
      cheapest: null,
      fastest: null,
      options: []
    };
  }
  
  // Sort by different criteria
  const cheapest = [...filteredDeals].sort((a, b) => a.price - b.price)[0];
  const fastest = [...filteredDeals].sort((a, b) => a.deliveryDays - b.deliveryDays)[0];
  
  // Best value calculation (simple algorithm: lower price + faster delivery = better value)
  const bestValue = [...filteredDeals].sort((a, b) => {
    const aScore = (a.price / budget) + (a.deliveryDays / 7); // Normalize values
    const bScore = (b.price / budget) + (b.deliveryDays / 7);
    return aScore - bScore;
  })[0];
  
  return {
    bestValue,
    cheapest,
    fastest,
    options: filteredDeals
  };
} 