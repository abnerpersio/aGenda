/* ------------------------------------------------------------------------------
*   a Genda sistema de gerenciamento de tempo  
*   © 2020 Abner Persio
*
*  Version: 1.0.0
*  update: Dez 3, 2020
* ---------------------------------------------------------------------------- */

function notificar(message, theme, presa) {
  $.jGrowl(message, {
    theme: theme,
    sticky: presa
  });
}
