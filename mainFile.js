document.addEventListener("DOMContentLoaded", function () {
  // Define a class for the file system
  class SimpleFileSystem {
    constructor() {
      // Check if local storage is supported
      if (typeof Storage === "undefined") {
        console.log("Local storage is not supported.");
        return;
      }

      // Initialize the file system
      if (!localStorage.getItem("root")) {
        localStorage.setItem("root", JSON.stringify({}));
      }
    }

    // Create a file
    createFile(path, content) {
      const root = JSON.parse(localStorage.getItem("root"));
      let currentDir = root;

      // Split the path into directories
      const dirs = path.split("/");
      const fileName = dirs.pop();

      // Traverse through directories
      for (const dir of dirs) {
        if (!currentDir[dir]) {
          currentDir[dir] = {};
        }
        currentDir = currentDir[dir];
      }

      // Add the file to the current directory
      currentDir[fileName] = content;

      // Update the root in local storage
      localStorage.setItem("root", JSON.stringify(root));
    }
  }

  // Initialize the file system
  const fs = new SimpleFileSystem();

  // Select form elements
  const fileForm = document.getElementById("fileForm");
  const fileInput = document.getElementById("fileInput");
  const listFilesBtn = document.getElementById("listFilesBtn");
  const deleteAllFilesBtn = document.getElementById("deleteAllFilesBtn");
  const outputDiv = document.getElementById("output");

  // Event listener for form submission
  fileForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const files = Array.from(fileInput.files);
    files.forEach((file) => {
      const filePath = file.name;
      const fileContent = file;
      fs.createFile(filePath, fileContent);
    });
    outputDiv.textContent = `Uploaded ${files.length} file(s).`;
  });

  // Event listener for listing files
  listFilesBtn.addEventListener("click", function () {
    const root = JSON.parse(localStorage.getItem("root"));
    let fileList = '';
    let count = 1;
    for (const fileName in root) {
      fileList += `${count}. ${fileName} - ${root[fileName].size} bytes\n`;
      count++;
    }
    outputDiv.textContent = fileList;
  });

  // Event listener for deleting all files
  deleteAllFilesBtn.addEventListener("click", function () {
    localStorage.removeItem("root");
    outputDiv.textContent = "All files deleted.";
  });
});
