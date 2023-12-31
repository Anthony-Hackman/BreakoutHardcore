// Initial Parameters
let alpha = 0;

    const BALL_SPD = 0.5;
    const BALL_SPD_MAX = 1.5;
    const BALL_SPIN = 0.2;
    const Brick_CLMS = 5;
    const Brick_GAP = 0.3;
    const Brick_RWS = 1; // Must be > 0
    const GAME_LIVES = 1 
    const KEY_SCORE = "breakout_highscore";
    const MARGIN = 6;
    const MAX_LVL = 5; // Currently affects Y alignment of Bricks
    const MIN_BOUNCE_ANGLE = 30;
    const PADDLE_SPD = 0.7;
    const PADDLE_W = 0.1;
    const WALL = 0.02;

// Colors
    const COLOR_BACKGROUND = "black";
    const COLOR_BALL = "white";
    const COLOR_PADDLE = "white";
    const COLOR_TXT = "white";
    const COLOR_WALL = "black";

// Text
    const TXT_FONT = "Consolas";
    const TXT_GAME_OVER = "YOU LOST";
    const TXT_LVL = "LEVEL";
    const TXT_LIVES = "LIVES";
    const TXT_SCORE = "SCORE";
    const TXT_SCORE_HI = "HIGHSCORE";
    const TXT_WIN = "CHICKEN DINNER";

 // Definitions
    const Direction = {
        LEFT: 0,
        RIGHT: 1,
        STOP: 2,
    }

 // Set up game canvas and context
    var canv = document.createElement("canvas");
    document.body.appendChild(canv);
    var ctx = canv.getContext("2d");

// Game Variables
    var ball, Bricks = [], paddle;
    var gameOver, win;
    var level, lives, score, scoreHigh;
    var numBricks, textSize, touchX;

// dimensions
    var height, width, wall;
    setDimensions();

// Event Listeners (Incl Touch Device)
    canv.addEventListener("touchcancel", touchCancel);
    canv.addEventListener("touchend", touchEnd);
    canv.addEventListener("touchmove", touchMove);
    canv.addEventListener("touchstart", touchStart);
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
    window.addEventListener("resize", setDimensions);
// Game Loop
    var timeDelta, timeLast;
    requestAnimationFrame(loop);

    function loop(timeNow) {
        if (!timeLast) {
            timeLast = timeNow;
        }

        // Calculate Time Difference
        timeDelta = (timeNow - timeLast) * 0.001; // seconds
        timeLast = timeNow;

        // Update
        if (!gameOver) {
            updatePaddle(timeDelta);
            updateBall(timeDelta);
            updateBricks(timeDelta);
        }

        // Draw
        drawBackground();
        drawWalls();
        drawPaddle();
        drawBricks();
        drawText();
        drawBall();

        // Call Next Loop
        requestAnimationFrame(loop);
    }

 // Update x and y velocity of ball
    function applyBallSpeed(angle) {
        ball.xv = ball.spd * Math.cos(angle);
        ball.yv = -ball.spd * Math.sin(angle);
    }

