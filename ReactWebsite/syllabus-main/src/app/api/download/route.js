import { extname, join } from 'path';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { cookies } from 'next/headers';
// Download file based on userId
// TODO change paths accordingly

export async function GET(request)  {
    const fileName = 'eSyllabus.ics';
    const userId = cookies().get('userId').value;

    // Define the root directory where files are stored
    const rootDir = process.cwd();

    // Construct the full file path
    const filePath = join(rootDir, 'src', 'app', 'api', 'upload', 'user_files', userId, fileName); // this should be the correct path

    try {
        // Read the file contents
        const fileContent = await readFile(filePath, 'utf-8');
        if(!fileContent){
            return NextResponse.json({ error: 'File not found error. Download API' }, { status: 404 });
        }

        // Convert fileContent to a binary Blob of .ics type (important!)
        const blob = new Blob([fileContent], { type: 'text/calendar' });

        // Send the Blob as the response
        const responseHeaders = {
            'Content-Disposition': `attachment; filename="eSyllabus.ics"`,
            'Content-Type': 'text/calendar', // ensure .ics type
        };

        // I just use a regular response here, to return the file in Blob
        return new Response(blob, {
            status: 200,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('Error downloading file:', error);
        return NextResponse.json({ error: 'Internal server error. Download API' }, { status: 500 });
    }
}
