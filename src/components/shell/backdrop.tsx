// src/components/shell/backdrop.tsx — Fond du site, fixe derrière tout le contenu : un dégradé discret
// teinté par la couleur de l'espace (CSS seul, .backdrop-base). Pas de fumée, pas de lignes, pas de
// numéro géant : le fond se fait oublier, le contenu porte la page.
export function Backdrop() {
  return (
    <div aria-hidden="true" className="backdrop">
      <div className="backdrop-base" />
    </div>
  );
}
