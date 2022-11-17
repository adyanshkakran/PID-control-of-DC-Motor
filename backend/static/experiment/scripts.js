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
$(".form").submit(function(e) {
    e.preventDefault();
});

function startSim() {
    let kp = $(".kp-input").val();
    let ki = $(".ki-input").val();
    let kd = $(".kd-input").val();
    let angle = $(".angle-input").val();
    fetch('../../../mqtt', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({kp:kp,ki:ki,kd:kd,angle:angle}),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    let submit = document.getElementsByClassName("submit-form")[0]
    submit.disabled = true
    setTimeout(() => {
        submit.disabled = false
    }, 17000);
}

function resetExperiment(){
    fetch('../../../mqtt', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({kp:-1,ki:-1,kd:-1,angle:-1}),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}