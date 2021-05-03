let deviceList = document.querySelector('#deviceList');

function renderDevice(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let id = document.createElement('span');

    li.setAttribute('data-id', doc.id);
    id.innerHTML = " --- ID: <strong>" + doc.data().id + "</strong>";
    name.innerHTML = "Name: <strong>" + doc.data().name + "</strong>";

    li.appendChild(name);
    li.appendChild(id);

    deviceList.appendChild(li);
}
;
db.collection("devices").orderBy("id", "asc").get().then(device => {
    device.docs.forEach(doc => {
        console.log(doc.data());
        renderDevice(doc);
    })
});