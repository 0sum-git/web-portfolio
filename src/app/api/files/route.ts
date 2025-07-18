import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const formData = await request.formData();
  const projectId = formData.get('projectId') as string;
  const files = formData.getAll('images') as File[];

  if (!projectId || files.length === 0) {
    return NextResponse.json({ error: 'projectId and images are required' }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });

  const savedFiles = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    const url = `/uploads/${fileName}`;
    const saved = await prisma.file.create({
      data: {
        url,
        projectId,
      },
    });
    savedFiles.push(saved);
  }

  return NextResponse.json({ files: savedFiles });
} 