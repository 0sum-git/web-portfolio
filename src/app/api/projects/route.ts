import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated, handleApiError } from '@/lib/auth';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { files: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
    // Log the error but don't expose it in the response
    handleApiError(error, 'Failed to fetch projects');
    // Still return an empty array with 200 status for public-facing endpoints
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  // Check if the request is authenticated
  const authCheck = isAdminAuthenticated(request);
  if (authCheck) return authCheck;

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
    const errorResponse = handleApiError(error, 'Failed to create project');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Check if the request is authenticated
  const authCheck = isAdminAuthenticated(request);
  if (authCheck) return authCheck;

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
    const errorResponse = handleApiError(error, 'Failed to update project');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}