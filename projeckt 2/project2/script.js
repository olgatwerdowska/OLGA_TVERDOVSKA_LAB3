var canvasFront   =   document.getElementById('front-canvas');
var canvasBack  =   document.getElementById('back-canvas');
ctxf    =   canvasFront.getContext('2d');
ctxb    =   canvasBack.getContext('2d');

var canvasWidth     =   document.getElementById('canvas-width');
var canvasHeight    =   document.getElementById('canvas-height');

var canvasPosition;

var mouseX, mouseY,
mouseXl  =   document.getElementById('mouseX'),
mouseYl  =   document.getElementById('mouseY');

var tools   =   [], size    =   [];

tools.pencil    =   document.getElementById('pencil');
tools.eraser    =   document.getElementById('eraser');
tools.spray    =   document.getElementById('spray');

size.small   =   document.getElementById('small');
size.middle   =   document.getElementById('middle');
size.big   =   document.getElementById('big');

var eraserSize  =   8,
    eraserCursor    =   "url(C:\Users\User\Desktop\redaktor\img\icons8-ластик-96.png),  auto";

var canvasClear =   document.getElementById('clear-canvas'),
    fileImg =   document.getElementById('img-file'),
    properties  =   document.getElementById('properties'),
    imgWidth    =   document.getElementById('img-width'),
    imgHeight   =   document.getElementById('img-height');

var startX  =   100,    startY  =   100;
var blur = document.getElementById('blur');

window.onload   =   function()  {
    canvasPosition  =   canvasBack.getBoundingClientRect();
}

canvasWidth.onchange    =   function()  {
    canvasFront.width   =   canvasWidth.value;
    canvasBack.width   =   canvasWidth.value;
}

canvasHeight.onchange    =   function() {
    canvasFront.height   =   canvasHeight.value;
    canvasBack.height   =   canvasHeight.value;
}

canvasFront.onmousemove =   function(e) {
    mouseX  =   e.clientX   -   canvasPosition.left;
    mouseY  =   e.clientY   -   canvasPosition.top;
    mouseXl.innerHTML   =  parseInt(mouseX);
    mouseYl.innerHTML   =   parseInt(mouseY);
}

canvasClear.onclick =   function()  {
    canvasBack.width    =   canvasBack.width;
    canvasFront.width   =   canvasFront.width;
}

addAllHandlers(tools,   "tool-active");
addAllHandlers(size,   "size-active");

function addAllHandlers(arr,    className){
   for(var  item  in  arr) {
       arr[item].onmousedown   =  addHandler(arr[item],    arr,    className);
   }
}

function    addHandler(element, arr,  className){
    return function(){
        removeAllClasses(arr);
        element.setAttribute('class', className);
    }
}

function removeAllClasses(arr){
    for(var item in arr){
        arr[item].removeAttribute('class');
    }
}

size.small.onclick  =   function(){
    ctxb.lineWidth  =   1;
    eraserSize  =   8; 
}

size.middle.onclick  =   function(){
    ctxb.lineWidth  =   5;
    eraserSize  =   16;
}

size.big.onclick  =   function(){
    ctxb.lineWidth  =   15;
    eraserSize  =   32;
}

var processing  =   false;
var operations  =   [];

operations['mousedown']    =   function()  {
    processing = true;
    ctxb.beginPath();   
}

operations['mouseup']    =   function()  {
    processing = false;
};

operations['mousemove']    =   function()  {
    processing = true;
};

canvasFront.addEventListener('mousedown', function(){
    operations['mousedown']();
});

canvasFront.addEventListener('mouseup', function(){
    operations['mouseup']();
});

canvasFront.addEventListener('mousemove', function(){
    operations['mousemove']();
});

tools.pencil.onclick    =   function(){
    canvasFront.style.cursor    =   "poiner";
    operations['mousemove'] =   function()  {
        if(processing){
            ctxb.lineCap = 'square';
            ctxb.lineTo(mouseX, mouseY);
            ctxb.stroke();
            ctxb.filter = 'none';
        };
    };
};
tools.spray.onclick    =   function(){
    canvasFront.style.cursor    =   "poiner";
    operations['mousemove'] =   function()  {
        if(processing){
            ctxb.lineCap = 'round';
            ctxb.lineTo(mouseX, mouseY); 
            ctxb.stroke(); 
            ctxb.filter = 'none';
        };
    };
};
tools.eraser.onclick    =   function(){
    canvasFront.style.cursor    =   eraserCursor;
    operations['mousemove'] =   function()  {
        if(processing){
            ctxb.clearRect(mouseX, mouseY, eraserSize, eraserSize); 
            ctxb.filter = 'none';
        };
    };
};



color.onchange  =   function(e){
    ctxb.strokeStyle    =   e.srcElement.value;  
}

fileImg.onchange    =   function(){
    var file    =   fileImg.files[0];
    var reader  =   new FileReader();
    reader.onload   =   function(event)  {
        var dataUrl =   event.target.result;
        img =   new Image();
        img.onload  =   function(){
        ctxf.strokeRect(startX, startY, img.width, img.height);
        ctxf.drawImage(img, startX, startY);
        operations['mousemove'] =   function()  {
            if(processing){
                canvasFront.width   =   canvasFront.width;
                ctxf.strokeRect(mouseX, mouseY, imgWidth.value, imgHeight.value);
                ctxf.drawImage(img, mouseX, mouseY, imgWidth.value,
                 imgHeight.value);
            };
        };

        operations['mouseup']   =   function(){
            properties.style.display    =   'none';
            canvasFront.width   =   canvasFront.width;
            processing  =   false;
            ctxb.drawImage(img, mouseX, mouseY, imgWidth.value, imgHeight.value);
            operations['mousemove'] =   undefined;
            operations['mouseup']   =   function(){
                processing  =   false;
            };
        };
        
    };
        img.src =   dataUrl;
        properties.style.display    =   'block';
    };
    reader.readAsDataURL(file);
};

imgWidth.addEventListener('change', changeImgSize);
imgHeight.addEventListener('change', changeImgSize);

function changeImgSize(){
    canvasFront.width   =   canvasFront.width;
    ctxf.strokeRect(startX, startY, imgWidth.value, imgHeight.value);
    ctxf.drawImage(img,startX, startY, imgWidth.value, imgHeight.value)
}



invert.onclick  =   function()  {
    var sepia = document.getElementById('sepia').value;
    var contrast = document.getElementById('contrast').value;
    var blur = document.getElementById('blur').value;
    var grayscale = document.getElementById('grayscale').value;
    var brightness = document.getElementById('brightness').value;
    ctxb.filter = `blur(${blur+'px'}) contrast(${contrast+'%'}) grayscale(${grayscale+'%'}) sepia(${sepia+'%'})
    brightness(${brightness+'%'})`;
}


