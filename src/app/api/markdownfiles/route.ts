import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const files = await prisma.markdownFile.findMany({
      include: { project: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch markdown files' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { filename, content, projectId } = await request.json();
    if (!filename || !content || !projectId) {
      return NextResponse.json({ error: 'filename, content and projectId are required' }, { status: 400 });
    }
    const file = await prisma.markdownFile.create({
      data: { filename, content, projectId },
    });
    return NextResponse.json(file);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create markdown file' }, { status: 500 });
  }
} 