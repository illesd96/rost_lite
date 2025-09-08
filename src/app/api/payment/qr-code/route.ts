import { NextRequest, NextResponse } from 'next/server';
import * as QRCode from 'qrcode';
import { paymentDataToQRString, type HungarianPaymentData } from '@/lib/hungarian-payment';

export async function POST(request: NextRequest) {
  try {
    const paymentData: HungarianPaymentData = await request.json();

    // Validate required fields
    if (!paymentData.name || !paymentData.iban || !paymentData.amount || !paymentData.currency) {
      return NextResponse.json(
        { error: 'Missing required payment data' },
        { status: 400 }
      );
    }

    // Convert payment data to QR string
    const qrString = paymentDataToQRString(paymentData);
    
    // Generate QR code as data URL
    const qrCodeUrl = await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 256,
    });

    return NextResponse.json({
      success: true,
      qrCodeUrl,
      qrString, // For debugging/testing purposes
    });

  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
