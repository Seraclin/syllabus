// API route for POST from form data
import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from "next/server";
import { extname, join } from 'path';

export async function POST(request) {
    // This basically does the same as the previous server implementation but instead via HTTP
    const data = await request.formData()
    const file = data.get('file')

    // Error checking
    if(!file) {
        // No file found error
        console.error("No file found.")
        return NextResponse.json({success: false})
    }

    // Check file extension
    const fileExtension = extname(file.name).toLowerCase();
    if (fileExtension !== '.pdf') {
        console.error("Wrong file type. Please upload a PDF.")
        return NextResponse.json({ success: false, error: 'File type must be PDF' });
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // With the file in the buffer, you can do whatever
    // For now, I'll just write it to the loacal file system
    // TODO: warning it's bad practice to put user info in the public folder, as anyone can access it
    // if they have the file path. Might try instead- https://uploadthing.com/
    const rootDir = process.cwd();
    const path = join(rootDir, 'public', 'tmp', file.name);
    await writeFile(path, buffer)
    console.log(`open ${path} to see the uploaded file`)

    return NextResponse.json({success: true})
}