

dbRef.child("devices_sensor").get().then((snapshot) => {
  if (snapshot.exists()) {
    let deviObj = snapshot.val();
    //let num_of_devi;

    // Get Number of device connected
   // num_of_devi = Object.keys(deviObj).length;


    // Get the lastest time (of D02)
    //n = Object.keys(deviObj.D02).length;
    //last_element = Object.keys(deviObj.D02)[n-1];
    //last_time = deviObj.D02[last_element].timeUpdate.timestamp;
   // document.getElementById('lastTime').innerText = last_time;
    
    // Devices get data
    let tem_aryD01 = [];
    let tem_aryD02 = [];
    let humi_aryD01 = [];
    let humi_aryD02 = [];
    let time_aryD01 = [];
    let time_aryD02 = [];
    let i = 0;
    for (d in deviObj.D01) {
      n_sampling = Object.keys(deviObj.D01).length;
      all_samp = Object.keys(deviObj.D01)[i];
      i += 1
      tem_aryD01.push(deviObj.D01[all_samp].temperature);
      time_aryD01.push(deviObj.D01[all_samp].timestamp);
      humi_aryD01.push(deviObj.D01[all_samp].humidity);
    }
   /* i = 0;
    for (d in deviObj.D02) {
      n_sampling = Object.keys(deviObj.D02).length;
      all_samp = Object.keys(deviObj.D02)[i]; 
      i += 1
      tem_aryD02.push(deviObj.D02[all_samp].temperature);
      time_aryD02.push(deviObj.D02[all_samp].timestamp);
      humi_aryD02.push(deviObj.D02[all_samp].humidity);
    }*/

    //D01
    let temp_data30_D01 = [];
    let date_data30_D01 = [];
    let humi_data30_D01 = [];

    
    
    if (tem_aryD01.length > 0 ) {
      for(let j = 0; j <= 3000; j++){
        var timestamp = time_aryD01[tem_aryD01.length-3000+j-1]/1000;
        let date = new Date(timestamp * 1000);
        let currentDateTimeD01 = date.getDate()+
          "/"+(date.getMonth()+1)+
          "/"+date.getFullYear()+
          " "+date.getHours()+
          ":"+date.getMinutes()+
          ":"+date.getSeconds();
        //console.log(timestamp);
        
        temp_data30_D01.push(tem_aryD01[tem_aryD01.length-3000+j-1]);
        date_data30_D01.push(currentDateTimeD01);
        humi_data30_D01.push(humi_aryD01[tem_aryD01.length-3000+j-1]);
      }
    }
    //D02
    /*let temp_data30_D02 = [];
    let date_data30_D02 = [];
    let humi_data30_D02 = [];
    if (tem_aryD02.length > 0 ) {
      for(let j = 0; j <= 43200; j++){
        var timestamp = time_aryD02[tem_aryD02.length-43200+j-1]/1000;
        let date = new Date(timestamp * 1000);
        let currentDateTimeD02 = date.getDate()+
          "/"+(date.getMonth()+1)+
          "/"+date.getFullYear()+
          " "+date.getHours()+
          ":"+date.getMinutes()+
          ":"+date.getSeconds();
        console.log(currentDateTimeD02);
        temp_data30_D02.push(tem_aryD02[tem_aryD02.length-43200+j-1]);
        date_data30_D02.push(currentDateTimeD02);
        humi_data30_D02.push(humi_aryD02[tem_aryD02.length-43200+j-1]);
      }
    }*/
    var labels =  date_data30_D01;
    // teperature grapt
    //console.log( temp_data30_D02);
    /*var ctx = document.getElementById('temperatureChart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{ 
            data: temp_data30_D02,
            label: "temperature_D02",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false,
            yAxisID: 'A',
            pointRadius: 0,
            borderWidth: 1
          }, { 
            data: humi_data30_D02,
            label: "humidity_D02",
            borderColor: "#3cba9f",
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
                suggestedMin: 20,
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
    });*/
    // D01
    var ctx = document.getElementById('temperatureChart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{ 
            data: temp_data30_D01,
            label: "temperature_D01",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false,
            yAxisID: 'A',
            pointRadius: 0,
            borderWidth: 1
          }, { 
            data: humi_data30_D01,
            label: "humidity_D01",
            borderColor: "#3cba9f",
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




