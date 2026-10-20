
# Mapa de jornada do usuário

> Entregável da aula 19.

## Persona 1 João Vitor

- **Nome e idade:** Mariana Costa, 35 anos (fictícia).
- **Contexto:** Conheceu a Bulbe pela internet e aderiu ao serviço buscando economizar na conta de energia.
- **Objetivo:** Economizar energia e compreender sua primeira fatura para realizar o pagamento corretamente.
- **Medos e dúvidas:** Não saber quando receberá a primeira fatura, não entender os valores cobrados e ter dúvidas sobre as contas da Bulbe e da distribuidora.
- **Canais que usa:** WhatsApp, e-mail e celular.

## Mapa

| Fase | Ações | Pontos de contato | Pensamentos | Emoção | Dor (com evidência da Bulbe) | Oportunidade |
| --- | --- | --- | --- | --- | --- | --- |
| Contratação | Adere à Bulbe para economizar na energia. | Site e WhatsApp. | Quando começarei a economizar? | Expectativa | Falta de clareza sobre as próximas etapas. | Apresentar as etapas da adesão. |
| Espera pela primeira fatura | Aguarda informações sobre a cobrança. | WhatsApp e e-mail. | Quando minha fatura vai chegar? | Insegurança | Clientes ficaram até 20 dias sem comunicação durante o onboarding. | Criar uma tela de acompanhamento da primeira fatura. |
| Recebimento da fatura | Consulta os valores e o vencimento. | Fatura digital. | Por que recebi essa cobrança? | Confusão | A Bulbe identificou dificuldades dos clientes para compreender a fatura. | Criar uma tela que explique os valores e descontos. |
| Pagamento | Tenta compreender e pagar a cobrança. | Fatura e canal de pagamento. | Estou pagando corretamente? | Dúvida | A inadimplência da primeira fatura é de 32,4%. | Facilitar o entendimento e orientar o pagamento. |

## Persona 2 Gabriel Muniz

-Nome e idade: Carlos Eduardo Mendes ("O Desconfiado das Duas Contas"), 42 anos.  

-Contexto: Comerciante e Gestor Financeiro de Pequeno Porte em Belo Horizonte (MG) com consumo médio de 500 kWh (cerca de R$ 500,00 mensais). Contratou a Bulbe para garantir 15% de desconto na fatura de energia da sua loja.   

-Objetivo: Ter a comprovação matemática imediata da sua economia financeira (15% OFF), entender a rastreabilidade do crédito solar nas duas faturas e ter agilidade para pagar os boletos sem precisar acionar o suporte da Bulbe.   

-Medos e dúvidas: Tem sensação de cobrança duplicada ao receber boletos em datas diferentes (ex: Cemig dia 10 e Bulbe dia 15). Não compreende por que a conta da Cemig não vem zerada e possui dificuldade técnica para ler a fatura original e encontrar a linha do abatimento do crédito solar.   

-Canais que usa: App Mobile (para pagamentos rápidos via PIX no dia a dia) e Portal Web no computador da loja (para conferir detalhes financeiros e baixar PDFs de comprovantes)

## Mapa

Aqui está a persona e o mapa de jornada estruturados exatamente no modelo solicitado, baseados nas informações do documento "requisitos_raio_x_fatura (1).pdf":

## Persona: Carlos Eduardo Mendes

* **Nome e idade:** Carlos Eduardo Mendes ("O Desconfiado das Duas Contas"), 42 anos.


* **Contexto:** Comerciante e Gestor Financeiro de Pequeno Porte em Belo Horizonte (MG) com consumo médio de 500 kWh (cerca de R$ 500,00 mensais). Contratou a Bulbe para garantir 15% de desconto na fatura de energia da sua loja.


* **Objetivo:** Ter a comprovação matemática imediata da sua economia financeira (15% OFF), entender a rastreabilidade do crédito solar nas duas faturas e ter agilidade para pagar os boletos sem precisar acionar o suporte da Bulbe.


* **Medos e dúvidas:** Tem sensação de cobrança duplicada ao receber boletos em datas diferentes (ex: Cemig dia 10 e Bulbe dia 15). Não compreende por que a conta da Cemig não vem zerada e possui dificuldade técnica para ler a fatura original e encontrar a linha do abatimento do crédito solar.


* **Canais que usa:** App Mobile (para pagamentos rápidos via PIX no dia a dia) e Portal Web no computador da loja (para conferir detalhes financeiros e baixar PDFs de comprovantes).



## Mapa

