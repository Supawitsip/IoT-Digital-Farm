var label;
var humi_data;
var tem_data;
var myChart;
var compareChart;

var color = ["#615af0", "#4be47", "#2a3434", "#4a543f", "#79bca0"];
var day_compareGraph = []; 

var date_label;
var day_all_data;

var date_data1_D_tranfer;
var date_data7_D_tranfer;
var date_data30_D_tranfer;
var date_data_all_D_tranfer;

var temp_data1_D;
var date_data1_D;
var humi_data1_D;

var temp_data7_D;
var date_data7_D;
var humi_data7_D;

var temp_data30_D;
var date_data30_D;
var humi_data30_D;

var temp_data_all_D;
var date_data_all_D;
var humi_data_all_D;

var date_carlendar_D;
var humi_carlendar_D;
var temp_carlendar_D;

var day_in_week;
var day1440;

var maxTicksLimitX = 24;
var maxTicksLimitY = 12;
var font_x_size = 16;
var font_y_size = 16;
var test;

var firstDateTime;
var lastDateTime;

var test_all = [];
var deviObj = {};
console.log('name: ' + device);
if (document.documentElement.clientWidth < 900) {
  //myChart.options.scales.yAxes[0].ticks.maxTicksLimit = 6;
  //myChart.options.scales.yAxes[1].ticks.maxTicksLimit = 6;
  //console.log("yees");
  maxTicksLimitX = 12;
  maxTicksLimitY = 5;
  font_x_size = 10;
  font_y_size = 10;
}

