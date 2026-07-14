(function(){
  const button=document.querySelector('#themeToggle');
  const storageKey='vish-project-theme-v2';
  const saved=localStorage.getItem(storageKey);

  function setTheme(dark){
    document.body.classList.toggle('dark-mode',dark);
    button.textContent=dark?'☀':'☾';
    button.setAttribute('aria-label',dark?'Enable light mode':'Enable dark mode');
    button.title=dark?'Switch to light mode':'Switch to dark mode';
    localStorage.setItem(storageKey,dark?'dark':'light');
  }

  setTheme(true);
  button.addEventListener('click',()=>setTheme(!document.body.classList.contains('dark-mode')));
})();
