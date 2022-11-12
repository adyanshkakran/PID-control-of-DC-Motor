function changeSlider(){
    let kp = document.getElementById("kp")
    
}

setTimeout(() => {
    location.href = '../../logout'
}, parseInt(localStorage.getItem("timeLeft"))*1000);

function updateTime() {
    timeLeft = parseInt(localStorage.getItem("timeLeft"))
    if(!isNaN(timeLeft)){
        if(timeLeft < 0)
            window.location.href = "../../logout"
        timeLeft--
        let min = Math.floor(timeLeft/60),sec = timeLeft%60;
        if(sec < 10)
            sec = "0"+sec
        if(min < 10)
            min = "0"+min
        document.getElementById("time-left").innerHTML = `${min}:${sec}`
        localStorage.setItem("timeLeft",timeLeft)
    }else{
        localStorage.setItem("timeLeft","900")
        document.getElementById("time-left").innerHTML = `15:00`
    }
}

updateTime()
setInterval(updateTime, 1000);

$('.input').keypress(function (e) {
    if (e.which == 13) {
         e.preventDefault();
    }
});

function bind_to_slider(slider,input,min,max,from,step){
    let $range = $(slider);
    let $input = $(input);
    
    $range.ionRangeSlider({
        skin: "round",
        // type: "single",
        min: min,
        max: max,
        from: from,
        step: step,
        onStart: (data) => {
            $input.prop("value", data.from);
        },
        onChange: (data) => {
            $input.prop("value", data.from);
        }
    });
    
    let instance = $range.data("ionRangeSlider");
    
    $input.on("input", function() {
        var val = $(this).prop("value");
        if (val < min) {
            val = min;
        } else if (val > max) {
            val = max;
        }
    
        instance.update({
            from: val
        });
    });
}

bind_to_slider(".kp-slider",".kp-input",-100,100,0,0,0.1);
bind_to_slider(".ki-slider",".ki-input",-100,100,0,0,0.1);
bind_to_slider(".kd-slider",".kd-input",-100,100,0,0,0.1);
bind_to_slider(".angle-slider",".angle-input",0,360,180,1);

function startSim() {
    let kp = $(".kp-input").val();
    let ki = $(".ki-input").val();
    let kd = $(".kd-input").val();
    let angle = $(".angle-input").val();
    fetch('https://9547-14-139-82-6.in.ngrok.io/mqtt',{
        method: 'POST',
        // body: 'field2='+kp+'&field3='+ki+'&field4='+kd+'&field5='+angle
        body : kp+','+ki+','+kd+','+angle
    })
}

function resetExperiment(){
    
}