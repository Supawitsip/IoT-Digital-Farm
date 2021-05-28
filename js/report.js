const dbRef = firebase.database().ref();

//Get url parameter (the device name)
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const device = urlParams.get('device');

let deviceObj;
let n_sampling;
let last_samp;
let first_samp;
let all_tem_data;
let  day_all_humi_data 

function initialLoad() {
    deviceObj = JSON.parse(localStorage.getItem('deviceObject'));
    //console.log(deviceObj)

    n_sampling = Object.keys(deviceObj).length;
    last_samp = Object.keys(deviceObj)[n_sampling-1];
    first_samp = Object.keys(deviceObj)[0];
    console.log(n_sampling);

    displayDeviceInfo();
    firstLoad();
}

// when database update this code will be triggered 
// dbRef.child("device_key").child("test 1").on('child_changed', (snapshot) => {
//   let deviceInfo = snapshot.val();
//  // console.log(snapshot.ref.parent.key + ": " + snapshot.key + ": " + deviceInfo);
//   if (deviceInfo.key === device) {
//     let date = new Date();
let firstAdded = false;
dbRef.child("devices_sensor").child(device).limitToLast(1).on('child_added', (snapshot) => {
  if (firstAdded) {
    let deviceInfo = snapshot.val();
    let date = new Date(deviceInfo.ti);
    lastDateTime = readableTime(date);
    document.getElementById("lastTime").innerText = lastDateTime;
    document.querySelector(".temp").innerHTML = `<i class="fas fa-thermometer-half"></i>${deviceInfo.te} °C`;
    document.querySelector(".humi").innerHTML = `<i class="fas fa-tint"></i>${deviceInfo.h} %`;
    let update = [lastDateTime, deviceInfo.ti, deviceInfo.te, deviceInfo.h];
    localStorage.setItem('updatingDevice', update);

    deviceObj[deviceInfo.ti] = {h: deviceInfo.h, te: deviceInfo.te, ti: deviceInfo.ti};
    localStorage.setItem('deviceObject', JSON.stringify(deviceObj));
    console.log(deviceObj[deviceInfo.ti]);
    //myChart.update();
    //chart.update();
  } else {
    firstAdded = true;
  }
});

function displayDeviceInfo() {
    console.log("Number of sampling: " + n_sampling);
    console.log("Last sampling key: " + last_samp);

    // Display device info
    document.getElementById("device").innerText = device;
    document.getElementById("dName").innerText = device;
    document.getElementById("header-excel").innerText = device;

    // Convert timestamp to readable
    let timestamp = (deviceObj[last_samp].ti)/1000;
    let ltimestamp = timestamp;
    let date = new Date(timestamp * 1000);
    lastDateTime = readableTime(date);
    timestamp = (deviceObj[first_samp].ti)/1000;
    date = new Date(timestamp * 1000);
    firstDateTime = readableTime(date);

    // check the latest time's data  
    let update = localStorage.getItem('updatingDevice');
    if (update != null && parseInt(update.split(',')[1]) > (ltimestamp*1000)) {
      update = update.split(',');
      document.getElementById("lastTime").innerText = update[0];
      document.querySelector(".temp").innerHTML = `<i class="fas fa-thermometer-half"></i>${update[2]} °C`;
      document.querySelector(".humi").innerHTML = `<i class="fas fa-tint"></i>${update[3]} %`;
    } else {
      document.getElementById("lastTime").innerText = lastDateTime;
      document.querySelector(".temp").innerHTML = `<i class="fas fa-thermometer-half"></i>${deviceObj[last_samp].te} °C`;
      document.querySelector(".humi").innerHTML = `<i class="fas fa-tint"></i>${deviceObj[last_samp].h} %`;
    }
}

// Convert timestamp to readable
function readableTime(time) {
    readable = time.getDate().toString().padStart(2, "0")+
        "/"+((time.getMonth()+1).toString().padStart(2, "0"))+
        "/"+time.getFullYear()+
        " "+time.getHours().toString().padStart(2, "0")+
        ":"+time.getMinutes().toString().padStart(2, "0")+
        ":"+time.getSeconds().toString().padStart(2, "0");
    return readable;
}

// Export data table from HTML to PDF 
function exportTable2pdf() {  
    // let tbody = document.getElementById('tbl-body');
    // for (i=0; i < tbody.rows.length; i++){
    //     tbody.childNodes[i].style.display = "";
    // }
    let doc = new jsPDF('p', 'pt', 'a4');  
    let htmlstring = '';  
    let tempVarToCheckPageHeight = 0;  
    let pageHeight = 0;  
    pageHeight = doc.internal.pageSize.height;  
    specialElementHandlers = {  
        // element with id of "bypass" - jQuery style selector  
        '#bypassme': function(element, renderer) {  
            // true = "handled elsewhere, bypass text extraction"  
            return true  
        }  
    };  
    margins = {  
        top: 150,  
        bottom: 60,  
        left: 40,  
        right: 40,  
        width: 600  
    };  
    let y = 20;  
    doc.setLineWidth(2);  
    doc.setFontSize(16);
    doc.text(290, y = y + 18, `${device}`);  
    doc.setFontSize(12);
    doc.text(150, y = y + 20, `Start: ${firstDateTime}, End: ${lastDateTime}`); 
    doc.autoTable({  
        // includeHiddenHtml: true,
        html: '#table2excel',  
        startY: 70,  
        theme: 'grid', 
        headStyles: {   
            halign: 'center',
            fontStyle: 'bold',
            fillColor: [151, 151, 151],
        },
        columnStyles: {  
            0: {  //No.
                cellWidth: 60, 
                halign: 'center', 
            },   
            2: {  //Date and Time
                cellWidth: 150,  
            },
            3: {  //Temperature
                cellWidth: 100,  
                halign: 'center', 
            },
            4: {  //Humidity
                cellWidth: 100,  
                halign: 'center', 
            }   
        },  
        styles: {  
            minCellHeight: 10  
        }  
    })  
    doc.save('data-report.pdf'); 
    downloadedCounter(0, 1, 0);
}  

// Export data table from HTML to excel (xlsx file) 
function exportTable2excel() {
  document.getElementById('time-excel').innerText = `Start: ${firstDateTime}, End: ${lastDateTime}`;
  let table = document.querySelector("#table2excel");
      TableToExcel.convert(table, {
      name: "data-report.xlsx",
      sheet: {
          name: "Sheet 1"
      }
  });
  downloadedCounter(0, 0, 1)
}

