import pygame
from pygame.sprite import Sprite
import os
from pygame.sprite import Group

from Attributes import Attributes, Colors
w = Attributes["width"]
h = Attributes["height"]

pygame.display.set_mode((w, h))
pizzaCat = pygame.image.load("pizza cat.png").convert_alpha()
pcDown = pygame.image.load("cat down.png").convert_alpha()
pcUp = pygame.image.load("cat up.png").convert_alpha()

pcScale = pygame.transform.scale(pizzaCat, (120,91))
pcdScale = pygame.transform.scale(pcDown, (120,91))
pcuScale = pygame.transform.scale(pcUp, (120,91))


class Player(Sprite):
    def __init__(self):
        Sprite.__init__(self)
        self.image = pcScale
        self.image.set_colorkey(Colors["black"])
        self.rect = self.image.get_rect()
        
        self.rect.centery = h / 2
        self.rect.left= 10
        self.speedy = 0
        self.shield = 100


    def update(self):
        self.speedy = 0
        self.image = pcScale
        keystate = pygame.key.get_pressed()
        if keystate[pygame.K_UP]:
            self.speedy = -15
            self.image = pcuScale
        if keystate[pygame.K_DOWN]:
            self.speedy = 15
            self.image = pcdScale
        
        self.speedx = 0
        keystate = pygame.key.get_pressed()
        if keystate[pygame.K_LEFT]:
            self.speedx = -15       
        if keystate[pygame.K_RIGHT]:
            self.speedx = 15  
            

        #update self rectangle
        self.rect.y += self.speedy
        if self.rect.bottom > h:
            self.rect.bottom = h
        if self.rect.top < 0 + 45:
            self.rect.top = 0 + 45

        self.rect.x += self.speedx
        if self.rect.right > w:
            self.rect.right = w
        if self.rect.left < 0:
            self.rect.left = 0

  

        