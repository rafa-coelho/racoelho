import { NextResponse } from 'next/server';
import { socialService } from '@/lib/services/social.service';

export async function GET() {
  try {
    const socialLinks = await socialService.getSocialLinks();
    return NextResponse.json(socialLinks);
  } catch (error) {
    console.error('Error fetching social links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social links' },
      { status: 500 }
    );
  }
}

