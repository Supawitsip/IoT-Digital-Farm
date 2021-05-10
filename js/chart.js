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
   // console.log(temp_data1_D.length + " length");
    //console.log(time_aryD01);
    /*temp_data30_D = [];
    date_data30_D = []; 
    humi_data30_D = [];
    temp_data1_D = [];
    date_data1_D = [];
    humi_data1_D = [];
    temp_data7_D = [];
    date_data7_D = [];
    humi_data7_D = [];
    let sample = 43200;
    

    if (tem_aryD01.length > 0 ) {
      for(let j = 0; j <= sample; j++){
        
        //console.log(timestamp);
        
        if(j <= 1440){
          temp_data30_D.push(tem_aryD01[tem_aryD01.length-sample+j-1]);
          date_data30_D.push(time_aryD01[time_aryD01.length-sample+j-1]);
          humi_data30_D.push(humi_aryD01[tem_aryD01.length-sample+j-1]);
         c
          temp_data7_D.push(tem_aryD01[tem_aryD01.length-sample+j-1+33120]);
          date_data7_D.push(time_aryD01[time_aryD01.length-sample+j-1+33120]);
          humi_data7_D.push(humi_aryD01[tem_aryD01.length-sample+j-1+33120]);
        } else if (j <= 10080) {
          temp_data30_D.push(tem_aryD01[tem_aryD01.length-sample+j-1]);
          date_data30_D.push(time_aryD01[time_aryD01.length-sample+j-1]);
          humi_data30_D.push(humi_aryD01[tem_aryD01.length-sample+j-1]);
          temp_data7_D.push(tem_aryD01[tem_aryD01.length-sample+j-1+33120]);
          date_data7_D.push(time_aryD01[time_aryD01.length-sample+j-1+33120]);
          humi_data7_D.push(humi_aryD01[tem_aryD01.length-sample+j-1+33120]);
        }else if (j <= 43200) {
          temp_data30_D.push(tem_aryD01[tem_aryD01.length-sample+j-1]);
          date_data30_D.push(time_aryD01[time_aryD01.length-sample+j-1]);
          humi_data30_D.push(humi_aryD01[tem_aryD01.length-sample+j-1]);
        }
        
      }
    }*/

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
            label: `temperature_${device}`,
            borderColor: "#ec7777",
            backgroundColor: "#7bb6dd",
            fill: false,
            yAxisID: 'A',
            pointRadius: 0,
            borderWidth: 2
          }, { 
            data: humi_data,
            label: `humidity_${device}`,
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
                suggestedMin: 0,
                suggestedMax: 50, 
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