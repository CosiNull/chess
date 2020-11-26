let canvas = document.getElementById("canvas");
canvas.width = 550;
canvas.height = 550;
let c = canvas.getContext("2d");
//_____________________________________________________________
let images = {};
let imageElements = document.getElementsByClassName("image");
const htmlFileName = "chess.html"
for(let i=0;i<imageElements.length;i++){
    images[JSON.stringify(imageElements[i].src).substring(JSON.stringify(location.href).length-htmlFileName.length+6,
    JSON.stringify(imageElements[i].src).length-5) ] = imageElements[i];
}
console.log(images);

function drawBackground(){
    c.drawImage(images["background"],0,0,canvas.width,canvas.height);
}