function firstLoad() {
  dbRef.child(`devices_sensor/${device}`).get().then((snapshot) => {
    if (snapshot.exists()) {
      let deObj = snapshot.val();
      //console.log(Object.values(deObj));
      deviObj = Object.values(deObj);
      //console.log(typeof deviObj);
      //test_all.push(deviObj);

      secondLoad();
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}

function secondLoad() {
  //console.log(deviObj);
  temp_data1_D = [];
  date_data1_D = [];
  humi_data1_D = [];
  temp_data7_D = [];
  date_data7_D = [];
  humi_data7_D = [];
  temp_data30_D = [];
  date_data30_D = [];
  humi_data30_D = [];
  date_data1_D_tranfer = [];
  date_data7_D_tranfer = [];
  date_data30_D_tranfer = [];
  date_data_all_D_tranfer = [];
  temp_data_all_D = [];
  date_data_all_D = [];
  humi_data_all_D = [];
  let i = 0;
  console.log('name: ' + device);
  n_sampling = Object.keys(deviObj).length;
  let day_samling = n_sampling - 1440;
  let week_sampling = n_sampling - 10080;
  let month_sampling = n_sampling - 43200;
  for (d in deviObj) {
    //console.log(test_all);
    //all_samp = deviObj[d].;
    let timestamp = deviObj[d].timestamp;
    //let timestamp = deviObj[device][all_samp].timestamp/1000;   
    let date = new Date(timestamp);
    let currentDateTimeDevice = date.getDate().toString().padStart(2, "0") +
      "/" + ((date.getMonth() + 1).toString().padStart(2, "0")) +
      "/" + date.getFullYear() +
      " " + date.getHours().toString().padStart(2, "0") +
      ":" + date.getMinutes().toString().padStart(2, "0") +
      ":" + date.getSeconds().toString().padStart(2, "0");
    i++
    if (i >= day_samling) {

      temp_data1_D.push(deviObj[d].temperature);
      date_data1_D_tranfer.push(currentDateTimeDevice);
      date_data1_D.push(date);
      humi_data1_D.push(deviObj[d].humidity);

      temp_data7_D.push(deviObj[d].temperature);
      date_data7_D_tranfer.push(currentDateTimeDevice);
      date_data7_D.push(date);
      humi_data7_D.push(deviObj[d].humidity);

      temp_data30_D.push(deviObj[d].temperature);
      date_data30_D_tranfer.push(currentDateTimeDevice);
      date_data30_D.push(date);
      humi_data30_D.push(deviObj[d].humidity);

      temp_data_all_D.push(deviObj[d].temperature);
      date_data_all_D_tranfer.push(currentDateTimeDevice);
      date_data_all_D.push(date);
      humi_data_all_D.push(deviObj[d].humidity);

    } else if (i >= week_sampling) {
      temp_data7_D.push(deviObj[d].temperature);
      date_data7_D_tranfer.push(currentDateTimeDevice);
      date_data7_D.push(date);
      humi_data7_D.push(deviObj[d].humidity);

      temp_data30_D.push(deviObj[d].temperature);
      date_data30_D_tranfer.push(currentDateTimeDevice);
      date_data30_D.push(date);
      humi_data30_D.push(deviObj[d].humidity);

      temp_data_all_D.push(deviObj[d].temperature);
      date_data_all_D_tranfer.push(currentDateTimeDevice);
      date_data_all_D.push(date);
      humi_data_all_D.push(deviObj[d].humidity);

    } else if (i >= month_sampling) {
      temp_data30_D.push(deviObj[d].temperature);
      date_data30_D_tranfer.push(currentDateTimeDevice);
      date_data30_D.push(date);
      humi_data30_D.push(deviObj[d].humidity);

      temp_data_all_D.push(deviObj[d].temperature);
      date_data_all_D_tranfer.push(currentDateTimeDevice);
      date_data_all_D.push(date);
      humi_data_all_D.push(deviObj[d].humidity);
    } else {
      temp_data_all_D.push(deviObj[d].temperature);
      date_data_all_D_tranfer.push(currentDateTimeDevice);
      date_data_all_D.push(date);
      humi_data_all_D.push(deviObj[d].humidity);
    }

    /* if (i > 129600) {
       console.log("Some of the data was older than 3 months, so it has been deleted.");
       dbRef.child("devices_sensor").child(device).child(d).remove();
     }*/
  }
  //console.log(all_samp);
  //console.log(Object.keys(deviObj)[1000]);
  label = date_data30_D;
  tem_data = temp_data30_D;
  humi_data = humi_data30_D;
  document.getElementById('date_from').value = ChangeFormateDateV2(date_data30_D_tranfer[0].toString().substring(0, 10));
  document.getElementById('date_to').value = new Date().toLocaleDateString('en-CA');
  renderTable(device, date_data30_D_tranfer, temp_data30_D, humi_data30_D);
  mainChat();
  compareGraph();
  
  for(let i = 1 ;i < day_all_data.length; i++) {
    compareChart.data.datasets.push({
      label: day_compareGraph[i] ,
      backgroundColor: color[i-1],
      borderColor: color[i-1],
      indexLabelFontSize: 10,
      fill: false,
      data: day_all_data[i],
      pointRadius: 0,
      borderWidth: 3,
      tension: 0
    });
    compareChart.update();
  }

}



////////////////////////////////////////////////////////////////////////////////
function mainChat() {
  let ctx = document.getElementById('temperatureChart').getContext('2d');
  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: label,
      datasets: [{
        data: tem_data,
        label: 'Temperature',
        indexLabelFontSize: 10,
        borderColor: "#ec7777",
        backgroundColor: "#ec7777",
        fill: false,
        yAxisID: 'A',
        pointRadius: 0,
        borderWidth: 3,
        tension: 0
      }, {
        data: humi_data,
        label: 'Humidity',
        borderColor: "#5f5ff1",
        backgroundColor: "#5f5ff1",
        fill: false,
        yAxisID: 'B',
        pointRadius: 0,
        borderWidth: 3,
        tension: 0
        //borderWidth: .00001
      }]
    },
    options: {
      /*pan: {
        enabled: true,
        mode: 'x',
        speed: 20,
      },*/
      zoom: {
        enabled: true,
        drag: {
          borderColor: 'rgba(225,225,225,0.3)',
          borderWidth: 5,
          backgroundColor: 'rgb(225,225,225)',
          animationDuration: 0
        },
        mode: 'x',
        /* limits: {
           max: 10,
           min: 0.
         }*/
      },
      tooltips: {
        mode: 'index',
        intersect: false
      },
      hover: {
        mode: 'index',
        intersect: false
      },
      responsive: true,
      scales: {
        yAxes: [{
          id: 'A',
          type: 'linear',
          position: 'left',
          ticks: {
            suggestedMin: 10,
            suggestedMax: 45,
            maxTicksLimit: maxTicksLimitY,
            fontSize: font_y_size, //10
            min: 10
          },
          scaleLabel: {
            display: true,
            labelString: 'Temperature (°C)',
            fontSize: font_y_size
          },
        }, {
          id: 'B',
          type: 'linear',
          position: 'right',
          ticks: {
            suggestedMin: 20,
            suggestedMax: 90,
            maxTicksLimit: maxTicksLimitY,
            fontSize: font_y_size,
            min: 20
          },
          scaleLabel: {
            display: true,
            labelString: 'Humidity (%RH)',
            fontSize: font_y_size
          }
        }],
        xAxes: [{
          type: 'time',
          time: {
            unit: 'hour',
            stepSize: 0.5,  //I'm using 3 hour intervals here
            tooltipFormat: 'HH:mm:ss DD/MM/YYYY',
            parser: 'HH:mm:ss', //these formatting values do nothing, I've tried a few different ones
            //: 'second', //I have tried minutes and hours too, same result
            displayFormats: {
              /*millisecond: 'HH:mm:ss', //I have tried without the 'a' too, same result
              second: 'HH:mm:ss',
              minute: 'HH:mm:ss',
              hour: 'HH:mm',
              day: 'HH:mm',
              'week': 'HH:mm:ss a',
              'month': 'HH:mm:ss a',
              'quarter': 'HH:mm:ss a',
              'year': 'HH:mm:ss a',*/
              hour: 'HH:mm'
            }
          },
          ticks: {
            //source: 'auto',
            major: {
              enabled: true, // <-- This is the key line
              fontStyle: 'bold', //You can also style these values differently
              fontSize: 14 //You can also style these values differently
            },
            //autoSkip: true,
            //fontSize: font_x_size
            //,maxTicksLimit: maxTicksLimitX,
          },
        }]
      },
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////


//click for change grapt
function allData() {

  let dayBtn = document.getElementById("dayDuration");
  let weekBtn = document.getElementById("weekDuration");
  let monthBtn = document.getElementById("monthDuration");
  let allBtn = document.getElementById("allDuration");
  allBtn.style.backgroundColor = "#E35F43";
  allBtn.style.color = "white";
  dayBtn.style.backgroundColor = "white";
  dayBtn.style.color = "#E35F43";
  weekBtn.style.backgroundColor = "white";
  weekBtn.style.color = "#E35F43";
  monthBtn.style.backgroundColor = "white";
  monthBtn.style.color = "#E35F43";

  //console.log(date_data1_D);
  myChart.data.datasets[0].data = temp_data30_D;
  myChart.data.datasets[1].data = humi_data30_D;
  myChart.data.labels = date_data30_D;
  myChart.update();

  renderTable(device, date_data30_D_tranfer, temp_data30_D, humi_data30_D);
}


function dayData() {
  let dayBtn = document.getElementById("dayDuration");
  let weekBtn = document.getElementById("weekDuration");
  let monthBtn = document.getElementById("monthDuration");
  let allBtn = document.getElementById("allDuration");
  dayBtn.style.backgroundColor = "#E35F43";
  dayBtn.style.color = "white";
  weekBtn.style.backgroundColor = "white";
  weekBtn.style.color = "#E35F43";
  monthBtn.style.backgroundColor = "white";
  monthBtn.style.color = "#E35F43";
  allBtn.style.backgroundColor = "white";
  allBtn.style.color = "#E35F43";

  document.getElementById('date_from').value = ChangeFormateDateV2(date_data1_D_tranfer[0].toString().substring(0, 10));
  document.getElementById('date_to').value = ChangeFormateDateV2(date_data1_D_tranfer[date_data1_D_tranfer.length - 1].toString().substring(0, 10));
  //console.log(date_data1_D);
  myChart.data.datasets[0].data = temp_data1_D;
  myChart.data.datasets[1].data = humi_data1_D;
  myChart.data.labels = date_data1_D;
  myChart.update();

  renderTable(device, date_data1_D_tranfer, temp_data1_D, humi_data1_D);
}

function weekData() {
  let dayBtn = document.getElementById("dayDuration");
  let weekBtn = document.getElementById("weekDuration");
  let monthBtn = document.getElementById("monthDuration");
  let allBtn = document.getElementById("allDuration");
  weekBtn.style.backgroundColor = "#E35F43";
  weekBtn.style.color = "white";
  dayBtn.style.backgroundColor = "white";
  dayBtn.style.color = "#E35F43";
  monthBtn.style.backgroundColor = "white";
  monthBtn.style.color = "#E35F43";
  allBtn.style.backgroundColor = "white";
  allBtn.style.color = "#E35F43";

  document.getElementById('date_from').value = ChangeFormateDateV2(date_data7_D_tranfer[0].toString().substring(0, 10));
  document.getElementById('date_to').value = ChangeFormateDateV2(date_data7_D_tranfer[date_data7_D_tranfer.length - 1].toString().substring(0, 10));
  //console.log(ChangeFormateDateV2(date_data7_D_tranfer[0].toString().substring(0, 10)));
  //console.log(ChangeFormateDateV2(date_data7_D_tranfer[date_data7_D_tranfer.length-1].toString().substring(0, 10)));
  myChart.data.datasets[0].data = temp_data7_D;
  myChart.data.datasets[1].data = humi_data7_D;
  myChart.data.labels = date_data7_D;
  myChart.update();
  
  renderTable(device, date_data7_D_tranfer, temp_data7_D, humi_data7_D);
}

function monthData() {
  let dayBtn = document.getElementById("dayDuration");
  let weekBtn = document.getElementById("weekDuration");
  let monthBtn = document.getElementById("monthDuration");
  let allBtn = document.getElementById("allDuration");
  monthBtn.style.backgroundColor = "#E35F43";
  monthBtn.style.color = "white";
  weekBtn.style.backgroundColor = "white";
  weekBtn.style.color = "#E35F43";
  dayBtn.style.backgroundColor = "white";
  dayBtn.style.color = "#E35F43";
  allBtn.style.backgroundColor = "white";
  allBtn.style.color = "#E35F43";

  document.getElementById('date_from').value = ChangeFormateDateV2(date_data30_D_tranfer[0].toString().substring(0, 10));
  document.getElementById('date_to').value = ChangeFormateDateV2(date_data30_D_tranfer[date_data30_D_tranfer.length - 1].toString().substring(0, 10));
  myChart.data.datasets[0].data = temp_data30_D;
  myChart.data.datasets[1].data = humi_data30_D;
  myChart.data.labels = date_data30_D;
  myChart.update();

  renderTable(device, date_data30_D_tranfer, temp_data30_D, humi_data30_D);
}

function allData() {
  let dayBtn = document.getElementById("dayDuration");
  let weekBtn = document.getElementById("weekDuration");
  let monthBtn = document.getElementById("monthDuration");
  let allBtn = document.getElementById("allDuration");
  monthBtn.style.backgroundColor = "#white";
  monthBtn.style.color = "E35F43";
  weekBtn.style.backgroundColor = "white";
  weekBtn.style.color = "#E35F43";
  dayBtn.style.backgroundColor = "white";
  dayBtn.style.color = "#E35F43";
  allBtn.style.backgroundColor = "#E35F43";
  allBtn.style.color = "#white";

  document.getElementById('date_from').value = ChangeFormateDateV2(date_data_all_D_tranfer[0].toString().substring(0, 10));
  document.getElementById('date_to').value = ChangeFormateDateV2(date_data_all_D_tranfer[date_data_all_D_tranfer.length - 1].toString().substring(0, 10));
  myChart.data.datasets[0].data = temp_data_all_D;
  myChart.data.datasets[1].data = humi_data_all_D;
  myChart.data.labels = date_data_all_D;
  myChart.update();
  //console.log(date_data_all_D.length);
 // console.log(date_data30_D.length);
  renderTable(device, date_data_all_D_tranfer, temp_data_all_D, humi_data_all_D);
}


function getRange() {
  let date_start = document.getElementById("date_from").value;
  let date_end = document.getElementById("date_to").value;
  // let date_start_formate = ChangeFormateDate(date_start); 
  // let date_end_formate = ChangeFormateDate(date_end); 
  date_calendar_transfer = [];
  date_carlendar_D = [];
  humi_carlendar_D = [];
  temp_carlendar_D = [];
  //console.log(date_data30_D_tranfer);
  if (date_start > date_end) {
    console.log("worng");
    //console.log(date_start);
    //console.log(date_end);
  } else {
    for (let i = 0; i < date_data30_D.length; i++) {
      if (date_start <= ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10)) && ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10)) <= date_end) {
        date_carlendar_D.push(date_data30_D[i]);
        humi_carlendar_D.push(humi_data30_D[i]);
        temp_carlendar_D.push(temp_data30_D[i]);
        date_calendar_transfer.push(date_data30_D_tranfer[i]);
      }
    };
    myChart.data.datasets[0].data = temp_carlendar_D;
    myChart.data.datasets[1].data = humi_carlendar_D;
    myChart.data.labels = date_carlendar_D;
    myChart.update();

    renderTable(device, date_calendar_transfer, temp_carlendar_D, humi_carlendar_D);
  }
}

