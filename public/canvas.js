var canvas = document.getElementById("canv");

///
if (canvas) {
    var context = canvas.getContext("2d");

    let inCanvas = false;

    canvas.addEventListener("mousedown", function() {
        context.beginPath();
        context.strokeStyle = "#FF8300";

        inCanvas = true;

        canvas.addEventListener("mousemove", function(e) {
            if (inCanvas) {
                context.lineTo(e.offsetX, e.offsetY);
                context.stroke();
            }

            // console.log("Write it down!");
        });
    });

    canvas.addEventListener("mouseup", function() {
        inCanvas = false;
        const dataUrl = canvas.toDataURL();
        $('input[name="sig"]').val(dataUrl);
        console.log($('input[name="sig"]').val());
    });
}

// var targLink = document.getElementById("LinkToPeople");
// var clickEvent = document.createEvent("MouseEvents");
// // clickEvent.initEvent("dblclick", true, true);
// // targLink.dispatchEvent(clickEvent);
//
// targLink.addEventListener("click",function(){
//     setTimeOut(clickEvent.initEvent("dblclick", true, true), 1000)
// }

$("#LinkToPeople").dblclick(function() {
    //code executed on jQuery double click rather than mouse double click
    alert("dblclick");
});
