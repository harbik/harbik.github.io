const N = 319; // number of colors
var n_tests;
var spans; // distance between color samples in the various rounds
var play; // play section node
var results;
var rand;// = mulberry32(seed);

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
    img.dataset.time = Date.now();
    let ball = document.getElementById(pos);
    ball.removeChild(ball.firstChild);
    ball.insertBefore(img, ball.firstChild);
}

function draw_circles(/*play*/){
    let positions = JSON.parse(play.dataset.positions);
    let pos_outlier = positions.pop();
    play.dataset.positions = JSON.stringify(positions);
    let h = +play.dataset.hue;
    let level = +play.dataset.level;
    let de = spans[level];
    draw_circle(h + (pos_outlier==0) * de, "left", pos_outlier==0);
    draw_circle(h + (pos_outlier==1) * de, "middle", pos_outlier==1);
    draw_circle(h + (pos_outlier==2) * de, "right", pos_outlier==2);
}

function play_next() {
    let hues = JSON.parse(play.dataset.hues);
    if (hues.length>0) {
        play.dataset.hue = hues.pop();
        play.dataset.hues = JSON.stringify(hues);
        play.dataset.test = +play.dataset.test + 1;
        document.getElementById("title").textContent = `${+play.dataset.level+1}.${n_tests-hues.length}`;
        draw_circles();
    } else if (+play.dataset.level < spans.length - 1) {
        show_interim();
    } else {
        show_report();
    }
}

function show_interim(){
    play.style.display = "none";
    let interim = document.getElementById("interim");
    let level = +play.dataset.level;
    let n_good = 0;
    for ( const {hue,result} of results.score[level]) {
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

function show_report(){
    play.style.display = "none";
    results.duration = Math.floor((Date.now()-results.date)/1000);
    let report = document.getElementById("report");
    let n;
    for (i=0; i<results.score.length; i++) {
        for (j=0, n=0; j<results.score[i].length; j++) {
            ({hue, result} = results.score[i][j]);
            if (+result === 1) n += 1;
        }
        let h = document.createElement("p");
        h.style.margin = 0;
        h.textContent = `Round ${i+1}:  ${n}/${n_tests}`;
        report.appendChild(h)
    }

    report.style.display = "flex";
    console.log(results);
}

function init_splash(){
    document.getElementById("splash").addEventListener('click', e => {
        document.getElementById("splash").style.display = "none";
        play.style.display = "flex";
        init_hues();
        init_positions();
        play_next();
    });
}

function init_interim() {
    let interim = document.getElementById("interim");
    interim.addEventListener("click", e => {
        interim.style.display = "none";
        play.style.display = "flex";
        init_hues();
        init_positions();
        play_next();
    })
}

// make this a generator?
function init_hues() {
    let ordered_hues = [];
    for (i=0;i<n_tests;i++){
        ordered_hues.push(Math.floor((i+rand()) * N/n_tests));
    }
    let hues = [];
    for (i=0; i<n_tests;i++){
        let index = Math.floor(rand()*ordered_hues.length);
        hues.push(ordered_hues.splice(index, 1)[0])
    }
    play.dataset.hues = JSON.stringify(hues);
}

// make this a generator?
function init_positions() {
    let ordered_positions = [];
    let seed = Date.now()%3;
    for (i=0;i<n_tests; i++) {
        ordered_positions.push((seed+i)%3);
    }
    let positions = [];
    for (i=0; i<n_tests;i++){
        let index = Math.floor(rand()*ordered_positions.length);
        positions.push(ordered_positions.splice(index, 1)[0])
    }
    play.dataset.positions = JSON.stringify(positions);
}

function init_plays(){
    for (position of ["#left", "#middle", "#right"]) {
        let item = play.querySelector(position);
        item.addEventListener("click", e => {
            let img = item.querySelector("img");
            results.score[+play.dataset.level].push({hue:play.dataset.hue, result: img.dataset.correct, time: Date.now()-img.dataset.time});
            play_next();
        })

    }
}

function init(){
    // init globals
    let parameters = document.querySelector("main").dataset;
    spans = JSON.parse(parameters.levelsSpan);
    n_tests = +parameters.tests;
    play = document.getElementById("play");
    let date = Date.now();
    seed = date % Math.pow(2,32);
    rand = mulberry32(seed);
    let score = [];
    for (i=0; i<spans.length; i++) score.push([]);
    results = {date, seed, score, duration: 0};

    // set up all the event handlers
    init_splash();
    init_plays();
    init_interim();
}