| Fase | Ações | Pontos de contato | Pensamentos | Emoção | Dor (com evidência da Bulbe) | Oportunidade |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Acesso e Conferência do Mês | Acessa o painel do cliente para conferir o valor do consumo do mês e verificar sua assinatura. | Portal Web e App Mobile (Aba "Raio-X da Fatura").| "Contratei para ter 15% de desconto, mas vejo uma conta de R$ 100 e outra de R$ 340. Estou pagando duas vezes?"
| Desconfiança e Confusão | A soma manual de faturas com datas diferentes gera sensação de cobrança duplicada e falta de percepção de economia.
| Criar um "Banner Resumo" no topo com ancoragem visual, exibindo barras gráficas comparando a "Conta Tradicional" versus a "Soma Atual", destacando em reais e percentual a economia (15% OFF).| 2. Análise de Faturamento | Analisa o detalhamento das cobranças para entender o que está pagando para a concessionária e para a Bulbe. | Tela de Comparativo Lado a Lado (Cards empilhados ou duas colunas). | "Por que a conta da Cemig não está zerada? E por que estou pagando essas taxas extras?" | Frustração Regulamentar | Falta de clareza regulatória sobre cobrança de taxas mínimas e iluminação pública da rede da concessionária. | Mostrar as faturas lado a lado, conectando visualmente a energia injetada na Bulbe ao abatimento da Cemig, e adicionar um rodapé educativo explicando as taxas mínimas.| 3. Auditoria da Conta | Abre a fatura da concessionária para procurar a comprovação de que o desconto da Bulbe realmente foi aplicado lá. | Visualizador da Fatura da Concessionária (PDF Original).| "Onde diabos está escrito na conta da Cemig que a energia da Bulbe foi abatida?"| Estresse Técnico | A fatura original da concessionária é técnica, densa e dificulta a localização exata da linha de abatimento do crédito solar.
| Implementar um "Localizador de Desconto", um botão que exibe uma prévia do PDF da Cemig com uma marcação visual (highlight) diretamente na linha da energia injetada/crédito.| 4. Pagamento Rápido | Realiza o pagamento da fatura aberta da Bulbe para voltar à rotina do comércio. | Fatura Aberta no App/Portal (Botões de Pagamento).| "Preciso resolver isso em segundos para voltar aos clientes da loja, sem ter que abrir chamado de suporte."| Pressa e Praticidade | Dificuldade em acessar métodos rápidos de pagamento faz o comerciante perder tempo na rotina da loja.| Disponibilizar um botão amarelo "Copiar Código PIX" com feedback visual imediato e botão secundário "Baixar Boleto", garantindo liquidação rápida sem atrito. |


## Persona 3 — Felipe Pratti

- **Nome e idade:** Mariana Souza, 34 anos
- **Contexto:** Contratou recentemente o serviço da Bulbe e está aguardando sua primeira cobrança. Como ainda não conhece o ciclo de faturamento, não sabe quando a fatura será emitida, por qual canal chegará ou onde poderá consultá-la.
- **Objetivo:** Acompanhar a emissão da primeira fatura, conhecer antecipadamente a data de vencimento e se organizar para realizar o pagamento dentro do prazo.
- **Medos e dúvidas:** Receio de não receber a fatura, perder o vencimento, pagar juros ou ter o serviço afetado. Tem dúvidas sobre o canal de envio, a diferença entre emissão e vencimento e se precisa realizar alguma ação.
- **Canais que usa:** Aplicativo ou Portal do Cliente, e-mail, WhatsApp e notificações no celular.

## Mapa

| Fase | Ações | Pontos de contato | Pensamentos | Emoção | Dor (evidência da HU02) | Oportunidade |
|---|---|---|---|---|---|---|
|Contratação | Finaliza a contratação e aguarda informações sobre a cobrança. | Site, consultor, WhatsApp e e-mail de boas-vindas. | “A contratação terminou, mas quando precisarei pagar?” | Expectativa | O cliente inicia o serviço sem saber quando sua primeira fatura chegará. | Apresentar, na confirmação da contratação, a previsão da primeira fatura e explicar o ciclo de cobrança. |
| Primeira consulta | Entra no aplicativo ou portal para verificar se já existe alguma cobrança. | Página inicial do aplicativo ou Portal do Cliente. | “Será que minha fatura já foi emitida? Onde eu encontro isso?” | Insegurança | O cliente não sabe onde encontrar a primeira fatura nem consegue identificar facilmente sua situação. | Exibir na página inicial um card destacado: **“Acompanhe sua primeira fatura”**, com status e previsão. |
| Acompanhamento | Acessa a tela de acompanhamento e consulta o status atual. | Tela “Acompanhe sua primeira fatura”. | “O que significa ‘em processamento’? Preciso fazer alguma coisa?” | Dúvida | Status técnicos ou genéricos não ajudam o cliente a entender o que está acontecendo. | Usar uma linha do tempo simples: **Em preparação → Emitida → Enviada → Disponível para pagamento**. Explicar cada etapa e indicar se existe alguma ação necessária. |
| Planejamento | Consulta a previsão de emissão, o vencimento e o canal de recebimento. | Tela de acompanhamento, e-mail e notificações. | “Quero saber a data para separar o dinheiro e não atrasar.” | Cautela | Sem uma previsão clara, o cliente não consegue se preparar financeiramente para o primeiro pagamento. | Mostrar previsão de emissão, data estimada de vencimento e, quando possível, valor estimado. Permitir confirmar ou atualizar o canal de recebimento. |
| Disponibilização | Recebe o aviso de que a primeira fatura está disponível e volta ao aplicativo ou portal. | Push, e-mail, WhatsApp, aplicativo e Portal do Cliente. | “Minha fatura chegou. Como posso visualizar ou pagar?” | Alívio | Mesmo após a emissão, o cliente pode não encontrar rapidamente o documento ou as opções de pagamento. | Enviar notificação com acesso direto à fatura e disponibilizar as ações **Ver fatura**, **Baixar PDF**, **Copiar código** e **Pagar**. |
| Pagamento | Escolhe a forma de pagamento e conclui ou agenda a transação. | Aplicativo, portal, Pix, boleto ou internet banking. | “O pagamento foi reconhecido? Está tudo certo?” | Alívio com expectativa | A ausência de confirmação pode fazer o cliente acreditar que o pagamento não foi processado. | Exibir o status **“Pagamento em processamento”** e, depois, **“Pagamento confirmado”**, informando o prazo de compensação. |
| Pós-pagamento | Confere a confirmação e passa a acompanhar as próximas cobranças. | Aplicativo, portal e notificação de confirmação. | “Agora sei quando e onde acompanhar minhas próximas faturas.” | Confiança | Uma primeira experiência confusa pode gerar insegurança nas cobranças seguintes. | Apresentar o próximo ciclo de cobrança e oferecer a ativação de lembretes e débito automático. |

