
# Bulbe Energia — Jornada e Experiência do Cliente

> Projeto em Ciência de Dados I · Ibmec BH · 2º semestre de 2026  
> Cliente: **Bulbe Energia** · Turma **B** · Squad **02**

Protótipo de uma plataforma que ajuda os clientes da Bulbe a compreender suas faturas, acompanhar cobranças, acessar orientações fiscais e visualizar a economia obtida com o serviço.

---

## 1. Problema

Clientes da Bulbe podem enfrentar dificuldades para receber, compreender e acompanhar suas primeiras faturas, o que pode gerar insegurança e atrasos no pagamento. Além disso, o squad identificou oportunidades complementares relacionadas à orientação fiscal de clientes PJ e à visualização da economia acumulada.

- **Dor escolhida:** Dificuldade de compreensão e acompanhamento das cobranças da Bulbe, especialmente da primeira fatura.
- **Evidência:** Segundo os dados apresentados pela Bulbe, a inadimplência da primeira fatura é de 32,4%, e cerca de 20% das mensagens enviadas pelo WhatsApp não chegam aos destinatários.
- **Indicador que a solução pretende mover:** Pagamento da primeira fatura, com possível contribuição para a redução do churn.

## 2. Persona e jornada

- **Persona:** Clientes da Bulbe com dificuldades para compreender cobranças, acompanhar faturas ou visualizar benefícios do serviço. Os perfis específicos estão documentados no mapa de jornada.
- **Mapa de jornada:** [docs/jornada.md](docs/jornada.md)

## 3. Solução

O squad propõe quatro funcionalidades para melhorar a experiência dos clientes da Bulbe.

| Tela | O que faz | História relacionada |
| --- | --- | --- |
| Detalhamento da primeira fatura | Apresenta valores, descontos, vencimento e diferenças entre as cobranças da Bulbe e da distribuidora. | HU01 |
| Kit Contador | Disponibiliza orientações fiscais em PDF para clientes PJ. | HU02 |
| Acompanhamento da primeira fatura | Apresenta o status da cobrança, previsão de disponibilidade e próximas etapas. | HU03 |
| Economia acumulada | Apresenta a economia mensal e total obtida com o serviço. | HU04 |

- **Histórias de usuário:** [docs/historias.md](docs/historias.md)
- **Wireframes:** [docs/wireframes/](docs/wireframes/)

## 4. Tecnologias

- HTML, CSS e JavaScript puro (vanilla)
- Dados fictícios em JSON, lidos com `fetch` (pasta `data/`)
- Git e GitHub (Issues, Projects e Pull Requests)

## 5. Como executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/joaoezrx/202602-projeto1-b-02.git
   ```
2. Abra a pasta no VS Code.
3. Instale a extensão **Live Server**.
4. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.

> Abrir o `index.html` diretamente no navegador pode impedir a leitura dos arquivos JSON pelo `fetch`. Utilize o Live Server.

### Conta de demonstração

Ao abrir o app, aparece a tela de login. Há duas contas fictícias (a senha é a mesma):

| Conta | E-mail | Senha | Para que serve |
| --- | --- | --- | --- |
| Cliente antiga | `ana.martins@bulbe.test` | `Bulbe@2026` | Faturas pagas e economia acumulada (todas as telas com dados) |
| Cliente nova | `lucas.andrade@bulbe.test` | `Bulbe@2026` | Acabou de aderir: primeira fatura em preparação, sem economia ainda e **tutorial do Continha** no primeiro acesso |

- **Ana Paula Martins** é o `clienteId` 4 em `data/clientes.json`. **Lucas Andrade** é o `clienteId` 5.
- O tutorial do Continha aparece uma vez por conta neste navegador. Para rever, abra o menu ☰ e escolha **Tutorial com o Continha**.
- Para **recomeçar do zero** (por exemplo, antes de uma apresentação), abra `pages/login.html?reiniciar=1`. Isso apaga a sessão, o "tutorial visto" e as preferências salvas pelo app neste navegador.
- Em `data/usuarios.json` a senha fica guardada só como hash SHA-256.
- Para sair, toque no avatar no canto superior direito e escolha **Sair da conta**.
- É um protótipo: o login acontece todo no navegador e **não é autenticação de verdade**.

### Apresentação

A apresentação do projeto fica em `apresentacao/index.html`. Com o servidor ligado, abra `apresentacao/index.html` pelo mesmo endereço do app (ex.: `http://127.0.0.1:5500/apresentacao/`).

- Os celulares dos slides mostram **o app de verdade**, e dá para clicar neles. Antes de apresentar, entre uma vez no app com **Manter conectado**; sem isso, os celulares mostram a tela de login.
- Para passar os slides, use as **setas** ou o **espaço**. A tecla **F** liga a tela cheia. Para abrir num slide específico, use `#n` no fim do endereço (ex.: `#5`).
- Tudo fica em um arquivo só (HTML, CSS e JS). Os textos de cada slide estão nas `<section class="slide">`.

## 6. Estrutura do repositório

```text
├── index.html
├── pages/
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   ├── js/api.js
│   └── img/
├── data/
├── docs/
└── .github/
```

## 7. Quadro do projeto

- **GitHub Projects:** [Quadro do Squad](https://github.com/users/joaoezrx/projects/4/views/1)

## 8. Equipe

| Integrante | GitHub | Papel principal |
| --- | --- | --- |
| João Vitor Oliveira | [@joaoezrx](https://github.com/joaoezrx) | Repositório e HU01 |
| Felipe Rodrigues Pratti | [@FelipeRPratti](https://github.com/FelipeRPratti) | HU03 |
| Gabriel Moura Muniz | [@gmunizzz](https://github.com/gmunizzz) | HU02 |
| Enrico Pesso Cota | [@enricopesso](https://github.com/enricopesso) | HU04 |

## 9. Entregas

| Marco | Aula | Status |
| --- | --- | --- |
| Mapa de jornada | 19 | [ ] |
| Histórias de usuário | 20 | [ ] |
| Wireframes | 21–23 | [ ] |
| Sprint Review I | 24 | [ ] |
| Implementação | 25–28 | [ ] |
| Sprint Review II | 29 | [ ] |
| Versão final | 30 | [ ] |

---

> Todos os dados utilizados no protótipo são fictícios. Nenhum dado real de cliente da Bulbe Energia é utilizado.
