const N = 319; // number of colors
var n_tests;
var seed = 8;
var score = [[],[],[],[],[]];
var spans;
var rand = mulberry32(seed);


function show_circle(i, pos, correct){
    var img = document.createElement("img");
    img.src = `../images/p${i%N}.png`;
    img.className = "color-circle";
    img.dataset.correct = correct;
    let ball = document.getElementById(pos);
    ball.removeChild(ball.firstChild);
    ball.insertBefore(img, ball.firstChild);
}

function draw_circles(play){
    let r = Math.floor(rand()*3); // deviator
    let h = +play.dataset.hue;
    let level = +play.dataset.level;
    let de = spans[level];
    show_circle(h + (r==0) * de, "left", r==0);
    show_circle(h + (r==1) * de, "middle", r==1);
    show_circle(h + (r==2) * de, "right", r==2);
    document.getElementById("title").textContent = `${level+1}.${play.dataset.test}`;
}

function mulberry32(a) {
    return function() {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
} 

function play_next() {
    let play = document.getElementById(`play`);
    let played = +play.dataset.test;
    if (played < n_tests) {
        play.dataset.test = +play.dataset.test + 1;
        play.dataset.hue = Math.floor(rand() * 319);
        draw_circles(play);
    } else {
        show_interim(play);
    }

}

function show_interim(play){
    play.style.display = "none";
    let interim = document.getElementById("interim");
    let level = +play.dataset.level;
    let n_good = 0;
    for ({hue,result} of score[level]) {
        if (result === "true") n_good += 1;
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

function init_splash(){
    document.getElementById("splash").addEventListener('click', e => {
        document.getElementById("splash").style.display = "none";
        document.getElementById("play").style.display = "flex";
        play_next();
    });
}

function update_score(play, correct){
    score[+play.dataset.level].push({hue:play.dataset.hue, result: correct});
}

function init_play_select(play, position){
        let item = play.querySelector(position);
        item.addEventListener("click", e => {
            let img = item.querySelector("img");
            update_score(play, img.dataset.correct);
            play_next();
        })
}

function init_interim() {
    let interim = document.getElementById("interim");
    interim.addEventListener("click", e => {
        interim.style.display = "none";
        document.getElementById("play").style.display = "flex";
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

