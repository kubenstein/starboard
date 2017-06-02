export default function frontendFilesHandler(fileBlob) {
  return new Promise((resolve, _reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => { resolve(reader.result); }, false);
    reader.readAsDataURL(fileBlob);
  });
}
