import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Get Kit.com API configuration from environment variables
    const kitApiKey = process.env.KIT_API_KEY;
    const kitNewsletterID = process.env.KIT_NEWSLETTER_ID;
    const kitApiUrl = process.env.KIT_API_URL || 'https://app.kit.com/api/v1/subscribe';

    if (!kitApiKey) {
      console.error('Kit.com API key is not configured');
      return NextResponse.json(
        { success: false, message: 'Newsletter service is not properly configured' },
        { status: 500 }
      );
    }

    // Make the API request to Kit.com
    try {
      const response = await fetch(kitApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${kitApiKey}`
        },
        body: JSON.stringify({ 
          email,
          newsletterId: kitNewsletterID,
          // Add any other required parameters according to Kit.com's API documentation
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Kit.com API error:', data);
        return NextResponse.json(
          { success: false, message: 'Failed to subscribe to the newsletter' },
          { status: response.status }
        );
      }
      
      return NextResponse.json(
        { success: true, message: 'Successfully subscribed to the newsletter' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Kit.com API request error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to connect to newsletter service' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process subscription request' },
      { status: 500 }
    );
  }
}
