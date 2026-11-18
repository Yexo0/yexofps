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

Le lecteur de l'accueil lit `public/videos/featured-edit-v2.mp4`, hébergé sur le site (rien n'est demandé à TikTok). Sans ce fichier, l'accueil affiche le lecteur TikTok, chargé au clic. La vidéo n'est téléchargée qu'à l'approche du lecteur (rien au chargement de la page).

Avant de l'ajouter, compresse-la (720p, 60 i/s, démarrage rapide ; l'audio reste pour le bouton son) :

```bash
ffmpeg -i montage.mp4 -vf "scale=1280:720:flags=lanczos" -c:v libx264 -preset slow -crf 32 -profile:v high -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart featured-edit-v3.mp4
```

Image d'aperçu facultative (puis `poster: "/videos/featured-edit.jpg"` dans `FEATURED_EDIT`), servie à la bonne taille par `next/image` :

```bash
ffmpeg -ss 0.5 -i featured-edit-v3.mp4 -frames:v 1 -q:v 3 featured-edit-v3.jpg
```

Le navigateur garde la vidéo en cache : pour la remplacer, change toujours son nom de fichier (v3, v4…) et `video` dans `FEATURED_EDIT`.

## Vérifications avant de déployer

```bash
npm run lint
npm run build
```
