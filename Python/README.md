## Contents
* Description
* Features
* Technologies
* Challenges and Solutions
* MVP
* Future Goals
* Author
* Screenshots


## Description
This project is a horizontal side-scrolling shooter built in Python using the open-source video game module library Pygame. The player navigates through a field of confectionary ‘meteors’, blasting them to gain points and evade damage through impact. The asteroids respawn with greater frequency as the player’s score increases, raising the difficulty level. The game ends when the player’s energy meter reaches zero. 

## Features
**Controls:** the player uses directional arrows to navigate and the space bar to shoot. The Enter/Return key is used to start the game from the intro screen and to discontinue the game from the game over screen.

**Enemies:** large meteors require 2 shots to destroy and are worth 50 points; small meteors require 1 shot to destroy and are worth 25 points.

**Difficulty:** The number of Enemies on the screen increases by 4 every 400 points up to 2,400 points (for a total of 24 enemies on the screen at a given time).


## Technologies
* Python
* Pygame

## Challenges and Solutions
**Background animation:** Though all of the activity in the game takes place within a single frame, I wanted to create the illusion that the player was speeding through space. To do this, I created three background layers: **1)** the static planet in the upper right hand corner **2)** the stars moving to the right, **3)** the mountains zooming by to the right on the bottom of the screen.
To achieve this, I ensured the all of the graphic layers were properly positioned atop each other. This was achieved by listing the bottom layer first in the all_sprites addition, and the top most layer (the player) last in the list.
```
# ===============================Player and Background
player = Player()
layer = [Background(), Background2(), Background3(), Background4(), Background5()]
all_sprites.add(layer[0],layer[1],layer[2],layer[3],layer[4], player)
```
Next, I created two background classes for both the stars and mountains images. As the identical images move along the x-axis, the second image will begin scrolling onto the screen on one side at the exact moment the end point of the first image exceeds the screen’s width on the other side in which the images are moving towards.
```
class Background(Sprite):
    def __init__(self):
        Sprite.__init__(self)
        self.image = pygame.image.load("stars.png").convert_alpha()
        self.rect = self.image.get_rect()
        self.rect.right = 0
        self.speedx = 10
       
    def update(self):
        self.rect.x += self.speedx
        if self.rect.left > w:
            self.rect.right= 0

class Background2(Sprite):
    def __init__(self):
        Sprite.__init__(self)
        self.image = pygame.image.load("stars.png").convert_alpha()
        self.rect = self.image.get_rect()
        self.rect.right = w
        self.speedx = 10
        
    def update(self):
        self.rect.x += self.speedx
        if self.rect.left > w:
            self.rect.right= 0
```
**Enemy rotation:** Having the enemy meteors rotate as they hurdle towards you creates an outer-space experience more visually accurate to what the player expects. Achieving the was the most difficult part of this program’s creation. To accomplish this, the program recreates the image each frame, rotating it slightly along its trajectory. Separate function calls were setup for both the images and their respective rotations per frame.
```
	class Asteroid(Sprite):
    def __init__(self):
        Sprite.__init__(self)
        
        #choose asteroid image
        randAstroid = [img1, img2, img3, img4, img5, img6, img7, img8]

        #Create copy for image rotation
        self.image_orig = random.choice(randAstroid)
        self.image = self.image_orig.copy()
        self.image.set_colorkey(Colors["white"])
        self.rect = self.image.get_rect()

        self.radius = int(self.rect.width / 2)

#  ====================================================ROTATE METHODS
       
    def update(self):
        self.rect.x -= self.speedx
        self.rect.y += self.speedy

        if self.rect.right < -20 or self.rect.bottom > h + 25 or self.rect.top < -350:
            self.rect.x = random.randrange(1200, 1400)
            self.rect.y = random.randrange(0, h)
            self.speedx = random.randrange(8,16)
        self.rotate()

    def rotate(self):
        now = pygame.time.get_ticks()
        if now - self.last_update > 50:
            self.last_update = now
            self.rot = (self.rot + self.rot_speed) % 360
            new_image = pygame.transform.rotate(self.image_orig, self.rot)
            old_center = self.rect.center
            self.image = new_image 
            self.rect = self.image.get_rect()
            self.rect.center = old_center     
```

## MVP
Create a side scrolling shooter that continues for as long as the player’s life bar persists and increases in difficulty the longer the player progresses.


## Stretch/Future Goals
Remove asteroids and introduce an end-of-level boss fight once the player exceeds 3,600 points.

## Authors
* Greg Roques
    * [GitHub Profile](https://github.com/GregRoques)


## Screenshots
![start screen](ReadMeImages/1.png)

![game play](ReadMeImages/2.png)

![game over screen](ReadMeImages/3.png)
