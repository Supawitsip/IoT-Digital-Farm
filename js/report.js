const dbRef = firebase.database().ref();
let db_devices = "devices_sensor"
let device = "D02";
dbRef.child(db_devices).child(device).get().then((snapshot) => {
    if (snapshot.exists()) {
        let deviObj = snapshot.val();
        n_sampling = Object.keys(deviObj).length;
        last_samp = Object.keys(deviObj)[n_sampling-1];
        console.log("Number of sampling: " + n_sampling);
        console.log("Last sampling key: " + last_samp);

        // Display device info
        document.getElementById("device").innerText = deviObj[last_samp].deviceNameID;
        document.getElementById("dName").innerText = deviObj[last_samp].deviceNameID;
        document.getElementById("lastTime").innerText = deviObj[last_samp].timestamp;
        document.querySelector(".temp").innerHTML = `<i class="fas fa-thermometer-half"></i>${deviObj[last_samp].temperature} °C`;
        document.querySelector(".humi").innerHTML = `<i class="fas fa-tint"></i>${deviObj[last_samp].humidity} %`;

        // Create data collection table
        let no = 0; //for count No. in the table
        Object.keys(deviObj).forEach(element => {
            no++;
            let col = 4; //column head number
            let dname = deviObj[element].deviceNameID;
            let dtemp = deviObj[element].temperature;
            let dhumi = deviObj[element].humidity;
            let dtime = deviObj[element].timestamp;
            let row = document.createElement('tr');
            let num = document.createElement('td');
            num.innerText = no;
            row.appendChild(num);
            let td_list = [dname, dtime, dtemp, dhumi]
            for (i = 0; i < col; i++) {
                let td = document.createElement('td');
                td.innerText = td_list[i];
                row.appendChild(td);
            }
            document.getElementById('table2excel').appendChild(row);
        });


    } else {
        console.log("No data available")
    }
}).catch((error) => {
  console.error(error);
});