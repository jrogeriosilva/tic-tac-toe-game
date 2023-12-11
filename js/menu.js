function selectMode(){
    let mode = document.getElementById("mode").value;
    let size = document.getElementById("size").value;
    window.location.href = `game.html?mode=${mode}&size=${size}`
}