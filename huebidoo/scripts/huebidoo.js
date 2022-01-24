const N = 319; // number of colors
var n_tests;
var seed = 8;
var score = [[],[],[],[],[]];
var spans;
var rand = mulberry32(seed);

function mulberry32(a) {
    return function() {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
} 

function draw_circle(i, pos, correct){
    var img = document.createElement("img");
    img.src = `../images/p${i%N}.png`;
    img.className = "color-circle";
    img.dataset.correct = correct?1:0;
    let ball = document.getElementById(pos);
    ball.removeChild(ball.firstChild);
    ball.insertBefore(img, ball.firstChild);
}

function draw_circles(play){
    let r = Math.floor(rand()*3); // deviator
    let h = +play.dataset.hue;
    let level = +play.dataset.level;
    let de = spans[level];
    draw_circle(h + (r==0) * de, "left", r==0);
    draw_circle(h + (r==1) * de, "middle", r==1);
    draw_circle(h + (r==2) * de, "right", r==2);
    document.getElementById("title").textContent = `${level+1}.${play.dataset.test}`;
}


function play_next() {
    let play = document.getElementById(`play`);
    let played = +play.dataset.test;
    if (played < n_tests) {
        play.dataset.test = +play.dataset.test + 1;
        play.dataset.hue = Math.floor(rand() * 319);
        draw_circles(play);
    } else if (+play.dataset.level < spans.length - 1) {
        show_interim(play);
    } else {
        show_report(play, score);
    }

}

function show_interim(play){
    play.style.display = "none";
    let interim = document.getElementById("interim");
    let level = +play.dataset.level;
    let n_good = 0;
    for ( const {hue,result} of score[level]) {
        if (+result === 1) n_good += 1;
    }
    document.querySelector("#interim").innerHTML = `
        <div>Round ${level + 1} score:</div>
        <h1>${n_good}/${n_tests}</h1>
        <div>Click for round ${level+2} of ${spans.length}</div>
    `;
    interim.style.display = "flex";
    play.dataset.level = level + 1;
    play.dataset.test = 0;
}

function show_report(play){
    play.style.display = "none";
    let report = document.getElementById("report");
    let n;
    for (i=0; i<score.length; i++) {
        for (j=0, n=0; j<score[i].length; j++) {
            ({hue, result} = score[i][j]);
            if (+result === 1) n += 1;
        }
        let h = document.createElement("p");
        h.style.margin = 0;
        h.textContent = `Round ${i}:  ${n}/${n_tests}`;
        report.appendChild(h)
    }

    report.style.display = "flex";
}



function init_splash(){
    document.getElementById("splash").addEventListener('click', e => {
        document.getElementById("splash").style.display = "none";
        document.getElementById("play").style.display = "flex";
        play_next();
    });
}



function init_interim() {
    let interim = document.getElementById("interim");
    interim.addEventListener("click", e => {
        interim.style.display = "none";
        document.getElementById("play").style.display = "flex";
        play_next();
    })
}

function init_play_select(play, position){
        let item = play.querySelector(position);
        item.addEventListener("click", e => {
            let img = item.querySelector("img");
            score[+play.dataset.level].push({hue:play.dataset.hue, result: img.dataset.correct});
            play_next();
        })
}

function init_plays(){
    let parameters = document.querySelector("main").dataset;
    spans = JSON.parse(parameters.levelsSpan);
    n_tests = +parameters.tests;
    let p = document.getElementById("play");
    init_play_select(p, "#left");
    init_play_select(p, "#middle");
    init_play_select(p, "#right");
}

