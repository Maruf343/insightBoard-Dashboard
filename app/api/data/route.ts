import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const category = request.nextUrl.searchParams.get('category');
  const keyword = request.nextUrl.searchParams.get('keyword');
  const sortField = request.nextUrl.searchParams.get('sortField') ?? 'createdAt';
  const sortDirection = request.nextUrl.searchParams.get('sortDirection') === 'asc' ? 'asc' : 'desc';
  const page = Number(request.nextUrl.searchParams.get('page') ?? '1');
  const pageSize = Number(request.nextUrl.searchParams.get('pageSize') ?? '8');
  const startDate = request.nextUrl.searchParams.get('startDate');
  const endDate = request.nextUrl.searchParams.get('endDate');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const where: any = { userId };

  if (category && category !== 'All') {
    where.category = category;
  }

  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: 'insensitive' } },
      { description: { contains: keyword, mode: 'insensitive' } },
    ];
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const total = await prisma.dataItem.count({ where });
  const items = await prisma.dataItem.findMany({
    where,
    orderBy: { [sortField]: sortDirection },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, title, description, category, status } = body;

  if (!userId || !title || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const item = await prisma.dataItem.create({
    data: {
      userId,
      title,
      description: description ?? '',
      category,
      status: status ?? 'Active',
    },
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: 'create',
      entity: 'data_item',
      entityId: item.id,
      details: `Created data item ${item.title}`,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
