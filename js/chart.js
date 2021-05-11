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
    label = date_data1_D;
    tem_data = temp_data1_D;
    humi_data = humi_data1_D;
    // D01
    var ctx = document.getElementById('temperatureChart').getContext('2d');
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
                parser: 'HH:mm:ss a', //these formatting values do nothing, I've tried a few different ones
                unit: 'minutes', //I have tried minutes and hours too, same result
                displayFormats: {
                 // 'millisecond': 'HH:mm:ss a', //I have tried without the 'a' too, same result
                  'second': 'HH:mm:ss a',
                  'minute': 'HH:mm:ss a',
                  'hour': 'HH:mm:ss a',
                  'day': 'HH:mm:ss a',
                  'week': 'HH:mm:ss a',
                  'month': 'HH:mm:ss a',
                  'quarter': 'HH:mm:ss a',
                  'year': 'HH:mm:ss a',
                }
              },
              ticks: {
                source: 'auto'
              },
              
              /*ticks: {
                //autoSkip: true,
                maxTicksLimit: maxTicksLimitX,
                fontSize: font_x_size
              },*/
            }]
          },
        }
    });

  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

//click for change grapt
function dayData(){
  let dayBtn = document.getElementById("dayDuration");
  let weekBtn = document.getElementById("weekDuration");
  let monthBtn = document.getElementById("monthDuration");
  dayBtn.style.backgroundColor = "#E35F43";
  dayBtn.style.color = "white";
  weekBtn.style.backgroundColor = "white";
  weekBtn.style.color = "#E35F43";
  monthBtn.style.backgroundColor = "white";
  monthBtn.style.color = "#E35F43";

  console.log(date_data1_D);
  myChart.data.datasets[0].data = temp_data1_D;
  myChart.data.datasets[1].data = humi_data1_D;
  myChart.data.labels = date_data1_D;
  myChart.update();
}

function weekData(){
  let dayBtn = document.getElementById("dayDuration");
  let weekBtn = document.getElementById("weekDuration");
  let monthBtn = document.getElementById("monthDuration");
  weekBtn.style.backgroundColor = "#E35F43";
  weekBtn.style.color = "white";
  dayBtn.style.backgroundColor = "white";
  dayBtn.style.color = "#E35F43";
  monthBtn.style.backgroundColor = "white";
  monthBtn.style.color = "#E35F43";

  console.log(date_data7_D.length);
  myChart.data.datasets[0].data = temp_data7_D;
  myChart.data.datasets[1].data = humi_data7_D;
  myChart.data.labels = date_data7_D;
  myChart.update();
}

function monthData(){
  let dayBtn = document.getElementById("dayDuration");
  let weekBtn = document.getElementById("weekDuration");
  let monthBtn = document.getElementById("monthDuration");
  monthBtn.style.backgroundColor = "#E35F43";
  monthBtn.style.color = "white";
  weekBtn.style.backgroundColor = "white";
  weekBtn.style.color = "#E35F43";
  dayBtn.style.backgroundColor = "white";
  dayBtn.style.color = "#E35F43";

  myChart.data.datasets[0].data = temp_data30_D;
  myChart.data.datasets[1].data = humi_data30_D;
  myChart.data.labels = date_data30_D;
  myChart.update();
}

//date grapt  
document.getElementById('date').value = new Date().toLocaleDateString('en-CA');
var calc = document.getElementById("calc")

calc.addEventListener("click", function() {
    var date = document.getElementById("date").value;
    //time = document.getElementById("time").value
    date_carlendar_D = []; 
    humi_carlendar_D = [];
    temp_carlendar_D = [];
    //console.log(ChangeFormateDate(date));
    dateNow = ChangeFormateDate(date);
    //console.log(dateNow);
    
    //console.log(date_data30_D[42000].substring(0, 10));
    
    /*for (let i = 0;i < 43200; i++) {
      
      if (date_data30_D[i] == NaN) {
        continue;
      } else if (dateNow == date_data30_D[i].toString().substring(0, 10)) {
        date_carlendar_D.push(date_data30_D[i].toString().substring(11, 19));
        humi_carlendar_D.push(humi_data30_D[i]);
        temp_carlendar_D.push(temp_data30_D[i]);
      }
    }*/
    for (let i = 0;i < date_data30_D.length; i++) {
      if (dateNow == date_data30_D_tranfer.toString().substring(0, 10)) {
        date_carlendar_D.push(date_data30_D[i]);
        humi_carlendar_D.push(humi_data30_D[i]);
        temp_carlendar_D.push(temp_data30_D[i]);
      }
      //console.log(date_data30_D[i]);
    }//console.log(date_carlendar_D);
 // console.log(temp_carlendar_D.legend);
    myChart.data.datasets[0].data = temp_carlendar_D;
    myChart.data.datasets[1].data = humi_carlendar_D;
    myChart.data.labels = date_carlendar_D;
  //label = date_carlendar_D;
  //tem_data = temp_carlendar_D;
  //humi_data =  humi_carlendar_D;
   myChart.update();
   console.log(date_carlendar_D.length);
   console.log(humi_carlendar_D.length);
   console.log(temp_carlendar_D.length);
})

function ChangeFormateDate(oldDate)
{
   return oldDate.toString().split("-").reverse().join("/");
}

