import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Inquiry from '@/models/Inquiry';

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get product counts and inquiries
    const [
      totalProducts,
      activeProducts,
      draftProducts,
      inactiveProducts,
      recentlyAddedProducts,
      totalInquiries,
      recentInquiries
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Product.countDocuments({ status: 'draft' }),
      Product.countDocuments({ status: 'inactive' }),
      Product.find({})
        .sort({ createdAt: -1 })
        .limit(4)
        .select('name category createdAt')
        .lean(),
      Inquiry.countDocuments(),
      Inquiry.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    // Get products by category for insights
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Get products by brand for insights
    const productsByBrand = await Product.aggregate([
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Format recently added products
    const formattedRecentProducts = recentlyAddedProducts.map(product => ({
      id: product._id,
      name: product.name,
      category: product.category,
      date: formatRelativeDate(new Date(product.createdAt))
    }));

    // Format recent inquiries
    const formattedRecentInquiries = (recentInquiries || []).map((inquiry: any) => ({
      id: inquiry._id.toString(),
      name: inquiry.name,
      email: inquiry.email,
      product: inquiry.productName || 'General Inquiry',
      message: inquiry.message,
      date: formatRelativeDate(new Date(inquiry.createdAt))
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        draftProducts,
        inactiveProducts,
        totalInquiries,
        recentlyAddedProducts: formattedRecentProducts,
        recentInquiries: formattedRecentInquiries,
        productsByCategory,
        productsByBrand
      }
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }
}