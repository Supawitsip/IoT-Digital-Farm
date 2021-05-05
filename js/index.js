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
let pDev = document.getElementById('devices');
const dbRef = firebase.database().ref();
dbRef.child("devices").get().then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
    pDev.innerText = JSON.stringify((snapshot.val()), null, 1);
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
