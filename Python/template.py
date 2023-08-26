#========================================== How to Activate Pygame

# miniconda access to run pygame
# cd /miniconda3/bin
# source activate py3k

# ==========IMPORTANT IMPORTS===============

import pygame
from pygame.sprite import Group, groupcollide, spritecollide, collide_circle
import random
import os

from Player import Player
from Asteroid import Asteroid
from Bullet import Bullet
# from Boss import Boss

from Attributes import Attributes, Colors
w = Attributes["width"]
h = Attributes["height"]
f = Attributes["fps"]

from Draw import draw_text, draw_shield_bar

from background import Background, Background2, Background3, Background4, Background5


# =================================================================================================START THE GAME

pygame.init()
pygame.mixer.init()
screen = pygame.display.set_mode((w, h))
pygame.display.set_caption("Intergalactic Adventures of Pizza Cat")
clock = pygame.time.Clock()

running = False


# ================================================================================================GRAPHICS & SOUND

shoot_sound = pygame.mixer.Sound("pew.wav")
hit_sound = pygame.mixer.Sound("expl3.wav")
hit_kill = pygame.mixer.Sound("expl6.wav")

# ===================================================================================SCARY MONSTERS AND NICE SPRITES

all_sprites = Group()

# ===============================Player and Background

player = Player()

layer = [Background(), Background2(), Background3(), Background4(), Background5()]

all_sprites.add(layer[0],layer[1],layer[2],layer[3],layer[4], player)

# ===============================Spawn Asteroids to Group

asteroids = Group()

def newAsteroid():
    a = Asteroid()
    all_sprites.add(a)
    asteroids.add(a)    

# ===============================Spawn Bullets to Group

bullets = Group()

def shoot(player):
        bullet = Bullet(player.rect.right, player.rect.centery)
        all_sprites.add(bullet)
        bullets.add(bullet)


# =====================================================================================START SCREEN
intro = True

# Opening Screen Music = Metroid Theme
pygame.mixer.music.load('Metroid.wav')
pygame.mixer.music.set_volume(0.6)
pygame.mixer.music.play(loops=-1)
# Print Start Screent
start = pygame.image.load("startScreen.jpg")

# ==================================Start Screen Loop
while intro:
    clock.tick(f)

    screen.blit(start, [0,0]) 

    for event in pygame.event.get():
    # check for closing window
        if event.type == pygame.QUIT:
            intro = False

        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_RETURN:
                running= True
                intro = False
    pygame.display.flip()            



# ==================================Start Screen Ends

# Game Music Loop Begins: Space Cats Theme
pygame.mixer.music.load('SpaceCats.wav')
pygame.mixer.music.set_volume(0.6)
pygame.mixer.music.play(loops=-1)

# ===========================================================================================GAME LOOP
score = 0
nextScore = 0

while running == True:
    
    # keep loop running at the right speed
    clock.tick(f)

    # Process input (events)
    for event in pygame.event.get():
        # check for closing window
        if event.type == pygame.QUIT:
            running = False
            outro = True

        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                shoot(player)
                shoot_sound.play()

    # Update
    all_sprites.update()
    

#    ==========================================ENEMEY SPAWNING   

   
    hits = groupcollide(asteroids, bullets, False, True)

    for hit_asteroid in hits:
        if hit_asteroid.health >0:
            hit_asteroid.takeDamage(1)
            hit_sound.play()
        if hit_asteroid.health ==0:
            asteroids.remove(hit_asteroid)
            hit_kill.play()
            score += hit_asteroid.points
            all_sprites.remove(hit_asteroid)
            asteroids.remove(hit_asteroid)
            newAsteroid()


    if (score >= nextScore) and (score <= 2400):
        for i in range(4):
            newAsteroid()
        nextScore += 400           
    
    # ==============================================PLAYER GETS HIT

    hits = spritecollide(player, asteroids, True, collide_circle)

    for hit in hits:
        player.shield -= 10
        hit_sound.play()
        newAsteroid()
       
        if player.shield <= 0:
            running = False
            outro = True

            pygame.mixer.music.load('gameOver.wav')
            pygame.mixer.music.set_volume(1)
            pygame.mixer.music.play(loops=-1)
            # Print Start Screent
            start = pygame.image.load("exitScreen.jpg")


            while outro:
                clock.tick(f)

                screen.blit(start, [0,0]) 

                for event in pygame.event.get():
                # check for closing window
                    if event.type == pygame.QUIT:
                        outro = False

                    if event.type == pygame.KEYDOWN:
                        if event.key == pygame.K_RETURN:
                            outro = False
                pygame.display.flip()            



    # Draw / render
  
    screen.fill(Colors["black"]) 
    # screen.blit(background, background_rect) 
    all_sprites.draw(screen)
  
    #player stats
    draw_text(screen, str(score), 30, w / 2, 10)
    draw_shield_bar(screen, 15, 15, player.shield)
    

    # *after* drawing everything, flip the display
    pygame.display.flip()

pygame.quit()