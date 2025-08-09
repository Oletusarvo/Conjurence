import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { tablenames } from '@/tablenames';
import db from '@/dbconfig';

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');
    if (!token) {
      return new NextResponse('Token missing from request!', { status: 400 });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new NextResponse('Invalid token!', { status: 409 });
    }

    //Mark the user as active
    await db(tablenames.user)
      .where({ id: payload.user_id })
      .update({
        user_status_id: db
          .select('id')
          .from(tablenames.user_status)
          .where({ label: 'active' })
          .limit(1),
      });

    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  } catch (err) {
    console.log(err.message);
    return new NextResponse('An unexpected error occured!', { status: 500 });
  }
}
