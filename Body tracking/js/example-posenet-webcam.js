let video;
let poseNet;
let poses = [];
let skeletons = [];
var hand;
var arm_1;

function setup() {
  createCanvas(640, 480).parent('canvasContainer');

  video = createCapture(VIDEO);
  video.size(width, height);
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  

  //////////HAND
  hand = createSprite(100, 150, 50, 100);
  hand.addAnimation('moving', 'assets/hand001.png', 'assets/hand003.png');

  //////////ARM
  arm_1 = createSprite(100, 150, 50, 600);
  arm_1.addAnimation('moving', 'assets/arm001.png', 'assets/arm001.png');



  video.hide();
}


function modelReady() {
  select('#status').html('Model Loaded');
}



function draw() {
  image(video, 0, 0, width, height);
  // We can call both functions to draw all keypoints and the skeletons
  //drawKeypoints();
  //drawSkeleton();
  drawSpecific();
  drawSprites();
}

function drawSpecific()  {
	for (let i = 0; i < poses.length; i++)
		 {
		 	
		 
		 	//ORIGIN - LEFT
		 	fill(255, 0, 0);
		 	
			let leftShoulder = 	poses[i].pose.keypoints[5]; 
			if (leftShoulder.score > 0.5) {ellipse(leftShoulder.position.x, leftShoulder.position.y, 10, 10);}
			
			let leftElbow = 	poses[i].pose.keypoints[7]; 
			if (leftElbow.score > 0.5) {ellipse(leftElbow.position.x, leftElbow.position.y, 10, 10);}
        	
        	let leftWrist = 	poses[i].pose.keypoints[9]; 
			if (leftWrist.score > 0.5) {ellipse(leftWrist.position.x, leftWrist.position.y, 30, 30);}
        	
        	
        	//Draw
        	strokeWeight(20);
        	stroke(255, 0, 0);
        	line(leftShoulder.position.x, leftShoulder.position.y, leftElbow.position.x, leftElbow.position.y);
        	line(leftElbow.position.x, leftElbow.position.y, leftWrist.position.x, leftWrist.position.y);
        	
        	
        	//Calculate 
        	var angle_Left_Shoulder_Elbow = 2 * Math.atan2(leftElbow.position.y - leftShoulder.position.y, leftElbow.position.x - leftShoulder.position.x) * 90 / Math.PI;
        	var angle_Left_Elbow_Wrist = 2 * Math.atan2(leftWrist.position.y - leftElbow.position.y, leftWrist.position.x - leftElbow.position.x) * 90 / Math.PI;
        	
        	//ORIGIN - Hand
        	hand.position.x = leftWrist.position.x;
        	hand.position.y = leftWrist.position.y;
        	hand.rotation = angle_Left_Elbow_Wrist;
        	
        	//ORIGIN - Arm-1
        	arm_1.position.x = leftShoulder.position.x;
        	arm_1.position.y = leftShoulder.position.y;
        	arm_1.rotation = angle_Left_Shoulder_Elbow;
        	
        	
        	
        	
        	
        }

}



// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = poses[i].pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.1) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}
// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    // For every skeleton, loop through all body connections
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}