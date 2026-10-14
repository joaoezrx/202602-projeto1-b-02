
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
