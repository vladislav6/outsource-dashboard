
const links = [
  {
    title: 'Projects',
    active: true,
  },
  {
    title: 'Employees',
    active: false,
  },
];

function addLinksToNav(linksList) {
  const links = document.querySelector('.links');

  linksList.forEach((link, index) => {
    const liElement = document.createElement('li');
    liElement.textContent = link.title;
    liElement.setAttribute('data-id', index);
    liElement.className = 'link';
    if (link.active) {
      liElement.classList.add('active');
    }

    links.append(liElement);
  });
}

function switchPage (links) {
  const linkArr = [...links];
  linkArr.forEach((link) => {
    link.addEventListener('click', (e) => {
      linkArr.map((link) => link.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });
}

addLinksToNav(links);
switchPage(document.querySelectorAll('.link'));

