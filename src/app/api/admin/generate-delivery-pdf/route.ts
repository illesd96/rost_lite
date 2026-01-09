import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface DeliveryItem {
  id: string;
  deliveryDate: string;
  quantity: number;
  amount: number;
  packageNumber: number;
  totalPackages: number;
  order: {
    orderNumber: string;
    billingData: any;
    user: {
      email: string;
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { date, deliveries }: { date: string; deliveries: DeliveryItem[] } = await req.json();

    // Helper functions
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('hu-HU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const getDeliveryAddress = (billingData: any) => {
      const address = billingData?.shippingAddress || billingData?.billingAddress;
      if (!address) return 'No address available';
      
      return `${address.postcode} ${address.city}, ${address.streetName} ${address.streetType} ${address.houseNum}${address.building ? ` ${address.building}` : ''}${address.floor ? ` ${address.floor}` : ''}${address.door ? ` ${address.door}` : ''}`;
    };

    const getContactInfo = (billingData: any) => {
      return {
        name: billingData?.contactName || billingData?.companyName || billingData?.firstName + ' ' + billingData?.lastName || 'N/A',
        phone: billingData?.contactPhone || 'N/A',
        email: billingData?.emailCC1 || 'N/A'
      };
    };

    // Generate HTML content
    const totalBottles = deliveries.reduce((sum, d) => sum + d.quantity, 0);
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>ROSTI - Delivery List</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          line-height: 1.4;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .header h1 {
          font-size: 24px;
          margin: 0;
          color: #333;
        }
        .header h2 {
          font-size: 18px;
          margin: 10px 0 0 0;
          color: #666;
        }
        .summary {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 30px;
        }
        .delivery-item {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        .delivery-header {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        .delivery-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .detail-section h4 {
          font-size: 14px;
          color: #666;
          margin: 0 0 5px 0;
        }
        .detail-section p {
          margin: 2px 0;
          font-size: 13px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }
        @media print {
          body { margin: 0; }
          .delivery-item { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>ROSTI - Delivery List</h1>
        <h2>${formatDate(date)}</h2>
      </div>
      
      <div class="summary">
        <strong>Summary:</strong> ${deliveries.length} deliveries • ${totalBottles} bottles total
      </div>
      
      ${deliveries.map((delivery, index) => {
        const contact = getContactInfo(delivery.order.billingData);
        const address = getDeliveryAddress(delivery.order.billingData);
        
        return `
        <div class="delivery-item">
          <div class="delivery-header">
            ${index + 1}. ${delivery.order.orderNumber} - Package ${delivery.packageNumber}/${delivery.totalPackages}
          </div>
          <div class="delivery-details">
            <div class="detail-section">
              <h4>Contact Information</h4>
              <p><strong>Name:</strong> ${contact.name}</p>
              <p><strong>Phone:</strong> ${contact.phone}</p>
              <p><strong>Email:</strong> ${delivery.order.user.email}</p>
            </div>
            <div class="detail-section">
              <h4>Delivery Details</h4>
              <p><strong>Address:</strong> ${address}</p>
              <p><strong>Quantity:</strong> ${delivery.quantity} bottles</p>
              <p><strong>Amount:</strong> ${(delivery.amount / 100).toFixed(0)} HUF</p>
            </div>
          </div>
        </div>
        `;
      }).join('')}
      
      <div class="footer">
        Generated on ${new Date().toLocaleString('hu-HU')}
      </div>
    </body>
    </html>
    `;

    // Return HTML response that can be printed as PDF by the browser
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="delivery-list-${date}.html"`,
      },
    });

  } catch (error) {
    console.error('Error generating delivery list:', error);
    return NextResponse.json(
      { message: 'Failed to generate delivery list' },
      { status: 500 }
    );
  }
}
