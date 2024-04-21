import { extname, join } from 'path';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { cookies } from 'next/headers';
// Download file based on userId
// TODO change paths accordingly

export async function GET(request)  {
    const userId = cookies().get('userId').value;

    // Define the root directory where files are stored
    const rootDir = process.cwd();

    // Construct the full file path
    const filePath = join(rootDir, 'tmp', fileName);  // TODO change path accordingly to where your output file is located after generating

    try {
        // Read the file contents
        const fileContent = await readFile(filePath, 'utf-8');

        // Prepare the response with the file content
        return NextResponse.ok(fileContent, {
            headers: {
                'Content-Disposition': `attachment; filename="${fileName}"`,
            },
        });
    } catch (error) {
        console.error('Error downloading file:', error);
        return NextResponse.error('File not found', { status: 404 });
    }
}
