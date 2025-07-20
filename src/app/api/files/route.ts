import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { isAdminAuthenticated, handleApiError } from '@/lib/auth';
import crypto from 'crypto';

export const runtime = 'nodejs';

// Allowed file types
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  // Check if the request is authenticated
  const authCheck = isAdminAuthenticated(request);
  if (authCheck) return authCheck;

  try {
    const formData = await request.formData();
    const projectId = formData.get('projectId') as string;
    const files = formData.getAll('images') as File[];

    if (!projectId || files.length === 0) {
      return NextResponse.json({ error: 'projectId and images are required' }, { status: 400 });
    }

    // Validate project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const savedFiles = [];

    for (const file of files) {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json({ 
          error: `File type not allowed: ${file.type}. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}` 
        }, { status: 400 });
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ 
          error: `File too large: ${Math.round(file.size / 1024 / 1024)}MB. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` 
        }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Generate a unique filename to prevent overwriting
      const fileExtension = path.extname(file.name);
      const fileNameWithoutExt = path.basename(file.name, fileExtension);
      const hash = crypto.createHash('md5').update(buffer).digest('hex').substring(0, 8);
      const safeFileName = `${fileNameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_')}_${hash}${fileExtension}`;
      
      const filePath = path.join(uploadDir, safeFileName);
      await writeFile(filePath, buffer);
      const url = `/uploads/${safeFileName}`;
      
      const saved = await prisma.file.create({
        data: {
          url,
          projectId,
        },
      });
      savedFiles.push(saved);
    }

    return NextResponse.json({ files: savedFiles });
  } catch (error) {
    const errorResponse = handleApiError(error, 'Failed to upload files');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}