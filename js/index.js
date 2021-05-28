const dbRef = firebase.database().ref();
const db_devices = "device_key";
const db_devices_data = "devices_sensor";

var deviObj;
let num_of_devi;

// when database update this code will be triggered 
dbRef.child(db_devices).on('child_changed', (snapshot) => {
  let deviceInfo = snapshot.val();
  // check if the device is exist 
  if (document.getElementById(`dtemp_${deviceInfo.key}`)) {
    document.getElementById(`dtemp_${deviceInfo.key}`).innerHTML = `<i class="fas fa-thermometer-half"></i>${deviceInfo.te} °C`;
    document.getElementById(`dhumi_${deviceInfo.key}`).innerHTML = `<i class="fas fa-tint"></i>${deviceInfo.h} %`;
  } else {
    location.reload(true);
  }
});

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
  viewCounter();
  // Get Number of device connected
  num_of_devi = Object.keys(deviObj).length;
  console.log('All Devices:' + num_of_devi);
  document.getElementById('allDevices').innerText = num_of_devi + " devices";

  // Display current time
  console.log(getLocalCurrentTime());
  //document.getElementById('lastTime').innerText = getLocalCurrentTime();
  setInterval(function(){
    document.getElementById("lastTime").innerHTML = getLocalCurrentTime();
  }, 1000);
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
        dbRef.child(db_devices_data).child(thisName).limitToLast(50000).get().then((snapshot) => {
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
        let conf = prompt(`Please enter the password for confirming the removal of ${dname}.`);
        let checking = 1026899268;
        if (conf != null) {
          if (conf.hashCode() == checking) {
            dbRef.child("device_key").child(dname).remove().catch((error) => {
              console.error(error);
            });
            dbRef.child("devices_sensor").child(dname).remove().catch((error) => {
              console.error(error);
            });
            alert(`Remove ${dname} successfully`);
            location.reload(true);
          } else {
            alert(`Error: wrong password!`);
          }
        }
    });
  };
}

function renderDevices() {
  let i = 0;
  for (d in deviObj) {
    i++
    // n_sampling = Object.keys(deviObj[d]).length;
    // last_samp = Object.keys(deviObj[d])[n_sampling-1];
    let d_name = deviObj[d].key;
    let humi = deviObj[d].h;
    let temp = deviObj[d].te;
    // console.log(d_name + ' sampling: ' + n_sampling);
    // console.log(d_name + ': ' + temp + ', ' + humi);

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
                            <p class="temp" id="dtemp_${d_name}"><i class="fas fa-thermometer-half"></i>${temp} °C</p>
                          </div>
                        </div>
                        <div class="humi-con">
                          <div class="humi-text">
                            <p class="humi-title">Humidity</p>
                            <p class="humi" id="dhumi_${d_name}"><i class="fas fa-tint"></i>${humi} %</p>
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

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

//const firestore_db = firebase.firestore();
function viewCounter() {
  // for realtime database
  dbRef.child("counter").get().then((snapshot) => {
    let counter = snapshot.val();
    let viewed = counter.view + 1;
    let downloaded = counter.graph_download + counter.pdf_download + counter.excel_download;
    dbRef.child("counter").update({ view: viewed });
    document.getElementById('view-counter').innerText = viewed;
    document.getElementById('download-counter').innerText = downloaded;
  });
  
  // for firebase database
  // let docRef = firestore_db.collection('view_counter').doc('DyePhHD4DbEQ6iQUFFdm');
  // docRef.get().then((doc) => {
  //   let viewed = doc.data().viewed + 1;
  //   let downloaded = doc.data().data_pdf_downloaded + doc.data().data_xlsx_downloaded + doc.data().graph_downloaded;
  //   docRef.update({
  //     viewed: viewed
  //   });
  //   document.getElementById('view-counter').innerText = viewed;
  //   document.getElementById('download-counter').innerText = downloaded;
  // })
}

//////////////////////////////////Start Function
initialLoad();