// Export Graph to PDF file
function exportGraph2pdf() {
    // get size of report page
    let reportPageHeight = $('#reportPage').innerHeight();
    let reportPageWidth = $('#reportPage').innerWidth();

    let checkChart2 = document.getElementById('compareChartCon');
    
    // create a new canvas object that we will populate with all other canvas objects
    let pdfCanvas = $('<canvas />').attr({
      id: "canvaspdf",
      width: reportPageWidth,
      height: reportPageHeight
    });
    let pdfCanvas2 = $('<canvas />').attr({
      id: "canvaspdf",
      width: reportPageWidth,
      height: reportPageHeight
    });
    
    // Main chart canvas
    // keep track canvas position
    let pdfctx = $(pdfCanvas)[0].getContext('2d');
    let pdfctxX = 0;
    let pdfctxY = 0;
    let buffer = 100;
    // make canvas BG is white
    pdfctx.fillStyle = "white";
    pdfctx.fillRect(0, 0, 1200, 800);
    $("#temperatureChart").each(function(index) {
      // get the chart height/width
      let canvasHeight = $(this).innerHeight();
      let canvasWidth = $(this).innerWidth();
      
      
      // reduce size of img chart
      canvasHeight = canvasHeight*90/100;
      canvasWidth = canvasWidth*90/100;
      
      // draw the chart into the new canvas
      
      pdfctx.drawImage($(this)[0], pdfctxX, pdfctxY, canvasWidth, canvasHeight);
      pdfctxX += canvasWidth + buffer;
      
      // our report page is in a grid pattern so replicate that in the new canvas
      if (index % 2 === 1) {
        pdfctxX = 0;
        pdfctxY += canvasHeight + buffer;
      }
    });

    if (checkChart2.style.display != "none") {
      // Comparing chart canvas
      // keep track canvas position
      let pdfComctx = $(pdfCanvas2)[0].getContext('2d');
      let pdfComctxX = 0;
      let pdfComctxY = 0;
      // make canvas BG is white
      pdfComctx.fillStyle = "white";
      pdfComctx.fillRect(0, 0, 1200, 800);
      // for comparing chart
      $("#compareChart").each(function(index) {
        // get the chart height/width
        let canvasHeight = $(this).innerHeight();
        let canvasWidth = $(this).innerWidth();
        
        
        // reduce size of img chart
        canvasHeight = canvasHeight*89/100;
        canvasWidth = canvasWidth*89/100;
        
        // draw the chart into the new canvas
        
        pdfComctx.drawImage($(this)[0], pdfComctxX, pdfComctxY, canvasWidth, canvasHeight);
        pdfComctxX += canvasWidth + buffer;
        
        // our report page is in a grid pattern so replicate that in the new canvas
        if (index % 2 === 1) {
          pdfComctxX = 0;
          pdfComctxY += canvasHeight + buffer;
        }
      });
    }
    
    // create new pdf and add our new canvas as an image
    let pdf = new jsPDF('landscape');
    pdf.setFontSize(20)
    pdf.text(140, 15, `${device}`)
    pdf.addImage($(pdfCanvas)[0], 'PNG', 12, 25);

    if (checkChart2.style.display != "none") {
      pdf.addPage();
      pdf.addImage($(pdfCanvas2)[0], 'PNG', 12, 25);
    }
    // download the pdf
    pdf.save('graph-report.pdf');
    downloadedCounter(1, 0, 0);
}

//const firestore_db = firebase.firestore();

function downloadedCounter(graph, pdf, excel) {
  dbRef.child("counter").get().then((snapshot) => {
    let counter = snapshot.val();
    let graph_downloaded = counter.graph_download + graph;
    let data_downloaded = counter.pdf_download + pdf;
    let excel_downloaded = counter.excel_download + excel;
    dbRef.child("counter").update({ graph_download: graph_downloaded, pdf_download: data_downloaded, excel_download: excel_downloaded});
  });
  // let docRef = firestore_db.collection('view_counter').doc('DyePhHD4DbEQ6iQUFFdm');
  // docRef.get().then((doc) => {
  //   let graph_downloaded = doc.data().graph_downloaded + graph;
  //   let data_downloaded = doc.data().data_pdf_downloaded + pdf;
  //   let excel_downloaded = doc.data().data_xlsx_downloaded + excel;
  //   docRef.update({
  //     graph_downloaded: graph_downloaded,
  //     data_pdf_downloaded: data_downloaded,
  //     data_xlsx_downloaded: excel_downloaded
  //   });
  // });
}


let label;
let humi_data;
let tem_data;
let myChart;
let compareChart;

let day_compareGraph = []; 

let date_label;
let day_all_data;

let date_data1_D_tranfer;
let date_data7_D_tranfer;
let date_data30_D_tranfer;
let date_data_all_D_tranfer;

let temp_data1_D;
let date_data1_D;
let humi_data1_D;

let temp_data7_D;
let date_data7_D;
let humi_data7_D;

let temp_data30_D;
let date_data30_D;
let humi_data30_D;

let temp_data_all_D;
let date_data_all_D;
let humi_data_all_D;

let date_carlendar_D;
let humi_carlendar_D;
let temp_carlendar_D;

let day_in_week;
let day1440;

let maxTicksLimitX = 24;
let maxTicksLimitY = 12;
let font_x_size = 16;
let font_y_size = 16;
let test;

let firstDateTime;
let lastDateTime;

let test_all = [];
let deviObj = {};

let corlor_7_day = ["#8342AF", "#03A9F4", "#FF5722", "#A0522D", "#7FFF00", "#4169E1", "#F50057"]

if (document.documentElement.clientWidth < 900) {
  //myChart.options.scales.yAxes[0].ticks.maxTicksLimit = 6;
  //myChart.options.scales.yAxes[1].ticks.maxTicksLimit = 6;
  maxTicksLimitX = 12;
  maxTicksLimitY = 5;
  font_x_size = 10;
  font_y_size = 10;
}

function firstLoad() {
    let deObj = deviceObj;
    deviObj = Object.values(deObj);
    secondLoad();
}

