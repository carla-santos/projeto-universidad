'use strict';

function initHeader() {
  const navbar = document.querySelector('.header__nav');
  const search = document.querySelector('.header__form-search');
  const cart = document.querySelector('.header__cart');
  const login = document.querySelector('.header__form-login');
  const menuBtn = document.querySelector('.js-menu-btn');
  const searchBtn = document.querySelector('.js-search-btn');
  const cartBtn = document.querySelector('.js-cart-btn');
  const loginBtn = document.querySelector('.js-login-btn');

  const aparecerMenu = function () {
    navbar.classList.toggle('active');
    search.classList.remove('active');
    cart.classList.remove('active');
    login.classList.remove('active');
  };
  menuBtn.addEventListener('click', aparecerMenu);

  const aparecerBusca = function () {
    search.classList.toggle('active');
    navbar.classList.remove('active');
    cart.classList.remove('active');
    login.classList.remove('active');
  };
  searchBtn.addEventListener('click', aparecerBusca);

  const aparecerCarrinho = function () {
    cart.classList.toggle('active');
    navbar.classList.remove('active');
    search.classList.remove('active');
    login.classList.remove('active');
  };
  cartBtn.addEventListener('click', aparecerCarrinho);

  const aparecerLogin = function () {
    login.classList.toggle('active');
    navbar.classList.remove('active');
    search.classList.remove('active');
    cart.classList.remove('active');
  };
  loginBtn.addEventListener('click', aparecerLogin);
}
initHeader();

function initCarrinho() {
  const containerCarrinho = document.querySelector('.header__cart');
  const conteudoCarrinho = document.querySelector('.cart__box tbody');
  const eltotal = document.querySelector('.total span');
  const btnLimpar = document.querySelector('.btn--limpar');
  const btnCalcular = document.querySelector('.btn--finalizar');
  const cursos = document.querySelector('.container__cursos');
  let carrinho = [];

  // Funções

  // Adiciona cursos ao local Storage
  const adicionarStorage = function () {
    localStorage.setItem('Carrinho', JSON.stringify(carrinho));
  };

  // Elimina os cursos do carrinho no DOM
  const limparHTML = function () {
    while (conteudoCarrinho.firstChild) {
      conteudoCarrinho.removeChild(conteudoCarrinho.firstChild);
    }

    adicionarStorage();
  };

  // Mostra o curso selecionado no carrinho
  const mostrarDadosCarrinho = function () {
    limparHTML();

    carrinho.forEach((curso) => {
      const { imagem, titulo, preco, quantidade, id } = curso;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><img src="${imagem}" width=60></td>
        <td class="cart__content text-center">${titulo}</td>
        <td class="text-center">${preco},00</td>
        <td class="text-center">${quantidade}</td>
        <td class="text-center"><a href="#" class="fas fa-trash apagar-curso" data-id="${id}"></a></td>  
      `;
      conteudoCarrinho.appendChild(row);
    });

    adicionarStorage();
  };

  // Adiciona curso ao carrinho.
  const adicionarCurso = function (e) {
    e.preventDefault();

    if (e.target.classList.contains('js-carrinho')) {
      const curso = e.target.closest('.cursos__item');

      // Envia o curso selecionado para a função pegar os dados
      lerDadosCurso(curso);
    }
  };

  // Ler os dados do curso
  function lerDadosCurso(curso) {
    const infoCurso = {
      imagem: curso.querySelector('.cursos__img').src,
      titulo: curso.querySelector('h3').textContent,
      preco: curso.querySelector('.cursos__price span').textContent,
      quantidade: 1,
      id: curso.querySelector('a').getAttribute('data-id'),
    };

    // Verifica se existe pelo menos 1 curso no carrinho.
    const verificaCurso = carrinho.some((curso) => curso.id === infoCurso.id);

    if (verificaCurso) {
      carrinho.forEach((curso) => {
        if (curso.id === infoCurso.id) curso.quantidade++;
      });
    } else {
      carrinho = [...carrinho, infoCurso];
    }

    mostrarDadosCarrinho();
  }

  // Elimina um curso do carrinho
  const eliminarCurso = function (e) {
    e.preventDefault();

    if (e.target.classList.contains('apagar-curso')) {
      const cursoId = e.target.getAttribute('data-id');

      carrinho.some((curso) => {
        if (curso.id === cursoId) {
          if (curso.quantidade > 1) curso.quantidade--;
          else {
            carrinho = carrinho.filter((curso) => curso.id !== cursoId);
          }
        }
        mostrarDadosCarrinho();
      });
    }
  };

  const calcularTotal = function () {
    const total = carrinho.reduce((acc, curso) => {
      if (curso.quantidade > 1) {
        return acc + +curso.quantidade * +curso.preco;
      } else {
        return acc + +curso.preco;
      }
    }, 0);

    eltotal.textContent = `${total},00`;
  };

  // Esvazia os cursos do carrinho ao clicar no botão.
  const limparCarrinho = function (e) {
    e.preventDefault();

    carrinho = [];
    limparHTML();
    eltotal.textContent = '0,00';
  };

  // Eventos
  const eventListener = function () {
    // Evento se dispara quando se pressiona o botão 'Agregar Carrito'
    cursos.addEventListener('click', adicionarCurso);

    // Elimina cursos do carrinho
    containerCarrinho.addEventListener('click', eliminarCurso);

    // Limpa o carrinho
    btnLimpar.addEventListener('click', limparCarrinho);

    // Cálcula o total
    btnCalcular.addEventListener('click', calcularTotal);

    // Mostra os cursos do Local Storage depois do HTML ser completamente carregado.
    document.addEventListener('DOMContentLoaded', () => {
      carrinho = JSON.parse(localStorage.getItem('Carrinho')) || [];
      mostrarDadosCarrinho();
    });
  };
  eventListener();
}
initCarrinho();
