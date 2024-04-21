// Deletes the specified file from the user's folder
// pages/api/delete.js

import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function DELETE(request) {
    const { fileName } = await request.json(); // get the fileName from the request body
    const userId = cookies().get('userId').value; // Assuming 'userId' is stored in cookies

    if (!userId) {
        return NextResponse.json({ error: 'User ID not found in cookies', status: 400 });
    }

    const userFolderPath = path.join(process.cwd(), 'src', 'app', 'api', 'upload', 'user_files', userId);
    const filePathToDelete = path.join(userFolderPath, fileName);
    try {
        console.log("DELETE PATH:", filePathToDelete)
        // Check if the file exists before deleting
        if (fs.existsSync(filePathToDelete)) {
        fs.unlinkSync(filePathToDelete); // Delete the file synchronously
        console.log("Successfully deleted file:", fileName, "; from user", userId);
        return NextResponse.json({ message: 'File deleted successfully', status: 200 });
        } else {
            console.error("Error: file not found", fileName)
            return NextResponse.json({ error: 'File not found', status: 404 });
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        return NextResponse.json({ error: 'Internal server error',  status: 500 });
    }
}