function secondLoad() {
  temp_data1_D = [];
  date_data1_D = [];
  humi_data1_D = [];
  temp_data7_D = [];
  date_data7_D = [];
  humi_data7_D = [];
  temp_data30_D = [];
  date_data30_D = [];
  humi_data30_D = [];
  temp_data_all_D = [];
  date_data_all_D = [];
  humi_data_all_D = [];
  date_data1_D_tranfer = [];
  date_data7_D_tranfer = [];
  date_data30_D_tranfer = [];
  date_data_all_D_tranfer = [];
  let i = 0;
  console.log('name: ' + device);
  n_sampling = Object.keys(deviObj).length;
  let day_samling = n_sampling - 1440;
  let week_sampling = n_sampling - 10080;
  let month_sampling = n_sampling - 43200;
  for (d in deviObj) {
    let timestamp = deviObj[d].ti;
    let date = new Date(timestamp);
    let currentDateTimeDevice = date.getDate().toString().padStart(2, "0") +
      "/" + ((date.getMonth() + 1).toString().padStart(2, "0")) +
      "/" + date.getFullYear() +
      " " + date.getHours().toString().padStart(2, "0") +
      ":" + date.getMinutes().toString().padStart(2, "0") +
      ":" + date.getSeconds().toString().padStart(2, "0");
    i++
    if (i >= day_samling) {

      temp_data1_D.push(deviObj[d].te);
      date_data1_D_tranfer.push(currentDateTimeDevice);
      date_data1_D.push(date);
      humi_data1_D.push(deviObj[d].h);

      temp_data7_D.push(deviObj[d].te);
      date_data7_D_tranfer.push(currentDateTimeDevice);
      date_data7_D.push(date);
      humi_data7_D.push(deviObj[d].h);

      temp_data30_D.push(deviObj[d].te);
      date_data30_D_tranfer.push(currentDateTimeDevice);
      date_data30_D.push(date);
      humi_data30_D.push(deviObj[d].h);

      // temp_data_all_D.push(deviObj[d].te);
      // date_data_all_D_tranfer.push(currentDateTimeDevice);
      // date_data_all_D.push(date);
      // humi_data_all_D.push(deviObj[d].h);

    } else if (i >= week_sampling) {
      temp_data7_D.push(deviObj[d].te);
      date_data7_D_tranfer.push(currentDateTimeDevice);
      date_data7_D.push(date);
      humi_data7_D.push(deviObj[d].h);

      temp_data30_D.push(deviObj[d].te);
      date_data30_D_tranfer.push(currentDateTimeDevice);
      date_data30_D.push(date);
      humi_data30_D.push(deviObj[d].h);

      // temp_data_all_D.push(deviObj[d].te);
      // date_data_all_D_tranfer.push(currentDateTimeDevice);
      // date_data_all_D.push(date);
      // humi_data_all_D.push(deviObj[d].h);

    } else if (i >= month_sampling) {
      temp_data30_D.push(deviObj[d].te);
      date_data30_D_tranfer.push(currentDateTimeDevice);
      date_data30_D.push(date);
      humi_data30_D.push(deviObj[d].h);

      // temp_data_all_D.push(deviObj[d].te);
      // date_data_all_D_tranfer.push(currentDateTimeDevice);
      // date_data_all_D.push(date);
      // humi_data_all_D.push(deviObj[d].h);
    } else {
      // temp_data_all_D.push(deviObj[d].te);
      // date_data_all_D_tranfer.push(currentDateTimeDevice);
      // date_data_all_D.push(date);
      // humi_data_all_D.push(deviObj[d].h);
    }

    /* if (i > 129600) {
       console.log("Some of the data was older than 3 months, so it has been deleted.");
       dbRef.child("devices_sensor").child(device).child(d).remove();
     }*/
  }
  label = date_data30_D;
  tem_data = temp_data30_D;
  humi_data = humi_data30_D;
  document.getElementById('date_from').value = ChangeFormateDateV2(date_data30_D_tranfer[0].toString().substring(0, 10));
  document.getElementById('date_to').value = ChangeFormateDateV2(date_data1_D_tranfer[date_data1_D_tranfer.length - 1].toString().substring(0, 10));
  //new Date().toLocaleDateString('en-CA');
  document.getElementById('date_now').value = ChangeFormateDateV2(date_data7_D_tranfer[date_data7_D_tranfer.length - 1].toString().substring(0, 10));
  //document.getElementById('date_now').value = ChangeFormateDateV2(date_data7_D_tranfer[date_data7_D_tranfer.length - 1440].toString().substring(0, 10));
  //new Date(new Date().getTime() - 86400000).toLocaleDateString('en-CA');
  document.getElementById('tbl_from').value = ChangeFormateDateV2(date_data7_D_tranfer[date_data7_D_tranfer.length - 1].toString().substring(0, 10));
  //new Date().toLocaleDateString('en-CA');
  document.getElementById('tbl_to').value = ChangeFormateDateV2(date_data7_D_tranfer[date_data7_D_tranfer.length - 1].toString().substring(0, 10));
  //new Date().toLocaleDateString('en-CA');
  getTableRange();
  mainChat();
  compareGraph();
  //compareChartHumi();
  //compareChart.update();
}



