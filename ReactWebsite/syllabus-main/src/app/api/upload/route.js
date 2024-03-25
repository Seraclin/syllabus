// API route for POST from form data
import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from "next/server";
import { extname, join } from 'path';

export async function POST(request) {
    // This basically does the same as the previous server implementation but instead via HTTP
    const data = await request.formData()
    const files = data.getAll('file') // get all files from input

    // Error checking
    if(!files || files.length == 0) {
        // No file found error
        console.error("No file found.")
        return NextResponse.json({success: false, error:'No files found.'})
    }

    // Check file extension, old: single file
    // const fileExtension = extname(file.name).toLowerCase();
    // if (fileExtension !== '.pdf') {
    //     console.error("Wrong file type. Please upload a PDF.")
    //     return NextResponse.json({ success: false, error: 'File type must be PDF' });
    // }
    const successResponses = [];
    const errorResponses = [];
    for(const file of files){
        // Check file extension just to be sure
        const fileExtension = extname(file.name).toLowerCase();
        if (fileExtension !== '.pdf') {
            console.error("Invalid file type. Please upload a PDF.")
            errorResponses.push({ success: false, error: 'File type must be PDF', fileName: file.name });
            continue;
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // With the file in the buffer, you can do whatever
        // For now, I'll just write it to the loacal file system
        // TODO: warning it's bad practice to put user info in the public folder, as anyone can access it
        // Try to find a secure server to store files rather than locally
        const rootDir = process.cwd();
        const path = join(rootDir, 'public', 'tmp', file.name); // TODO change to more secure location
        await writeFile(path, buffer)
        console.log(`open ${path} to see the uploaded file`)
        successResponses.push({ success: true, fileName: file.name });
    }
    // Keep track of all successful and unsuccessful responses for debugging purposes
    const response = {
        successResponses,
        errorResponses
    };
    return NextResponse.json(response)
}