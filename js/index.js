// let deviceList = document.querySelector('#deviceList');
// let showBtn;

// function renderDevice(doc) {
//     let li = document.createElement('li');
//     let name = document.createElement('span');
//     let id = document.createElement('span');
//     let btn = document.createElement('button');

//     li.setAttribute('data-id', doc.id);
//     btn.setAttribute('data-id', doc.id);
//     btn.setAttribute('class', 'showBtn');

    
//     id.innerHTML = " --- ID: <strong>" + doc.data().id + "</strong>";
//     name.innerHTML = "Name: <strong>" + doc.data().name + "</strong>";
//     btn.innerHTML = "Show"

//     li.appendChild(name);
//     li.appendChild(id);
//     li.appendChild(btn);

//     deviceList.appendChild(li);
// };

// function displayDevices() {
//     db.collection("devices").orderBy("id", "asc").get().then(device => {
//         device.docs.forEach(doc => {
//             console.log(doc.data());
//             renderDevice(doc);
//         });
//     });
// };

// function handleShowBtn() {
//     setTimeout(function() {
//         showBtn = document.querySelectorAll('.showBtn');
//         for (var i = 0; i < showBtn.length; i++) {
//             showBtn[i].onclick = function() {
//                 var index = this.getAttribute('data-id');
//                 window.location = '/player_detail?username=' + index;
//             };
//         };
//     }, 1000);
// };

// displayDevices();
// handleShowBtn();
//let pDev = document.getElementById('devices_srt');
/*var devObj;
const dbRef = firebase.database().ref();
dbRef.child("devices_sensor").get().then((snapshot) => {
  if (snapshot.exists()) {
    devObj = snapshot.val();
    //console.log(devObj);
    snapshot.forEach(function(D01){
          var val = D01.val();
          console.log(D01.val());
          console.log(val.tempereture);           
    });
    //for (x in devObj.D01) {
      //console.log(devObj);
	//console.log(snapshot.val().humidity[x]);
        //console.log("title",snapshot.key);
    //}
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});*/

var database = firebase.database();
database.ref("devices_sensor").once('child_added', function(snapshot){
      if(snapshot.exists()){
          
          //console.log(snapshot.val().D01); 
          snapshot.forEach(function(D01){
              var val = D01.val();
              //console.log("row",D01.val());
              console.log(val.humidity);       
          });
          //var theDiv = document.getElementById("ex-table");
          //theDiv.innerHTML += content; 
          //$('#ex-table').append(content);
      }
});
