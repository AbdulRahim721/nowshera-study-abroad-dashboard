import { NextResponse } from 'next/server';
import { getOfficeData } from '../../../lib/repository';

export async function GET() {
  return NextResponse.json(await getOfficeData());
}