// change / to -
function ChangeFormateDate(oldDate) {
  return oldDate.toString().split("-").reverse().join("/");
}
// change - to /
function ChangeFormateDateV2(oldDate) {
  return oldDate.toString().split("/").reverse().join("-");
}

document.getElementById('resetZoom').addEventListener('click', function () {
  myChart.resetZoom('none');
});

document.getElementById('resetZoom2').addEventListener('click', function () {
  compareChart.resetZoom('none');
});

function compareGraph() {
  /*let yesterday = Date.now() - 86400000;
  let dateYesterday = new Date(yesterday);
  
  let currentDateTimeDevice = dateYesterday.getDate().toString().padStart(2, "0") +
      "/" + ((dateYesterday.getMonth() + 1).toString().padStart(2, "0")) +
      "/" + dateYesterday.getFullYear();*/
  date_label = [];
  day_all_data = [];
  day_compareGraph = [];
  let day_eve_day = [];
  let lastest_day = ChangeFormateDateV2(date_data1_D_tranfer[date_data1_D_tranfer.length-1].toString().substring(0, 10));
  let lastest_week = ChangeFormateDateV2(date_data7_D_tranfer[0].toString().substring(0, 10));
  //let day_count = lastest_week;
  console.log(lastest_day);
  console.log(lastest_week);
  //console.log(date_data1_D_tranfer[0]);
  let day_set = lastest_week;
  let j = 0;
  for (let i = 0; i < date_data7_D.length; i++) {
    let day_count = ChangeFormateDateV2(date_data7_D_tranfer[i].toString().substring(0, 10));
    if (day_count == lastest_day) {
      break;
    } else if (day_count != lastest_week) {
      if (j < 1440) {
        date_label.push(date_data7_D[i]);
      }
      if (0 == j % 1440) {
        day_compareGraph.push(ChangeFormateDateV2(date_data7_D_tranfer[i+10].toString().substring(0, 10)));
        day_all_data.push(day_eve_day);
        day_eve_day = [];
      }
      day_eve_day.push(temp_data30_D[i]);
      j++
    } 
  }
  //console.log(day_all_data);
  //console.log(day_compareGraph);
  
  var ctx2 = document.getElementById('compareChart').getContext('2d');
  compareChart = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: date_label,
    },
    options: {
      zoom: {
        enabled: true,
        drag: {
          borderColor: 'rgba(225,225,225,0.3)',
          borderWidth: 5,
          backgroundColor: 'rgb(225,225,225)',
          animationDuration: 0
        },
        mode: 'x',
      },
      tooltips: {
        mode: 'index',
        intersect: false
      },
      hover: {
        mode: 'index',
        intersect: false
      },
      responsive: true,
      scales: {
        yAxes: [{
          id: 'A',
          type: 'linear',
          position: 'left',
          ticks: {
            suggestedMin: 10,
            suggestedMax: 45,
            maxTicksLimit: maxTicksLimitY,
            fontSize: font_y_size,
            min: 10
          },
          scaleLabel: {
            display: true,
            labelString: 'Temperature (°C)',
            fontSize: font_y_size
          },
        }],
        xAxes: [{
          type: 'time',
          time: {
            unit: 'hour',
            stepSize: 0.5,  //I'm using 3 hour intervals here
            tooltipFormat: 'HH:mm:ss DD/MM/YYYY',
            parser: 'HH:mm:ss', //these formatting values do nothing, I've tried a few different ones
            //: 'second', //I have tried minutes and hours too, same result
            displayFormats: {
              hour: 'HH:mm'
            }
          },
          ticks: {
            //source: 'auto',
            major: {
              enabled: true, // <-- This is the key line
              fontStyle: 'bold', //You can also style these values differently
              fontSize: 14 //You can also style these values differently
            },
          },
        }]
      },
    }
  });
}


