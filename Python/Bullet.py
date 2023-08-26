import pygame
import os
from pygame.sprite import Sprite

from Attributes import Attributes, Colors
w = Attributes["width"]
h = Attributes["height"]

pygame.display.set_mode((w, h))

p1 = pygame.image.load("p1.png").convert_alpha()

class Bullet(Sprite):
    def __init__(self,x,y):
        super(Bullet,self).__init__()
        self.image = pygame.transform.scale(p1, (25,25))
        self.rect = self.image.get_rect()
        self.rect.right = x
        self.rect.centery = y
        self.speedx = 25
       

    def update(self):

        # Rotate bullet
      


        self.rect.right += self.speedx

        # kill if it moves beyond screen
        if self.rect.left > w:
            self.kill()