////////////////////////////////////////////////////////////////////////////////
function mainChat() {
  let ctx = document.getElementById('temperatureChart').getContext('2d');
  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: label,
      datasets: [{
        data: tem_data,
        label: 'Temperature',
        indexLabelFontSize: 10,
        borderColor: "#ec7777",
        backgroundColor: "#ec7777",
        fill: false,
        yAxisID: 'A',
        pointRadius: 0,
        borderWidth: 3,
        tension: 0
      }, {
        data: humi_data,
        label: 'Humidity',
        borderColor: "#5f5ff1",
        backgroundColor: "#5f5ff1",
        fill: false,
        yAxisID: 'B',
        pointRadius: 0,
        borderWidth: 3,
        tension: 0
        //borderWidth: .00001
      }]
    },
    options: {
      /*pan: {
        enabled: true,
        mode: 'x',
        speed: 20,
      },*/
      zoom: {
        enabled: true,
        drag: {
          borderColor: 'rgba(225,225,225,0.3)',
          borderWidth: 5,
          backgroundColor: 'rgb(225,225,225)',
          animationDuration: 0
        },
        mode: 'x',
        /* limits: {
           max: 10,
           min: 0.
         }*/
      },
      tooltips: {
        mode: 'index',
        intersect: false
      },
      hover: {
        mode: 'index',
        intersect: false
      },
      responsive: true,
      scales: {
        yAxes: [{
          id: 'A',
          type: 'linear',
          position: 'left',
          ticks: {
            suggestedMin: 10,
            suggestedMax: 50,
            maxTicksLimit: maxTicksLimitY,
            fontSize: font_y_size, //10
            min: 10
          },
          scaleLabel: {
            display: true,
            labelString: 'Temperature (°C)',
            fontSize: font_y_size
          },
        }, {
          id: 'B',
          type: 'linear',
          position: 'right',
          ticks: {
            suggestedMin: 20,
            suggestedMax: 100,
            maxTicksLimit: maxTicksLimitY,
            fontSize: font_y_size,
            min: 20
          },
          scaleLabel: {
            display: true,
            labelString: 'Humidity (%RH)',
            fontSize: font_y_size
          }
        }],
        xAxes: [{
          type: 'time',
          time: {
            unit: 'hour',
            stepSize: 1,  //I'm using 3 hour intervals here
            tooltipFormat: 'HH:mm:ss DD/MM/YYYY',
            parser: 'HH:mm:ss', //these formatting values do nothing, I've tried a few different ones
            //: 'second', //I have tried minutes and hours too, same result
            displayFormats: {
              /*millisecond: 'HH:mm:ss', //I have tried without the 'a' too, same result
              second: 'HH:mm:ss',
              minute: 'HH:mm:ss',
              hour: 'HH:mm',
              day: 'HH:mm',
              'week': 'HH:mm:ss a',
              'month': 'HH:mm:ss a',
              'quarter': 'HH:mm:ss a',
              'year': 'HH:mm:ss a',*/
              hour: 'HH:mm'
            }
          },
          ticks: {
            source: 'auto',
            major: {
              enabled: true, // <-- This is the key line
              fontStyle: 'bold', //You can also style these values differently
              fontSize: 14 //You can also style these values differently
            },
            //autoSkip: true,
            //fontSize: font_x_size
            //,maxTicksLimit: maxTicksLimitX,
          },
        }]
      },
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////
function getPastelColor(){ 
  return "hsl(" + 360 * Math.random() + ',' +
              (35 + 50 * Math.random()) + '%,' + 
              (65 + 10 * Math.random()) + '%)';
}
//click for change grapt
function allData() {

  let dayBtn = document.getElementById("dayDuration");
  let weekBtn = document.getElementById("weekDuration");
  let monthBtn = document.getElementById("monthDuration");
  let allBtn = document.getElementById("allDuration");
  allBtn.style.backgroundColor = "#E35F43";
  allBtn.style.color = "white";
  dayBtn.style.backgroundColor = "white";
  dayBtn.style.color = "#E35F43";
  weekBtn.style.backgroundColor = "white";
  weekBtn.style.color = "#E35F43";
  monthBtn.style.backgroundColor = "white";
  monthBtn.style.color = "#E35F43";

  //Check if data is more than 1 month sampling, get the data, if not, use the 1 month data instead
  if (n_sampling > 43200) {
    // Check if already get all data
    if (date_data_all_D.length === 0) {
      console.log('getting all data');
      //Get all data from realtime database
      dbRef.child("devices_sensor").child(device).get().then((snapshot) => {
        let all = snapshot.val();
        let all_sampling = Object.keys(all).length;
        console.log("All sampling: " + all_sampling);
        if (all_sampling > 129600) {
          console.log('There are some data that are older than 3 months which will be deleted.');
          let i = 0;
          let del_limit_first = all_sampling - 129600;
          for (d in all) {
            if (i < del_limit_first) {
              dbRef.child("devices_sensor").child(device).child(d).remove();
              i++;
            } else {
              let timestamp = all[d].ti;
              let date = new Date(timestamp);
              let currentDateTimeDevice = readableTime(date);
    
              temp_data_all_D.push(all[d].te);
              date_data_all_D_tranfer.push(currentDateTimeDevice);
              date_data_all_D.push(date);
              humi_data_all_D.push(all[d].h);
            }
          }
        } else {
          for (d in all) {
            let timestamp = all[d].ti;
            let date = new Date(timestamp);
            let currentDateTimeDevice = readableTime(date);
  
            temp_data_all_D.push(all[d].te);
            date_data_all_D_tranfer.push(currentDateTimeDevice);
            date_data_all_D.push(date);
            humi_data_all_D.push(all[d].h);
          }
        }
        document.getElementById('date_from').value = ChangeFormateDateV2(date_data_all_D_tranfer[0].toString().substring(0, 10));
        document.getElementById('date_to').value = ChangeFormateDateV2(date_data_all_D_tranfer[date_data_all_D_tranfer.length - 1].toString().substring(0, 10));
        myChart.data.datasets[0].data = temp_data_all_D;
        myChart.data.datasets[1].data = humi_data_all_D;
        myChart.data.labels = date_data_all_D;
        myChart.update();
        
      }).catch((error) => {
        console.error(error);
      });
    } else {
      console.log('using already loaded data');
      document.getElementById('date_from').value = ChangeFormateDateV2(date_data_all_D_tranfer[0].toString().substring(0, 10));
      document.getElementById('date_to').value = ChangeFormateDateV2(date_data_all_D_tranfer[date_data_all_D_tranfer.length - 1].toString().substring(0, 10));
      myChart.data.datasets[0].data = temp_data_all_D;
      myChart.data.datasets[1].data = humi_data_all_D;
      myChart.data.labels = date_data_all_D;
      myChart.update();
    }
    
  } else {
    console.log('still use 30D loaded data');
    myChart.data.datasets[0].data = temp_data30_D;
    myChart.data.datasets[1].data = humi_data30_D;
    myChart.data.labels = date_data30_D;
    myChart.update();
  }
}


function dayData() {
  let dayBtn = document.getElementById("dayDuration");
  let weekBtn = document.getElementById("weekDuration");
  let monthBtn = document.getElementById("monthDuration");
  let allBtn = document.getElementById("allDuration");
  dayBtn.style.backgroundColor = "#E35F43";
  dayBtn.style.color = "white";
  weekBtn.style.backgroundColor = "white";
  weekBtn.style.color = "#E35F43";
  monthBtn.style.backgroundColor = "white";
  monthBtn.style.color = "#E35F43";
  allBtn.style.backgroundColor = "white";
  allBtn.style.color = "#E35F43";

  document.getElementById('date_from').value = ChangeFormateDateV2(date_data1_D_tranfer[0].toString().substring(0, 10));
  document.getElementById('date_to').value = ChangeFormateDateV2(date_data1_D_tranfer[date_data1_D_tranfer.length - 1].toString().substring(0, 10));

  myChart.data.datasets[0].data = temp_data1_D;
  myChart.data.datasets[1].data = humi_data1_D;
  myChart.data.labels = date_data1_D;
  myChart.update();
}

function weekData() {
  let dayBtn = document.getElementById("dayDuration");
  let weekBtn = document.getElementById("weekDuration");
  let monthBtn = document.getElementById("monthDuration");
  let allBtn = document.getElementById("allDuration");
  weekBtn.style.backgroundColor = "#E35F43";
  weekBtn.style.color = "white";
  dayBtn.style.backgroundColor = "white";
  dayBtn.style.color = "#E35F43";
  monthBtn.style.backgroundColor = "white";
  monthBtn.style.color = "#E35F43";
  allBtn.style.backgroundColor = "white";
  allBtn.style.color = "#E35F43";

  document.getElementById('date_from').value = ChangeFormateDateV2(date_data7_D_tranfer[0].toString().substring(0, 10));
  document.getElementById('date_to').value = ChangeFormateDateV2(date_data7_D_tranfer[date_data7_D_tranfer.length - 1].toString().substring(0, 10));

  myChart.data.datasets[0].data = temp_data7_D;
  myChart.data.datasets[1].data = humi_data7_D;
  myChart.data.labels = date_data7_D;
  myChart.update();
  
}

function monthData() {
  let dayBtn = document.getElementById("dayDuration");
  let weekBtn = document.getElementById("weekDuration");
  let monthBtn = document.getElementById("monthDuration");
  let allBtn = document.getElementById("allDuration");
  monthBtn.style.backgroundColor = "#E35F43";
  monthBtn.style.color = "white";
  weekBtn.style.backgroundColor = "white";
  weekBtn.style.color = "#E35F43";
  dayBtn.style.backgroundColor = "white";
  dayBtn.style.color = "#E35F43";
  allBtn.style.backgroundColor = "white";
  allBtn.style.color = "#E35F43";

  document.getElementById('date_from').value = ChangeFormateDateV2(date_data30_D_tranfer[0].toString().substring(0, 10));
  document.getElementById('date_to').value = ChangeFormateDateV2(date_data30_D_tranfer[date_data30_D_tranfer.length - 1].toString().substring(0, 10));
  myChart.data.datasets[0].data = temp_data30_D;
  myChart.data.datasets[1].data = humi_data30_D;
  myChart.data.labels = date_data30_D;
  myChart.update();
}

function getRange() {
  let date_start = document.getElementById("date_from").value;
  let date_end = document.getElementById("date_to").value;
  

  let timestamp_30_before = new Date(new Date(date_data30_D[date_data30_D.length - 1]).getTime() - (30 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-CA');
  date_calendar_transfer = [];
  date_carlendar_D = [];
  humi_carlendar_D = [];
  temp_carlendar_D = [];
  
  if (date_start > date_end) {
    console.log("Wrong input.");
  } else {
    if (new Date(timestamp_30_before).getTime() > new Date(date_start).getTime() && n_sampling > 43200) {
      if (date_data_all_D.length === 0) {
        console.log('getting all data');
        dbRef.child("devices_sensor").child(device).get().then((snapshot) => {
          let all = snapshot.val();
          console.log("All sampling: " + Object.keys(all).length);
          for (d in all) {
            let timestamp = all[d].ti;
            let date = new Date(timestamp);
            let currentDateTimeDevice = readableTime(date);
  
            temp_data_all_D.push(all[d].te);
            date_data_all_D_tranfer.push(currentDateTimeDevice);
            date_data_all_D.push(date);
            humi_data_all_D.push(all[d].h);
          }
          for (let i = 0; i < date_data_all_D.length; i++) {
            if (date_start <= ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)) && ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)) <= date_end) {
              date_carlendar_D.push(date_data_all_D[i]);
              humi_carlendar_D.push(humi_data_all_D[i]);
              temp_carlendar_D.push(temp_data_all_D[i]);
              date_calendar_transfer.push(date_data_all_D_tranfer[i]);
              //testi = i;
            }
          };
          myChart.data.datasets[0].data = temp_carlendar_D;
          myChart.data.datasets[1].data = humi_carlendar_D;
          myChart.data.labels = date_carlendar_D;
          myChart.update();
        }).catch((error) => {
          console.error(error);
        });
      } else {
        console.log('using already loaded data');
        for (let i = 0; i < date_data_all_D.length; i++) {
          if (date_start <= ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)) && ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)) <= date_end) {
            date_carlendar_D.push(date_data_all_D[i]);
            humi_carlendar_D.push(humi_data_all_D[i]);
            temp_carlendar_D.push(temp_data_all_D[i]);
            date_calendar_transfer.push(date_data_all_D_tranfer[i]);
            //testi = i;
          }
        };
        myChart.data.datasets[0].data = temp_carlendar_D;
        myChart.data.datasets[1].data = humi_carlendar_D;
        myChart.data.labels = date_carlendar_D;
        myChart.update();
      }
     
    } else {
      console.log('still use 30day loaded data');
      for (let i = 0; i < date_data30_D.length; i++) {
        if (date_start <= ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10)) && ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10)) <= date_end) {
          date_carlendar_D.push(date_data30_D[i]);
          humi_carlendar_D.push(humi_data30_D[i]);
          temp_carlendar_D.push(temp_data30_D[i]);
          date_calendar_transfer.push(date_data30_D_tranfer[i]);
          //testi = i;
        }
      };
      myChart.data.datasets[0].data = temp_carlendar_D;
      myChart.data.datasets[1].data = humi_carlendar_D;
      myChart.data.labels = date_carlendar_D;
      myChart.update();
    }
  }
}

