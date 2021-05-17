const dbRef = firebase.database().ref();
const db_devices = "devices_sensor";

//Get url parameter (the device name)
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const device = urlParams.get('device');

let deviceObj;
let n_sampling;
let last_samp;
let first_samp;

let  day_all_humi_data 
// function initialLoad() {
//     dbRef.child(db_devices).child(device).get().then((snapshot) => {
//         if (snapshot.exists()) {
//             deviceObj = snapshot.val();
//             n_sampling = Object.keys(deviceObj).length;
//             last_samp = Object.keys(deviceObj)[n_sampling-1];
//             first_samp = Object.keys(deviceObj)[0];

//             displayDeviceInfo();
//             firstLoad();
//         } else {
//             console.log("No data available")
//         }
//     }).catch((error) => {
//       console.error(error);
//     });
// }

function initialLoad() {
    deviceObj = JSON.parse(localStorage.getItem('deviceObject'));
    console.log(deviceObj)

    n_sampling = Object.keys(deviceObj).length;
    last_samp = Object.keys(deviceObj)[n_sampling-1];
    first_samp = Object.keys(deviceObj)[0];
    //console.log(typeof retrievedObject);
    //console.log(retrievedObject[device]);
    displayDeviceInfo();
    firstLoad();
}

function displayDeviceInfo() {
    console.log("Number of sampling: " + n_sampling);
    console.log("Last sampling key: " + last_samp);

    // Display device info
    document.getElementById("device").innerText = device;
    document.getElementById("dName").innerText = device;
    document.getElementById("header-excel").innerText = device;

    // Convert timestamp to readable
    let timestamp = (deviceObj[last_samp].ti)/1000;
    let date = new Date(timestamp * 1000);
    lastDateTime = readableTime(date);
    timestamp = (deviceObj[first_samp].ti)/1000;
    date = new Date(timestamp * 1000);
    firstDateTime = readableTime(date);

    document.getElementById("lastTime").innerText = lastDateTime;
    document.querySelector(".temp").innerHTML = `<i class="fas fa-thermometer-half"></i>${deviceObj[last_samp].te} °C`;
    document.querySelector(".humi").innerHTML = `<i class="fas fa-tint"></i>${deviceObj[last_samp].h} %`;
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
}  

// Export data table from HTML to excel (csv file) 
function exportTable2excel() {
  document.getElementById('time-excel').innerText = `Start: ${firstDateTime}, End: ${lastDateTime}`;
    let table = document.querySelector("#table2excel");
        TableToExcel.convert(table, {
        name: "data-report.xlsx",
        sheet: {
            name: "Sheet 1"
        }
    });
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
}



var label;
var humi_data;
var tem_data;
var myChart;
var compareChart;

var color = ["#615af0", "#4be47", "#2a3434", "#4a543f", "#79bca0"];
var day_compareGraph = []; 

var date_label;
var day_all_data;

var date_data1_D_tranfer;
var date_data7_D_tranfer;
var date_data30_D_tranfer;

var temp_data1_D;
var date_data1_D;
var humi_data1_D;

var temp_data7_D;
var date_data7_D;
var humi_data7_D;

var temp_data30_D;
var date_data30_D;
var humi_data30_D;

var date_carlendar_D;
var humi_carlendar_D;
var temp_carlendar_D;

var day_in_week;
var day1440;

var maxTicksLimitX = 24;
var maxTicksLimitY = 12;
var font_x_size = 16;
var font_y_size = 16;
var test;

var firstDateTime;
var lastDateTime;

var test_all = [];
var deviObj = {};
console.log('name: ' + device);
if (document.documentElement.clientWidth < 900) {
  //myChart.options.scales.yAxes[0].ticks.maxTicksLimit = 6;
  //myChart.options.scales.yAxes[1].ticks.maxTicksLimit = 6;
  //console.log("yees");
  maxTicksLimitX = 12;
  maxTicksLimitY = 5;
  font_x_size = 10;
  font_y_size = 10;
}

function firstLoad() {
    let deObj = deviceObj;
    //console.log(Object.values(deObj));
    deviObj = Object.values(deObj);
    //console.log(typeof deviObj);
    //test_all.push(deviObj);
    
    secondLoad();
}

