import { WasteItem, WasteCategoryType } from '../types';

export interface CategoryInfo {
  type: WasteCategoryType;
  title: string;
  binColor: string;
  binName: string;
  badgeBg: string;
  badgeText: string;
  cardBorder: string;
  icon: string;
  description: string;
  examples: string[];
}

export const CATEGORY_DETAILS: Record<WasteCategoryType, CategoryInfo> = {
  'Wet Waste': {
    type: 'Wet Waste',
    title: '🟢 Wet / Organic Waste',
    binColor: '#22C55E',
    binName: 'Green Bin 🟢',
    badgeBg: 'bg-green-100 dark:bg-green-950',
    badgeText: 'text-green-800 dark:text-green-300',
    cardBorder: 'border-green-200 dark:border-green-800',
    icon: 'Apple',
    description: 'Biodegradable kitchen, food, and garden waste that decomposes naturally.',
    examples: ['Food leftovers', 'Vegetable & fruit peels', 'Coffee grounds & tea bags', 'Garden leaves & twigs', 'Eggshells'],
  },
  'Dry Waste': {
    type: 'Dry Waste',
    title: '🔵 Dry Waste',
    binColor: '#3B82F6',
    binName: 'Blue Bin 🔵',
    badgeBg: 'bg-blue-100 dark:bg-blue-950',
    badgeText: 'text-blue-800 dark:text-blue-300',
    cardBorder: 'border-blue-200 dark:border-blue-800',
    icon: 'FileText',
    description: 'Non-biodegradable waste that does not rot or contain liquid moisture.',
    examples: ['Newspapers & magazines', 'Cardboard boxes', 'Dry plastic wrappers', 'Rubber & leather', 'Rags & textiles'],
  },
  'Recyclable Waste': {
    type: 'Recyclable Waste',
    title: '🔵 Recyclable Waste',
    binColor: '#0284C7',
    binName: 'Blue Bin 🔵',
    badgeBg: 'bg-sky-100 dark:bg-sky-950',
    badgeText: 'text-sky-800 dark:text-sky-300',
    cardBorder: 'border-sky-200 dark:border-sky-800',
    icon: 'Recycle',
    description: 'Clean materials that can be processed and re-manufactured into new items.',
    examples: ['PET Plastic bottles', 'Glass bottles & jars', 'Aluminum soda cans', 'Milk & juice cartons', 'Tin food cans'],
  },
  'Hazardous Waste': {
    type: 'Hazardous Waste',
    title: '🔴 Hazardous Waste',
    binColor: '#EF4444',
    binName: 'Red Bin 🔴',
    badgeBg: 'bg-red-100 dark:bg-red-950',
    badgeText: 'text-red-800 dark:text-red-300',
    cardBorder: 'border-red-200 dark:border-red-800',
    icon: 'AlertTriangle',
    description: 'Toxic, chemical, flammable, infectious, or corrosive items requiring special disposal.',
    examples: ['Used household batteries', 'Paint cans & solvents', 'Expired medicines & syringes', 'Fluorescent bulbs', 'Pesticide containers'],
  },
  'E-Waste': {
    type: 'E-Waste',
    title: '🟡 Electronic Waste',
    binColor: '#EAB308',
    binName: 'Yellow Bin 🟡',
    badgeBg: 'bg-amber-100 dark:bg-amber-950',
    badgeText: 'text-amber-800 dark:text-amber-300',
    cardBorder: 'border-amber-200 dark:border-amber-800',
    icon: 'Smartphone',
    description: 'Discarded electrical or electronic devices, circuits, wires, and power accessories.',
    examples: ['Old mobile phones', 'Laptops & computers', 'Chargers & power cables', 'Printers & cartridges', 'Circuit boards'],
  },
};

