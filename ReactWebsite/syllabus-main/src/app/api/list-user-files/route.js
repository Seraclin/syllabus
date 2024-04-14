// API for displaying a list of user files to the front-end based on their cookie's userId
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { writeFile, mkdir, access } from 'fs/promises'


export async function GET(request) {
  // const userId = cookies(request).userId; // Get userId from the cookie
  const cookieStore = cookies();
  const userId = cookieStore.get('userId').value;
  // console.log("GET file list has been called by", userId) // TODO debug
  if (!userId) {
    return NextResponse.json({ error: 'User ID not found in cookies', status: 404 });
  }

  try {
    // Get user-specific files based on userId
    const userFilesPath = path.join(process.cwd(), 'src', 'app', 'api', 'upload', 'user_files', userId);
    const userFiles = getUserFiles(userFilesPath);

    // Send the list of files as JSON response {{files: ...}}
    return NextResponse.json({ status: 200, files: userFiles})
  } catch (error) {
    console.error('Error fetching user files:', error);
    return NextResponse.json({ status: 500, error: 'Internal server error' })
  }
}

// Function to get files in a directory
function getUserFiles(dirPath) {
  try {
    // Check if the directory exists
    if (fs.existsSync(dirPath)) {
      // Read files in the directory
      const files = fs.readdirSync(dirPath);
      return files;
    } else {
      console.error(`Directory not found: ${dirPath}`);
      return [];
    }
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}
