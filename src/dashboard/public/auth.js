/* eslint-disable no-undef */
const ventana = window.open(`${process.env.URL}/signin', 'Discord Authentication', 'fullscreen=no, left=100, top=100, toolbar=no, height=850, width=400`)
  setInterval(() => {
    if(!ventana) {
      window.location.reload();
    }
  }, 1000);
//pa la logeazion de discord como se usa esto xdd