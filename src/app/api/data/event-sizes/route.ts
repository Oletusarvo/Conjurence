import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = await db(tablenames.event_threshold).pluck('label');
    return new NextResponse(JSON.stringify(categories), { status: 200 });
  } catch (err: any) {
    console.log(err.message);
    return new NextResponse(null, { status: 500 });
  }
}
