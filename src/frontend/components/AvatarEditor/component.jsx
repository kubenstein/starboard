import React from 'react';
import PropTypes from 'prop-types';
import FunctionLink from 'components/FunctionLink';
import placeholderAvatar from 'assets/images/avatar-placeholder.jpg';
import 'components/AvatarEditor/styles.scss';

export default class AvatarEditor extends React.Component {
  static propTypes = {
    avatarUrl: PropTypes.string,
    onAvatarRemove: PropTypes.func.isRequired,
    onAvatarUpload: PropTypes.func.isRequired,
  }

  state = {
    uploading: false,
  };

  onAvatarUpload = () => {
    const { onAvatarUpload } = this.props;

    this.setState({ uploading: true });
    const file = this.fileInput.files[0];
    onAvatarUpload(file)
      .then(() => this.setState({ uploading: false }));
  }

  render() {
    const { uploading } = this.state;
    const { onAvatarRemove, avatarUrl } = this.props;
    const displayedAvatarUrl = avatarUrl || placeholderAvatar;

    return (
      <div className="avatar-editor">
        {uploading && <span className="badge">~</span>}

        {avatarUrl && (
          <FunctionLink
            component="button"
            className="badge btn-remove"
            onClick={onAvatarRemove}
          >
            ✕
          </FunctionLink>
        )}
        <label
          className="file-input-trigger"
          htmlFor="avatar-file"
          style={{ backgroundImage: `url('${displayedAvatarUrl}')` }}
        >
          {!uploading && (
            <input
              className="file-input"
              type="file"
              id="avatar-file"
              ref={(e) => { this.fileInput = e; }}
              onChange={this.onAvatarUpload}
            />
          )}
        </label>
      </div>
    );
  }
}
