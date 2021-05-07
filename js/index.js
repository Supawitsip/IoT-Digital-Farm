const dbRef = firebase.database().ref();
dbRef.child("devices_sensor").get().then((snapshot) => {
  if (snapshot.exists()) {
    let deviObj = snapshot.val();
    let num_of_devi;

    // Get Number of device connected
    num_of_devi = Object.keys(deviObj).length;
    console.log('All Devices:' + num_of_devi);
    document.getElementById('allDevices').innerText = num_of_devi + " devices";

    // Get the lastest time (of D02)
    let date = new Date();
    let currentDateTime = date.getDate()+
          "/"+(date.getMonth()+1)+
          "/"+date.getFullYear()+
          " "+date.getHours()+
          ":"+date.getMinutes()+
          ":"+date.getSeconds();
    console.log(currentDateTime);
    document.getElementById('lastTime').innerText = currentDateTime;

    // Get all devices info and display it
    for (d in deviObj) {
      n_sampling = Object.keys(deviObj[d]).length;
      last_samp = Object.keys(deviObj[d])[n_sampling-1];
      console.log(n_sampling);
      let d_name = deviObj[d][last_samp].deviceNameID;
      let humi = deviObj[d][last_samp].humidity;
      let temp = deviObj[d][last_samp].temperature;
      console.log(d_name + ': ' + temp + ', ' + humi);

      let devi_info = document.createElement('div');
      devi_info.setAttribute('class', 'devi-block');
      devi_info.setAttribute('name', d_name);
      devi_info.innerHTML = 
                          `<div class="devi-head">
                            <i class="fas fa-laptop-code"></i>
                            <div>${d_name}</div>
                          </div>
                          <div class="temp-con">
                            <div class="temp-text">
                              <p class="temp-title">Temperature</p>
                              <p class="temp"><i class="fas fa-thermometer-half"></i>${temp} °C</p>
                            </div>
                          </div>
                          <div class="humi-con">
                            <div class="humi-text">
                              <p class="humi-title">Humidity</p>
                              <p class="humi"><i class="fas fa-tint"></i>${humi} %</p>
                            </div>
                          </div>`
      document.getElementById("devices-con").appendChild(devi_info);
      
    };

    // Add event listener to device-block
    var deviBlock = document.querySelectorAll('.devi-block');
    console.log(deviBlock);
    for (clicked of deviBlock) {
      clicked.addEventListener('click', function() {
          let thisName = this.getAttribute("name");
          location.href=`/report.html?device=${thisName}`;
      });
  };

  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

