import React from 'react';

export default (Component, defaultTitle) => class extends React.Component {

  state = {};

  onMounted(node) {
    if (!this.state.rightHeader) {
      this.setState({ rightHeader: node.rightDashHeader() });
    }
  }

  render() {
    return (
      <div className="dash-item">
        <div className="dash-item-header">
          <span className="dash-title">
            {this.props.dashTitle || defaultTitle}
          </span>
          <span style={{ float: 'right' }}>
            {this.state.rightHeader}
          </span>
        </div>
        <div className="dash-item-body">
          <Component
            ref={(node) => this.onMounted(node)}
            {...this.props}
          />
        </div>
      </div>
    );
  }
};
