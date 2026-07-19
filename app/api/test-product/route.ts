import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

// Test endpoint to see product data
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get all products with just IDs and names
    const products = await Product.find({}, 'name _id category brand condition status').limit(10).lean();

    return NextResponse.json({
      success: true,
      count: products.length,
      products: products.map(p => ({
        id: p._id,
        name: p.name,
        category: p.category,
        brand: p.brand,
        condition: p.condition,
        status: p.status
      }))
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
