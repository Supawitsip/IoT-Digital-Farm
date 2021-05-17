const dbRef = firebase.database().ref();
const db_devices = "device_key";
const db_devices_data = "devices_sensor";

var deviObj;
let num_of_devi;

function initialLoad() {
  dbRef.child(db_devices).get().then((snapshot) => {
    if (snapshot.exists()) {
      deviObj = snapshot.val();
      console.log(deviObj);
      
      displayLoaded();
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}


function displayLoaded() {
  // Get Number of device connected
  num_of_devi = Object.keys(deviObj).length;
  console.log('All Devices:' + num_of_devi);
  document.getElementById('allDevices').innerText = num_of_devi + " devices";

  // Display current time
  console.log(getLocalCurrentTime());
  document.getElementById('lastTime').innerText = getLocalCurrentTime();

  // Get all devices info and display it
  renderDevices();
  // Handler when click a device
  deviceClickHandler()
  // Can delete device
  deleteDevice();
}

function deviceClickHandler() {
  // Add event listener to device-block
  var deviName = document.querySelectorAll('.device-name');
  for (clicked of deviName) {
    clicked.addEventListener('click', function() {
        let thisName = this.getAttribute("dname");
        //Save devices data to Local Storage
        dbRef.child(db_devices_data).child(thisName).get().then((snapshot) => {
          localStorage.setItem('deviceObject', JSON.stringify(snapshot.val()));
          location.href=`/report.html?device=${thisName}`;
        });
    });
  };
}
  

function deleteDevice() {
  // Delete device
  var delBtn = document.querySelectorAll('.delBtn');
  for (clicked of delBtn) {
    clicked.addEventListener('click', function() {
        let dname = this.getAttribute("dname");
        let conf = confirm(`Are you sure you want to remove ${dname}?`);
        if (conf == true) {
          dbRef.child("device_key").child(dname).remove().catch((error) => {
            console.error(error);
          });
          dbRef.child("devices_sensor").child(dname).remove().catch((error) => {
            console.error(error);
          });
          alert(`Remove ${dname} successfully`);
          location.reload(true);;
        }
    });
  };
}

function renderDevices() {
  let i = 0;
  for (d in deviObj) {
    console.log(i);
    i++
    n_sampling = Object.keys(deviObj[d]).length;
    last_samp = Object.keys(deviObj[d])[n_sampling-1];
    let d_name = deviObj[d][last_samp].deviceNameID;
    let humi = deviObj[d][last_samp].humidity;
    let temp = deviObj[d][last_samp].temperature;
    console.log(d_name + ' sampling: ' + n_sampling);
    console.log(d_name + ': ' + temp + ', ' + humi);

    let devi_info = document.createElement('div');
    devi_info.setAttribute('class', 'devi-block');
    devi_info.innerHTML = 
                        `<div class="devi-head">
                          <i class="fas fa-laptop-code"></i>
                          <div class="device-name" dname="${d_name}">${d_name}</div>
                          <i class="fas fa-trash-alt delBtn" dname="${d_name}"></i>
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
                        </div>`;
    document.getElementById("devices-con").appendChild(devi_info);
  };
}

function getLocalCurrentTime() {
// Get now time
  let date = new Date();
  let currentDateTime = date.getDate().toString().padStart(2, "0")+
      "/"+((date.getMonth()+1).toString().padStart(2, "0"))+
      "/"+date.getFullYear()+
      " "+date.getHours().toString().padStart(2, "0")+
      ":"+date.getMinutes().toString().padStart(2, "0")+
      ":"+date.getSeconds().toString().padStart(2, "0");
  return currentDateTime;
}

//////////////////////////////////Start Function
initialLoad();