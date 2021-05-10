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
//console.log('name: ' + device);

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
            label: `Temperature_${device}`,
            borderColor: "#ec7777",
            backgroundColor: "#7bb6dd",
            fill: false,
            yAxisID: 'A',
            pointRadius: 0,
            borderWidth: 2
          }, { 
            data: humi_data,
            label: `Humidity_${device}`,
            borderColor: "#5f5ff1",
            backgroundColor: "#71d1bd",
            fill: false,
            yAxisID: 'B',
            pointRadius: 0,
            borderWidth: 2
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
                suggestedMin: 15,
                suggestedMax: 45, 
              },
              scaleLabel: {
                display: true,
                labelString: 'Temperature(°C)'
              },
            }, {
              id: 'B',
              type: 'linear',
              position: 'right',
              ticks: {
                suggestedMin: 30,
                suggestedMax: 80, 
              },
              scaleLabel: {
                display: true,
                labelString: 'Humidity(%RH)'
              }          
            }],
            xAxes: [{
              //type: 'time',
              ticks: {
                autoSkip: true,
                maxTicksLimit: 20
              }
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
  myChart.data.datasets[0].data = temp_data1_D;
  myChart.data.datasets[1].data = humi_data1_D;
  myChart.data.labels = date_data1_D;
  myChart.update();
}

function weekData(){
  myChart.data.datasets[0].data = temp_data7_D;
  myChart.data.datasets[1].data = humi_data7_D;
  myChart.data.labels = date_data7_D;
  myChart.update();
}

function monthData(){
  myChart.data.datasets[0].data = temp_data30_D;
  myChart.data.datasets[1].data = humi_data30_D;
  myChart.data.labels = date_data30_D;
  myChart.update();
}