class PoseDetector {
    constructor() {
        this.video = document.getElementById('webcam');
        this.poseCanvas = document.getElementById('pose-canvas');
        this.ctx = this.poseCanvas.getContext('2d');
        this.model = null;
        this.detector = null;
        
        // Calibration variables
        this.isCalibrating = true;
        this.calibrationFrames = 0;
        this.requiredFrames = 60;
        this.shoulderBaseline = null;
        this.hipBaseline = null;
        this.bodyHeight = null;
        this.calibrationShoulders = [];
        this.calibrationHips = [];
        this.calibrationBodyHeights = [];
        
        // Thresholds
        this.smallJumpThresholdPct = 0.15;
        this.bigJumpThresholdPct = 0.30;
        this.duckThresholdPct = -0.50;
        
        // Current state
        this.humanState = "standing";
        
        // Callback for when calibration is complete
        this.onCalibrationComplete = null;
        
        // Jump motion tracking
        this.inJumpMotion = false;
        this.maxJumpHeight = 0;
        
        // Add overlay to hide raw webcam feed during loading
        this.createWebcamOverlay();
    }
    
    async setup() {
        try {
            // Show loading indicator
            document.getElementById('loading-status').textContent = "Loading pose detection model...";
            
            // Load model first before accessing camera
            const detectorConfig = {
                modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
                enableSmoothing: true,
                modelUrl: 'https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4'
            };
            this.detector = await poseDetection.createDetector(
                poseDetection.SupportedModels.MoveNet, 
                detectorConfig
            );
            
            console.log("Pose detection model loaded");
            
            // Update loading status when model is loaded
            document.getElementById('loading-status').textContent = "Camera ready - follow the instructions";
            
            // Then access camera
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: { ideal: 640, max: 640 },
                    height: { ideal: 480, max: 480 },
                    facingMode: 'user'
                },
                audio: false
            });
            this.video.srcObject = stream;
            
            // Wait for video to be ready
            await new Promise(resolve => {
                this.video.onloadedmetadata = () => {
                    resolve();
                };
            });
            
            // Set canvas size to match video
            this.poseCanvas.width = this.video.videoWidth;
            this.poseCanvas.height = this.video.videoHeight;
            
            return true;
        } catch (error) {
            console.error("Error setting up pose detection:", error);
            document.getElementById('loading-status').innerHTML = 
                "<span style='color: red;'>Error: Could not access camera.</span><br>" +
                "Please ensure camera permissions are granted and try again.";
            return false;
        }
    }
    
    async detectPose() {
        if (!this.detector) return null;
        
        try {
            const poses = await this.detector.estimatePoses(this.video);
            if (poses.length > 0) {
                return poses[0];
            }
            return null;
        } catch (error) {
            console.error("Error detecting pose:", error);
            return null;
        }
    }
    
    async startDetection(onStateChange) {
        if (!this.detector) return;
        
        let frameCount = 0;
        const frameSkip = navigator.hardwareConcurrency <= 4 ? 3 : 2;
        
        // Detect if mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        // Show the pose visualization immediately
        document.getElementById('webcam-container').style.display = 'block';
        
        const detect = async () => {
            frameCount++;
            
            // Skip frames on all devices, more aggressively on low-end ones
            if (frameCount % frameSkip !== 0) {
                requestAnimationFrame(detect);
                return;
            }
            
            const pose = await this.detectPose();
            if (pose) {
                this.drawPose(pose);
                
                if (this.isCalibrating) {
                    const calibrationComplete = this.handleCalibration(pose);
                    if (calibrationComplete) {
                        this.isCalibrating = false;
                        // Don't hide calibration screen here - let the Start Game button do that
                    }
                } else {
                    const state = this.determineState(pose);
                    if (state !== this.humanState) {
                        this.humanState = state;
                        onStateChange(state);
                    }
                }
            }
            
            // Remove the overlay after first successful detection
            if (this.webcamOverlay && pose) {
                this.webcamOverlay.remove();
                this.webcamOverlay = null;
            }
            
            requestAnimationFrame(detect);
        };
        
        detect();
    }
    
    handleCalibration(pose) {
        // Check if hand is raised (wrist above shoulder)
        const keypoints = pose.keypoints;
        const leftWrist = keypoints.find(kp => kp.name === 'left_wrist');
        const rightWrist = keypoints.find(kp => kp.name === 'right_wrist');
        const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
        const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
        
        if (!leftShoulder || !rightShoulder) return false;
        
        const avgShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
        
        // Check if either wrist is above shoulders
        const handRaised = (leftWrist && leftWrist.y < avgShoulderY) || 
                          (rightWrist && rightWrist.y < avgShoulderY);
        
        if (handRaised) {
            // Collect calibration data
            this.calibrationShoulders.push(avgShoulderY);
            
            // Get hip positions
            const leftHip = keypoints.find(kp => kp.name === 'left_hip');
            const rightHip = keypoints.find(kp => kp.name === 'right_hip');
            
            if (leftHip && rightHip) {
                const avgHipY = (leftHip.y + rightHip.y) / 2;
                this.calibrationHips.push(avgHipY);
                
                // Calculate body height
                const currentBodyHeight = Math.abs(avgShoulderY - avgHipY);
                this.calibrationBodyHeights.push(currentBodyHeight);
            }
            
            this.calibrationFrames++;
            
            // Update progress
            const progress = Math.min(100, Math.round(this.calibrationFrames / this.requiredFrames * 100));
            document.getElementById('calibration-progress').textContent = `${progress}%`;
            
            // Check if calibration is complete
            if (this.calibrationFrames >= this.requiredFrames) {
                // Calculate baselines
                this.shoulderBaseline = this.average(this.calibrationShoulders);
                this.hipBaseline = this.average(this.calibrationHips);
                this.bodyHeight = this.average(this.calibrationBodyHeights);
                
                // Calculate thresholds
                this.smallJumpThreshold = this.bodyHeight * this.smallJumpThresholdPct;
                this.bigJumpThreshold = this.bodyHeight * this.bigJumpThresholdPct;
                this.duckThreshold = this.bodyHeight * this.duckThresholdPct;
                
                console.log("Calibration complete!");
                
                // Hide calibration screen and show game screen
                document.getElementById('calibration').classList.add('hidden');
                document.getElementById('game').classList.remove('hidden');
                
                // Call the onCalibrationComplete callback if it exists
                if (this.onCalibrationComplete) {
                    this.onCalibrationComplete();
                }
                
                return true;
            }
        } else {
            // Reset if hand is lowered
            this.calibrationFrames = 0;
            this.calibrationShoulders = [];
            this.calibrationHips = [];
            this.calibrationBodyHeights = [];
            document.getElementById('calibration-progress').textContent = "0%";
        }
        
        return false;
    }
    
    determineState(pose) {
        const keypoints = pose.keypoints;
        const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
        const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
        const leftWrist = keypoints.find(kp => kp.name === 'left_wrist');
        const rightWrist = keypoints.find(kp => kp.name === 'right_wrist');
        
        if (!leftShoulder || !rightShoulder) return "standing";
        
        const currentShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
        const shoulderHeightChange = this.shoulderBaseline - currentShoulderY;
        
        // Store the previous state before updating
        const previousState = this.humanState;
        
        // Check for hand raise to restart game - ONLY if game is over
        if (this.game && this.game.gameOver) {
            const handRaised = (leftWrist && leftWrist.y < this.shoulderBaseline - this.bigJumpThreshold) || 
                              (rightWrist && rightWrist.y < this.shoulderBaseline - this.bigJumpThreshold);
            
            if (handRaised) {
                this.game.reset();
                return "standing";
            }
        }
        
        // Simplified jump motion tracking
        if (shoulderHeightChange < this.duckThreshold) {
            return "duck";
        } else if (this.inJumpMotion) {
            // Already in a jump motion
            if (shoulderHeightChange > this.maxJumpHeight) {
                this.maxJumpHeight = shoulderHeightChange;
                
                if (shoulderHeightChange > this.bigJumpThreshold) {
                    return "big jump";
                }
            }
            
            // Check if jump is complete
            if (Math.abs(shoulderHeightChange) < this.smallJumpThreshold * 0.5) {
                this.inJumpMotion = false;
                return "standing";
            }
            
            return previousState;
        } else if (shoulderHeightChange > this.smallJumpThreshold) {
            // Starting a new jump
            this.inJumpMotion = true;
            this.maxJumpHeight = shoulderHeightChange;
            
            return shoulderHeightChange > this.bigJumpThreshold ? "big jump" : "small jump";
        } else {
            return "standing";
        }
    }
    
    drawPose(pose) {
        this.ctx.clearRect(0, 0, this.poseCanvas.width, this.poseCanvas.height);
        
        // Set background to black
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.poseCanvas.width, this.poseCanvas.height);
        
        // Draw keypoints with special highlight for hands that can trigger restart
        pose.keypoints.forEach(keypoint => {
            if (keypoint.score > 0.5) {
                this.ctx.beginPath();
                
                // Highlight wrists that are above the big jump threshold when game is over
                if (this.game && this.game.gameOver && 
                    (keypoint.name === 'left_wrist' || keypoint.name === 'right_wrist') && 
                    keypoint.y < this.shoulderBaseline - this.bigJumpThreshold) {
                    // Make the point larger and red to indicate it can trigger restart
                    this.ctx.arc(keypoint.x, keypoint.y, 8, 0, 2 * Math.PI);
                    this.ctx.fillStyle = 'red';
                } else {
                    this.ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
                    this.ctx.fillStyle = 'yellow';
                }
                
                this.ctx.fill();
            }
        });
        
        // Draw skeleton
        const connections = [
            ['left_shoulder', 'right_shoulder'],
            ['left_shoulder', 'left_elbow'],
            ['right_shoulder', 'right_elbow'],
            ['left_elbow', 'left_wrist'],
            ['right_elbow', 'right_wrist'],
            ['left_shoulder', 'left_hip'],
            ['right_shoulder', 'right_hip'],
            ['left_hip', 'right_hip'],
            ['left_hip', 'left_knee'],
            ['right_hip', 'right_knee'],
            ['left_knee', 'left_ankle'],
            ['right_knee', 'right_ankle']
        ];
        
        connections.forEach(([p1, p2]) => {
            const point1 = pose.keypoints.find(kp => kp.name === p1);
            const point2 = pose.keypoints.find(kp => kp.name === p2);
            
            if (point1 && point2 && point1.score > 0.5 && point2.score > 0.5) {
                this.ctx.beginPath();
                this.ctx.moveTo(point1.x, point1.y);
                this.ctx.lineTo(point2.x, point2.y);
                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = 'green';
                this.ctx.stroke();
            }
        });
        
        // Draw baselines if calibration is complete
        if (!this.isCalibrating && this.shoulderBaseline) {
            // Draw shoulder baseline
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.shoulderBaseline);
            this.ctx.lineTo(this.poseCanvas.width, this.shoulderBaseline);
            this.ctx.strokeStyle = 'green';
            this.ctx.stroke();
            
            // Draw jump thresholds
            this.ctx.beginPath();
            this.ctx.setLineDash([5, 5]);
            this.ctx.moveTo(0, this.shoulderBaseline - this.smallJumpThreshold);
            this.ctx.lineTo(this.poseCanvas.width, this.shoulderBaseline - this.smallJumpThreshold);
            this.ctx.strokeStyle = 'yellow';
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.shoulderBaseline - this.bigJumpThreshold);
            this.ctx.lineTo(this.poseCanvas.width, this.shoulderBaseline - this.bigJumpThreshold);
            this.ctx.strokeStyle = 'red';
            this.ctx.stroke();
            
            // Draw duck threshold - changed to orange
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.shoulderBaseline - this.duckThreshold); // Note: duckThreshold is negative
            this.ctx.lineTo(this.poseCanvas.width, this.shoulderBaseline - this.duckThreshold);
            this.ctx.strokeStyle = 'orange'; // Changed from blue to orange
            this.ctx.stroke();
            
            this.ctx.setLineDash([]);
            
            // Add labels for thresholds
            this.ctx.font = '12px Arial';
            this.ctx.fillStyle = 'white';
            this.ctx.fillText('Standing', 10, this.shoulderBaseline - 5);
            this.ctx.fillText('Small Jump', 10, this.shoulderBaseline - this.smallJumpThreshold - 5);
            this.ctx.fillText('Big Jump', 10, this.shoulderBaseline - this.bigJumpThreshold - 5);
            this.ctx.fillText('Duck', 10, this.shoulderBaseline - this.duckThreshold - 5);
            
            // Add restart instruction if game is over
            if (this.game && this.game.gameOver) {
                this.ctx.font = '14px Arial';
                this.ctx.fillStyle = 'white';
                this.ctx.fillText('Raise hand above red line to restart', 10, 30);
            }
        }
    }
    
    average(arr) {
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }
    
    createWebcamOverlay() {
        // Create a black overlay div
        const overlay = document.createElement('div');
        overlay.id = 'webcam-overlay';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'black';
        overlay.style.zIndex = '5'; // Between webcam and pose canvas
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        
        // Add loading text
        const loadingText = document.createElement('div');
        loadingText.textContent = 'Initializing camera...';
        loadingText.style.color = 'white';
        loadingText.style.fontFamily = 'Arial, sans-serif';
        loadingText.style.fontSize = '16px';
        
        overlay.appendChild(loadingText);
        document.getElementById('webcam-container').appendChild(overlay);
        
        // Store reference to remove it later
        this.webcamOverlay = overlay;
    }
} 
