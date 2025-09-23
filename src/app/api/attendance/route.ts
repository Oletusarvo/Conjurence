import db from '@/dbconfig';
import { getAttendance } from '@/features/attendance/dal/get-attendance';
import { attendanceService } from '@/features/attendance/services/attendance-service';
import { loadSession } from '@/util/load-session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await loadSession();
    const attendanceRecord = await attendanceService.repo.findRecentActiveByUserId(
      session.user.id,
      db
    );

    return new NextResponse(JSON.stringify(attendanceRecord), { status: 200 });
  } catch (err) {
    console.log(err.message);
    return new NextResponse(null, { status: 500 });
  }
}
