import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  image: String,
  price: Number,
  qty: Number,
  category: String,
});

const AddressSchema = new mongoose.Schema(
  {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: "India" },
  },
  { _id: false }
);

const TrackingEventSchema = new mongoose.Schema(
  {
    date: String,
    status: String,
    activity: String,
    location: String,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [OrderItemSchema],
    subtotal: Number,
    total: Number,
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing", 
        "shipped",
        "delivered",
        "cancelled",
        "returned", 
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: { type: String, default: "razorpay" },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    customerName: String,
    customerMobile: String,
    customerEmail: String,
    shippingAddress: AddressSchema,
    billingAddress: AddressSchema,
    gstNumber: String,
    notes: String,
    shipment: {
      provider: { type: String, default: "shiprocket" },
      srOrderId: Number,
      shipmentId: Number,
      awbCode: String,
      courierName: String,
      courierCompanyId: Number,
      trackingUrl: String,
      currentStatus: String, 
      etd: String,
      pickupRequested: { type: Boolean, default: false },
      pickupScheduledDate: String,
      pickupError: String,
      parcel: {
        weight: Number,
        length: Number, 
        breadth: Number,
        height: Number,
      },
      events: [TrackingEventSchema],
      lastTrackedAt: Date,
      shippedAt: Date,
      deliveredAt: Date,
    },
    stockIssues: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        qtyRequested: Number,
        qtyFulfilled: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);