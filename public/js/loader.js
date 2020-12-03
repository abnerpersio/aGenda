/* ------------------------------------------------------------------------------
*   a Genda sistema de gerenciamento de tempo  
*   © 2020 Abner Persio
*
*  Version: 1.0.0
*  update: Dez 3, 2020
* ---------------------------------------------------------------------------- */

const preloader = document.querySelector('.preloader');

const loader = (time) => {
  preloader.style.display = 'block';

  setInterval(() => {
    preloader.style.display = 'none'; 
  }, time);
}

document.addEventListener('load', loader(2000));