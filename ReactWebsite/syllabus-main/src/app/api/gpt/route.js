import { extname, join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';


export async function GET(request)  {
    
    const userId = cookies().get('userId').value;

    // Define the root directory where files are stored
    const rootDir = process.cwd();

    try {
        
        const spawn = require("child_process").spawn;
        const pythonProcess = spawn('python',["syllabus.py", userId], {shell:true});
        pythonProcess.stderr.pipe(process.stdout);
        console.log("gpt generation has been called");
        // Prepare the response with the file content
       return NextResponse.json({status: 200});
    } catch (error) {
        // console.error('Error downloading file:', error);
        return NextResponse.json({ error: 'Internal server error. GPT API' }, { status: 500 });
    }

}
