import moment from 'moment';

function stringify(stringOrJSON) {
  if (typeof stringOrJSON === 'object') {
    return JSON.stringify(stringOrJSON);
  }
  return stringOrJSON.toString();
}

function getEventJsonKeys(log) {
  return Object.keys(log.event_json);
}

export default function exportJSONtoCSV(JSONData, filename, flattenJson = true) {
  // If JSONData is not an object then JSON.parse
  // will parse the JSON string in an Object
  const inputData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;

  let labels;
  const arrData = [];
  if (flattenJson) {
    labels = ['timestamp', 'event_name'];
    for (let i = 0; i < inputData.length; i++) {
      arrData.push(Object.assign({}, inputData[i]));
      getEventJsonKeys(inputData[i]).forEach((key) => {
        if (labels.indexOf(`_${key}`) === -1) { labels.push(`_${key}`); }
        arrData[i][`_${key}`] = inputData[i].event_json[key];
      });
      delete arrData[i].event_json;
    }
  } else {
    labels = ['timestamp', 'event_name', 'event_json'];
  }

  let CSV = '';

  // This will generate the Label/Header
  let row = '';

  for (let i = 0; i < labels.length; i++) {
    row += `"${labels[i]}",`;
  }

  // remove trailing comma and add line break
  CSV += `${row.slice(0, -1)} \r\n`;

  // 1st loop is to extract each row
  for (let i = 0; i < arrData.length; i++) {
    row = '';

    // 2nd loop will extract each column and convert it in string comma-seprated
    for (let j = 0; j < labels.length; j++) {
      if (labels[j] === 'timestamp') {
        row += `"${moment(arrData[i][labels[j]]).format('M/D/YY, h:mm a')}",`;
      } else if (arrData[i][labels[j]]) {
        row += `"${stringify(arrData[i][labels[j]])}",`;
      } else {
        row += '"",';
      }
    }

    CSV += `${row.slice(0, -1)} \r\n`;
  }

  // Initialize file format you want csv or xls
  const uri = `data:text/csv;charset=utf-8,${escape(CSV)}`;

  // this trick will generate a temp <a /> tag
  const link = document.createElement('a');
  link.href = uri;

  // set the visibility hidden so it will not effect on your web-layout
  link.style = 'visibility:hidden';
  link.download = `${filename}.csv`;

  // this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
