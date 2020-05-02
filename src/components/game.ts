const Game = () => {
    var template =
    `
    <div class="background" id="background">
        <div class="gameContainer" id="gameContainer">
            <div class="menu">
                <div class="counter">
                    <h1 id="bombCounter">091</h1>
                </div>
                <button class="newgamebtn" id="newGameBtn"> 
                    <span class="material-icons" style="font-size:36px;">
                        fiber_new
                    </span>
                </button>                     
                <div class="counter">
                    <h1 id="timeCounter">012</h1>
                </div>
            </div>
            
            <div class="grid" id="grid">
            </div>            
        </div> 
        
        <button class="settingsbtn" id="settingsBtn">
            <span class="material-icons" style="font-size:36px;">
                settings
            </span>
        </button>

        <div class="dropdown-content" id="dropdown-content">
            <div class="bg">
            </div>
            <h1>Mineswepper</h1>
            <button id="changeSizeBtn">Change size</button>
            <input type="range" min="10" max="50" value="30" class="slider rangeInput" id="squareSizeSlider">
            <label for"nameInput">Nickname</label>
            <input class="nameInput" type="text" id="nameInput">
            </div>
        
    </div>
    `;
    return template;
}

export default Game