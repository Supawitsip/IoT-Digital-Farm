var label;
var myChart;

var date_data1_D_tranfer;
var date_data7_D_tranfer;
var date_data30_D_tranfer;

var temp_data1_D;
var date_data1_D; 
var humi_data1_D;
var temp_data7_D;
var date_data7_D;
var humi_data7_D;

var temp_data30_D;
var date_data30_D; 
var humi_data30_D;
var date_carlendar_D; 
var humi_carlendar_D;
var temp_carlendar_D;
var humi_data;
var tem_data;
var maxTicksLimitX = 24;
var maxTicksLimitY = 12;
var font_x_size = 16;
var font_y_size = 16;
var test;

var firstDateTime;
var lastDateTime;
//console.log('name: ' + device);
if (document.documentElement.clientWidth < 900) {
  //myChart.options.scales.yAxes[0].ticks.maxTicksLimit = 6;
  //myChart.options.scales.yAxes[1].ticks.maxTicksLimit = 6;
  //console.log("yees");
  maxTicksLimitX = 12;
  maxTicksLimitY = 5;
  font_x_size = 10;
  font_y_size = 10;
}

dbRef.child("devices_sensor").get().then((snapshot) => {
  if (snapshot.exists()) {
    let deviObj = snapshot.val();
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
    test = [];
    // when data not enought
   /* let sampling_Nan = n_sampling;
    if (sampling_Nan < 43200) {
      for (; sampling_Nan < 43200;sampling_Nan++) {
        if (sampling_Nan < 1440) {
          temp_data1_D.push(NaN);
          date_data1_D.push(new Date(0));
          humi_data1_D.push(NaN);
          temp_data7_D.push(NaN);
          date_data7_D.push(new Date(0));
          humi_data7_D.push(NaN);
          temp_data30_D.push(NaN);
          date_data30_D.push(new Date(0));
          humi_data30_D.push(NaN);
        } else if (sampling_Nan < 10080) { //week
          temp_data7_D.push(NaN);
          date_data7_D.push(new Date(0));
          humi_data7_D.push(NaN);
          temp_data30_D.push(NaN);
          date_data30_D.push(new Date(0));
          humi_data30_D.push(NaN);
        } else {
          temp_data30_D.push(NaN);
          date_data30_D.push(new Date(0));
          humi_data30_D.push(NaN);
        }  
      }   
    } */
    
    let i = 0;
    for (d in deviObj[device]) {
      n_sampling = Object.keys(deviObj[device]).length;
      let day_samling = n_sampling - 1440;
      let week_sampling = n_sampling - 10080;
      let month_sampling = n_sampling - 43200;

      //for D15
      /*let day_samling = n_sampling - 24;
      let week_sampling = n_sampling - 168;
      let month_sampling = n_sampling - 720; //for D15*/
      all_samp = Object.keys(deviObj[device])[i];
      let timestamp = deviObj[device][all_samp].timestamp/1000;   
      let date = new Date(timestamp * 1000);
      let currentDateTimeDevice = date.getDate().toString().padStart(2, "0")+
          "/"+((date.getMonth()+1).toString().padStart(2, "0"))+
          "/"+date.getFullYear()+
          " "+date.getHours().toString().padStart(2, "0")+
          ":"+date.getMinutes().toString().padStart(2, "0")+
          ":"+date.getSeconds().toString().padStart(2, "0");
      i += 1;
      test.push(date);
      if (i >= day_samling) {
        temp_data1_D.push(deviObj[device][all_samp].temperature);
        date_data1_D_tranfer.push(currentDateTimeDevice);
        date_data1_D.push(date);
        humi_data1_D.push(deviObj[device][all_samp].humidity);
        temp_data7_D.push(deviObj[device][all_samp].temperature);
        date_data7_D_tranfer.push(currentDateTimeDevice);
        date_data7_D.push(date);
        humi_data7_D.push(deviObj[device][all_samp].humidity);
        temp_data30_D.push(deviObj[device][all_samp].temperature);
        date_data30_D_tranfer.push(currentDateTimeDevice);
        date_data30_D.push(date);
        humi_data30_D.push(deviObj[device][all_samp].humidity);
      } else if (i >= week_sampling) {
        temp_data7_D.push(deviObj[device][all_samp].temperature);
        date_data7_D_tranfer.push(currentDateTimeDevice);
        date_data7_D.push(date);
        humi_data7_D.push(deviObj[device][all_samp].humidity);
        temp_data30_D.push(deviObj[device][all_samp].temperature);
        date_data30_D_tranfer.push(currentDateTimeDevice);
        date_data30_D.push(date);
        humi_data30_D.push(deviObj[device][all_samp].humidity);
      } else if (i >= month_sampling){
        temp_data30_D.push(deviObj[device][all_samp].temperature);
        date_data30_D_tranfer.push(currentDateTimeDevice);
        date_data30_D.push(date);
        humi_data30_D.push(deviObj[device][all_samp].humidity);
      }

      if (i > 129600) {
        console.log("Some of the data was older than 3 months, so it has been deleted.");
        dbRef.child("devices_sensor").child(device).child(d).remove();
      }
    }
    //console.log(date_data30_D.length);
    //console.log(date_data7_D.length);
    //console.log(date_data1_D.length);
   // console.log(temp_data30_D.length);
   // console.log(humi_data30_D.length);
    label = date_data30_D;
    tem_data = temp_data30_D;
    humi_data = humi_data30_D;
    // D01
    
    document.getElementById('date_from').value = ChangeFormateDateV2(date_data30_D_tranfer[0].toString().substring(0, 10));
    document.getElementById('date_to').value = new Date().toLocaleDateString('en-CA');
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
///////////////////////////////////////////////////////////////////////////// hard
    /*var ctx2 = document.getElementById('compareChart').getContext('2d');
    var compareChart = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: date_data1_D,
        datasets: [{ 
            data: temp_data1_D,
            label: 'Temperature1',
            indexLabelFontSize: 10,
            borderColor: "#ec7777",
            backgroundColor: "#ec7777",
            fill: false,
            //yAxisID: 'A', 
            pointRadius: 0,
            borderWidth: 3,
            tension: 0
          },
          {
            data: temp_data1_D,
            label: 'Temperature2',
            indexLabelFontSize: 10,
            borderColor: "#ec7777",
            backgroundColor: "#ec7777",
            fill: false,
            //yAxisID: 'A', 
            pointRadius: 0,
            borderWidth: 3,
            tension: 0
          }]
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
    });*/

    renderTable(device, date_data30_D_tranfer, temp_data30_D, humi_data30_D);
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});



//click for change grapt
function allData(){
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


function dayData(){
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
  document.getElementById('date_to').value = ChangeFormateDateV2(date_data1_D_tranfer[date_data1_D_tranfer.length-1].toString().substring(0, 10));
  //console.log(date_data1_D);
  myChart.data.datasets[0].data = temp_data1_D;
  myChart.data.datasets[1].data = humi_data1_D;
  myChart.data.labels = date_data1_D;
  myChart.update();

  renderTable(device, date_data1_D_tranfer, temp_data1_D, humi_data1_D);
}

function weekData(){
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
  document.getElementById('date_to').value = ChangeFormateDateV2(date_data7_D_tranfer[date_data7_D_tranfer.length-1].toString().substring(0, 10));
  console.log(ChangeFormateDateV2(date_data7_D_tranfer[0].toString().substring(0, 10)));
  myChart.data.datasets[0].data = temp_data7_D;
  myChart.data.datasets[1].data = humi_data7_D;
  myChart.data.labels = date_data7_D;
  myChart.update();

  renderTable(device, date_data7_D_tranfer, temp_data7_D, humi_data7_D);
}

function monthData(){
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
  document.getElementById('date_to').value = ChangeFormateDateV2(date_data30_D_tranfer[date_data30_D_tranfer.length-1].toString().substring(0, 10));
  myChart.data.datasets[0].data = temp_data30_D;
  myChart.data.datasets[1].data = humi_data30_D;
  myChart.data.labels = date_data30_D;
  myChart.update();

  renderTable(device, date_data30_D_tranfer, temp_data30_D, humi_data30_D);
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
    for (let i = 0;i < date_data30_D.length; i++) {
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

document.getElementById('resetZoom').addEventListener('click', function() {
  myChart.resetZoom('none');
});

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
    let td_list = [i+1, device_name, date_array[i], temp_array[i], humi_array[i]]
    for (j = 0; j < col; j++) {
      let td = document.createElement('td');
      td.innerText = td_list[j];
      row.appendChild(td);
    }
    tbody.appendChild(row);
  }
  document.getElementById('table2excel').appendChild(tbody);
}
// อยู่ตรงนี้วัยรุ่น