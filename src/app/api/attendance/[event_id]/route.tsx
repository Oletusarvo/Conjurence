import db from '@/dbconfig';
import { attendanceService } from '@/features/attendance/services/attendance-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }) {
  try {
    const { event_id } = await params;
    const attendance = await attendanceService.repo.findByEventInstanceId(event_id, db);
    return new NextResponse(JSON.stringify(attendance), { status: 200 });
  } catch (err: any) {
    console.log(err.message);
    return new NextResponse(null, { status: 500 });
  }
}
