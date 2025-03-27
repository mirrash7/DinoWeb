import pygame
import random
import sys
import threading
import time
import cv2
import numpy as np
from queue import Queue
import os

# Initialize Pygame
pygame.init()

# Game constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 400
GROUND_HEIGHT = 350
FPS = 60

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Create the screen
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Dino Runner")
clock = pygame.time.Clock()

# Get the absolute path to the assets
current_dir = os.path.dirname(os.path.abspath(__file__))
assets_dir = os.path.join(current_dir, 'Assets')

# Load images using absolute paths
dino_run_imgs = [
    pygame.image.load(os.path.join(assets_dir, 'dino_run1.png')).convert_alpha(),
    pygame.image.load(os.path.join(assets_dir, 'dino_run2.png')).convert_alpha()
]
dino_jump_img = pygame.image.load(os.path.join(assets_dir, 'dino_jump.png')).convert_alpha()
dino_duck_imgs = [
    pygame.image.load(os.path.join(assets_dir, 'dino_duck1.png')).convert_alpha(),
    pygame.image.load(os.path.join(assets_dir, 'dino_duck2.png')).convert_alpha()
]
cactus_imgs = [
    pygame.image.load(os.path.join(assets_dir, 'cactus_small.png')).convert_alpha(),
    pygame.image.load(os.path.join(assets_dir, 'cactus_big.png')).convert_alpha()
]
bird_imgs = [
    pygame.image.load(os.path.join(assets_dir, 'bird1.png')).convert_alpha(),
    pygame.image.load(os.path.join(assets_dir, 'bird2.png')).convert_alpha()
]
cloud_img = pygame.image.load(os.path.join(assets_dir, 'cloud.png')).convert_alpha()
ground_img = pygame.image.load(os.path.join(assets_dir, 'ground.png')).convert_alpha()

# Scale images if needed
for i in range(len(dino_run_imgs)):
    dino_run_imgs[i] = pygame.transform.scale(dino_run_imgs[i], (60, 70))
dino_jump_img = pygame.transform.scale(dino_jump_img, (60, 70))
for i in range(len(dino_duck_imgs)):
    dino_duck_imgs[i] = pygame.transform.scale(dino_duck_imgs[i], (80, 40))
for i in range(len(cactus_imgs)):
    cactus_imgs[i] = pygame.transform.scale(cactus_imgs[i], (40, 70))
# Make the tall cactus taller
tall_cactus_img = pygame.transform.scale(cactus_imgs[1], (40, 120))
for i in range(len(bird_imgs)):
    bird_imgs[i] = pygame.transform.scale(bird_imgs[i], (60, 40))
cloud_img = pygame.transform.scale(cloud_img, (80, 40))
ground_img = pygame.transform.scale(ground_img, (SCREEN_WIDTH, 20))

# Obstacle types
SMALL_CACTUS = 0  # Requires small jump
TALL_CACTUS = 1   # Requires big jump
LOW_BIRD = 2      # Can be jumped over with any jump
MID_BIRD = 3      # Can be jumped with big jump or ducked under

