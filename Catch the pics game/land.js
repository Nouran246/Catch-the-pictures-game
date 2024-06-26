//Matter library allows us to use physics and physical body
//engine --> simluation managments and updates

//world-->container for all objects

//bodies -->various shapes with physical bodies

//modify the properties of the existing bodies
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body=Matter.Body;
let engine;
let items = [];
let lastMouseX=-1;
 let lastMouseY=1;
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    engine = Engine.create();
    engine.world.gravity.y = 0;

    addBoundaries();

    let x = random(100, width - 100);
    let y = random(100, height - 100);
    const imagePaths = [
        './photo/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.webp',
        './photo/biodiversity-shutterstock_1477256246.jpg.webp',
        './photo/close-up-growing-beautiful-forest-in-glass-ball-and-flying-butterflies-in-nature-outdoors-spring-season-concept-generative-ai-photo.jpg',
        './photo/connectwithnature.jpg',
        './photo/images.jpeg',
        './photo/images11111.jpeg',
        './photo/imbnnages.jpeg',
        './photo/NaturePositive.webp',
        './photo/road-1072821_1280.jpg',
        './photo/shutterstock_1288634614.jpg',
        './photo/Untitled.jpeg',
        './photo/nature-3082832_960_720.jpg',
        // Add more image paths here as needed
    ];

    // Iterate over the image paths array and create new Item objects
    for (let i = 0; i < imagePaths.length; i++) {
        items.push(new Item(x, y, imagePaths[i]));
    }
}

function addBoundaries() {
    const thickness = 50;
    World.add(engine.world, [
        Bodies.rectangle(width / 2, -thickness / 2, width, thickness, {
            isStatic: true,
        }),
        Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, {
            isStatic: true,
        }),
        Bodies.rectangle(-thickness / 2, height / 2, thickness, height, {
            isStatic: true,
        }),
        Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, {
            isStatic: true,
        }),
    ]);
}

function draw() {
    background("black");
    Engine.update(engine);
    items.forEach((item) => item.update());
}

class Item {
    constructor(x, y, imagePath) {
        let options = {
            frictionAir: 0.075,
            restitution: 0.25,
            density: 0.002,
            angle: Math.random() * Math.PI * 2,
     
        };

        this.body = Bodies.rectangle(x, y, 100, 200, options);
        World.add(engine.world, this.body);
        this.div = document.createElement("div");
        this.div.className = "item";
        this.div.style.left = `${this.body.position.x - 50}px`;
        this.div.style.top = `${this.body.position.y - 100}px`;
        const img = document.createElement("img");
        img.src = imagePath;
        this.div.appendChild(img);
        document.body.appendChild(this.div);
        this.originalAngle = options.angle;
        this.initialPosition = { x: x, y: y };
        this.centerPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let rotateClicked = false; // Flag to keep track of rotation state

this.div.addEventListener('click', () => {
    if (!rotateClicked) {
        this.rotateToOriginalAngle();
    } else {
        this.restoreOriginalAngle();
    }
    rotateClicked = !rotateClicked; // Toggle rotation state
});
this.isZoomed = false;
this.div.item = this;
// Add event listeners
this.div.addEventListener('click', () => { this.toggleZoom(); });
}


toggleZoom() {
        this.isZoomed = !this.isZoomed; // Toggle the zoom state

        if (this.isZoomed) {
            // Zoom in
            this.zoomIn();
        } else {
            // Zoom out
            this.zoomOut();
        }
    }

    zoomIn() {
    // Check if the item is already at the center
    if (this.body.position.x === this.centerPosition.x && this.body.position.y === this.centerPosition.y) {
        return; // If already at the center, do nothing
    }

    gsap.to(this.div, {
        duration: 0.5,
        width: "500px",
        height: "400px",
        left: `${this.centerPosition.x - 250}px`,
        top: `${this.centerPosition.y - 200}px`,
        x: 0,
        y: 0,
        rotation: this.body.angle,
        ease: "power2.inOut",
        zIndex: 1 // Increase z-index when zooming in
    });

    // Update the body's position to be fixed at the center
    Body.setPosition(this.body, this.centerPosition);
}

zoomOut() {
    // Zoom out to original size and position
    gsap.to(this.div, {
        duration: 0.5,
        width: "200px",
        height: "250px",
        left: `${this.initialPosition.x - 50}px`,
        top: `${this.initialPosition.y - 100}px`,
        rotation: this.body.angle,
        ease: "power2.inOut",
        zIndex: 0 // Return z-index to initial value when zooming out
    });
}










    rotateToOriginalAngle() {
        Body.setAngle(this.body, 0); // Rotate to original angle (assuming it's 0)
    }

    restoreOriginalAngle() {
        Body.setAngle(this.body, this.originalAngle); // Restore to the randomly generated angle
    }

    update() {
        this.div.style.left = `${this.body.position.x - 50}px`;
        this.div.style.top = `${this.body.position.y - 100}px`;
        this.div.style.transform = `rotate(${this.body.angle}rad)`;
    }
    
}





function mouseMoved()
{
  if(dist(mouseX,mouseY,lastMouseX, lastMouseY)>10)
  {
    lastMouseX= mouseX;
    lastMouseY=-mouseY;
    items.forEach((item)=>{
      if(dist(mouseX,mouseY, item.body.position.x,item.body.position.y)<150)
      {
        let forceMagnitude=3;
        Body.applyForce(item.body,{
          x:item.body.position.x,
          y:item.body.position.y,
        },{
          x:random(-forceMagnitude,forceMagnitude),
          y:random(-forceMagnitude,forceMagnitude),
        })
      }


    })
  }
}





// Global variables
let timerInterval;
let score = 0;

