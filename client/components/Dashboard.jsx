import React from 'react';
import { Responsive, WidthProvider as widthProvider } from 'react-grid-layout';
const ResponsiveGridLayout = widthProvider(Responsive);
import { default as Logs, LogsDash } from './Logs';
import AddLog from './AddLog';
import DataSourcesList from './DataSourcesList';
import '../styles/Dashboard.scss';

export default class Dashboard extends React.Component {

  getDashHeaderRight = (ref) => () => console.log(this.refs);

  render() {
    const layouts = {
      lg: [
        { i: 's', x: 0, y: 0, w: 7, h: 1, maxH: 2 },
        { i: 'a', x: 0, y: 1, w: 7, h: 6, minW: 6, minH: 4 },
        { i: 'b', x: 7, y: 0, w: 3, h: 3, minW: 2, minH: 3, maxW: 4 },
        { i: 'c', x: 7, y: 3, w: 3, h: 4, maxW: 4 },
        { i: 'd', x: 0, y: 7, w: 5, h: 2, maxW: 5 },
        { i: 'e', x: 5, y: 7, w: 5, h: 3, maxW: 5 },
      ],
      md: [
        { i: 's', x: 0, y: 0, w: 7, h: 1, maxH: 2 },
        { i: 'a', x: 0, y: 1, w: 7, h: 6, minW: 6, minH: 4 },
        { i: 'b', x: 7, y: 0, w: 3, h: 3, minW: 2, minH: 3, maxW: 4 },
        { i: 'c', x: 7, y: 3, w: 3, h: 4, maxW: 4 },
        { i: 'd', x: 0, y: 7, w: 5, h: 2, maxW: 5 },
        { i: 'e', x: 5, y: 7, w: 5, h: 3, maxW: 5 },
      ],
    };
    return (
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        rowHeight={76}
        margin={[10, 10]}
        draggableCancel=".dash-item-body"
        draggableHandle=".dash-item-header"
      >
        <div key={'s'}>
          <DashItem dashTitle="Search and filter logs">
            <b>Coming soon!</b>
          </DashItem>
        </div>
        <div key={'a'}>
          <LogsDash />
        </div>
        <div key={'b'}><DashItem dashTitle="Add log" ><AddLog /></DashItem></div>
        <div key={'c'}>
          <DashItem dashTitle="Data sources">
            <DataSourcesList />
          </DashItem>
        </div>
        <div key={'d'}>
          <DashItem dashTitle="Feedback" >
            <p>
              Welcome to the public alpha of Anylog. This is very much a work
              in progress, though the core is usable and ready to log.
            </p>
            <p>
              Any questions, comments or feature requests you have are
              appreciated! Please email me at:
              <a href="mailto:admin@anylog.xyz">admin@anylog.xyz</a>.
            </p>
          </DashItem>
        </div>
        <div key={'e'}>
          <DashItem dashTitle="Data analysis">
            <h4>Potential data analysis tools:</h4>
            <ul>
              <li>Graph frequency of a single event.</li>
              <li>Find and graph correlations between two events.</li>
            </ul>
          </DashItem>
        </div>
      </ResponsiveGridLayout>
    );
  }
}

const DashItem = (props) => (
  <div className="dash-item">
    <div className="dash-item-header">
      <span className="dash-title">
        {props.dashTitle}
      </span>
      <span style={{ float: 'right' }}>
        {props.getDashHeaderRight && props.getDashHeaderRight()}
      </span>
    </div>
    <div className="dash-item-body">
      {props.children}
    </div>
  </div>
);
