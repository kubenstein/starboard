import connect from 'lib/dependencyContext/connect';

import Component from './component';

const mapStateToProps = (deps, { card }) => ({
  colors: deps.get('settingsRepository').availableColors(),
  textForLabel: label => deps.get('settingsRepository').textForLabel(label),
  onChange: (label) => {
    const labels = card.labels || [];
    const shouldBeSet = (labels.indexOf(label) === -1);
    deps.get('cardsRepository').updateLabel(card.id, label, shouldBeSet);
  },
});

export default connect(mapStateToProps)(Component);
