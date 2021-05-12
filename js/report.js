const dbRef = firebase.database().ref();
const db_devices = "devices_sensor";

//Get url parameter (the device name)
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const device = urlParams.get('device');

dbRef.child(db_devices).child(device).get().then((snapshot) => {
    if (snapshot.exists()) {
        let deviObj = snapshot.val();
        let n_sampling = Object.keys(deviObj).length;
        let last_samp = Object.keys(deviObj)[n_sampling-1];
        let first_samp = Object.keys(deviObj)[0];
        console.log("Number of sampling: " + n_sampling);
        console.log("Last sampling key: " + last_samp);

        // Display device info
        document.getElementById("device").innerText = deviObj[last_samp].deviceNameID;
        document.getElementById("dName").innerText = deviObj[last_samp].deviceNameID;

        // Convert timestamp to readable
        let timestamp = (deviObj[last_samp].timestamp)/1000;
        let date = new Date(timestamp * 1000);
        lastDateTime = readableTime(date);
        timestamp = (deviObj[first_samp].timestamp)/1000;
        date = new Date(timestamp * 1000);
        firstDateTime = readableTime(date);

        document.getElementById("lastTime").innerText = lastDateTime;
        document.querySelector(".temp").innerHTML = `<i class="fas fa-thermometer-half"></i>${deviObj[last_samp].temperature} °C`;
        document.querySelector(".humi").innerHTML = `<i class="fas fa-tint"></i>${deviObj[last_samp].humidity} %`;
    } else {
        console.log("No data available")
    }
}).catch((error) => {
  console.error(error);
});

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
            1: {  //Device Name
                cellWidth: 100,  
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
    
    // create a new canvas object that we will populate with all other canvas objects
    let pdfCanvas = $('<canvas />').attr({
      id: "canvaspdf",
      width: reportPageWidth,
      height: reportPageHeight
    });
    
    // keep track canvas position
    let pdfctx = $(pdfCanvas)[0].getContext('2d');
    let pdfctxX = 0;
    let pdfctxY = 0;
    let buffer = 100;
    // make canvas BG is white
    pdfctx.fillStyle = "white";
    pdfctx.fillRect(0, 0, 1200, 800);
    
    // for each chart.js chart
    $("canvas").each(function(index) {
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
    
    // create new pdf and add our new canvas as an image
    let pdf = new jsPDF('landscape');
    pdf.setFontSize(20)
    pdf.text(140, 15, `${device}`)
    pdf.addImage($(pdfCanvas)[0], 'PNG', 12, 25);
    
    // download the pdf
    pdf.save('graph-report.pdf');
}
    