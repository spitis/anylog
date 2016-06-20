import React from 'react';
import AutoAffix from 'react-overlays/lib/AutoAffix';
import Waypoint from 'react-waypoint';
import '../../styles/Guide.scss';

import { Nav, NavItem, Row, Col } from 'react-bootstrap';
import SubNav from './SubNav';

import Overview from './sections/Overview';
import DataSources from './sections/DataSources';
import Email from './sections/Email';
import Sms from './sections/Sms';
import ApiKey from './sections/ApiKey';
import ComingSoon from './sections/ComingSoon';
import DesigningYourExperience from './sections/DesigningYourExperience';
import DataAnalysis from './sections/DataAnalysis';
import ExportingData from './sections/ExportingData';
import Faq from './sections/Faq';

// order matters in ES6 (see how it is used in componentDidMount)
/* eslint-disable indent */
const sections = {
  overview: '#overview',
  dataSources: '#data-sources',
    email: '#email',
    sms: '#sms',
    apiKey: '#api-key',
    comingSoon: '#coming-soon',
  designingYourExperience: '#designing-your-experience',
  dataAnalysis: '#data-analysis',
  exportingData: '#exporting-data',
  faq: '#faq',
};
/* eslint-enable indent */

/* eslint-disable react/prop-types */
let ScrollSpy = ({ href, onBefore, onAfter }) => (
  <Waypoint
    onEnter={(o) => { o.previousPosition === 'above' && onBefore(href); }}
    onLeave={(o) => { o.currentPosition === 'above' && onAfter(href); }}
    threshold={-0.02}
  />
);
/* eslint-enable react/prop-types */

export default class Guide extends React.Component {
  state = { activeNavItemHref: null };

  getMain = () => (this.refs.main);

  handleNavItemSelect = (key, e) => { window.location = e.target.href; }

  componentDidMount = () => {
    this.afterSections = {};
    const arr = [];
    Object.keys(sections).forEach(
      key => {
        this.afterSections[sections[key]] = false;
        arr.push(sections[key]);
      }
    );

    const { hash } = window.location;
    if (arr.includes(hash)) {
      for (const href of Object.keys(this.afterSections)) {
        this.afterSections[href] = true;

        if (href === hash) {
          this.setActiveNavItem();
          break;
        }
      }
    }
  }

  setActiveNavItem = () => {
    let activeNavItemHref = null;

    for (const href of Object.keys(this.afterSections)) {
      if (!this.afterSections[href]) {
        break;
      }
      activeNavItemHref = href;
    }

    this.setState({ activeNavItemHref });
  }

  renderScrollSpy = (href) => (
    <ScrollSpy
      href={href}
      onBefore={this.onBefore}
      onAfter={this.onAfter}
    />
  )

  onBefore = (href) => {
    this.afterSections[href] = false;
    this.updateActiveHref();
  }

  onAfter = (href) => {
    this.afterSections[href] = true;
    this.updateActiveHref();
  }

  updateActiveHref = () => {
    if (this.updateActiveHrefHandle != null) {
      return;
    }

    this.updateActiveHrefHandle = setTimeout(() => {
      this.updateActiveHrefHandle = null;
      this.setActiveNavItem();
    });
  }

  render = () => (
    <div className="container">
      <Row>
        <Col md={12}>
          <h1>The Guide</h1>
        </Col>
      </Row>
      <Row>
        <Col md={9}>
          <div ref="main" className="guide-container">
            {this.renderScrollSpy(sections.overview)}
            <Overview />
            {this.renderScrollSpy(sections.dataSources)}
            <DataSources />
            {this.renderScrollSpy(sections.email)}
            <Email />
            {this.renderScrollSpy(sections.sms)}
            <Sms />
            {this.renderScrollSpy(sections.apiKey)}
            <ApiKey />
            {this.renderScrollSpy(sections.comingSoon)}
            <ComingSoon />
            {this.renderScrollSpy(sections.designingYourExperience)}
            <DesigningYourExperience />
            {this.renderScrollSpy(sections.dataAnalysis)}
            <DataAnalysis />
            {this.renderScrollSpy(sections.exportingData)}
            <ExportingData />
            {this.renderScrollSpy(sections.faq)}
            <Faq />
          </div>
        </Col>
        <Col md={3}>
          <AutoAffix
            viewportOffsetTop={20}
            container={this.getMain}
          >
            <div className="guide-sidebar" role="complementary">
              <Nav
                className="guide-sidenav"
                activeHref={this.state.activeNavItemHref}
                onSelect={this.handleNavItemSelect}
              >
                <SubNav href={sections.overview} text="Introducing Anylog" />
                <SubNav href={sections.dataSources} text="Data sources">
                  <NavItem href={sections.email}>Email</NavItem>
                  <NavItem href={sections.sms}>SMS</NavItem>
                  <NavItem href={sections.apiKey}>Autosync with IFTTT</NavItem>
                  <NavItem href={sections.comingSoon}>Coming soon</NavItem>
                </SubNav>
                <SubNav href={sections.designingYourExperience} text="Designing your experience" />
                <SubNav href={sections.dataAnalysis} text="Data analysis" />
                <SubNav href={sections.exportingData} text="Exporting data" />
                <SubNav href={sections.faq} text="FAQ" />
              </Nav>
              <a className="back-to-top" href="#top">
                Back to top
              </a>
            </div>
          </AutoAffix>
        </Col>
      </Row>
    </div>
  )

}