export const INITIAL_WASTE_ITEMS: WasteItem[] = [
  {
    id: 'w1',
    name: 'Banana Peel',
    category: 'Wet Waste',
    binColor: 'Green',
    binName: 'Green Bin 🟢',
    examples: ['Fruit scraps', 'Organic kitchen waste'],
    actionSteps: [
      'Collect in a dedicated wet waste bin lined with paper or compostable liner.',
      'Keep free from plastic wrappers or foil.',
      'Deposit in green composting bin or home compost pile.'
    ],
    recyclingTip: 'Banana peels are rich in potassium and make excellent natural soil fertilizer!',
    ecoPoints: 10,
    environmentalImpact: 'Diverts methane-producing organic mass from landfills into nutrient-dense compost.'
  },
  {
    id: 'w2',
    name: 'Plastic Water Bottle (PET)',
    category: 'Recyclable Waste',
    binColor: 'Blue',
    binName: 'Blue Bin 🔵',
    examples: ['Beverage bottles', 'Soda containers'],
    actionSteps: [
      'Empty all liquid contents completely.',
      'Rinse lightly with clean water if sticky.',
      'Crush the bottle and separate or loosely cap.',
      'Place in the dry recyclable bin.'
    ],
    recyclingTip: 'Recycled PET bottles are melted down into polyester fiber used for clothing and backpacks!',
    ecoPoints: 15,
    environmentalImpact: 'Recycling 1 plastic bottle saves enough energy to power a 60W lightbulb for 3 hours.'
  },
  {
    id: 'w3',
    name: 'Newspaper & Mail',
    category: 'Dry Waste',
    binColor: 'Blue',
    binName: 'Blue Bin 🔵',
    examples: ['Print papers', 'Catalogues', 'Envelopes'],
    actionSteps: [
      'Keep dry and clean from grease or food oil.',
      'Bundle newspapers together or stack flat.',
      'Place in blue paper recycling bin.'
    ],
    recyclingTip: 'Paper can be recycled 5 to 7 times before wood fibers become too short to bind.',
    ecoPoints: 12,
    environmentalImpact: '1 ton of recycled newspaper saves 17 mature trees and 7,000 gallons of water.'
  },
  {
    id: 'w4',
    name: 'Glass Beverage Bottle',
    category: 'Recyclable Waste',
    binColor: 'Blue',
    binName: 'Blue Bin 🔵',
    examples: ['Juice jars', 'Sauce bottles', 'Glass cups'],
    actionSteps: [
      'Rinse out food or beverage residues.',
      'Remove metal or plastic caps (recycle metal separately).',
      'Handle carefully to prevent breakage and deposit in glass collection bin.'
    ],
    recyclingTip: 'Glass is 100% recyclable endlessly without any loss in quality or purity!',
    ecoPoints: 20,
    environmentalImpact: 'Using recycled glass cullet cuts carbon dioxide emissions in glass furnaces by 20%.'
  },
  {
    id: 'w5',
    name: 'Household AA Batteries',
    category: 'Hazardous Waste',
    binColor: 'Red',
    binName: 'Red Bin 🔴',
    examples: ['Alkaline batteries', 'Li-ion cells', 'Button cell batteries'],
    actionSteps: [
      'Store in a cool, dry plastic box or tape the battery terminals with electric tape.',
      'Never throw into standard garbage bins or burn in fires.',
      'Drop off at an authorized hazardous waste or battery collection point.'
    ],
    recyclingTip: 'Specialized battery recyclers extract zinc, manganese, steel, and lithium for reuse.',
    ecoPoints: 25,
    environmentalImpact: 'Prevents heavy metal leaching into underground groundwater aquifers.'
  },
  {
    id: 'w6',
    name: 'Old Smartphone & Laptop',
    category: 'E-Waste',
    binColor: 'Yellow',
    binName: 'Yellow Bin 🟡',
    examples: ['Cell phones', 'Tablets', 'Computer towers'],
    actionSteps: [
      'Perform a factory reset to erase personal data.',
      'Remove SIM card and memory cards.',
      'Schedule an EcoCycle E-Waste pickup or visit an authorized collection kiosk.'
    ],
    recyclingTip: '1 million recycled mobile phones yield 35,000 lbs of copper and 75 lbs of gold!',
    ecoPoints: 30,
    environmentalImpact: 'Reduces toxic electronic waste buildup and recovers scarce precious earth minerals.'
  },
  {
    id: 'w7',
    name: 'Cardboard Delivery Box',
    category: 'Recyclable Waste',
    binColor: 'Blue',
    binName: 'Blue Bin 🔵',
    examples: ['Shipping boxes', 'Cereal boxes', 'Shoe packaging'],
    actionSteps: [
      'Remove plastic shipping tape and shipping labels if possible.',
      'Flatten the box completely.',
      'Keep dry and stack in dry recyclable collection stream.'
    ],
    recyclingTip: 'Corrugated cardboard has one of the highest recycling efficiency rates worldwide (>85%).',
    ecoPoints: 15,
    environmentalImpact: 'Reduces deforestation and keeps bulky cardboard out of municipal landfills.'
  },
  {
    id: 'w8',
    name: 'Food Waste & Leftovers',
    category: 'Wet Waste',
    binColor: 'Green',
    binName: 'Green Bin 🟢',
    examples: ['Cooked rice', 'Curry leftovers', 'Stale bread'],
    actionSteps: [
      'Drain excess gravy or liquid soup down sink with food trap.',
      'Deposit solid food remains into green wet waste bin.',
      'Send to municipal anaerobic digestion or home vermicomposting.'
    ],
    recyclingTip: 'Anaerobic digestion converts food waste into green biogas fuel for cooking and electricity!',
    ecoPoints: 10,
    environmentalImpact: 'Prevents landfill gas generation and produces renewable biogas energy.'
  },
  {
    id: 'w9',
    name: 'Aluminum Soda Can',
    category: 'Recyclable Waste',
    binColor: 'Blue',
    binName: 'Blue Bin 🔵',
    examples: ['Soft drink cans', 'Canned food tins'],
    actionSteps: [
      'Rinse out remaining liquid.',
      'Optionally crush to save space.',
      'Place in metal/recyclables collection stream.'
    ],
    recyclingTip: 'An aluminum can can be recycled and back on store shelves as a new can in just 60 days!',
    ecoPoints: 20,
    environmentalImpact: 'Recycling aluminum consumes 95% less energy than refining bauxite ore.'
  },
  {
    id: 'w10',
    name: 'Expired Medicine & Syringes',
    category: 'Hazardous Waste',
    binColor: 'Red',
    binName: 'Red Bin 🔴',
    examples: ['Pill blisters', 'Syringes', 'Ointment tubes'],
    actionSteps: [
      'Keep in original container or place sharps in puncture-resistant rigid container.',
      'Label clearly as Medical/Hazardous Waste.',
      'Hand over to pharmacy collection box or biomedical waste agent.'
    ],
    recyclingTip: 'Biomedical waste is safely incinerated at ultra-high temperatures in specialized treatment units.',
    ecoPoints: 20,
    environmentalImpact: 'Protects sanitation personnel and avoids drug contamination in river waterways.'
  },
  {
    id: 'w11',
    name: 'Computer Cables & Charger',
    category: 'E-Waste',
    binColor: 'Yellow',
    binName: 'Yellow Bin 🟡',
    examples: ['USB cables', 'Power adapters', 'Headphones'],
    actionSteps: [
      'Bundle neatly with a rubber band.',
      'Store together in an E-Waste box.',
      'Request EcoCycle pickup or drop off at local E-waste center.'
    ],
    recyclingTip: 'Copper wiring inside charging cables is highly valuable and easily meltable for reuse.',
    ecoPoints: 20,
    environmentalImpact: 'Reclaims high-purity copper without energy-intensive mining.'
  },
  {
    id: 'w12',
    name: 'Fluorescent Bulb & CFL',
    category: 'Hazardous Waste',
    binColor: 'Red',
    binName: 'Red Bin 🔴',
    examples: ['Tube lights', 'CFL bulbs'],
    actionSteps: [
      'Wrap in paper or bubble wrap to prevent breaking.',
      'Do not place in standard glass recycling or trash bin.',
      'Drop off at hazardous recycling site.'
    ],
    recyclingTip: 'CFL bulbs contain trace mercury vapor which is captured and safely isolated during recycling.',
    ecoPoints: 25,
    environmentalImpact: 'Prevents mercury exposure in homes and municipal waste facilities.'
  }
];
