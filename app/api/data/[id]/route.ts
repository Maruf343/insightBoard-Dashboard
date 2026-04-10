import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const item = await prisma.dataItem.findUnique({ where: { id: params.id } });
  if (!item || item.userId !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { userId, title, description, category, status } = body;

  if (!userId || !title || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const existing = await prisma.dataItem.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const updated = await prisma.dataItem.update({
    where: { id: params.id },
    data: {
      title,
      description: description ?? '',
      category,
      status,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: 'update',
      entity: 'data_item',
      entityId: updated.id,
      details: `Updated data item ${updated.title}`,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const existing = await prisma.dataItem.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.dataItem.delete({ where: { id: params.id } });
  await prisma.activityLog.create({
    data: {
      userId,
      action: 'delete',
      entity: 'data_item',
      entityId: existing.id,
      details: `Deleted data item ${existing.title}`,
    },
  });

  return NextResponse.json({ success: true });
}
