export default class Base64FileUploader {
  uploadFileFromFileBlob(fileBlob) {
    return new Promise((resolve, _reject) => {
      const fileReader = new FileReader();
      fileReader.onload = e => resolve(e.target.result);
      fileReader.readAsDataURL(fileBlob);
    });
  }
}
