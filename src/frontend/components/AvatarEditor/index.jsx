import React from 'react';
import PropTypes from 'prop-types';
import FunctionLink from 'components/FunctionLink';
import placeholderAvatar from 'assets/images/avatar-placeholder.jpg';
import 'components/AvatarEditor/styles.scss';

export default class AvatarEditor extends React.Component {
  static propTypes = {
    deps: PropTypes.object.isRequired,
  }

  state = {
    uploading: false,
  };

  constructor(props) {
    super(props);
    this.repo = this.props.deps.get('usersRepository');
  }

  removeAvatar = () => {
    this.repo.setCurrentUserAvatar(null);
  }

  handleAvatarUpload = () => {
    this.setState({ uploading: true });
    const file = this.fileInput.files[0];
    const avatar = { blob: file };
    this.repo.setCurrentUserAvatar(avatar)
      .then(() => this.setState({ uploading: false }));
  }

  render() {
    const { uploading } = this.state;
    const avatarUrl = this.repo.currentUserAvatarUrl();
    const displayedAvatarUrl = avatarUrl || placeholderAvatar;
    return (
      <div className="avatar-editor">
        { uploading && (
          <span className="badge">~</span>
        )}

        { avatarUrl && (
          <FunctionLink
            component="button"
            className="badge btn-remove"
            onClick={this.removeAvatar}
          >
            ✕
          </FunctionLink>
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
              onChange={this.handleAvatarUpload}
            />
          )}
        </label>
      </div>
    );
  }
}