function startGame() {
  document.getElementById('startAudio').play();
    // Hide background and buttons
    document.getElementById('background').style.display = 'none';

    // Show popup
    document.getElementById('popup').style.display = 'block';

    // Update the OK button to start the countdown timer
    document.getElementById('okButton').addEventListener('click', () => {
        // Hide the popup
        document.getElementById('popup').style.display = 'none';

        // Start the countdown timer
        countdown();
    });
}




// Function to close the popup
function closePopup() {
    // Hide popup
    document.getElementById('popup').style.display = 'none';
    startTimer();
    // Start updating score on item click
    updateScore();
}

// Function to start countdown timer
function startTimer() {
    let timeLeft = 10;
    timerInterval = setInterval(() => {
        document.getElementById('timer').textContent = timeLeft;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

// Function to update score on item click
// Function to update score on item click
function updateScore() {
    // Remove existing event listeners to prevent duplication
    items.forEach((item) => {
        item.div.removeEventListener('click', handleClick);
        item.div.addEventListener('click', handleClick);
    });
}

// Separate function to handle item click
function handleClick() {
    if (this.item.isZoomed) {
        score++;
        document.getElementById('score').textContent = score;

        // Play points audio
        document.getElementById('pointsAudio').play();
    }
}

const winAudio = new Audio('Audio/320672__rhodesmas__win-01.wav');
const loseAudio = new Audio('Audio/157218__adamweeden__video-game-die-or-lose-life.flac');
// Function to end the game
// Inside the function that handles the end of the game or timer expiration
function endGame() {
    // Check if the score is less than 6 to determine if the player wins or loses
    if (score < 6) {
      loseAudio.play();
      showGameOverAlert(score); 
        
        // Display the background and play again question with buttons
        document.getElementById('background').style.display = 'flex';
        document.getElementById('background').style.alignItems = 'center';
        document.getElementById('playGameButton').textContent = 'Play Again';
        document.getElementById('playGameButton').onclick = playAgain;
        document.getElementById('exploreAppButtons').style.display = 'inline-block'; // Change display to inline-block
    } else {
      winAudio.play();
      showWinAlert(score);
        document.getElementById('background').style.display = 'flex';
        document.getElementById('background').style.alignItems = 'center';
        document.getElementById('playGameButton').textContent = 'Play Again';
        document.getElementById('playGameButton').onclick = playAgain;
        document.getElementById('exploreAppButtons').style.display = 'inline-block'; // Change display to inline-block
      
    }
}

// Function to reset the game state and start again
function playAgain() {
    // Hide end game elements
    document.getElementById('startAudio').play();
    document.getElementById('background').style.display = 'none';

    // Reset game state
    resetGame();

    // Start the game
    startGame();
}
// Inside the countdown function
function countdown() {
    // Decrement the timer
    timer--;

    // Update the timer display
    updateTimerAndScore();

    // If timer reaches 0, end the game
    if (timer === 0) {
        endGame();
       
        return; // Exit the function early
    }

    // Call the function again after 1 second
    setTimeout(countdown, 1000);
}





// Add a function to reset the game state
function resetGame() {
    // Reset all items to their initial state (zoomed out)
    items.forEach(item => {
        item.isZoomed = false;
        item.zoomOut();
    });

    // Shuffle the items to new positions
    items.forEach(item => {
        let x = random(100, window.innerWidth - 100);
        let y = random(100, window.innerHeight - 100);
        Body.setPosition(item.body, { x: x, y: y });
    });

    // Reset timer and score
    timer = 10;
    score = 0;
    updateTimerAndScore();
}

// Function to update the timer and score display
function updateTimerAndScore() {
    document.getElementById('timer').textContent = timer;
    document.getElementById('score').textContent = score;
}


// Function to handle the click event on the OK button of the first popup
function handleOkButtonClick() {
    // Hide the first popup
    document.getElementById('popup').style.display = 'none';

    // Start the countdown timer
    countdown();

    // Hide background and explore app button
    document.getElementById('background').style.display = 'none';
    document.getElementById('exploreAppButton').style.display = 'none';
}

// Add event listener to the OK button
document.getElementById('okButton').addEventListener('click', handleOkButtonClick);



function showEndGameElements() {
        // Hide countdown and score
        document.getElementById('countdown').style.display = 'none';
        document.getElementById('score').style.display = 'none';

        // Show background, title, and buttons
        document.getElementById('background').style.display = 'block';
        showEndGameElements();
    }

    // Function to reset the game state and start again
    function playAgain() {
        // Hide end game elements
        document.getElementById('background').style.display = 'none';

        // Reset game state
        resetGame();

        // Start the game
        startGame();
    }


// Function to display an alert with a custom title and message
function showAlert(title, message, className) {
    // Create a new alert element
    const alert = document.createElement('div');
    alert.classList.add('alert', className);

    // Add title and message to the alert
    alert.innerHTML = `<div class="alert-title">${title}</div>
                       <div class="alert-message">${message}</div>`;

    // Add the alert to the alert container
    const alertContainer = document.querySelector('.alert-container');
    alertContainer.appendChild(alert);

    // Display the alert
    alert.style.display = 'block';

    // Automatically hide the alert after 3 seconds
    setTimeout(() => {
        alert.style.display = 'none';
        // Remove the alert from the alert container
        alertContainer.removeChild(alert);
    }, 3000);
}

// Function to display the game over alert
// Function to display the game over alert
function showGameOverAlert(score) {
    showAlert('Game Over', `You lose! Your score: ${score}`, 'game-over-alert');
}

// Function to display the win alert with the score
function showWinAlert(score) {
    showAlert('Congratulations!', `You win! Your score: ${score}`, 'win-alert');
}

