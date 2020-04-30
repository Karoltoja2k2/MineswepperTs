const Game = () => {
    var template =
    `
    <div class="background">
        <div class="gameContainer" id="gameContainer">
            <div class="menu">
                <div class="counter">
                    <h1 id="bombCounter">091</h1>
                </div>
                <div class="counter">
                    <button id="newGameBtn">New game</button>
                </div>
                <div class="counter">
                    <h1 id="timeCounter">012</h1>
                </div>
            </div>

            
            
            <div class="grid" id="grid">
            </div>

            
        </div>  
        
    </div>
    <div class="settings">
        <div class="dropup">
            <button class="dropbtn">
            </button>
            <div class="dropup-content">
                <button id="changeSizeBtn">Change size</button>
                <input type="range" min="10" max="50" value="30" class="slider" id="squareSizeSlider">


            </div>
        </div>
    </div>
    `;
    return template;
}

export default Game