function renderTable(device_name, date_array, temp_array, humi_array) {
  firstDateTime = date_array[0];
  lastDateTime = date_array[date_array.length - 1];
  let haveTbody = document.getElementById('tbl-body');
  if (haveTbody) {
    haveTbody.remove();
  }
  let tbody = document.createElement('tbody');
  tbody.setAttribute('id', 'tbl-body');
  let col = 5; //column head number
  for (i = 0; i < date_array.length; i++) {
    let row = document.createElement('tr');
    let td_list = [i + 1, device_name, date_array[i], temp_array[i], humi_array[i]]
    for (j = 0; j < col; j++) {
      let td = document.createElement('td');
      td.innerText = td_list[j];
      row.appendChild(td);
    }
    tbody.appendChild(row);
  }
  document.getElementById('table2excel').appendChild(tbody);
}

// function addData(chart, label, data) {
//   chart.data.labels.push(label);
//   chart.data.datasets.forEach((dataset) => {
//       dataset.data.push(data);
//   });
//   chart.update();
// }

function addData(chart, label, color, data) {
  chart.data.datasets.push({
    label: label,
    backgroundColor: color,
    fill: false,
    data: data
  });
  chart.update();
}

// อยู่ตรงนี้วัยรุ่น
/////////////////////////////////////////////////// start function
firstLoad();