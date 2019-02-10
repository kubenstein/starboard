import React from 'react';
import PropTypes from 'prop-types';
import EditableInput from 'components/EditableInput';
import ActivityItem from 'components/ActivityItem';
import AvatarEditor from 'components/AvatarEditor';
import FunctionLink from 'components/FunctionLink';
import 'components/SideMenu/styles.scss';

const labelCssClasses = (color) => {
  const labelId = color.replace('#', '');
  return `label-input-${labelId}`;
};

const colorPickerCssClasses = (color) => {
  const pickerId = color.replace('#', '');
  return `color theme-color-picker-input-${pickerId}`;
};

export default class SideMenu extends React.Component {
  static propTypes = {
    availableColors: PropTypes.arrayOf(PropTypes.string).isRequired,
    userId: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    activities: PropTypes.arrayOf(PropTypes.object).isRequired,
    textForLabel: PropTypes.func.isRequired,
    onThemeColorChange: PropTypes.func.isRequired,
    onLabelTextChange: PropTypes.func.isRequired,
    onNicknameChange: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
  }

  render() {
    const {
      availableColors,
      userId,
      nickname,
      activities,
      textForLabel,
      onThemeColorChange,
      onLabelTextChange,
      onNicknameChange,
      onLogout,
    } = this.props;
    return (
      <div className="side-menu">
        <div className="section user-section">
          <h3 className="section-title">User:</h3>
          <input
            className="btn-link btn-small btn-logout"
            type="button"
            value="log out"
            onClick={onLogout}
          />
          <br className="clearfix" />
          <AvatarEditor className="avatar-editor" />
          <EditableInput
            className="input-nickname"
            value={nickname}
            placeholder="Set Nickname..."
            onChange={onNicknameChange}
          />
          <small className="user-id">{userId}</small>
        </div>

        <div className="section">
          <h3 className="section-title">Board Color:</h3>
          <ul className="color-picker">
            { availableColors.map(color => (
              <FunctionLink
                component="li"
                key={color}
                style={{ backgroundColor: color }}
                className={colorPickerCssClasses(color)}
                onClick={() => onThemeColorChange(color)}
              />
            ))}
          </ul>
        </div>

        <div className="section">
          <h3 className="section-title">Labels:</h3>
          <div className="label-editor">
            { availableColors.map(color => (
              <div key={color} className="label" style={{ backgroundColor: color }}>
                <EditableInput
                  className={labelCssClasses(color)}
                  value={textForLabel(color)}
                  onChange={value => onLabelTextChange(color, value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="section activities-section">
          <h3 className="section-title">Latest Activities:</h3>
          <div className="activities">
            { activities.map(activity => (
              <ActivityItem
                key={activity.id}
                activity={activity}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
