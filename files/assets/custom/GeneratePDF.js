function makePDF() {

    var Graph = document.getElementById('container');
    var Tableheader = document.getElementById('Tableheader');
/*    html2canvas(Graph).then(function(canvas){
              window.open(canvas.toDataURL("image/png", 1.0));
        
            }); */
    var pdf = new jsPDF('p', 'pt', 'letter');
    
    html2canvas(Graph).then(function(canvas) {
   console.log("Graph Canvas running");
       
            var srcImg  = canvas;
            var sX      = 0;
            var sY      = 0; // start 980 pixels down for every new page
            var sWidth  = 900;
            var sHeight = 980;
            var dX      = 0;
            var dY      = 0;
            var dWidth  = 900;
            var dHeight = 980;
            window.onePageCanvas = document.createElement("canvas");
            onePageCanvas.setAttribute('width', 900);
            onePageCanvas.setAttribute('height', 980);
            var ctx = onePageCanvas.getContext('2d');
            ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);
            var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

            var width         = onePageCanvas.width;
            var height        = onePageCanvas.clientHeight;

            pdf.addImage(canvasDataURL, 'PNG', 20, 100, 730, 750);
            //pdf.save('test.pdf');
             return html2canvas(Tableheader);
         
        }).then( function (TableCanvas){
            console.log("Table Canvas running");
            var srcImg  = TableCanvas;
            var sX      = 0;
            var sY      = 0; // start 980 pixels down for every new page
            var sWidth  = 900;
            var sHeight = 980;
            var dX      = 0;
            var dY      = 0;
            var dWidth  = 900;
            var dHeight = 980;
            window.anotherPageCanvas = document.createElement("canvas");
            anotherPageCanvas.setAttribute('width', 900);
            anotherPageCanvas.setAttribute('height', 980);
            var ctx = anotherPageCanvas.getContext('2d');
            ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);
            var canvasDataURL = anotherPageCanvas.toDataURL("image/png", 1.0);

            var width         = anotherPageCanvas.width;
            var height        = anotherPageCanvas.clientHeight;
            //pdf.addPage(612, 791);
            //pdf.setPage(2);
            pdf.addImage(canvasDataURL, 'PNG', 20, 500, 700, 750);
            pdf.save('test.pdf');
        
    });
}
       
    
    
    
    
    /*  html2canvas(quotes, {
        onrendered: function(canvas) {

        //! MAKE YOUR PDF
        var pdf = new jsPDF('p', 'pt', 'letter');

        //for (var i = 0; i <= quotes.clientHeight/980; i++) {
            //! This is all just html2canvas stuff
            var srcImg  = canvas;
            var sX      = 0;
            var sY      = 980; // start 980 pixels down for every new page
            var sWidth  = 900;
            var sHeight = 980;
            var dX      = 0;
            var dY      = 0;
            var dWidth  = 900;
            var dHeight = 980;

            window.onePageCanvas = document.createElement("canvas");
            onePageCanvas.setAttribute('width', 900);
            onePageCanvas.setAttribute('height', 980);
            var ctx = onePageCanvas.getContext('2d');
            // details on this usage of this function: 
            // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
            ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);

            // document.body.appendChild(canvas);
            var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

            var width         = onePageCanvas.width;
            var height        = onePageCanvas.clientHeight;

            //! If we're on anything other than the first page,
            // add another page
           // if (i > 0) {
            //    pdf.addPage(612, 791); //8.5" x 11" in pts (in*72)
            //}
            //! now we declare that we're working on that page
            //pdf.setPage(i+1);
            //! now we add content to that page!
            pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width*.62), (height*.62));

        //}
        //! after the for loop is finished running, we save the pdf.
        pdf.save('test.pdf');
    }
  }); */
//}
