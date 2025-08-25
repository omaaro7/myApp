// src\app\api\upload\route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const subject = formData.get('subject') as string;
    const userName = formData.get('userName') as string;
    const userId = formData.get('userId') as string;

    if (!file || !subject || !userName || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Disallow PHP files by extension or MIME type
    const ext = path.extname(file.name).toLowerCase();
    const blockedExts = new Set(['.php', '.phtml', '.php3', '.php4', '.php5', '.phps']);
    const mime = (file.type || '').toLowerCase();
    const blockedMimes = ['application/x-httpd-php', 'text/x-php', 'application/php'];
    if (blockedExts.has(ext) || blockedMimes.includes(mime)) {
      return NextResponse.json(
        { error: 'PHP files are not allowed.' },
        { status: 400 }
      );
    }

    // Create user-specific upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', userName, subject);
    await mkdir(uploadDir, { recursive: true });

    // Convert the file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write the file to the uploads directory
    const filePath = path.join(uploadDir, file.name);
    await writeFile(filePath, buffer);

    // Generate the URL for the uploaded file
    const fileUrl = `/uploads/${userName}/${subject}/${file.name}`;

    // Store file metadata in your database if needed
    // await db.files.create({ ... })

    return NextResponse.json({ 
      url: fileUrl,
      message: 'File uploaded successfully' 
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}
