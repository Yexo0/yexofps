# yexofps.org

Site perso de Baptiste Dauvergne (Yexo) : parcours en administration systèmes et réseaux, homelab, rangs et tracker Valorant, edits et Y-Services, convertisseur de sensibilité.

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
| Tous les textes | `messages/fr.json`, `messages/en.json` |

Dans `src/config/lab.ts`, chaque élément inventé porte `placeholder: true` et un commentaire `PLACEHOLDER` : remplace-le par tes vraies infos.

## Vérifications avant de déployer

```bash
npm run lint
npm run build
```