function getTableRange() {
  let tbl_start = document.getElementById('tbl_from').value;
  let tbl_end = document.getElementById('tbl_to').value;
  let date_carlendar_tbl = [];
  let date_carlendar_tbl_transfer = [];
  let humi_carlendar_tbl = [];
  let temp_carlendar_tbl = [];

  let timestamp_30_before = new Date(new Date(date_data30_D[date_data30_D.length - 1]).getTime() - (30 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-CA');

  if (tbl_start > tbl_end) {
    console.log("Error: Wrong date input.")
  } else {
    if (new Date(timestamp_30_before).getTime() > new Date(tbl_start).getTime() && n_sampling > 43200) {
      if (date_data_all_D.length === 0) {
        console.log('getting all data');
        dbRef.child("devices_sensor").child(device).get().then((snapshot) => {
          let all = snapshot.val();
          console.log("All sampling: " + Object.keys(all).length);
          for (d in all) {
            let timestamp = all[d].ti;
            let date = new Date(timestamp);
            let currentDateTimeDevice = readableTime(date);
  
            temp_data_all_D.push(all[d].te);
            date_data_all_D_tranfer.push(currentDateTimeDevice);
            date_data_all_D.push(date);
            humi_data_all_D.push(all[d].h);
          }
          for (let i = 0; i < date_data_all_D.length; i++) {
            if (tbl_start <= ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)) && ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)) <= tbl_end) {
              date_carlendar_tbl.push(date_data_all_D[i]);
              humi_carlendar_tbl.push(humi_data_all_D[i]);
              temp_carlendar_tbl.push(temp_data_all_D[i]);
              date_carlendar_tbl_transfer.push(date_data_all_D_tranfer[i]);
            }
          }
        }).catch((error) => {
          console.error(error);
        });
      } else {
        console.log('using already loaded data');
        for (let i = 0; i < date_data_all_D.length; i++) {
          if (tbl_start <= ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)) && ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)) <= tbl_end) {
            date_carlendar_tbl.push(date_data_all_D[i]);
            humi_carlendar_tbl.push(humi_data_all_D[i]);
            temp_carlendar_tbl.push(temp_data_all_D[i]);
            date_carlendar_tbl_transfer.push(date_data_all_D_tranfer[i]);
          }
        }
      }
    } else {
      console.log('still use 30day loaded data');
      for (let i = 0; i < date_data30_D.length; i++) {
        if (tbl_start <= ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10)) && ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10)) <= tbl_end) {
          date_carlendar_tbl.push(date_data30_D[i]);
          humi_carlendar_tbl.push(humi_data30_D[i]);
          temp_carlendar_tbl.push(temp_data30_D[i]);
          date_carlendar_tbl_transfer.push(date_data30_D_tranfer[i]);
        }
      }
    }
  }
  renderTable(date_carlendar_tbl_transfer, temp_carlendar_tbl, humi_carlendar_tbl);
}
function getAllDataTable() {
  if (date_data_all_D.length === 0 && n_sampling > 43200) {
    console.log('getting all data');
    dbRef.child("devices_sensor").child(device).get().then((snapshot) => {
      let all = snapshot.val();
      console.log("All sampling: " + Object.keys(all).length);
      for (d in all) {
        let timestamp = all[d].ti;
        let date = new Date(timestamp);
        let currentDateTimeDevice = readableTime(date);

        temp_data_all_D.push(all[d].te);
        date_data_all_D_tranfer.push(currentDateTimeDevice);
        date_data_all_D.push(date);
        humi_data_all_D.push(all[d].h);
      }
      renderTable(date_data_all_D_tranfer, temp_data_all_D, humi_data_all_D);
    }).catch((error) => {
      console.error(error);
    });
  } else {
    if (n_sampling > 43200) {
      console.log('using already loaded data');
      renderTable(date_data_all_D_tranfer, temp_data_all_D, humi_data_all_D);
    }
    console.log('still use 30day loaded data');
    renderTable(date_data30_D_tranfer, temp_data30_D, humi_data30_D);
  }
}

// change / to -
function ChangeFormateDate(oldDate) {
  return oldDate.toString().split("-").reverse().join("/");
}
// change - to /
function ChangeFormateDateV2(oldDate) {
  return oldDate.toString().split("/").reverse().join("-");
}

document.getElementById('resetZoom').addEventListener('click', function () {
  myChart.resetZoom('none');
});

document.getElementById('resetZoom2').addEventListener('click', function () {
  compareChart.resetZoom('none');
});

function compareGraph() {
  compareStart();
}

