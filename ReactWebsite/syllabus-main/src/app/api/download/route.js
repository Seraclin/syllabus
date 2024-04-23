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
    const filePath = join(rootDir, 'src', 'app', 'api', 'upload', 'user_files', userId, 'eSyllabus.ics'); // this should be the correct path

    try {
        // Read the file contents
        const fileContent = await readFile(filePath, 'utf-8');
        if(!fileContent){
            return NextResponse.json({ error: 'File not found error. Download API' }, { status: 404 });
        }
        const fileName = 'eSyllabus.ics';

        // Prepare the response with the file content
       return NextResponse.json(fileContent, {
            status: 200,
            headers: {
                'Content-Disposition': `attachment; filename="eSyllabus.ics"`, // Example file name
                // Add any additional headers as needed like 'Content-Type', 'text/calendar' to specify .ics type
            },
        });
    } catch (error) {
        console.error('Error downloading file:', error);
        return NextResponse.json({ error: 'Internal server error. Download API' }, { status: 500 });
    }
}
