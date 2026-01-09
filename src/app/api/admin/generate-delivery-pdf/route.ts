import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import PDFDocument from 'pdfkit';

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

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    
    const pdfPromise = new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });

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
      const address = billingData?.shippingAddress || billingData?.billingData;
      if (!address) return 'No address available';
      
      return `${address.postcode} ${address.city}, ${address.streetName} ${address.streetType} ${address.houseNum}${address.building ? ` ${address.building}` : ''}${address.floor ? ` ${address.floor}` : ''}${address.door ? ` ${address.door}` : ''}`;
    };

    const getContactInfo = (billingData: any) => {
      return {
        name: billingData?.contactName || billingData?.companyName || billingData?.firstName + ' ' + billingData?.lastName || 'N/A',
        phone: billingData?.contactPhone || 'N/A',
        email: billingData?.emailCC1 || billingData?.user?.email || 'N/A'
      };
    };

    // PDF Header
    doc.fontSize(20).text('ROSTI - Delivery List', { align: 'center' });
    doc.fontSize(14).text(formatDate(date), { align: 'center' });
    doc.moveDown();

    // Summary
    const totalBottles = deliveries.reduce((sum, d) => sum + d.quantity, 0);
    doc.fontSize(12)
       .text(`Total Deliveries: ${deliveries.length}`)
       .text(`Total Bottles: ${totalBottles}`)
       .moveDown();

    // Deliveries list
    deliveries.forEach((delivery, index) => {
      const contact = getContactInfo(delivery.order.billingData);
      const address = getDeliveryAddress(delivery.order.billingData);

      // Check if we need a new page
      if (doc.y > 700) {
        doc.addPage();
      }

      // Delivery header
      doc.fontSize(12)
         .fillColor('black')
         .text(`${index + 1}. ${delivery.order.orderNumber} - Package ${delivery.packageNumber}/${delivery.totalPackages}`, { underline: true });
      
      doc.moveDown(0.5);

      // Contact info
      doc.fontSize(10)
         .text(`Contact: ${contact.name}`)
         .text(`Phone: ${contact.phone}`)
         .text(`Email: ${delivery.order.user.email}`)
         .moveDown(0.3);

      // Address
      doc.text(`Address: ${address}`)
         .moveDown(0.3);

      // Package info
      doc.text(`Quantity: ${delivery.quantity} bottles`)
         .text(`Amount: ${(delivery.amount / 100).toFixed(0)} HUF`)
         .moveDown(0.5);

      // Separator line
      doc.moveTo(50, doc.y)
         .lineTo(550, doc.y)
         .stroke()
         .moveDown(0.5);
    });

    // Footer
    doc.fontSize(8)
       .fillColor('gray')
       .text(`Generated on ${new Date().toLocaleString('hu-HU')}`, 50, doc.page.height - 50, { align: 'center' });

    doc.end();

    const pdfBuffer = await pdfPromise;

    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="delivery-list-${date}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { message: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
