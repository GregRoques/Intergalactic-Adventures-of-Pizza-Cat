import pygame
from pygame.sprite import Sprite
from Attributes import Attributes, Colors
w = Attributes["width"]
h = Attributes["height"]
fps = Attributes["fps"]

screen = pygame.display.set_mode((w, h))



# class Background(Sprite):
#     def __init__(self):
#         Sprite.__init__(self)
       



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
    
    

class Background3(Sprite):
    def __init__(self):
        Sprite.__init__(self)
        

        self.image = pygame.image.load("test2.png").convert_alpha()

        self.rect = self.image.get_rect()


class Background4(Sprite):
    def __init__(self):
        Sprite.__init__(self)
        

        self.image = pygame.image.load("mountain.png").convert_alpha()

        self.rect = self.image.get_rect()

        self.rect.left = 0
        

        self.speedx = 20
        
    def update(self):
        

        self.rect.x -= self.speedx
        if self.rect.right < 0:
            self.rect.left= w


class Background5(Sprite):
    def __init__(self):
        Sprite.__init__(self)
        

        self.image = pygame.image.load("mountain.png").convert_alpha()

        self.rect = self.image.get_rect()

        self.rect.left = w
        

        self.speedx = 20
        
    def update(self):
        

        self.rect.x -= self.speedx
        if self.rect.right < 0:
            self.rect.left= w            