## Oportunidades registradas como Issues

- [ ] #5 Facilitar a compreensão da primeira fatura — João Vitor.
- [ ] #6 Criar acompanhamento da primeira fatura — Felipe Pratti.


## Persona 4 — Enrico Pesso Cota

- **Nome e idade:** Ana Paula Ribeiro, 29 anos (fictícia).
- **Contexto:** Mora de aluguel com o namorado e contratou a Bulbe há três meses após ver uma promessa de economia na conta de luz. Já pagou as primeiras faturas, mas, como recebe a cobrança da Bulbe e o valor residual da distribuidora separadamente, não consegue confirmar se está economizando de verdade.
- **Objetivo:** Ter certeza de que a troca valeu a pena e acompanhar mês a mês quanto está economizando.
- **Medos e dúvidas:** Medo de estar pagando mais caro sem perceber, de a economia prometida não ser real e de ter que fazer contas sozinha somando as duas faturas. Tem dúvida se o desconto muda conforme o consumo.
- **Canais que usa:** Aplicativo ou Portal do Cliente, WhatsApp e e-mail.

## Mapa

| Fase | Ações | Pontos de contato | Pensamentos | Emoção | Dor (com evidência da Bulbe) | Oportunidade |
| --- | --- | --- | --- | --- | --- | --- |
| Contratação | Adere à Bulbe atraída pela promessa de desconto na conta. | Anúncio, site e WhatsApp. | "Quanto eu vou economizar de verdade?" | Expectativa | A economia é apresentada em percentual, sem mostrar quanto isso representa em reais para o cliente. | Mostrar na contratação uma simulação de economia em reais com base no consumo médio do cliente. |
| Recebimento das faturas | Recebe a fatura da Bulbe e a conta residual da distribuidora. | E-mail, WhatsApp e fatura digital. | "Agora são duas contas. Isso está saindo mais barato mesmo?" | Desconfiança | A necessidade de somar a conta da distribuidora com a da Bulbe gera a sensação de que o cliente está pagando mais caro. | Exibir o valor total do mês (Bulbe + distribuidora) e compará-lo com o que seria pago sem a Bulbe. |
| Verificação da economia | Tenta comparar as contas atuais com as antigas por conta própria. | Faturas antigas, aplicativo do banco e calculadora. | "Não sei se estou fazendo a conta certa." | Frustração | O cliente não encontra no portal nenhuma informação consolidada sobre sua economia. | Criar uma tela "Minha economia" com o valor economizado no mês e o total acumulado desde a contratação. |
| Variação de consumo | Percebe que a economia mudou de um mês para o outro. | Fatura digital e Portal do Cliente. | "Por que esse mês economizei menos? O desconto diminuiu?" | Dúvida | A variação do valor economizado, sem explicação, faz o cliente achar que o desconto mudou. | Explicar como a economia é calculada e mostrar que a variação acompanha o consumo do mês. |
| Permanência | Decide se continua com a Bulbe ou cancela o serviço. | Portal do Cliente, WhatsApp e e-mail. | "Se eu não consigo ver o benefício, por que continuar?" | Insegurança | A falta de percepção do benefício pode levar o cliente a cancelar mesmo estando economizando. | Enviar mensalmente um resumo da economia por e-mail ou WhatsApp, com o total acumulado. |

