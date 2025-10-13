async function loadHTML(id, url) {
  const res = await fetch(url);
  document.getElementById(id).innerHTML = await res.text();
}

loadHTML('header', 'header.html');
loadHTML('footer', 'footer.html');

