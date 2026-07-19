import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  email: string;
  productName?: string;
  message: string;
  createdAt: Date;
}

const InquirySchema: Schema<IInquiry> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    productName: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Index for query performance
InquirySchema.index({ createdAt: -1 });

const Inquiry = models.Inquiry || model<IInquiry>('Inquiry', InquirySchema);

export default Inquiry;
