var labels;
var myChart;
var temp_data1_D;
var date_data1_D; 
var humi_data1_D;
var temp_data7_D;
var date_data7_D;
var humi_data7_D;
var temp_data30_D;
var date_data30_D; 
var humi_data30_D;
var humi_data;
var tem_data;
var maxTicksLimitX = 20;
var maxTicksLimitY = 12;
var font_x_size = 16;
var font_y_size = 16;
//console.log('name: ' + device);
if (document.documentElement.clientWidth < 900) {
  //myChart.options.scales.yAxes[0].ticks.maxTicksLimit = 6;
  //myChart.options.scales.yAxes[1].ticks.maxTicksLimit = 6;
  //console.log("yees");
  maxTicksLimitX = 10;
  maxTicksLimitY = 5;
  font_x_size = 10;
  font_y_size = 10;
}
dbRef.child("devices_sensor").get().then((snapshot) => {
  if (snapshot.exists()) {
    let deviObj = snapshot.val();
    //let tem_aryD01 = [];
    //let humi_aryD01 = [];
    //let time_aryD01 = [];
    
    temp_data1_D = [];
    date_data1_D = [];
    humi_data1_D = [];
    temp_data7_D = [];
    date_data7_D = [];
    humi_data7_D = [];
    temp_data30_D = [];
    date_data30_D = []; 
    humi_data30_D = [];
    // when data not enought
    if (n_sampling < 43200) {
      for (; n_sampling < 43200; n_sampling++) {
        if (n_sampling < 10080) { //week
          temp_data7_D.push(NaN);
          date_data7_D.push(NaN);
          humi_data7_D.push(NaN);
          temp_data30_D.push(NaN);
          date_data30_D.push(NaN);
          humi_data30_D.push(NaN);
        } else {
          temp_data30_D.push(NaN);
          date_data30_D.push(NaN);
          humi_data30_D.push(NaN);
        }  
      }   
    } 
    
    let i = 0;
    for (d in deviObj[device]) {
      n_sampling = Object.keys(deviObj[device]).length;
      let day_samling = n_sampling - 1440;
      let week_sampling = n_sampling - 10080;
      let month_sampling = n_sampling - 43200;
      all_samp = Object.keys(deviObj[device])[i];
      let timestamp = deviObj[device][all_samp].timestamp/1000;   
      let date = new Date(timestamp * 1000);
      let currentDateTimeDevice = date.getDate()+
          "/"+(date.getMonth()+1)+
          "/"+date.getFullYear()+
          " "+date.getHours()+
          ":"+date.getMinutes()+
          ":"+date.getSeconds();
      i += 1;
      if (i >= day_samling) {
        temp_data1_D.push(deviObj[device][all_samp].temperature);
        date_data1_D.push(currentDateTimeDevice);
        humi_data1_D.push(deviObj[device][all_samp].humidity);
        temp_data7_D.push(deviObj[device][all_samp].temperature);
        date_data7_D.push(currentDateTimeDevice);
        humi_data7_D.push(deviObj[device][all_samp].humidity);
        temp_data30_D.push(deviObj[device][all_samp].temperature);
        date_data30_D.push(currentDateTimeDevice);
        humi_data30_D.push(deviObj[device][all_samp].humidity);
      } else if (i >= week_sampling) {
        temp_data7_D.push(deviObj[device][all_samp].temperature);
        date_data7_D.push(currentDateTimeDevice);
        humi_data7_D.push(deviObj[device][all_samp].humidity);
        temp_data30_D.push(deviObj[device][all_samp].temperature);
        date_data30_D.push(currentDateTimeDevice);
        humi_data30_D.push(deviObj[device][all_samp].humidity);
      } else if (i >= month_sampling){
        temp_data30_D.push(deviObj[device][all_samp].temperature);
        date_data30_D.push(currentDateTimeDevice);
        humi_data30_D.push(deviObj[device][all_samp].humidity);
      }

      if (i > 129600) {
        console.log("Some of the data was older than 3 months, so it has been deleted.");
        dbRef.child("devices_sensor").child(device).child(d).remove();
      }
    }
   // console.log(date_data30_D.length);
   // console.log(temp_data30_D.length);
   // console.log(humi_data30_D.length);
    labels = date_data1_D;
    tem_data = temp_data1_D;
    humi_data = humi_data1_D;
    // D01
    var ctx = document.getElementById('temperatureChart').getContext('2d');
    myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{ 
            data: tem_data,
            label: 'Temperature',
            indexLabelFontSize: 10,
            borderColor: "#ec7777",
            backgroundColor: "#7bb6dd",
            fill: false,
            yAxisID: 'A', 
            pointRadius: 0,
            borderWidth: 3
          }, { 
            data: humi_data,
            label: 'Humidity',
            borderColor: "#5f5ff1",
            backgroundColor: "#71d1bd",
            fill: false,
            yAxisID: 'B',
            pointRadius: 0,
            borderWidth: 3
            //borderWidth: .00001
          }]
        },
        options: {
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
              },
            }
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
              //type: 'time',
              ticks: {
                autoSkip: true,
                maxTicksLimit: maxTicksLimitX,
                fontSize: font_x_size
              },
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

var calc = document.getElementById("calc")

calc.addEventListener("click", function() {
    var date = document.getElementById("date").value;
        //time = document.getElementById("time").value

    console.log(new Date(date));
})