function secondLoad() {
  //console.log(deviObj);
  temp_data1_D = [];
  date_data1_D = [];
  humi_data1_D = [];
  temp_data7_D = [];
  date_data7_D = [];
  humi_data7_D = [];
  temp_data30_D = [];
  date_data30_D = [];
  humi_data30_D = [];
  date_data1_D_tranfer = [];
  date_data7_D_tranfer = [];
  date_data30_D_tranfer = [];
  let i = 0;
  console.log('name: ' + device);
  n_sampling = Object.keys(deviObj).length;
  let day_samling = n_sampling - 1440;
  let week_sampling = n_sampling - 10080;
  let month_sampling = n_sampling - 43200;
  for (d in deviObj) {
    //console.log(test_all);
    //all_samp = deviObj[d].;
    let timestamp = deviObj[d].ti;
    //let timestamp = deviObj[device][all_samp].timestamp/1000;   
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

    } else if (i >= week_sampling) {
      temp_data7_D.push(deviObj[d].te);
      date_data7_D_tranfer.push(currentDateTimeDevice);
      date_data7_D.push(date);
      humi_data7_D.push(deviObj[d].h);

      temp_data30_D.push(deviObj[d].te);
      date_data30_D_tranfer.push(currentDateTimeDevice);
      date_data30_D.push(date);
      humi_data30_D.push(deviObj[d].h);



    } else if (i >= month_sampling) {
      temp_data30_D.push(deviObj[d].te);
      date_data30_D_tranfer.push(currentDateTimeDevice);
      date_data30_D.push(date);
      humi_data30_D.push(deviObj[d].h);
    }

    /* if (i > 129600) {
       console.log("Some of the data was older than 3 months, so it has been deleted.");
       dbRef.child("devices_sensor").child(device).child(d).remove();
     }*/
  }
  //console.log(all_samp);
  //console.log(Object.keys(deviObj)[1000]);
  label = date_data30_D;
  tem_data = temp_data30_D;
  humi_data = humi_data30_D;
  document.getElementById('date_from').value = ChangeFormateDateV2(date_data30_D_tranfer[0].toString().substring(0, 10));
  document.getElementById('date_to').value = new Date().toLocaleDateString('en-CA');
  document.getElementById('date_now').value = new Date(new Date().getTime() - 86400000).toLocaleDateString('en-CA');
  document.getElementById('tbl_from').value = new Date().toLocaleDateString('en-CA');
  document.getElementById('tbl_to').value = new Date().toLocaleDateString('en-CA');
  getTableRange();
  mainChat();
  compareGraph();
  initialCompareChart();
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
            suggestedMax: 45,
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
            suggestedMax: 90,
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
            stepSize: 0.5,  //I'm using 3 hour intervals here
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
            //source: 'auto',
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

  //console.log(date_data1_D);
  myChart.data.datasets[0].data = temp_data30_D;
  myChart.data.datasets[1].data = humi_data30_D;
  myChart.data.labels = date_data30_D;
  myChart.update();

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
  //console.log(date_data1_D);
  myChart.data.datasets[0].data = temp_data1_D;
  myChart.data.datasets[1].data = humi_data1_D;
  myChart.data.labels = date_data1_D;
  myChart.update();
  console.log(date_data1_D_tranfer.length);
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
  //console.log(ChangeFormateDateV2(date_data7_D_tranfer[0].toString().substring(0, 10)));
  //console.log(ChangeFormateDateV2(date_data7_D_tranfer[date_data7_D_tranfer.length-1].toString().substring(0, 10)));
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
  // let date_start_formate = ChangeFormateDate(date_start); 
  // let date_end_formate = ChangeFormateDate(date_end); 
  date_calendar_transfer = [];
  date_carlendar_D = [];
  humi_carlendar_D = [];
  temp_carlendar_D = [];
  //console.log(date_data30_D_tranfer);
  if (date_start > date_end) {
    console.log("worng");
    //console.log(date_start);
    //console.log(date_end);
  } else {
    for (let i = 0; i < date_data30_D.length; i++) {
      if (date_start <= ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10)) && ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10)) <= date_end) {
        date_carlendar_D.push(date_data30_D[i]);
        humi_carlendar_D.push(humi_data30_D[i]);
        temp_carlendar_D.push(temp_data30_D[i]);
        date_calendar_transfer.push(date_data30_D_tranfer[i]);
      }
    };
    myChart.data.datasets[0].data = temp_carlendar_D;
    myChart.data.datasets[1].data = humi_carlendar_D;
    myChart.data.labels = date_carlendar_D;
    myChart.update();

  }
}