# Game classes
class Dino:
    def __init__(self):
        self.x = 80
        self.y = GROUND_HEIGHT - 70
        self.duck_y = GROUND_HEIGHT - 40
        self.vel_y = 0
        self.gravity = 1
        self.jump_vel = -18
        self.big_jump_vel = -22
        self.is_jumping = False
        self.is_ducking = False
        self.run_count = 0
        self.duck_count = 0
        self.rect = pygame.Rect(self.x, self.y, 50, 70)
        self.duck_rect = pygame.Rect(self.x, self.duck_y, 70, 40)
        self.can_jump = True  # Flag to prevent mid-air jumps
    
    def update(self, action):
        # Handle actions from pose detection
        if action == "small jump" and not self.is_jumping and self.can_jump:
            self.vel_y = self.jump_vel
            self.is_jumping = True
            self.is_ducking = False
            self.can_jump = False  # Prevent jumping again until landed
        elif action == "big jump" and not self.is_jumping and self.can_jump:
            self.vel_y = self.big_jump_vel
            self.is_jumping = True
            self.is_ducking = False
            self.can_jump = False  # Prevent jumping again until landed
        elif action == "duck" and not self.is_jumping:
            self.is_ducking = True
        else:
            # Only reset ducking if we're not explicitly ducking
            if action != "duck":
                self.is_ducking = False
        
        # Apply gravity
        if self.is_jumping:
            self.y += self.vel_y
            self.vel_y += self.gravity
            
            if self.y >= GROUND_HEIGHT - 70:
                self.y = GROUND_HEIGHT - 70
                self.is_jumping = False
                self.vel_y = 0
                self.can_jump = True  # Allow jumping again after landing
        
        # Update rect for collision detection
        if self.is_ducking:
            self.rect = self.duck_rect
            self.rect.y = self.duck_y
        else:
            self.rect = pygame.Rect(self.x, self.y, 50, 70)
    
    def draw(self, screen):
        if self.is_jumping:
            screen.blit(dino_jump_img, (self.x, self.y))
        elif self.is_ducking:
            screen.blit(dino_duck_imgs[self.duck_count // 5], (self.x, self.duck_y))
            self.duck_count = (self.duck_count + 1) % 10
        else:
            screen.blit(dino_run_imgs[self.run_count // 5], (self.x, self.y))
            self.run_count = (self.run_count + 1) % 10

class Obstacle:
    def __init__(self, x, type_idx):
        self.x = x
        self.type_idx = type_idx
        
        if type_idx == SMALL_CACTUS:  # Small cactus
            self.y = GROUND_HEIGHT - 70
            self.image = cactus_imgs[0]
            self.rect = self.image.get_rect()
            self.rect.x = x
            self.rect.y = self.y
        elif type_idx == TALL_CACTUS:  # Tall cactus
            self.y = GROUND_HEIGHT - 160
            self.image = tall_cactus_img
            self.rect = self.image.get_rect()
            self.rect.x = x
            self.rect.y = self.y
        elif type_idx == LOW_BIRD:  # Low flying bird
            self.y = GROUND_HEIGHT - 50
            self.bird_count = 0
            self.rect = pygame.Rect(x, self.y, 50, 40)
        elif type_idx == MID_BIRD:  # Mid-height bird
            self.y = GROUND_HEIGHT - 100
            self.bird_count = 0
            self.rect = pygame.Rect(x, self.y, 50, 40)
    
    def update(self, speed):
        self.x -= speed
        self.rect.x = self.x
    
    def draw(self, screen):
        if self.type_idx == SMALL_CACTUS or self.type_idx == TALL_CACTUS:
            screen.blit(self.image, (self.x, self.y))
        else:  # Bird
            screen.blit(bird_imgs[self.bird_count // 5], (self.x, self.y))
            self.bird_count = (self.bird_count + 1) % 10

class Cloud:
    def __init__(self):
        self.x = SCREEN_WIDTH + random.randint(0, 300)
        self.y = random.randint(50, 200)
    
    def update(self, speed):
        self.x -= speed // 2  # Clouds move slower than obstacles
    
    def draw(self, screen):
        screen.blit(cloud_img, (self.x, self.y))

class Ground:
    def __init__(self):
        self.x1 = 0
        self.x2 = SCREEN_WIDTH
        self.y = GROUND_HEIGHT
    
    def update(self, speed):
        self.x1 -= speed
        self.x2 -= speed
        
        if self.x1 + SCREEN_WIDTH < 0:
            self.x1 = self.x2 + SCREEN_WIDTH
        
        if self.x2 + SCREEN_WIDTH < 0:
            self.x2 = self.x1 + SCREEN_WIDTH
    
    def draw(self, screen):
        screen.blit(ground_img, (self.x1, self.y))
        screen.blit(ground_img, (self.x2, self.y))

# Communication queue for pose data
pose_queue = Queue()

# Function to run the pose detection in a separate thread
def run_pose_detection():
    import subprocess
    subprocess.Popen(["python", "Games/Jump/exp1.py"])

# Game function
def game_loop():
    dino = Dino()
    ground = Ground()
    obstacles = []
    clouds = []
    score = 0
    game_speed = 10
    obstacle_timer = 0
    cloud_timer = 0
    font = pygame.font.SysFont('Arial', 20)
    game_over = False
    
    # Create initial clouds
    for _ in range(3):
        clouds.append(Cloud())
    
    # Main game loop
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE and not game_over and dino.can_jump:
                    if pygame.key.get_mods() & pygame.KMOD_SHIFT:
                        dino.vel_y = dino.big_jump_vel
                    else:
                        dino.vel_y = dino.jump_vel
                    dino.is_jumping = True
                    dino.is_ducking = False
                    dino.can_jump = False  # Prevent jumping again until landed
                if event.key == pygame.K_DOWN and not game_over:
                    dino.is_ducking = True
                if event.key == pygame.K_r and game_over:
                    # Reset game
                    dino = Dino()
                    obstacles = []
                    score = 0
                    game_speed = 10
                    game_over = False
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_DOWN:
                    dino.is_ducking = False
        
        # Get pose data from webcam
        try:
            # Try to get the latest pose data (non-blocking)
            # In a real implementation, this would come from exp.py
            # For now, we'll use keyboard controls as a fallback
            action = "standing"
            keys = pygame.key.get_pressed()
            if keys[pygame.K_DOWN]:
                action = "duck"
            elif keys[pygame.K_SPACE] and dino.can_jump:
                if pygame.key.get_mods() & pygame.KMOD_SHIFT:
                    action = "big jump"
                else:
                    action = "small jump"
            
            # Update dino based on pose
            dino.update(action)
        except:
            # If no pose data, just use keyboard controls
            pass
        
        if not game_over:
            # Update game elements
            ground.update(game_speed)
            
            # Update clouds
            cloud_timer += 1
            if cloud_timer > 50:
                clouds.append(Cloud())
                cloud_timer = 0
            
            for cloud in clouds[:]:
                cloud.update(game_speed)
                if cloud.x < -100:
                    clouds.remove(cloud)
            
            # Update obstacles
            obstacle_timer += 1
            if obstacle_timer > 50 + random.randint(0, 50):
                # Determine obstacle type
                type_idx = random.randint(0, 3)  # 0: small cactus, 1: tall cactus, 2: low bird, 3: mid bird
                obstacles.append(Obstacle(SCREEN_WIDTH, type_idx))
                obstacle_timer = 0
            
            for obstacle in obstacles[:]:
                obstacle.update(game_speed)
                
                # Check collision
                if dino.rect.colliderect(obstacle.rect):
                    game_over = True
                
                if obstacle.x < -100:
                    obstacles.remove(obstacle)
            
            # Increase score and speed
            score += 1
            if score % 500 == 0:
                game_speed += 1
        
        # Draw everything
        screen.fill(WHITE)
        
        # Draw clouds
        for cloud in clouds:
            cloud.draw(screen)
        
        # Draw ground
        ground.draw(screen)
        
        # Draw score
        score_text = font.render(f'Score: {score}', True, BLACK)
        screen.blit(score_text, (SCREEN_WIDTH - 150, 20))
        
        # Draw obstacles
        for obstacle in obstacles:
            obstacle.draw(screen)
        
        # Draw dino
        dino.draw(screen)
        
        # Draw game over message
        if game_over:
            game_over_text = font.render('Game Over! Press R to restart', True, BLACK)
            screen.blit(game_over_text, (SCREEN_WIDTH // 2 - 150, SCREEN_HEIGHT // 2))
        
        # Draw debug info
        debug_text = font.render(f'Can Jump: {dino.can_jump}', True, BLACK)
        screen.blit(debug_text, (50, 20))
        
        pygame.display.update()
        clock.tick(FPS)
    
    pygame.quit()
    sys.exit()

# Start pose detection in a separate thread
pose_thread = threading.Thread(target=run_pose_detection)
pose_thread.daemon = True
pose_thread.start()

# Start the game
if __name__ == "__main__":
    # Wait a moment for pose detection to initialize
    time.sleep(1)
    game_loop() 