# yexofps.org

Site perso de Baptiste Dauvergne (Yexo) : parcours en administration systèmes et réseaux, homelab, rangs, tracker et settings Valorant, edits et Y-Services, convertisseur de sensibilité.

Next.js 16 · TypeScript · Tailwind CSS v4 · next-intl (FR / EN) · auto-hébergé sur un VPS Ubuntu.

## Lancer le projet

```bash
npm ci
npm run dev
```

Le tracker Valorant a besoin d'une clé HenrikDev dans `.env.local` :

```bash
HENRIK_API_KEY=ta_cle
```

Sans clé, le site fonctionne : le tracker affiche un état « indisponible » et le peak reste visible.

## Modifier le contenu

| Quoi | Où |
|------|----|
| Couleur d'accent (toute la palette en découle) | `src/config/theme.ts` |
| Liens, emails, partenaires, produits, rangs, setup, compte du tracker | `src/config/site.ts` |
| Homelab (machines, VM, VLAN, schéma) | `src/config/lab.ts` |
| Parcours (frise, compétences, missions, tutos) | `src/config/career.ts` |
| Emploi du temps de la page /now (statut en direct, dispo pour répondre) | `src/config/now.ts` (lien Spotify : `SPOTIFY_URL` dans `site.ts`) |
| Page « Ce site » (/lab/site) : hébergeur et reverse proxy affichés | `HOSTING` dans `src/config/site.ts` (le reste est lu en direct sur le serveur) |
| Statut Discord en direct sur /now | `DISCORD_USER_ID` dans `src/config/site.ts` (il faut avoir rejoint le serveur Discord de Lanyard), jeux reconnus : `PRESENCE_ACTIVITIES` dans `src/config/now.ts` |
| Settings Valorant (tous les onglets, réticule, affichage) | `src/config/valorant-settings.ts` (sensi et DPI : `MY_SENS` dans `site.ts`) |
| Tous les textes | `messages/fr.json`, `messages/en.json` |

Dans `src/config/lab.ts`, chaque élément inventé porte `placeholder: true` et un commentaire `PLACEHOLDER` : remplace-le par tes vraies infos.

## Vidéo à la une (accueil)

Le lecteur de l'accueil lit `public/videos/featured-edit.mp4`, hébergé sur le site (rien n'est demandé à TikTok). Sans ce fichier, l'accueil affiche le lecteur TikTok, chargé au clic.

Avant de l'ajouter, compresse-le (720 × 1280, démarrage rapide, quelques Mo au lieu de 30) :

```bash
ffmpeg -i montage.mp4 -vf "scale=-2:1280" -c:v libx264 -preset slow -crf 24 -c:a aac -b:a 128k -movflags +faststart featured-edit.mp4
```

Image d'aperçu facultative (puis `poster: "/videos/featured-edit.jpg"` dans `FEATURED_EDIT`) :

```bash
ffmpeg -ss 0.5 -i featured-edit.mp4 -frames:v 1 -q:v 3 featured-edit.jpg
```

Le navigateur garde la vidéo en cache 7 jours : pour la remplacer, change aussi son nom de fichier (et `video` dans `FEATURED_EDIT`).

## Vérifications avant de déployer

```bash
npm run lint
npm run build
```
