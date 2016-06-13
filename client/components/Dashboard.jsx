import React from 'react';
import { Responsive, WidthProvider as widthProvider } from 'react-grid-layout';
const ResponsiveGridLayout = widthProvider(Responsive);
import Logs from './Logs';
import AddLog from './AddLog';
import '../styles/Dashboard.scss';

export default class Dashboard extends React.Component {

  getDashHeaderRight = (ref) => () => console.log(this.refs);

  render() {
    const layouts = {
      lg: [
        { i: 'a', x: 0, y: 0, w: 7, h: 8, minW: 6, minH: 4 },
        { i: 'b', x: 7, y: 0, w: 3, h: 4, minW: 2, minH: 4, maxW: 4 },
        { i: 'c', x: 4, y: 0, w: 1, h: 2 },
      ],
      md: [
        { i: 'a', x: 0, y: 0, w: 7, h: 6, minW: 4, minH: 4 },
        { i: 'b', x: 7, y: 0, w: 3, h: 4, minW: 2, minH: 4, maxW: 4 },
        { i: 'c', x: 4, y: 0, w: 1, h: 2 },
      ],
    };
    return (
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        rowHeight={60}
        margin={[5, 5]}
      >
        <div key={'a'}>
          <DashItem dashTitle="Logs" getDashHeaderRight={this.getDashHeaderRight('logs')}>
            <Logs ref={'logs'} />
          </DashItem>
        </div>
        <div key={'b'}><DashItem dashTitle="Add log" ><AddLog /></DashItem></div>
        <div key={'c'}><DashItem dashTitle="Input sources">c</DashItem></div>
      </ResponsiveGridLayout>
    );
  }
}

const DashItem = (props) => {

  let dashHeaderRight = null;
  if (props.getDashHeaderRight) {
    dashHeaderRight = props.getDashHeaderRight();
  }

  return (
    <div className="dash-item">
      <div className="dash-item-header">
        {props.dashTitle}
        <span style={{ float: 'right' }}>
          {dashHeaderRight}
        </span>
      </div>
      <div className="dash-item-body">
        {props.children}
      </div>
    </div>
  );
};