function createBricks() {
        
        // Row Dimensions
        let minY = wall;
        let maxY = ball.y - ball.h * 3;
        let totalSpaceY = maxY - minY;
        let totalRows = MARGIN + Brick_RWS + MAX_LVL * 2;
        let rowH = totalSpaceY / totalRows;
        let gap = wall * Brick_GAP;
        let h = rowH - gap;
        textSize = rowH * MARGIN * 0.2;

        // Column Dimensions
        let totalSpaceX = width - wall * 2;
        let colW = (totalSpaceX - gap) / Brick_CLMS;
        let w = colW - gap;

        // Populate Bricks Array
        Bricks = [];
        let cols = Brick_CLMS;
        let rows = Brick_RWS + level * 2;
        let color, left, rank, rankHigh, score, spdMult, top;
        numBricks = cols * rows;
        rankHigh = rows * 0.5 - 1;
        for (let i = 0; i < rows; i++) {
            Bricks[i] = [];
            rank = Math.floor(i * 0.5);
            score = (rankHigh - rank) * 2 + 1;
            spdMult = 1 + (rankHigh - rank) / rankHigh * (BALL_SPD_MAX - 1);
            top = wall + (MARGIN + i) * rowH;
            for (let j = 0; j < cols; j++) {
                left = wall + gap + j * colW;
                Bricks[i][j] = new Brick(left, top, w, h, color, score, spdMult);
            }
        }
    }

    function drawBackground() {
        ctx.fillStyle = COLOR_BACKGROUND;
        ctx.fillRect(0, 0, width, height);
    }

    function drawBall() {
        ctx.fillStyle = COLOR_BALL;
        ctx.fillRect(ball.x - ball.w * 0.5, ball.y - ball.h * 0.5, ball.w, ball.h);
    }

    function drawBricks() {
        for (let row of Bricks) {
            for (let Brick of row) {
                if (Brick == null) {
                    continue;
                }
                ctx.fillStyle = Brick.color;
                ctx.fillRect(Brick.left, Brick.top, Brick.w, Brick.h);
            }
        }
    }

    function drawPaddle() {
        ctx.fillStyle = COLOR_PADDLE;
        ctx.fillRect(paddle.x - paddle.w * 0.5, paddle.y - paddle.h * 0.5, paddle.w, paddle.h);
    }

    function drawText() {
    ctx.fillStyle = COLOR_TXT;

    // Dimensions
    let labelSize = textSize * 0.5;
    let margin = wall * 2;
    let maxWidth = width - margin * 2;
    let maxWidth1 = maxWidth * 0.27;
    let maxWidth2 = maxWidth * 0.2;
    let maxWidth3 = maxWidth * 0.2;
    let maxWidth4 = maxWidth * 0.27;
    let x1 = margin;
    let x2 = width * 0.4;
    let x3 = width * 0.6;
    let x4 = width - margin;
    let yLabel = wall + labelSize;
    let yValue = yLabel + textSize * .8;

    // Labels
    ctx.font = labelSize + "px " + TXT_FONT;
    ctx.textAlign = "left";
    ctx.fillText(TXT_SCORE, x1, yLabel, maxWidth1);
    ctx.textAlign = "center";
    ctx.fillText(TXT_LIVES, x2, yLabel, maxWidth2);
    ctx.fillText(TXT_LVL, x3, yLabel, maxWidth3);
    ctx.textAlign = "right";
    ctx.fillText(TXT_SCORE_HI, x4, yLabel, maxWidth4);

    // Values
    ctx.font = textSize + "px " + TXT_FONT;
    ctx.textAlign = "left";
    ctx.fillText(score, x1, yValue, maxWidth1);
    ctx.textAlign = "center";
    ctx.fillText(lives, x2, yValue, maxWidth2);
    ctx.fillText(level, x3, yValue, maxWidth3);
    ctx.textAlign = "right";
    ctx.fillText(scoreHigh, x4, yValue, maxWidth4);

    // game over fade-in
    if (gameOver) {
        let text = win ? TXT_WIN : TXT_GAME_OVER;
        ctx.font = textSize + "px " + TXT_FONT;
        ctx.textAlign = "center";
        ctx.globalAlpha = alpha; // Set the alpha value
        ctx.fillStyle = "red"; // Set the text color to red
        ctx.fillText(text, width * 0.5, paddle.y * .25, maxWidth);
        ctx.globalAlpha = 1; // Reset alpha to 1 for other elements

        // Gradually increase game over alpha
        if (alpha < 1) {
            alpha += 0.02; // Adjust the increment for the desired speed of the fade-in
            }
        }
    }

    function drawWalls() {
        let hwall = wall * 0.5;
        ctx.strokeStyle = COLOR_WALL;
        ctx.beginPath();
        ctx.moveTo(hwall, height);
        ctx.lineTo(hwall, hwall);
        ctx.lineTo(width - hwall, hwall);
        ctx.lineTo(width - hwall, height);
        ctx.stroke();
    }

