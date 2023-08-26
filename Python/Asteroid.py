import pygame
from pygame.sprite import Sprite
import random
import os

from Attributes import Attributes, Colors
w = Attributes["width"]
h = Attributes["height"]

pygame.display.set_mode((w, h))

img1 = pygame.image.load("burger2.png").convert_alpha()
img2 = pygame.image.load("donut2.png").convert_alpha()
img3 = pygame.image.load("burger3.png").convert_alpha()
img4 = pygame.image.load("donut3.png").convert_alpha()

img5 = pygame.image.load("cupcake2.png").convert_alpha()
img6 = pygame.image.load("cookie2.png").convert_alpha()
img7 = pygame.image.load("cupcake3.png").convert_alpha()
img8 = pygame.image.load("cookie3.png").convert_alpha()


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

        # pygame.draw.circle(self.image, RED, self.rect.center, self.radius)

        self.rect.x = random.randrange(1200, 1400)
        self.rect.y = random.randrange(0, h)
        self.speedy = random.randrange(-3, 3)
        self.speedx = random.randrange(8,16)

        self.rot = 0
        self.rot_speed = random.randrange(-8, 8)
        self.last_update = pygame.time.get_ticks()


# ======================================================ASTEROID STRENGTH

        if (self.image_orig == randAstroid[0]) or (self.image_orig == randAstroid[1]) or (self.image_orig == randAstroid[4]) or (self.image_orig == randAstroid[5]):
            asteroidHealth = 2
            pts = 50
        else:
            asteroidHealth = 1 
            pts = 25

        self.health = asteroidHealth
        self.points = pts
     

# ================================================KILL ASTEROID

    def takeDamage(self, ammountOfDamage):
        self.health -= ammountOfDamage
        

    def isAlive(self):
        return self.health <= 0
       


   

  
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

