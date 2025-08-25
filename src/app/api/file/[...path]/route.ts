// src\app\api\file\[...path]\route.ts
import { NextResponse } from 'next/server';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    // Reconstruct the file path from the URL parameters
    const filePath = path.join(process.cwd(), 'uploads', ...params.path);

    // Check if file exists and get its stats
    const stats = await stat(filePath);
    if (!stats.isFile()) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }

    // Create a readable stream of the file
    const fileStream = createReadStream(filePath);

    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentType = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.mp3': 'audio/mpeg',
      '.mp4': 'video/mp4',
      '.webm': 'audio/webm',
      '.pdf': 'application/pdf',
    }[ext] || 'application/octet-stream';

    // Return the file stream with appropriate headers
    return new NextResponse(fileStream as any, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': stats.size.toString(),
        'Cache-Control': 'public, max-age=31536000',
      },
    });

  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'Error serving file' },
      { status: 500 }
    );
  }
}
