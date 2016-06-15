/*
 * PopoverHandle wraps a "handle," which can show or hide its children.
 */

import React from 'react';
import '../../styles/popoverHandle.scss';

export default (Component) => class extends React.Component {
  toggleOpen = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  state = {
    isOpen: false,
  };

  close = () => {
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  };

  componentDidMount() {
   // Hide dropdown block on click outside the block
    window.addEventListener('click', this.close, false);
  }

  componentWillUnmount() {
   // Remove click event listener on component unmount
    window.removeEventListener('click', this.close, false);
  }

  render() {
    let classes;
    if (this.state.isOpen) {
      classes = 'popover visible';
    } else {
      classes = 'popover';
    }

    return (
      <div onClick={(e) => e.stopPropagation()}>
        <div onClick={this.toggleOpen}>
          <Component
            {...this.props}
            {...this.state}
            toggleOpen={this.toggleOpen}
            close={this.close}
          />
        </div>
        <div className={classes}>
          {this.props.children}
        </div>
      </div>
    );
  }
};