function compareStart() {
  date_label = [];
  day_all_tem_data = [];
  day_all_humi_data = [];
  day_compareGraph = [];
  
  let get_select_date = document.getElementById('date_now').value;
  
  let day7 = (new Date(new Date(get_select_date).getTime() - 604800000).toLocaleDateString('en-CA'));
  let day6 = (new Date(new Date(get_select_date).getTime() - 518400000).toLocaleDateString('en-CA'));
  let day5 = (new Date(new Date(get_select_date).getTime() - 432000000).toLocaleDateString('en-CA'));
  let day4 = (new Date(new Date(get_select_date).getTime() - 345600000).toLocaleDateString('en-CA'));
  let day3 = (new Date(new Date(get_select_date).getTime() - 259200000).toLocaleDateString('en-CA'));
  let day2 = (new Date(new Date(get_select_date).getTime() - 172800000).toLocaleDateString('en-CA'));
  let day1 = (new Date(new Date(get_select_date).getTime() - 86400000).toLocaleDateString('en-CA'));
  let day0 = (new Date(new Date(get_select_date).getTime()).toLocaleDateString('en-CA'));

  let lastest_day = (new Date(new Date(get_select_date).getTime() + 86400000).toLocaleDateString('en-CA'));

  all_tem_data = [];

  let day0_tem = [];
  let day1_tem = [];
  let day2_tem = [];
  let day3_tem = [];
  let day4_tem = [];
  let day5_tem = [];
  let day6_tem = [];

  let day0_humi = [];
  let day1_humi = [];
  let day2_humi = [];
  let day3_humi = [];
  let day4_humi = [];
  let day5_humi = [];
  let day6_humi = [];

  let day0_date = true;
  let day1_date = true;
  let day2_date = true;
  let day3_date = true;
  let day4_date = true;
  let day5_date = true;
  let day6_date = true;
  let obj_humi = {};
  let obj_tem = {};
  
  let timestamp_30_before = new Date(new Date(date_data30_D[date_data30_D.length - 1]).getTime() - (30 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-CA') ;

  if (new Date(timestamp_30_before).getTime() > new Date(day7).getTime()) { //old more than 30 day
    if (date_data_all_D.length === 0) { //Not load all data before
      console.log("load all date");
      dbRef.child("devices_sensor").child(device).get().then((snapshot) => {
        let all = snapshot.val();
        console.log("All sampling: " + Object.keys(all).length);
        for (d in all) {
          let timestamp = all[d].ti;
          let date = new Date(timestamp);
          let currentDateTimeDevice = readableTime(date);

          temp_data_all_D.push(all[d].te);
          date_data_all_D_tranfer.push(currentDateTimeDevice);
          date_data_all_D.push(date);
          humi_data_all_D.push(all[d].h);
        }

        for (let i = 0; i < date_data_all_D.length; i++) {
          let day_count_day = ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10));
          if (day7 < day_count_day && day_count_day < day5) {
            obj_tem.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
            obj_tem.y = temp_data_all_D[i];
            day6_tem.push(obj_tem);
            obj_tem = {};
      
            obj_humi.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
            obj_humi.y = humi_data_all_D[i];
            day6_humi.push(obj_humi);
            obj_humi = {};
            if (day6_date) {
              day_compareGraph.push(ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)));
              day6_date = false;
              console.log(date_data_all_D_tranfer[i].toString().substring(10, 19));
            }
          } else if (day6 < day_count_day && day_count_day < day4) {
            obj_tem.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
            obj_tem.y = temp_data_all_D[i];
            day5_tem.push(obj_tem);
            obj_tem = {};
      
            obj_humi.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
            obj_humi.y = humi_data_all_D[i];
            day5_humi.push(obj_humi);
            obj_humi = {};
            if (day5_date) {
              day_compareGraph.push(ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)));
              day5_date = false;
              if (day6_tem.length != 0){
                day_all_tem_data.push(day6_tem);
                day_all_humi_data.push(day6_humi);
              }
            }
          } else if (day5 < day_count_day && day_count_day < day3) {
            obj_tem.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
            obj_tem.y = temp_data_all_D[i];
            day4_tem.push(obj_tem);
            obj_tem = {};
      
            obj_humi.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
            obj_humi.y = humi_data_all_D[i];
            day4_humi.push(obj_humi);
            obj_humi = {};
            if (day4_date) {
              day_compareGraph.push(ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)));
              day4_date = false;
              if (day5_tem.length != 0){
                day_all_tem_data.push(day5_tem);
                day_all_humi_data.push(day5_humi);
              }
            }
          } else if (day4 < day_count_day && day_count_day < day2) {
            obj_tem.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
            obj_tem.y = temp_data_all_D[i];
            day3_tem.push(obj_tem);
            obj_tem = {};
      
            obj_humi.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
            obj_humi.y = humi_data_all_D[i];
            day3_humi.push(obj_humi);
            obj_humi = {};
            if (day3_date) {
              day_compareGraph.push(ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)));
              day3_date = false;
              if (day4_tem.length != 0){
                day_all_tem_data.push(day4_tem);
                day_all_humi_data.push(day4_humi);
              }
            }
          } else if (day3 < day_count_day && day_count_day < day1) {
            obj_tem.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
            obj_tem.y = temp_data_all_D[i];
            day2_tem.push(obj_tem);
            obj_tem = {};
      
            obj_humi.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
            obj_humi.y = humi_data_all_D[i];
            day2_humi.push(obj_humi);
            obj_humi = {};
            if (day2_date) {
              day_compareGraph.push(ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)));
              day2_date = false;
              if (day3_tem.length != 0){
                day_all_tem_data.push(day3_tem);
                day_all_humi_data.push(day3_humi);
              }
            }
          } else if (day2 < day_count_day && day_count_day < day0) {
            obj_tem.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
            obj_tem.y = temp_data_all_D[i];
            day1_tem.push(obj_tem);
            obj_tem = {};
      
            obj_humi.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
            obj_humi.y = humi_data_all_D[i];
            day1_humi.push(obj_humi);
            obj_humi = {};
            if (day1_date) {
              day_compareGraph.push(ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)));
              day1_date = false;
              if (day2_tem.length != 0){
                day_all_tem_data.push(day2_tem);
                day_all_humi_data.push(day2_humi);
              }
            }
          } else if (day1 < day_count_day && day_count_day < lastest_day) {
            obj_tem.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
            obj_tem.y = temp_data_all_D[i];
            day0_tem.push(obj_tem);
            obj_tem = {};
      
            obj_humi.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
            obj_humi.y = humi_data_all_D[i];
            day0_humi.push(obj_humi);
            obj_humi = {};
            if (day0_date) {
              day_compareGraph.push(ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)));
              day0_date = false;
              if (day1_tem.length != 0){
                day_all_tem_data.push(day1_tem);
                day_all_humi_data.push(day1_humi);
              }
            }
          }  else if (day_count_day == lastest_day) {
            if (day0_tem.length != 0){
              day_all_tem_data.push(day0_tem);
              day_all_humi_data.push(day0_humi);
            }
              break;
          }
        }
      }).catch((error) => {
        console.error(error);
      });
    } else { //Already loaded all data
      for (let i = 0; i < date_data_all_D.length; i++) {
        let day_count_day = ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10));
        if (day7 < day_count_day && day_count_day < day5) {
          obj_tem.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
          obj_tem.y = temp_data_all_D[i];
          day6_tem.push(obj_tem);
          obj_tem = {};
    
          obj_humi.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
          obj_humi.y = humi_data_all_D[i];
          day6_humi.push(obj_humi);
          obj_humi = {};
          if (day6_date) {
            day_compareGraph.push(ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)));
            day6_date = false;
            console.log(date_data_all_D_tranfer[i].toString().substring(10, 19));
          }
        } else if (day6 < day_count_day && day_count_day < day4) {
          obj_tem.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
          obj_tem.y = temp_data_all_D[i];
          day5_tem.push(obj_tem);
          obj_tem = {};
    
          obj_humi.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
          obj_humi.y = humi_data_all_D[i];
          day5_humi.push(obj_humi);
          obj_humi = {};
          if (day5_date) {
            day_compareGraph.push(ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)));
            day5_date = false;
            if (day6_tem.length != 0){
              day_all_tem_data.push(day6_tem);
              day_all_humi_data.push(day6_humi);
            }
          }
        } else if (day5 < day_count_day && day_count_day < day3) {
          obj_tem.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
          obj_tem.y = temp_data_all_D[i];
          day4_tem.push(obj_tem);
          obj_tem = {};
    
          obj_humi.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
          obj_humi.y = humi_data_all_D[i];
          day4_humi.push(obj_humi);
          obj_humi = {};
          if (day4_date) {
            day_compareGraph.push(ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)));
            day4_date = false;
            if (day5_tem.length != 0){
              day_all_tem_data.push(day5_tem);
              day_all_humi_data.push(day5_humi);
            }
          }
        } else if (day4 < day_count_day && day_count_day < day2) {
          obj_tem.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
          obj_tem.y = temp_data_all_D[i];
          day3_tem.push(obj_tem);
          obj_tem = {};
    
          obj_humi.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
          obj_humi.y = humi_data_all_D[i];
          day3_humi.push(obj_humi);
          obj_humi = {};
          if (day3_date) {
            day_compareGraph.push(ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)));
            day3_date = false;
            if (day4_tem.length != 0){
              day_all_tem_data.push(day4_tem);
              day_all_humi_data.push(day4_humi);
            }
          }
        } else if (day3 < day_count_day && day_count_day < day1) {
          obj_tem.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
          obj_tem.y = temp_data_all_D[i];
          day2_tem.push(obj_tem);
          obj_tem = {};
    
          obj_humi.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
          obj_humi.y = humi_data_all_D[i];
          day2_humi.push(obj_humi);
          obj_humi = {};
          if (day2_date) {
            day_compareGraph.push(ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)));
            day2_date = false;
            if (day3_tem.length != 0){
              day_all_tem_data.push(day3_tem);
              day_all_humi_data.push(day3_humi);
            }
          }
        } else if (day2 < day_count_day && day_count_day < day0) {
          obj_tem.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
          obj_tem.y = temp_data_all_D[i];
          day1_tem.push(obj_tem);
          obj_tem = {};
    
          obj_humi.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
          obj_humi.y = humi_data_all_D[i];
          day1_humi.push(obj_humi);
          obj_humi = {};
          if (day1_date) {
            day_compareGraph.push(ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)));
            day1_date = false;
            if (day2_tem.length != 0){
              day_all_tem_data.push(day2_tem);
              day_all_humi_data.push(day2_humi);
            }
          }
        } else if (day1 < day_count_day && day_count_day < lastest_day) {
          obj_tem.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
          obj_tem.y = temp_data_all_D[i];
          day0_tem.push(obj_tem);
          obj_tem = {};
    
          obj_humi.x = date_data_all_D_tranfer[i].toString().substring(10, 19);
          obj_humi.y = humi_data_all_D[i];
          day0_humi.push(obj_humi);
          obj_humi = {};
          if (day0_date) {
            day_compareGraph.push(ChangeFormateDateV2(date_data_all_D_tranfer[i].toString().substring(0, 10)));
            day0_date = false;
            if (day1_tem.length != 0){
              day_all_tem_data.push(day1_tem);
              day_all_humi_data.push(day1_humi);
            }
          }
        }  else if (day_count_day == lastest_day) {
          if (day0_tem.length != 0){
            day_all_tem_data.push(day0_tem);
            day_all_humi_data.push(day0_humi);
          }
            break;
        }
      }
    }
    
  } else {
    console.log("less than 30 day");
    for (let i = 0; i < date_data30_D.length; i++) {
      let day_count_day = ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10));
      if (day7 < day_count_day && day_count_day < day5) {
        obj_tem.x = date_data30_D_tranfer[i].toString().substring(10, 19);
        obj_tem.y = temp_data30_D[i];
        day6_tem.push(obj_tem);
        obj_tem = {};
  
        obj_humi.x = date_data30_D_tranfer[i].toString().substring(10, 19);
        obj_humi.y = humi_data30_D[i];
        day6_humi.push(obj_humi);
        obj_humi = {};
        if (day6_date) {
          day_compareGraph.push(ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10)));
          day6_date = false;
          console.log(date_data30_D_tranfer[i].toString().substring(10, 19));
        }
      } else if (day6 < day_count_day && day_count_day < day4) {
        obj_tem.x = date_data30_D_tranfer[i].toString().substring(10, 19);
        obj_tem.y = temp_data30_D[i];
        day5_tem.push(obj_tem);
        obj_tem = {};
  
        obj_humi.x = date_data30_D_tranfer[i].toString().substring(10, 19);
        obj_humi.y = humi_data30_D[i];
        day5_humi.push(obj_humi);
        obj_humi = {};
        if (day5_date) {
          day_compareGraph.push(ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10)));
          day5_date = false;
          if (day6_tem.length != 0){
            day_all_tem_data.push(day6_tem);
            day_all_humi_data.push(day6_humi);
          }
        }
      } else if (day5 < day_count_day && day_count_day < day3) {
        obj_tem.x = date_data30_D_tranfer[i].toString().substring(10, 19);
        obj_tem.y = temp_data30_D[i];
        day4_tem.push(obj_tem);
        obj_tem = {};
  
        obj_humi.x = date_data30_D_tranfer[i].toString().substring(10, 19);
        obj_humi.y = humi_data30_D[i];
        day4_humi.push(obj_humi);
        obj_humi = {};
        if (day4_date) {
          day_compareGraph.push(ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10)));
          day4_date = false;
          if (day5_tem.length != 0){
            day_all_tem_data.push(day5_tem);
            day_all_humi_data.push(day5_humi);
          }
        }
      } else if (day4 < day_count_day && day_count_day < day2) {
        obj_tem.x = date_data30_D_tranfer[i].toString().substring(10, 19);
        obj_tem.y = temp_data30_D[i];
        day3_tem.push(obj_tem);
        obj_tem = {};
  
        obj_humi.x = date_data30_D_tranfer[i].toString().substring(10, 19);
        obj_humi.y = humi_data30_D[i];
        day3_humi.push(obj_humi);
        obj_humi = {};
        if (day3_date) {
          day_compareGraph.push(ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10)));
          day3_date = false;
          if (day4_tem.length != 0){
            day_all_tem_data.push(day4_tem);
            day_all_humi_data.push(day4_humi);
          }
        }
      } else if (day3 < day_count_day && day_count_day < day1) {
        obj_tem.x = date_data30_D_tranfer[i].toString().substring(10, 19);
        obj_tem.y = temp_data30_D[i];
        day2_tem.push(obj_tem);
        obj_tem = {};
  
        obj_humi.x = date_data30_D_tranfer[i].toString().substring(10, 19);
        obj_humi.y = humi_data30_D[i];
        day2_humi.push(obj_humi);
        obj_humi = {};
        if (day2_date) {
          day_compareGraph.push(ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10)));
          day2_date = false;
          if (day3_tem.length != 0){
            day_all_tem_data.push(day3_tem);
            day_all_humi_data.push(day3_humi);
          }
        }
      } else if (day2 < day_count_day && day_count_day < day0) {
        obj_tem.x = date_data30_D_tranfer[i].toString().substring(10, 19);
        obj_tem.y = temp_data30_D[i];
        day1_tem.push(obj_tem);
        obj_tem = {};
  
        obj_humi.x = date_data30_D_tranfer[i].toString().substring(10, 19);
        obj_humi.y = humi_data30_D[i];
        day1_humi.push(obj_humi);
        obj_humi = {};
        if (day1_date) {
          day_compareGraph.push(ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10)));
          day1_date = false;
          if (day2_tem.length != 0){
            day_all_tem_data.push(day2_tem);
            day_all_humi_data.push(day2_humi);
          }
        }
      } else if (day1 < day_count_day && day_count_day < lastest_day) {
        obj_tem.x = date_data30_D_tranfer[i].toString().substring(10, 19);
        obj_tem.y = temp_data30_D[i];
        day0_tem.push(obj_tem);
        obj_tem = {};
  
        obj_humi.x = date_data30_D_tranfer[i].toString().substring(10, 19);
        obj_humi.y = humi_data30_D[i];
        day0_humi.push(obj_humi);
        obj_humi = {};
        if (day0_date) {
          day_compareGraph.push(ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10)));
          day0_date = false;
          if (day1_tem.length != 0){
            day_all_tem_data.push(day1_tem);
            day_all_humi_data.push(day1_humi);
          }
        }
      }  else if (day_count_day == lastest_day) {
        if (day0_tem.length != 0){
          day_all_tem_data.push(day0_tem);
          day_all_humi_data.push(day0_humi);
        }
          break;
      }
    }
  }
  
  //day_compareGraph.pop();
  if (day_compareGraph.length != day_all_tem_data.length) {
    day_compareGraph.pop();
  }
  // console.log(day_compareGraph.length);
  // console.log(day_all_tem_data.length);
  //compareChart.destroy();
  let ctx3 = document.getElementById('compareChart').getContext('2d');
  compareChart = new Chart(ctx3, {
    type: 'line',
    data: {
      //labels: date_label,
    },
    options: {
    
      legend: {
          display: true,
          position: 'left'
      
      },
      zoom: {
        enabled: true,
        drag: {
          borderColor: 'rgba(225,225,225,0.3)',
          borderWidth: 5,
          backgroundColor: 'rgb(225,225,225)',
          animationDuration: 0
        },
        mode: 'x',
      },
      tooltips: {
        mode: 'x',
        intersect: false,
        xAlign: 'center',
        yAlign:'top',
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
      },
      hover: {
        mode: 'x',
        intersect: false
      },
      elements: {
        point: {
            //radius: 0,
            hitRadius: 0.2,
            hoverRadius: 4
        }
     },
     /* interaction: {
        mode: 'index'
      },*/
      responsive: true,
      scales: {
        yAxes: [{
          type: 'linear',
          position: 'right',
          ticks: {
            suggestedMin: 20,
            suggestedMax: 45,
            maxTicksLimit: maxTicksLimitY,
            fontSize: font_y_size,
            min: 20
          },
          scaleLabel: {
            display: true,
            labelString: 'Temperature (°C)',
            fontSize: font_y_size
          },
        }],
        xAxes: [{
          type: 'time',
           time: {
             unit: 'hour',
             stepSize: 0.5,  //I'm using 3 hour intervals here
          //   tooltipFormat: 'HH:mm:ss',
             parser: 'HH:mm:ss', //these formatting values do nothing, I've tried a few different ones
          //   //: 'second', //I have tried minutes and hours too, same result
             displayFormats: {
               hour: 'HH:mm'
             }
           //},
          // ticks: {
          //   //source: 'auto',
          //   major: {
          //     //enabled: true, // <-- This is the key line
          //     fontStyle: 'bold', //You can also style these values differently
          //     fontSize: 14 //You can also style these values differently
          //   },
          },
        }]
      },
    }
  });
  initialCompareChart();
}

