import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  brand: string;
  category: string;
  condition: 'New' | 'Used' | 'Refurbished';
  description?: string;
  specifications?: string;
  images: string[];
  status: 'active' | 'inactive' | 'draft';
  stockQuantity?: number;
  price?: number;
  currency?: string;
  partNumber?: string;
  manufacturer?: string;
  model?: string;
  yearManufactured?: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    condition: {
      type: String,
      enum: ['New', 'Used', 'Refurbished'],
      required: [true, 'Condition is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    specifications: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'draft',
    },
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    partNumber: {
      type: String,
      trim: true,
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    yearManufactured: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    weight: {
      type: Number,
      min: 0,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        default: 'cm',
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
ProductSchema.index({ slug: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ name: 'text', brand: 'text', category: 'text' });

const Product = models.Product || model<IProduct>('Product', ProductSchema);

export default Product;
