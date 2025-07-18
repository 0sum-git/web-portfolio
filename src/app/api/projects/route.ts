import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { files: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('API /api/projects GET error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, content, technologies, githubUrl } = await request.json();
    if (!title || !description || !content) {
      return NextResponse.json({ error: 'Title, description and content are required' }, { status: 400 });
    }
    let techArray: string[] = [];
    if (Array.isArray(technologies)) {
      techArray = technologies;
    } else if (typeof technologies === 'string') {
      techArray = technologies.split(',').map(t => t.trim()).filter(Boolean);
    }
    const project = await prisma.project.create({
      data: { 
        title, 
        description, 
        content, 
        technologies: techArray,
        githubUrl 
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error('API /api/projects POST error:', error);
    return NextResponse.json({ error: 'Failed to create project', details: String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, description, content, technologies, githubUrl } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    if (!title || !description || !content) {
      return NextResponse.json({ error: 'Title, description and content are required' }, { status: 400 });
    }
    
    let techArray: string[] = [];
    if (Array.isArray(technologies)) {
      techArray = technologies;
    } else if (typeof technologies === 'string') {
      techArray = technologies.split(',').map(t => t.trim()).filter(Boolean);
    }
    
    const project = await prisma.project.update({
      where: { id },
      data: { 
        title, 
        description, 
        content, 
        technologies: techArray,
        githubUrl 
      },
    });
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('API /api/projects PUT error:', error);
    return NextResponse.json({ error: 'Failed to update project', details: String(error) }, { status: 500 });
  }
}