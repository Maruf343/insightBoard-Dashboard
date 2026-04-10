import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '../../../lib/prisma';

const reportsDir = path.join(process.cwd(), 'public', 'reports');

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const reports = await prisma.report.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(reports);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, title, filters, sections, summary, pdfBase64 } = body;

  if (!userId || !title || !filters || !sections || !pdfBase64) {
    return NextResponse.json({ error: 'Missing required report data' }, { status: 400 });
  }

  const reportId = crypto.randomUUID();
  const fileName = `${reportId}.pdf`;
  const filePath = path.join(reportsDir, fileName);

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
  fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

  const report = await prisma.report.create({
    data: {
      id: reportId,
      title,
      userId,
      filters,
      sections,
      summary,
      pdfUrl: `/reports/${fileName}`,
    },
  });

  return NextResponse.json(report, { status: 201 });
}
