import mongoose, { Schema, Document } from "mongoose";

export interface IHomepageDoc extends Document {
  hero: {
    heading: string;
    subheading: string;
    image: string;
    imageMobile: string;
    videoUrl: string;
    videoUrlMobile: string;
    ctaText: string;
    ctaUrl: string;
    badge: string;
  };
  announcementBar: {
    text: string;
    active: boolean;
  };
  trustItems: {
    icon: string;
    title: string;
    description: string;
  }[];
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
  nonVegSection: {
    heading: string;
    description: string;
    image: string;
    ctaText: string;
    ctaUrl: string;
  };
  powdersSection: {
    heading: string;
    description: string;
    image: string;
    ctaText: string;
    ctaUrl: string;
  };
  experienceSteps: {
    number: string;
    title: string;
    description: string;
  }[];
  founder: {
    name: string;
    designation: string;
    story: string;
    quote: string;
    image: string;
  };
  policies: {
    heading: string;
    unboxingDisclaimer: string;
    cancellationHeading: string;
    cancellationText: string;
    returnHeading: string;
    returnText: string;
    refundHeading: string;
    refundText: string;
    policyNote: string;
  };
}

const HomepageSchema = new Schema<IHomepageDoc>(
  {
    hero: {
      heading: { type: String, default: "AUTHENTIC TASTE.\nMADE WITH LOVE." },
      subheading: { type: String, default: "Traditional homemade pickles crafted with care, packed fresh and delivered to your doorstep." },
      image: { type: String, default: "" },
      imageMobile: { type: String, default: "" },
      videoUrl: { type: String, default: "" },
      videoUrlMobile: { type: String, default: "" },
      ctaText: { type: String, default: "SHOP PICKLES" },
      ctaUrl: { type: String, default: "/shop" },
      badge: { type: String, default: "PURE. FRESH. HOMEMADE WITH LOVE." },
    },
    announcementBar: {
      text: { type: String, default: "AUTHENTIC HOMEMADE PICKLES • FRESHLY PREPARED • MADE WITH LOVE" },
      active: { type: Boolean, default: true },
    },
    trustItems: [
      {
        icon: { type: String, default: "leaf" },
        title: { type: String },
        description: { type: String },
      },
    ],
    storySection: {
      title: { type: String, default: "TRADITION IN EVERY JAR" },
      text: { type: String, default: "At Devi Pickles, every jar carries the warmth of traditional homemade cooking. We believe great food does not need to be complicated — it needs authentic ingredients, time-tested recipes and a whole lot of love." },
      image: { type: String, default: "" },
    },
    featuredProducts: [{ type: String }],
    whyChooseUs: {
      title: { type: String, default: "WHY CHOOSE DEVI PICKLES?" },
      items: [
        {
          title: { type: String },
          description: { type: String },
          icon: { type: String },
        },
      ],
    },
    finalCta: {
      heading: { type: String, default: "BRING HOME THE TASTE OF TRADITION." },
      description: { type: String, default: "Authentic homemade flavours, prepared with care." },
      buttonText: { type: String, default: "SHOP NOW" },
      buttonUrl: { type: String, default: "/shop" },
    },
    socialGallery: [{ type: String }],
    nonVegSection: {
      heading: { type: String, default: "PREMIUM NON-VEG PICKLES" },
      description: { type: String, default: "Rich, flavourful and prepared with the finest ingredients." },
      image: { type: String, default: "" },
      ctaText: { type: String, default: "EXPLORE NON-VEG PICKLES" },
      ctaUrl: { type: String, default: "/shop/non-veg-pickles" },
    },
    powdersSection: {
      heading: { type: String, default: "TRADITIONAL POWDERS" },
      description: { type: String, default: "Authentic spice blends made from traditional recipes." },
      image: { type: String, default: "" },
      ctaText: { type: String, default: "SHOP POWDERS" },
      ctaUrl: { type: String, default: "/shop/powders" },
    },
    experienceSteps: [
      {
        number: { type: String, default: "01" },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
    founder: {
      name: { type: String, default: "" },
      designation: { type: String, default: "" },
      story: { type: String, default: "" },
      quote: { type: String, default: "" },
      image: { type: String, default: "" },
    },
    policies: {
      heading: { type: String, default: "ORDER POLICY" },
      unboxingDisclaimer: { type: String, default: "Please record a continuous unboxing video while opening your package to help us verify any transit damage, missing items or order-related issues." },
      cancellationHeading: { type: String, default: "NO CANCELLATION" },
      cancellationText: { type: String, default: "Orders cannot be cancelled once processing or dispatch has started." },
      returnHeading: { type: String, default: "NO RETURN" },
      returnText: { type: String, default: "Food products are not eligible for return due to hygiene and food-safety considerations." },
      refundHeading: { type: String, default: "NO REFUND" },
      refundText: { type: String, default: "Refunds are provided only for approved cases such as damaged, missing or incorrect items as per the store policy." },
      policyNote: { type: String, default: "Please review our complete policy before placing your order." },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Homepage || mongoose.model<IHomepageDoc>("Homepage", HomepageSchema);
