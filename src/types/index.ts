export interface IVariant {
  _id?: string;
  name: string;
  weight: string;
  weightInGrams: number;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku?: string;
  active: boolean;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  description: string;
  shortDescription: string;
  images: string[];
  cloudinaryPublicIds: string[];
  variants: IVariant[];
  ingredients: string[];
  rating: number;
  reviewCount: number;
  shelfLife?: string;
  storageInstructions?: string;
  tags: string[];
  featured: boolean;
  bestSeller: boolean;
  active: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  cloudinaryPublicId?: string;
  displayOrder: number;
  active: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderItem {
  product: string;
  productName: string;
  variantName: string;
  weightInGrams: number;
  quantity: number;
  price: number;
  weight: string;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: "razorpay" | "whatsapp";
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  deliveryCharge: number;
  totalWeight: number;
  grandTotal: number;
  couponCode?: string;
  discountAmount?: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  _id: string;
  customerName: string;
  rating: number;
  review: string;
  location?: string;
  photo?: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITestimonial {
  _id: string;
  type: "written" | "instagram" | "uploaded";
  customerName: string;
  customerLocation: string;
  customerImage?: string;
  productId?: string;
  productName?: string;
  rating: number;
  reviewText: string;
  instagramUrl?: string;
  instagramCode?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  videoPublicId?: string;
  videoDuration?: number;
  videoAspect?: string;
  caption: string;
  verified: boolean;
  featured: boolean;
  active: boolean;
  displayOrder: number;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICoupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderValue: number;
  maximumDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IFAQ {
  _id: string;
  question: string;
  answer: string;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITrustItem {
  icon: string;
  title: string;
  description: string;
}

export interface IHomepageContent {
  _id: string;
  hero: {
    heading: string;
    subheading: string;
    image: string;
    ctaText: string;
    ctaUrl: string;
  };
  announcementBar: {
    text: string;
    active: boolean;
  };
  trustItems: ITrustItem[];
  storySection: {
    title: string;
    text: string;
    image: string;
  };
  featuredProducts: string[];
  whyChooseUs: {
    title: string;
    items: {
      title: string;
      description: string;
      icon: string;
    }[];
  };
  finalCta: {
    heading: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
  };
  socialGallery: string[];
  updatedAt: string;
}

export interface ISiteSettings {
  _id: string;
  businessName: string;
  businessAddress: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  fssaiNumber: string;
  gstNumber?: string;
  logo: string;
  favicon: string;
  deliveryRatePerKg: number;
  minimumDeliveryCharge: number;
  freeDeliveryEnabled: boolean;
  freeDeliveryThreshold: number;
  razorpayEnabled: boolean;
  whatsappOrdersEnabled: boolean;
  updatedAt: string;
}

export interface ICustomer {
  _id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAdmin {
  _id: string;
  email: string;
  name: string;
  password?: string;
  role: "admin" | "superadmin";
  createdAt: string;
  updatedAt: string;
}

export interface ICartItem {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  weight: string;
  weightInGrams: number;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  category: string;
}

export interface ICartState {
  items: ICartItem[];
  addItem: (item: ICartItem) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalWeight: () => number;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export interface IApiError {
  success: boolean;
  message: string;
  error?: string;
}

export interface IApiSuccess<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