function keyDown(ev) {
        switch (ev.keyCode) {
            case 32: 	// space bar (serve the ball)
                serve();
                if (gameOver) {
                    newGame();
                }
                break;
            case 37: 	// left arrow (move paddle left)
                movePaddle(Direction.LEFT);
                break;
            case 39: 	// right arrow (move paddle right)
                movePaddle(Direction.RIGHT);
                break;
        }
    }

    function keyUp(ev) {
        switch (ev.keyCode) {
            case 37: // left arrow (stop moving)
            case 39: // right arrow (stop moving)
                movePaddle(Direction.STOP);
                break;
        }
    }

    function movePaddle(direction) {
        switch (direction) {
            case Direction.LEFT:
                paddle.xv = -paddle.spd;
                break;
            case Direction.RIGHT:
                paddle.xv = paddle.spd;
                break;
            case Direction.STOP:
                paddle.xv = 0;
                break;
        }
    }

    function newBall() {
        paddle = new Paddle();
        ball = new Ball();
    }

    function newGame() {
        gameOver = false;
        level = 1;
        lives = GAME_LIVES;
        score = 0;
        win = false;
        alpha = 0;

        // Get Highscore from local storage
        let scoreStr = localStorage.getItem(KEY_SCORE);
        if (scoreStr == null) {
            scoreHigh = 0;
        } else {
            scoreHigh = parseInt(scoreStr);
        }
        
        // Start a New Level
        newLevel();
    }

    function newLevel() {
        touchX = null;
        newBall();
        createBricks();
    }

    function outOfBounds() {
        lives--;
        if (lives == 0) {
            gameOver = true;
        }
        newBall();
    }

    function serve() {

        // Ball already in motion
        if (ball.yv != 0) {
            return false;
        }

        // Random angle (not less than min bounce angle)
        let minBounceAngle = MIN_BOUNCE_ANGLE / 180 * Math.PI; // radians
        let range = Math.PI - minBounceAngle * 2;
        let angle = Math.random() * range + minBounceAngle;
        applyBallSpeed(angle);
        return true;
    }

    function setDimensions() {
        height = window.innerHeight;
        width = window.innerWidth;
        wall = WALL * (height < width ? height : width);
        canv.width = width;
        canv.height = height;
        ctx.lineWidth = wall;
        ctx.textBaseline = "middle";
        newGame();
    }

    function spinBall() {
        let upwards = ball.yv < 0;
        let angle = Math.atan2(-ball.yv, ball.xv);
        angle += (Math.random() * Math.PI / 2 - Math.PI / 4) * BALL_SPIN;

        // Minimum bounce angle
        let minBounceAngle = MIN_BOUNCE_ANGLE / 180 * Math.PI; // radians
        if (upwards) {
            if (angle < minBounceAngle) {
                angle = minBounceAngle;
            } else if (angle > Math.PI - minBounceAngle) {
                angle = Math.PI - minBounceAngle;
            }
        } else {
            if (angle > -minBounceAngle) {
                angle = -minBounceAngle;
            } else if (angle < -Math.PI + minBounceAngle) {
                angle = -Math.PI + minBounceAngle;
            }
        }
        applyBallSpeed(angle);
    }

    function touchCancel(ev) {
        touchX = null;
        movePaddle(Direction.STOP);
    }

    function touchEnd(ev) {
        touchX = null;
        movePaddle(Direction.STOP);
    }

    function touchMove(ev) {
        touchX = ev.touches[0].clientX;
    }

    function touchStart(ev) {
        if (serve()) {
            if (gameOver) {
                newGame();
            }
            return;
        }
        touchX = ev.touches[0].clientX;
    }

    function updateBall(delta) {
        ball.x += ball.xv * delta;
        ball.y += ball.yv * delta;

        // Bounce the ball off the walls
        if (ball.x < wall + ball.w * 0.5) {
            ball.x = wall + ball.w * 0.5;
            ball.xv = -ball.xv;
            spinBall();
        } else if (ball.x > width - wall - ball.w * 0.5) {
            ball.x = width - wall - ball.w * 0.5;
            ball.xv = -ball.xv;
            spinBall();
        } else if (ball.y < wall + ball.h * 0.5) {
            ball.y = wall + ball.h * 0.5;
            ball.yv = -ball.yv;
            spinBall();
        }

        // Bounce off the paddle
        if (ball.y > paddle.y - paddle.h * 0.5 - ball.h * 0.5
            && ball.y < paddle.y + paddle.h * 0.5
            && ball.x > paddle.x - paddle.w * 0.5 - ball.w * 0.5
            && ball.x < paddle.x + paddle.w * 0.5 + ball.w * 0.5
        ) {
            ball.y = paddle.y - paddle.h * 0.5 - ball.h * 0.5;
            ball.yv = -ball.yv;
            spinBall();
        }

        // Handle out of bounds
        if (ball.y > height) {
            outOfBounds();
        }

        // Move the stationary ball with the paddle
        if (ball.yv == 0) {
            ball.x = paddle.x;
        }
    }

    function updateBricks(delta) {

        // Check for ball collisions
        OUTER: for (let i = 0; i < Bricks.length; i++) {
            for (let j = 0; j < Brick_CLMS; j++) {
                if (Bricks[i][j] != null && Bricks[i][j].intersect(ball)) {
                    updateScore(Bricks[i][j].score);
                    ball.setSpeed(Bricks[i][j].spdMult);

                    // Set ball to the edge of the Brick
                    if (ball.yv < 0) { // upwards
                        ball.y = Bricks[i][j].bot + ball.h * 0.5;
                    } else { // downwards
                        ball.y = Bricks[i][j].top - ball.h * 0.5;
                    }

                    // Bounce the ball and destroy the Brick
                    ball.yv = -ball.yv;
                    Bricks[i][j] = null;
                    numBricks--;
                    spinBall();
                    break OUTER;
                }
            }
        }

        // Next level
        if (numBricks == 0) {
            if (level < MAX_LVL) {
                level++;
                newLevel();
            } else {
                gameOver = true;
                win = true;
                newBall();
            }
        }
    }

    function updatePaddle(delta) {

        // Handle touch
        if (touchX != null) {
            if (touchX > paddle.x + wall) {
                movePaddle(Direction.RIGHT);
            } else if (touchX < paddle.x - wall) {
                movePaddle(Direction.LEFT);
            } else {
                movePaddle(Direction.STOP);
            }
        }

        // Move the paddle
        paddle.x += paddle.xv * delta;

        // Stop paddle at walls
        if (paddle.x < wall + paddle.w * 0.5) {
            paddle.x = wall + paddle.w * 0.5;
        } else if (paddle.x > width - wall - paddle.w * 0.5) {
            paddle.x = width - wall - paddle.w * 0.5;
        }
    }

    function updateScore(BrickScore) {
        score += BrickScore;

        // Check for a high score
        if (score > scoreHigh) {
            scoreHigh = score;
            localStorage.setItem(KEY_SCORE, scoreHigh);
        }
    }

    function Ball() {
        this.w = wall;
        this.h = wall;
        this.x = paddle.x;
        this.y = paddle.y - paddle.h / 2 - this.h / 2;
        this.spd = BALL_SPD * height;
        this.xv = 0;
        this.yv = 0;

        this.setSpeed = function(spdMult) {
            this.spd = Math.max(this.spd, BALL_SPD * height * spdMult);
        }
    }

    function Brick(left, top, w, h, color, score, spdMult) {
        this.w = w;
        this.h = h;
        this.bot = top + h;
        this.left = left;
        this.right = left + w;
        this.top = top;
        this.color = color;
        this.score = score;
        this.spdMult = spdMult;

        this.intersect = function(ball) {
            let bBot = ball.y + ball.h * 0.5;
            let bLeft = ball.x - ball.w * 0.5;
            let bRight = ball.x + ball.w * 0.5;
            let bTop = ball.y - ball.h * 0.5;
            return this.left < bRight
                && bLeft < this.right
                && this.bot > bTop
                && bBot > this.top;
        }
    }

    function Paddle() {
        this.w = PADDLE_W * width;
        this.h = wall;
        this.x = width / 2;
        this.y = height - this.h * 3;
        this.spd = PADDLE_SPD * width;
        this.xv = 0;
    }