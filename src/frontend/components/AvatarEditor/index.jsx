import React from 'react';
import UsersRepository from 'lib/repositories/users-repository';
import 'components/AvatarEditor/styles.scss';

export default class AvatarEditor extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.repo = new UsersRepository(this.stateManager);
    this.state = {
      uploading: false
    };
  }

  removeAvatar() {
    this.repo.setCurrentUserAvatar(null);
  }

  handleAvatarUpload() {
    this.setState({ uploading: true });
    const file = this.fileInput.files[0];
    const avatarInfo = {
      blob: file,
    };
    this.repo.setCurrentUserAvatar(avatarInfo).then(() => {
      this.setState({ uploading: false });
    });
  }

  render() {
    const { uploading } = this.state;
    const avatarUrl = this.repo.currentUserAvatarUrl();
    const displayedAvatarUrl = avatarUrl || '/images/avatar-placeholder.jpg';
    return (
      <div className="avatar-editor">
        { uploading && (
          <span className="badge">~</span>
        )}

        { avatarUrl && (
          <button
            className="badge btn-remove"
            onClick={() => { this.removeAvatar(); }}
          >✕</button>
        )}
        <label
          className="file-input-trigger"
          htmlFor="avatar-file"
          style={{ backgroundImage: `url('${displayedAvatarUrl}')` }}
        >
          { !uploading && (
            <input
              className="file-input"
              type="file"
              id="avatar-file"
              ref={(e) => { this.fileInput = e; }}
              onChange={() => { this.handleAvatarUpload(); }}
            />
          )}
        </label>
      </div>
    );
  }
}
