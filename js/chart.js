

dbRef.child("devices_sensor").get().then((snapshot) => {
  if (snapshot.exists()) {
    let deviObj = snapshot.val();
    let num_of_devi;

    // Get Number of device connected
    num_of_devi = Object.keys(deviObj).length;
    //console.log('All Devices:' + num_of_devi);
    //document.getElementById('allDevices').innerText = num_of_devi + " devices";

    // Get the lastest time (of D02)
    n = Object.keys(deviObj.D02).length;
    last_element = Object.keys(deviObj.D02)[n-1];
    last_time = deviObj.D02[last_element].timeUpdate.timestamp;
   // document.getElementById('lastTime').innerText = last_time;
    let tem_aryD02 = [];
    let tem_aryD01 = [];
    // Get all devices info and display it
    let i = 0;
    for (d in deviObj.D01) {
      n_sampling = Object.keys(deviObj.D01).length;
      all_samp = Object.keys(deviObj.D01)[i]; //Object.keys(deviObj[d])[100];
      //last_samp = Object.keys(deviObj[d])[n_sampling-1]; //Object.keys(deviObj[d])[100];
      i += 1
      tem_aryD01.push(deviObj.D01[all_samp].temperature);
      /*
      let d_name = deviObj[d][last_samp].deviceNameID;
      let humi = deviObj[d][last_samp].humidity;
      let humi_try = deviObj[d][last_samp].humidity;
      console.log("I " + humi_try);
      let temp = deviObj[d][last_samp].temperature;
      console.log(d_name + ': ' + humi + ', ' + temp);

      //let devi_info = document.createElement('div');
      //devi_info.setAttribute('class', 'devi-block');*/
    }
    i = 0;
    for (d in deviObj.D02) {
      
      n_sampling = Object.keys(deviObj.D02).length;
      all_samp = Object.keys(deviObj.D02)[i]; 
      i += 1
      tem_aryD02.push(deviObj.D02[all_samp].temperature);
    }
    //console.log(tem_ary);
    
      var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
          
            type: 'line',
            data: {
              labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
              datasets: [{ 
                  data: tem_aryD01,
                  label: "D01",
                  borderColor: "#3e95cd",
                  backgroundColor: "#7bb6dd",
                  fill: false,
                }, { 
                  data: tem_aryD02,
                  label: "D02",
                  borderColor: "#3cba9f",
                  backgroundColor: "#71d1bd",
                  fill: false,
                }/*, { 
                  data: [10,21,60,44,17,21,17],
                  label: "Pending",
                  borderColor: "#ffa500",
                  backgroundColor:"#ffc04d",
                  fill: false,
                }, { 
                  data: [6,3,2,2,7,0,16],
                  label: "Rejected",
                  borderColor: "#c45850",
                  backgroundColor:"#d78f89",
                  fill: false,
                }*/
              ]
            },
          });
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});


function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}


