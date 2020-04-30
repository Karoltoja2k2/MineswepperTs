const Game = () => {
    var template =
    `
    <div class="background">
        <div class="gameContainer" id="gameContainer">
            <div class="menu">
                <div class="counter">
                    <h1 id="bombCounter">091</h1>
                </div>
                <div class="midButtons">
                    <button id="newGameBtn">New game</button>
                    <button id="changeSizeBtn">Change size</button>
                    <button id="test">TEST</button>

                </div>
                <div class="counter">
                    <h1 id="timeCounter">012</h1>
                </div>
            </div>

            
            
            <div class="grid" id="grid">
            </div>
        </div>  
  
    </div>
    `;
    return template;
}

export default Game