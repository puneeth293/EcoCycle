export type PageRoute = 
  | 'home'
  | 'segregation'
  | 'upload-waste'
  | 'electricity-bill'
  | 'ai-bot'
  | 'pickup'
  | 'centers'
  | 'dashboard'
  | 'rewards'
  | 'about'
  | 'contact'
  | 'login'
  | 'register'
  | 'admin';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    actionType: 'navigate' | 'query';
    target: string;
  }[];
  quickTip?: string;
  topic?: 'segregation' | 'electricity-bill' | 'pollution' | 'pickup' | 'general';
}

export type ReportCategory = 'waste' | 'air-pollution' | 'water-pollution' | 'soil-pollution';

export type PollutionSeverity = 'Low' | 'Moderate' | 'Severe' | 'Hazardous';

export type WasteCategoryType = 
  | 'Wet Waste'
  | 'Dry Waste'
  | 'Recyclable Waste'
  | 'Hazardous Waste'
  | 'E-Waste';

export type BinColor = 'Green' | 'Blue' | 'Red' | 'Black' | 'Yellow';

export interface WasteItem {
  id: string;
  name: string;
  category: WasteCategoryType;
  binColor: BinColor;
  binName: string;
  examples: string[];
  actionSteps: string[];
  recyclingTip: string;
  ecoPoints: number;
  environmentalImpact: string;
}

export type PickupStatus = 'Pending' | 'Confirmed' | 'Assigned' | 'Collected' | 'Completed';

export interface PickupRequest {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  address: string;
  city: string;
  wasteType: WasteCategoryType | 'Other';
  quantity: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status: PickupStatus;
  createdAt: string;
}

export interface CollectionCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  openingHours: string;
  acceptedTypes: WasteCategoryType[];
  rating: number;
  latitude: number;
  longitude: number;
  directionsUrl: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  ecoPoints: number;
  itemsRecycled: number;
  wasteSegregatedKg: number;
  pickupRequestsCount: number;
  joinedDate: string;
  badges: string[];
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlocked: boolean;
  requiredPoints: number;
}

export interface EnvironmentalReportRecord {
  id: string;
  reportType: ReportCategory;
  imageUrl: string;
  detectedTitle: string;
  categoryOrDomain: string;
  binColor?: BinColor;
  binName?: string;
  confidenceScore: number;
  severityLevel?: PollutionSeverity;
  sourceOfPollution?: string;
  aqiImpact?: string;
  contaminantsIdentified?: string[];
  conditionNotes: string;
  actionSteps: string[];
  remedialAdvice: string;
  pointsAwarded: number;
  co2SavedKg?: number;
  ticketId?: string;
  funFact?: string;
  timestamp: string;
  location?: string;
}

// Backward compatibility alias for PhotoVerificationRecord
export type PhotoVerificationRecord = EnvironmentalReportRecord;

export interface SegregationRecord {
  id: string;
  itemName: string;
  category: WasteCategoryType;
  date: string;
  pointsEarned: number;
}

export interface ElectricityProvider {
  id: string;
  name: string;
  state: string;
  shortCode: string;
  logo: string;
  helpline: string;
  sampleConsumerNumber?: string;
}

export interface ElectricityBill {
  id: string;
  consumerNumber: string;
  consumerName: string;
  providerId: string;
  providerName: string;
  billingMonth: string;
  dueDate: string;
  unitsConsumedKwh: number;
  billAmount: number;
  energyCharges: number;
  fixedCharges: number;
  greenCessCharges: number;
  taxes: number;
  isPaid: boolean;
  carbonFootprintKg: number;
  solarDiscountEligible: boolean;
}

export interface BillPaymentRecord {
  transactionId: string;
  consumerNumber: string;
  consumerName: string;
  providerName: string;
  billingMonth: string;
  originalAmount: number;
  ecoPointsRedeemed: number;
  discountAmount: number;
  finalAmountPaid: number;
  paymentMethod: string;
  paymentStatus: 'Success' | 'Processing' | 'Failed';
  paidAt: string;
  bbpsReference: string;
  ecoPointsAwarded: number;
}
