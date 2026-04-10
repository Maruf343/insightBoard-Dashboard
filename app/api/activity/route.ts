import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const page = Number(request.nextUrl.searchParams.get('page') ?? '1');
  const pageSize = Number(request.nextUrl.searchParams.get('pageSize') ?? '10');
  const keyword = request.nextUrl.searchParams.get('keyword');
  const startDate = request.nextUrl.searchParams.get('startDate');
  const endDate = request.nextUrl.searchParams.get('endDate');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const where: any = { userId };
  if (keyword) {
    where.OR = [
      { action: { contains: keyword, mode: 'insensitive' } },
      { entity: { contains: keyword, mode: 'insensitive' } },
      { details: { contains: keyword, mode: 'insensitive' } },
    ];
  }
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const total = await prisma.activityLog.count({ where });
  const logs = await prisma.activityLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return NextResponse.json({ logs, total, page, pageSize });
}
