import React from 'react';
import { connect } from 'react-redux';
import { Chart } from 'chart.js';
import moment from 'moment';

class BucketVisGraph extends React.Component {
  componentDidMount() {
    const chartCanvas = this.refs.chart;

    const myChart = new Chart(chartCanvas, {
      type: 'bar',
      data: this.props.data,
      options: this.props.options,
    });

    this.setState({ chart: myChart });
  }

  componentDidUpdate() {
    const chart = this.state.chart;
    const data = this.props.data;

    data.datasets.forEach((dataset, i) => chart.data.datasets[i].data = dataset.data);

    chart.data.labels = data.labels;
    chart.update();
  }

  render() {
    return (
      <canvas ref={'chart'} height={'100%'} width={'100%'}></canvas>
    );
  }
}

const BucketVis = (props) => {

  const buckets = [];
  if (props.labelsType === 'Last7Days') {
    for (let i = -6; i < 1; i++) {
      buckets.push(moment().add(i, 'days').format('ddd D'));
    }
  }

  const data = {};
  for (let i = 0; i < 7; i++) {
    data[i] = 0;
  }

  props.logs.forEach((log) => {
    const i = moment(log.timestamp).diff(moment(), 'days') + 6;
    if ((0 <= i) && (i <= 6)) {
      data[i] += 1;
    }
  });

  return (
    <BucketVisGraph
      data={{
        labels: buckets,
        datasets: [
          {
            label: 'Events logged in last 7 days',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: Object.values(data),
          },
        ],
      }}
      options={{
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              suggestedMax: 5,
              beginAtZero: true,   // minimum value will be 0.
              stepSize: 1,
            },
          }],
        } }}
    />
  );
};

BucketVis.propTypes = {
  labelsType: React.PropTypes.string,
};

BucketVis.defaultProps = {
  labelsType: 'Last7Days',
};

const mapStateToProps = (state) => ({
  logs: state.logs.logs,
});

export default connect(mapStateToProps)(BucketVis);
