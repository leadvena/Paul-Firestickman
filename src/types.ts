export interface OrderFormData {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  postcode: string;
  packageType: string;
  specialInstructions: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  description: string;
  delivery: string;
  badge?: string;
  features: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}
