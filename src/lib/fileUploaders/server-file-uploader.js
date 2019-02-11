import axios from 'axios';

export default class ServerFileUploader {
  uploadFileFromFileBlob(fileBlob) {
    const data = new FormData();
    data.append('attachment', fileBlob);
    data.append('token', this.token);
    return axios.post('/attachments/', data)
      .then(response => response.data.attachmentUrl);
  }
}
