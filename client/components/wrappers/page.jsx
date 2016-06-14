import React from 'react';

export default (Component, defaultTitle) => class extends React.Component {

  state = {};

  onMounted(node) {
    if (!this.state.rightHeader) {
      this.setState({ rightHeader: node.rightPageHeader() });
    }
  }

  render() {
    return (
      <div>
        <h1>
          {this.props.pageTitle || defaultTitle}
          <span style={{ float: 'right' }}>
            {this.state.rightHeader}
          </span>
        </h1>
        <hr />
        <Component
          ref={(node) => this.onMounted(node)}
          {...this.props}
        />
      </div>
    );
  }
};
