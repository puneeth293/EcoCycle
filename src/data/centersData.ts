import { CollectionCenter } from '../types';

export const COLLECTION_CENTERS: CollectionCenter[] = [
  {
    id: 'c1',
    name: 'EcoCycle Tumkur Central Material Recovery Facility',
    address: 'Plot 14, Industrial Area Phase II, B.H. Road',
    city: 'Tumkur',
    phone: '+91 816 225 4321',
    email: 'tumkur.mrf@ecocycle.org',
    openingHours: 'Mon - Sat: 08:00 AM - 06:00 PM',
    acceptedTypes: ['Wet Waste', 'Dry Waste', 'Recyclable Waste', 'E-Waste', 'Hazardous Waste'],
    rating: 4.8,
    latitude: 13.3379,
    longitude: 77.1173,
    directionsUrl: 'https://maps.google.com/?q=Tumkur+Industrial+Area'
  },
  {
    id: 'c2',
    name: 'GreenEarth Recycling Hub - SS Puram',
    address: 'Near Town Hall Circle, SS Puram',
    city: 'Tumkur',
    phone: '+91 816 227 8890',
    email: 'sspuram.hub@greenearth.in',
    openingHours: 'Mon - Sun: 09:00 AM - 07:00 PM',
    acceptedTypes: ['Dry Waste', 'Recyclable Waste', 'E-Waste'],
    rating: 4.6,
    latitude: 13.3412,
    longitude: 77.1021,
    directionsUrl: 'https://maps.google.com/?q=SS+Puram+Tumkur'
  },
  {
    id: 'c3',
    name: 'Bengaluru Smart E-Waste Collection Center',
    address: '32, 100 Feet Road, Indiranagar',
    city: 'Bengaluru',
    phone: '+91 80 4112 9900',
    email: 'ewaste.blr@ecocycle.org',
    openingHours: 'Mon - Sat: 09:30 AM - 06:30 PM',
    acceptedTypes: ['E-Waste', 'Hazardous Waste', 'Recyclable Waste'],
    rating: 4.9,
    latitude: 12.9784,
    longitude: 77.6408,
    directionsUrl: 'https://maps.google.com/?q=Indiranagar+Bengaluru'
  },
  {
    id: 'c4',
    name: 'North City Bio-Composting Yard',
    address: 'Kalyan Nagar Ring Road, Near Water Tank',
    city: 'Bengaluru',
    phone: '+91 80 2543 1122',
    email: 'north.compost@blr.gov.in',
    openingHours: 'Mon - Sat: 07:00 AM - 04:00 PM',
    acceptedTypes: ['Wet Waste'],
    rating: 4.5,
    latitude: 13.0285,
    longitude: 77.6492,
    directionsUrl: 'https://maps.google.com/?q=Kalyan+Nagar+Bengaluru'
  },
  {
    id: 'c5',
    name: 'Mysuru Clean City Recycling Depot',
    address: '18, Hebbal Industrial Layout',
    city: 'Mysuru',
    phone: '+91 821 240 5566',
    email: 'mysuru.recycling@cleanenvironment.org',
    openingHours: 'Mon - Sat: 08:30 AM - 05:30 PM',
    acceptedTypes: ['Dry Waste', 'Recyclable Waste', 'E-Waste'],
    rating: 4.7,
    latitude: 12.3362,
    longitude: 76.6191,
    directionsUrl: 'https://maps.google.com/?q=Hebbal+Mysuru'
  },
  {
    id: 'c6',
    name: 'Jayanagar Eco Kiosk & Drop Point',
    address: '4th Block, Near Shopping Complex',
    city: 'Bengaluru',
    phone: '+91 80 2663 4455',
    email: 'jayanagar.drop@ecocycle.org',
    openingHours: 'Tue - Sun: 09:00 AM - 08:00 PM',
    acceptedTypes: ['Recyclable Waste', 'E-Waste'],
    rating: 4.8,
    latitude: 12.9250,
    longitude: 77.5838,
    directionsUrl: 'https://maps.google.com/?q=Jayanagar+Bengaluru'
  }
];