function getTableRange() {
  let tbl_start = document.getElementById('tbl_from').value;
  let tbl_end = document.getElementById('tbl_to').value;
  let date_carlendar_tbl = [];
  let date_carlendar_tbl_transfer = [];
  let humi_carlendar_tbl = [];
  let temp_carlendar_tbl = [];
  if (tbl_start > tbl_end) {
    console.log("Error: Wrong date input.")
  } else {
    for (let i = 0; i < date_data30_D.length; i++) {
      if (tbl_start <= ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10)) && ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10)) <= tbl_end) {
        date_carlendar_tbl.push(date_data30_D[i]);
        humi_carlendar_tbl.push(humi_data30_D[i]);
        temp_carlendar_tbl.push(temp_data30_D[i]);
        date_carlendar_tbl_transfer.push(date_data30_D_tranfer[i]);
      }
    }
  }
  renderTable(date_carlendar_tbl_transfer, temp_carlendar_tbl, temp_carlendar_tbl);
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
  /*let yesterday = Date.now() - 86400000;
  let dateYesterday = new Date(yesterday);
  
  let currentDateTimeDevice = dateYesterday.getDate().toString().padStart(2, "0") +
      "/" + ((dateYesterday.getMonth() + 1).toString().padStart(2, "0")) +
      "/" + dateYesterday.getFullYear();*/
  date_label = [];
  day_all_tem_data = [];
  day_all_humi_data = [];
  day_compareGraph = [];
  let day_tem_day = [];
  let day_humi_day = [];
  //let lastest_day = ChangeFormateDateV2(date_data1_D_tranfer[date_data1_D_tranfer.length-1].toString().substring(0, 10));
  let lastest_week = ChangeFormateDateV2(date_data7_D_tranfer[0].toString().substring(0, 10));
  let get_select_date = document.getElementById('date_now').value;
  //let lastest_week =
  let day9 = new Date(new Date().getTime() - 777600000).toLocaleDateString('en-CA');
  let lastest_day = (new Date(new Date(get_select_date).getTime() + 86400000).toLocaleDateString('en-CA'));
  
  //console.log(new Date().toLocaleDateString('en-CA'));
  //let day_count = lastest_week;
  // console.log(lastest_day);
  // console.log(lastest_week);
  
 
  let j = 0;
  for (let i = 0; i < date_data7_D.length; i++) {
    let day_count = ChangeFormateDateV2(date_data7_D_tranfer[i].toString().substring(0, 10));
    if (day_count == lastest_day) {
        day_all_tem_data.push(day_tem_day);
        day_all_humi_data.push(day_humi_day);
        //day_compareGraph.push(ChangeFormateDateV2(date_data7_D_tranfer[i+10].toString().substring(0, 10)));
      break;
    } else if (day_count != lastest_week) {
      if (j < 1440) {
        date_label.push(date_data7_D[i]);
      }
      if (0 == j % 1440) {
        day_compareGraph.push(ChangeFormateDateV2(date_data7_D_tranfer[i+10].toString().substring(0, 10)));
        day_all_tem_data.push(day_tem_day);
        day_all_humi_data.push(day_humi_day);
        day_humi_day = [];
        day_tem_day = [];
      }
      day_tem_day.push(temp_data7_D[i]);
      day_humi_day.push(humi_data7_D[i]);
      j++
    } 
  }
  // console.log(date_data7_D.length);
  // console.log(temp_data30_D.length);
  // //console.log(day_all_data);
  // console.log(day_compareGraph);
  
  var ctx2 = document.getElementById('compareChart').getContext('2d');
  compareChart = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: date_label,
    },
    options: {
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
          type: 'linear',
          position: 'left',
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
            tooltipFormat: 'HH:mm:ss',
            parser: 'HH:mm:ss', //these formatting values do nothing, I've tried a few different ones
            //: 'second', //I have tried minutes and hours too, same result
            displayFormats: {
              hour: 'HH:mm'
            }
          },
          ticks: {
            //source: 'auto',
            major: {
              //enabled: true, // <-- This is the key line
              fontStyle: 'bold', //You can also style these values differently
              fontSize: 14 //You can also style these values differently
            },
          },
        }]
      },
    }
  });
}

