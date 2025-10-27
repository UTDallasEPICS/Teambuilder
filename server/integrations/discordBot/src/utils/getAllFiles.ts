//A re-useable function sometimes called by other functions that will
//return the current filestructure of a given file tree.

import * as fs from 'fs';
import * as path from 'path';

const getAllFiles = (directory: string, foldersOnly: boolean = false): string[] => {
  // Array to store file names
  let fileNames: string[] = [];

  // Import any files/folders inside a specific directory
  const files: fs.Dirent[] = fs.readdirSync(directory, { withFileTypes: true });

  // Loop for checking if something is a file or a folder
  for (const file of files) {
    const filePath = path.join(directory, file.name);

    if (foldersOnly) {
      // If a file is a folder:
      if (file.isDirectory()) {
        fileNames.push(filePath);
      }
    } else {
      // If a file is a file:
      if (file.isFile()) {
        fileNames.push(filePath);
      }
    }
  }

  return fileNames;
};

export default getAllFiles;
