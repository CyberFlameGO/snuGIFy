var cursor = 0,
    testImages = ["/static/images/1.jpg","/static/images/2.jpg"],
    prepped = [],
    prepImages = function(images){
        if(!(images instanceof Array)) images = [images]; // ensure array


    for(var i=0;i<images.length;i++){
        var img = new Image();
            img.src = images[i];
            $(".hidden").append($(img));
            prepped.push(img);
        img.onload = function(){
            console.log(this,"loaded");
        };
        console.log(testImages,prepped);

        return prepCanvas(prepped[0]); //start off our canvas animation
    }
};

var stepOver = function(array){
    var tick = array.length;
    cursor += 1;
    if(cursor > array.length) cursor = 0;
    return array[cursor];

};

var rNum = function(){
    return Math.floor(Math.random()*2);
};

function prepCanvas(image){
    var canvas = document.getElementById("reanimator"),
        context = canvas.getContext('2d'),
        cw = image.width,
        ch = image.height;

    console.log(cw,ch);

    $(canvas).fadeIn();
    canvas.width = cw;
    canvas.height = ch;

    return draw(context,image,cw,ch);

}

function draw(canvas,image,w,h) {
    var i = rNum();
    canvas.drawImage(image,0,0,w,h);
    setTimeout(function(){
        console.log(stepOver(prepped),"vs",image);
        draw(canvas,stepOver(prepped),w,h);
    },300);
}
/*
prepImages(testImages);
setTimeout(function () {
    prepCanvas(prepped[0]);
},300);
*/

/** DOM bits and search **/

function clear_container(container_name) {
    var elmt = document.getElementById(container_name);
    elmt.innerHTML="";
}

function setupSM() {
    soundManager.url = '/static/';
    soundManager.debugMode = false;
    soundManager.flashVersion = 9; // optional: shiny features (default = 8)
    soundManager.useFlashBlock = false; // optionally, enable when you're ready to dive in
    soundManager.onready(function() {
        window.sm_loaded = true;
    });
}

function loopFile(url) {
    if (!window.sm_loaded) {
        return false;
    }
    var s = soundManager.createSound({
      id:url,
      url:url
    });

    s.play({
      loops: 100
    });
    return true;
}

function updateSongInfo(artist, title) {
    $("#songInfo").html("<p>"+artist+"-"+title+"</p>");
}

function injectSong(data) {
    var songObj = data;
    console.log(songObj,"song obj baby");
    updateSongInfo(songObj.artist, songObj.title);
    loopFile(songObj.loop_url);
    prepImages(songObj.gifurls);
    $("#songLoader").fadeOut().remove();
}

function ohShit(e) {
    alert("some shit went wrong so search for another song innit");
    console.log(e);
    $("#songLoader").fadeOut().remove();
}



function searchLoadSong(user_input) {
    clear_container("songInfo");
    var img = $("img.selected");
        source = img.attr("src");
    console.log(source);
    // looks like this:
    // http://snuggle.sandpit.us/looper?combined=kreayshawn%20gucci%20gucci
    $.ajax({
        url: "/looper", 
        data: {combined : user_input, gifurl : source}, 
        dataType: 'JSON', 
        success: injectSong, 
        error:ohShit
    });
    return false;
}

$.extend({
    keys:    function(obj){
        var a = [];
        $.each(obj, function(k){ a.push(k); });
        return a;
    }
});

/** Canvas stuff **/

window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        window.setTimeout(callback, 1000 / 60);
    };
})();