function compareGraphSet() {
  compareChart.destroy();
  compareStart();
}

function initialCompareChart(){
  //let color = getPastelColor()
  for(let i = 0 ;i < day_compareGraph.length; i++) {
    let color = getPastelColor()
    compareChart.data.datasets.push({
      label: day_compareGraph[i] ,
      backgroundColor: corlor_7_day[i],
      borderColor: corlor_7_day[i],
      //indexLabelFontSize: 10,
      hoverBackgroundColor: corlor_7_day[i],
      hoverBorderColor: corlor_7_day[i],
      hoverBorderWidth : '0.01',
      fill: false,
      data: day_all_tem_data[i],
      pointRadius: 0,
      borderWidth: 3,
      tension: 0
      
    });
    compareChart.update();
  }
  
}

function compareChartTem() {
  let temBtn = document.getElementById("tempCompare");
  let humiBtn = document.getElementById("humiCompare");
  temBtn.style.backgroundColor = "#E35F43";
  temBtn.style.color = "white";
  humiBtn.style.backgroundColor = "white";
  humiBtn.style.color = "#E35F43";

  //compareChart.destroy();
  for(let i = 0 ;i < day_all_tem_data.length; i++) {
    compareChart.data.datasets[i].data = day_all_tem_data[i];
    //compareChart.data.datasets[i-1].label = day_compareGraph[i];
    let color = getPastelColor();
    compareChart.data.datasets[i].backgroundColor = corlor_7_day[i];
    compareChart.data.datasets[i].borderColor = corlor_7_day[i];
  }
  
  // compareChart.options.scales.yAxes[0].ticks.suggestedMin = 10;
  // compareChart.options.scales.yAxes[0].ticks.suggestedMin = 50;
  compareChart.options.scales.yAxes[0].scaleLabel.labelString = 'Temperature (°C)';
  compareChart.update();
}