function compareGraphSet() {
  let temBtn = document.getElementById("tempCompare");
  let humiBtn = document.getElementById("humiCompare");
  temBtn.style.backgroundColor = "#E35F43";
  temBtn.style.color = "white";
  humiBtn.style.backgroundColor = "white";
  humiBtn.style.color = "#E35F43";

  date_label = [];
  day_all_tem_data = [];
  day_all_humi_data = [];
  day_compareGraph = [];
  let day_tem_day = [];
  let day_humi_day = [];
  
  let get_select_date = document.getElementById('date_now').value;
  //let lastest_week =
  let day7 = (new Date(new Date(get_select_date).getTime() - 604800000).toLocaleDateString('en-CA'));
 // console.log(day9);
  let start_mount = ChangeFormateDateV2(date_data30_D_tranfer[0].toString().substring(0, 10));
  let lastest_day = (new Date(new Date(get_select_date).getTime() + 86400000).toLocaleDateString('en-CA'));
  // console.log(lastest_day);

  let lastest_week = ChangeFormateDateV2(date_data7_D_tranfer[0].toString().substring(0, 10));
  //let lastest_week =

  let j = 0;
  let start_count = false;
  if (start_mount > day7) {
    console.log("this not collect 7 day");
    let j = 0;
    for (let i = 0; i < date_data7_D.length; i++) {
      let day_count = ChangeFormateDateV2(date_data7_D_tranfer[i].toString().substring(0, 10));
      if (day_count == lastest_day) {
          day_all_tem_data.push(day_tem_day);
          day_all_humi_data.push(day_humi_day);

        break;
      } else if (day_count != lastest_week) {
        if (j < 1440) {
          date_label.push(date_data7_D[i]);
        }
        if (0 == j % 1440) {
          day_compareGraph.push(ChangeFormateDateV2(date_data7_D_tranfer[i+10].toString().substring(0, 10)));
          day_all_tem_data.push(day_tem_day);
          day_all_humi_data.push(day_humi_day);
          day_humi_day = [];
          day_tem_day = [];
        }
        day_tem_day.push(temp_data7_D[i]);
        day_humi_day.push(humi_data7_D[i]);
        j++
      } 
    }
  } else {
    for (let i = 0; i < date_data30_D.length; i++) {
      let day_count = ChangeFormateDateV2(date_data30_D_tranfer[i].toString().substring(0, 10));
      
      if (day_count == lastest_day) {
          day_all_tem_data.push(day_tem_day);
          day_all_humi_data.push(day_humi_day);
          day_compareGraph.push(ChangeFormateDateV2(date_data30_D_tranfer[i+10].toString().substring(0, 10)));
        break;
      } else if (day_count == day7) {
        start_count = true;
        
      } 
      if (start_count) {
        if (j < 1440) {
          date_label.push(date_data30_D[i]);
        }
        if (0 == j % 1440) {
          day_compareGraph.push(ChangeFormateDateV2(date_data30_D_tranfer[i+10].toString().substring(0, 10)));
          day_all_tem_data.push(day_tem_day);
          day_all_humi_data.push(day_humi_day);
          day_humi_day = [];
          day_tem_day = [];
          console.log(day_count);
        }
        day_tem_day.push(temp_data30_D[i]);
        day_humi_day.push(humi_data30_D[i]);
        j++
      } 
    }
  }
  // console.log(day_all_tem_data);
  // console.log(day_all_humi_data);
  /*for(let i = 0 ;i < day_all_tem_data.length; i++) {
    compareChart.data.datasets[i].data = day_all_tem_data[i+1];
  }*/
  compareChart.destroy();
  let ctx3 = document.getElementById('compareChart').getContext('2d');
  compareChart = new Chart(ctx3, {
    type: 'line',
    data: {
      labels: date_label,
    },
    options: {
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
          type: 'linear',
          position: 'left',
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
            tooltipFormat: 'HH:mm:ss',
            parser: 'HH:mm:ss', //these formatting values do nothing, I've tried a few different ones
            //: 'second', //I have tried minutes and hours too, same result
            displayFormats: {
              hour: 'HH:mm'
            }
          },
          ticks: {
            //source: 'auto',
            major: {
              //enabled: true, // <-- This is the key line
              fontStyle: 'bold', //You can also style these values differently
              fontSize: 14 //You can also style these values differently
            },
          },
        }]
      },
    }
  });
  initialCompareChart();
}


function initialCompareChart(){
  
  for(let i = 0 ;i < day_all_tem_data.length - 1; i++) {
    compareChart.data.datasets.push({
      label: day_compareGraph[i] ,
      backgroundColor: getPastelColor(),
      borderColor: getPastelColor(),
      indexLabelFontSize: 10,
      fill: false,
      data: day_all_tem_data[i+1],
      pointRadius: 0,
      borderWidth: 3,
      tension: 0
    });
  }
  compareChart.update();
}

function compareChartTem() {
  let temBtn = document.getElementById("tempCompare");
  let humiBtn = document.getElementById("humiCompare");
  temBtn.style.backgroundColor = "#E35F43";
  temBtn.style.color = "white";
  humiBtn.style.backgroundColor = "white";
  humiBtn.style.color = "#E35F43";

  //compareChart.destroy();
  for(let i = 1 ;i < day_all_tem_data.length; i++) {
    compareChart.data.datasets[i-1].data = day_all_tem_data[i];
    //compareChart.data.datasets[i-1].label = day_compareGraph[i];
    let color = getPastelColor();
    compareChart.data.datasets[i-1].backgroundColor = color;
    compareChart.data.datasets[i-1].borderColor = color;
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
  for(let i = 1 ;i < day_all_humi_data.length; i++) {
    compareChart.data.datasets[i-1].data = day_all_humi_data[i];
    let color = getPastelColor();
    compareChart.data.datasets[i-1].backgroundColor = color;
    compareChart.data.datasets[i-1].borderColor = color;
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


// อยู่ตรงนี้วัยรุ่น
/////////////////////////////////////////////////// start function
//////////////////////////////// Start Fucntion
initialLoad();


