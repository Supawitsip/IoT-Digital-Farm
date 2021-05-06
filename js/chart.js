

dbRef.child("devices_sensor").get().then((snapshot) => {
  if (snapshot.exists()) {
    let deviObj = snapshot.val();
    let num_of_devi;

    // Get Number of device connected
    num_of_devi = Object.keys(deviObj).length;


    // Get the lastest time (of D02)
    n = Object.keys(deviObj.D02).length;
    last_element = Object.keys(deviObj.D02)[n-1];
    last_time = deviObj.D02[last_element].timeUpdate.timestamp;
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
      time_aryD01.push(deviObj.D01[all_samp].timeUpdate.timestamp);
      humi_aryD01.push(deviObj.D01[all_samp].humidity);
    }
    i = 0;
    for (d in deviObj.D02) {
      n_sampling = Object.keys(deviObj.D02).length;
      all_samp = Object.keys(deviObj.D02)[i]; 
      i += 1
      tem_aryD02.push(deviObj.D02[all_samp].temperature);
      time_aryD02.push(deviObj.D02[all_samp].timeUpdate.timestamp);
      humi_aryD02.push(deviObj.D02[all_samp].humidity);
    }

    //D01
    let temp_data30_D01 = [];
    let date_data30_D01 = [];
    let humi_data30_D01 = [];
    if (tem_aryD01.length > 0 ) {
      for(let j = 0; j <= 30; j++){
        temp_data30_D01.push(tem_aryD01[tem_aryD01.length-30+j]);
        date_data30_D01.push(time_aryD01[tem_aryD01.length-30+j]);
        humi_data30_D01.push(humi_aryD01[tem_aryD01.length-30+j]);
      }
    }
    //D02
    let temp_data30_D02 = [];
    let date_data30_D02 = [];
    let humi_data30_D02 = [];
    if (tem_aryD02.length > 0 ) {
      for(let j = 0; j <= 30; j++){
        temp_data30_D02.push(tem_aryD02[tem_aryD02.length-30+j]);
        date_data30_D02.push(time_aryD02[tem_aryD02.length-30+j]);
        humi_data30_D02.push(humi_aryD02[tem_aryD02.length-30+j]);
      }
    }

    // teperature grapt
    console.log(humi_data30_D02);
    var ctx = document.getElementById('temperatureChart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: date_data30_D02,
        datasets: [{ 
            data: temp_data30_D01,
            label: "D01",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false,
          }, { 
            data: temp_data30_D02,
            label: "D02",
            borderColor: "#3cba9f",
            backgroundColor: "#71d1bd",
            fill: false,
          }]
        },
        options: {
          scales: {
            yAxes: [{
              display: true,
              ticks: {
                suggestedMin: 20, 
                suggestedMax: 50,
              }
            }],
            xAxes: [{
             ticks: {
                    display: false
             }
           }]
         },
         title: {
          display: true,
            text: 'Temperature Chart'
         }
      }
    });


    // humidity grapt
    var ctx = document.getElementById('humidityChart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: date_data30_D02,
        datasets: [{ 
            data:  humi_data30_D01,
            label: "D01",
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            fill: false,
          }, { 
            data:  humi_data30_D02,
            label: "D02",
            borderColor: "#3cba9f",
            backgroundColor: "#71d1bd",
            fill: false,
          }]
      },
      options: {
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              suggestedMin: 0, 
              suggestedMax: 100,
            }
          }],
          xAxes: [{
           ticks: {
                  display: false
           }
         }]
       },
       title: {
        display: true,
          text: 'Humidity Chart'
       }
    }
  });

  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});




