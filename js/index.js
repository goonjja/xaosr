const links = document.getElementsByClassName('social-link')

// Array.from(links).forEach((el) => {
//   el.addEventListener('mouseenter', (e) => {
//     activateLink(e)
//   });
// });

// document.getElementById('links').addEventListener('mouseleave', () => {
//   deactivateLink();
// });

const activateLink = (e) => {
  const activeLink = document.getElementById('active-link');

  activeLink.href = e.target.href;
  activeLink.replaceChild(document.createTextNode(e.target.href), activeLink.childNodes[0]);
  activeLink.classList.add('active');
};

const deactivateLink = () => {
  const activeLink = document.getElementById('active-link');

  activeLink.href = '#';
  activeLink.replaceChild(document.createTextNode('...'), activeLink.childNodes[0]);
  activeLink.classList.remove('active');
};
