import pygame
from Attributes import Attributes, Colors
w = Attributes["width"]
h = Attributes["height"]
screen = pygame.display.set_mode((w, h))

font_name = pygame.font.match_font('Museo-700 Regular')

def draw_text(surf, text, size, x, y):
    font = pygame.font.Font(font_name, size)
    text_surface = font.render(text, True, Colors["white"])
    text_rect = text_surface.get_rect()
    text_rect.midtop = (x, y)
    surf.blit(text_surface, text_rect)

def draw_shield_bar(surf, x, y, pct):
    if pct < 0:
        pct = 0
    BAR_LENGTH = 200
    BAR_HEIGHT = 20
    fill = (pct / 100) * BAR_LENGTH
    outline_rect = pygame.Rect(x, y, BAR_LENGTH, BAR_HEIGHT)
    fill_rect = pygame.Rect(x, y, fill, BAR_HEIGHT)
    pygame.draw.rect(surf, Colors["green"], fill_rect)
    pygame.draw.rect(surf, Colors["white"], outline_rect, 2)