function compareChartHumi() {
  let temBtn = document.getElementById("tempCompare");
  let humiBtn = document.getElementById("humiCompare");
  temBtn.style.backgroundColor = "white";
  temBtn.style.color = "#E35F43";
  humiBtn.style.backgroundColor = "#E35F43";
  humiBtn.style.color = "white";

  //compareChart.destroy();
  for(let i = 0 ;i < day_all_humi_data.length; i++) {
    compareChart.data.datasets[i].data = day_all_humi_data[i];
    let color = getPastelColor();
    compareChart.data.datasets[i].backgroundColor = corlor_7_day[i];
    compareChart.data.datasets[i].borderColor = corlor_7_day[i];
    //compareChart.data.datasets[i-1].label = day_compareGraph[i];
    //myChart.data.datasets[1].data = humi_carlendar_D;
    //myChart.data.labels = date_carlendar_D;
    //compareChart.update();
  }
  compareChart.options.scales.yAxes[0].scaleLabel.labelString = 'Humidity (%RH)';
  compareChart.update();
}


function renderTable(date_array, temp_array, humi_array) {
  firstDateTime = date_array[0];
  lastDateTime = date_array[date_array.length - 1];
  let tbody = document.getElementById('tbl-body');
  let col = 4; //column head number
  let load_sector = 1500;
  let multiply = 1;
  let shifter;
  //reset old table
  tbody.innerText = '';

  for (i = 0; i < date_array.length; i++) {
      let row = document.createElement('tr');
      let td_list = [i + 1, date_array[i], temp_array[i], humi_array[i]]
      for (j = 0; j < col; j++) {
          let td = document.createElement('td');
          td.innerText = td_list[j];
          row.appendChild(td);
      }
      tbody.appendChild(row);
  };
}

function addData(chart, label, color, data) {
  chart.data.datasets.push({
    label: label,
    backgroundColor: color,
    fill: false,
    data: data
  });
  chart.update();
}


/////////////////////////////////////////////////// start function
//////////////////////////////// Start Fucntion
initialLoad();
