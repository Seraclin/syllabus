import { extname, join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';


export async function GET(request)  {
    
    const userId = cookies().get('userId').value;

    // Define the root directory where files are stored
    const rootDir = process.cwd();

    try {
        const { spawnSync } = require('child_process');
        // Execute a command synchronously
        const result = spawnSync('python',["syllabus.py", userId]);
        // result.stderr.pipe(process.stdout)
        // Check for errors
        if (result.error) {
          console.error('Error:', result.error);
          return NextResponse.json({ error: 'Internal server error. GPT API' }, { status: 500 });
        }
        return NextResponse.json({status: 200});
    } catch (error) {
        // console.error('Error downloading file:', error);
        return NextResponse.json({ error: 'Internal server error. GPT API' }, { status: 500 });
    }

}
