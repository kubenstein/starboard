export default function backendWithFilesStorageFilesHandler(fileName) {
  //
  // do nothing. Files are already in public folder.
  return Promise.resolve(fileName);
}
