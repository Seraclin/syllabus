import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';

export default async function downloadFile(request) {
    const { fileName } = request.query;

    // Define the root directory where files are stored
    const rootDir = process.cwd();

    // Construct the full file path
    const filePath = join(rootDir, 'tmp', fileName);

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
