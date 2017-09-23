import React from 'react';
import UsersRepository from 'lib/repositories/users-repository';
import 'components/AvatarEditor/styles.scss';

export default class AvatarEditor extends React.Component {
  constructor(props) {
    super(props);
    this.stateManager = this.props.stateManager;
    this.repo = new UsersRepository(this.stateManager);
  }

  removeAvatar() {
    this.repo.setCurrentUserAvatar(null);
  }

  handleAvatarUpload() {
    const file = this.fileInput.files[0];
    const avatarInfo = {
      blob: file,
    };
    this.repo.setCurrentUserAvatar(avatarInfo);
  }

  render() {
    const avatarUrl = this.repo.currentUserAvatarUrl();
    const displayedAvatarUrl = avatarUrl || '/images/avatar-placeholder.jpg';
    return (
      <div className="avatar-editor">
        { avatarUrl && (
          <button
            className="btn-remove"
            onClick={() => { this.removeAvatar(); }}
          >✕</button>
        )}
        <label
          className="file-input-trigger"
          htmlFor="avatar-file"
          style={{ backgroundImage: `url('${displayedAvatarUrl}')` }}
        >
          <input
            className="file-input"
            type="file"
            id="avatar-file"
            ref={(e) => { this.fileInput = e; }}
            onChange={() => { this.handleAvatarUpload(); }}
          />
        </label>
      </div>
    );
  }
}
