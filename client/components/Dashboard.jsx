import React from 'react';
import { Responsive, WidthProvider as widthProvider } from 'react-grid-layout';
const ResponsiveGridLayout = widthProvider(Responsive);
import { LogsDash } from './Logs';
import AddLog from './AddLog';
import DataSourcesList from './DataSourcesList';
import '../styles/Dashboard.scss';
import BucketVis from './widgets/BucketVis';

export default class Dashboard extends React.Component {

  getDashHeaderRight = () => () => console.log(this.refs);

  render() {
    const layouts = {
      lg: [
        { i: 'a', x: 2, y: 0, w: 6, h: 7, minW: 4, minH: 4 },
        { i: 'b', x: 0, y: 0, w: 2, h: 3, minW: 2, minH: 3, maxW: 4 },
        { i: 'c', x: 0, y: 3, w: 2, h: 4, maxW: 4 },
        { i: 'd', x: 0, y: 7, w: 5, h: 2, maxW: 5 },
        { i: 'vis', x: 8, y: 0, w: 4, h: 7, minH: 4, minW: 4 },
      ],
      md: [
        { i: 'a', x: 0, y: 0, w: 7, h: 6, minW: 6, minH: 4 },
        { i: 'b', x: 7, y: 0, w: 3, h: 3, minW: 2, minH: 3, maxW: 4 },
        { i: 'c', x: 7, y: 3, w: 3, h: 3, maxW: 4 },
        { i: 'd', x: 0, y: 6, w: 5, h: 2, maxW: 5 },
        { i: 'vis', x: 5, y: 6, w: 5, h: 5, minH: 4, minW: 4 },
      ],
      sm: [
        { i: 'a', x: 0, y: 3, w: 7, h: 7, minW: 6, minH: 4 },
        { i: 'b', x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 3, maxW: 4 },
        { i: 'c', x: 3, y: 0, w: 3, h: 3, maxW: 4 },
        { i: 'd', x: 0, y: 7, w: 5, h: 2, maxW: 5 },
      ],
      xs: [
        { i: 'a', x: 0, y: 3, w: 4, h: 7, minW: 6, minH: 4 },
        { i: 'b', x: 0, y: 0, w: 4, h: 3, minW: 2, minH: 3, maxW: 4 },
        { i: 'c', x: 0, y: 10, w: 3, h: 3, maxW: 4 },
        { i: 'd', x: 0, y: 7, w: 5, h: 2, maxW: 5 },
      ],
    };
    return (
      <div className="dashboard">
        <ResponsiveGridLayout
          className="layout"
          breakpoints={{ lg: 1400, md: 996, sm: 768, xs: 480, xxs: 0 }}
          layouts={layouts}
          rowHeight={76}
          margin={[10, 10]}
          draggableCancel=".dash-item-body"
          draggableHandle=".dash-item-header"
        >
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
          <div key={'vis'}>
            <DashItem dashTitle="Data visualization (under construction)">
              <BucketVis />
            </DashItem>
          </div>
        </ResponsiveGridLayout>
      </div>
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
