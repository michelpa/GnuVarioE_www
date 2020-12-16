# Repository du site Web embarqué GnuVario-E

## Liens vers le projet

[GitHub Gnuvario-E](https://github.com/prunkdump/GNUVario-TTGO-T5)

[Site Web Gnuvario-E](https://prunkdump.github.io/GNUVario-TTGO-T5-website/)

[GitHub Developpeur](https://github.com/jpg63/Gnuvario_for_TTGO-T5)

[GitHub Developpeur (uniquement la version en cours de travail sous platformio)](https://github.com/michelpa/GnuVarioE)

## Notes aux développeurs

### Informations importantes

~~Le serveur web embarqué est synchrone, ce qui signifie qu'une seule requète peut être traitée à la fois.
Cette contrainte oblige à ne pas avoir d'image provenant du serveur ou alors de les inclures directement dans les pages mais pas de ressources basées sur les urls.
C'est aussi pour ca que l'ensemble des resources css et js (sauf le coeur du programme) utilise des CDN.~~

Le serveur web a été remplacé par un serveur asynchrone.

