/**
 * BULBE ENERGIA - LÓGICA INTERATIVA E ADAPTAÇÃO DE DISPOSITIVOS
 * Arquivo: js/app.js
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Base de Dados Dinâmica por Mês
    const invoicesData = {
        out: {
            mesNome: "Outubro / 2026",
            economia: 60,
            percentual: 15,
            tradicional: 500,
            cemigValor: 100,
            cemigStatus: "[ Paga ]",
            cemigBadgeClass: "badge-paid",
            cemigVenc: "10/10",
            kwhRede: 500,
            consumoRedeValor: 450,
            taxasValor: 50,
            creditoCemig: 400,
            bulbeValor: 340,
            bulbeStatus: "[ Aberta ]",
            bulbeBadgeClass: "badge-open",
            bulbeVenc: "15/10",
            kwhSolar: 444,
            energiaSolarValor: 400,
            descontoBulbe: 60,
            pixCode: "00020126580014BR.GOV.BCB.PIX0136bulbe-energia-fatura-outubro-2026-340"
        },
        set: {
            mesNome: "Setembro / 2026",
            economia: 54,
            percentual: 15,
            tradicional: 460,
            cemigValor: 100,
            cemigStatus: "[ Paga ]",
            cemigBadgeClass: "badge-paid",
            cemigVenc: "10/09",
            kwhRede: 455,
            consumoRedeValor: 410,
            taxasValor: 50,
            creditoCemig: 360,
            bulbeValor: 306,
            bulbeStatus: "[ Paga ]",
            bulbeBadgeClass: "badge-paid",
            bulbeVenc: "15/09",
            kwhSolar: 400,
            energiaSolarValor: 360,
            descontoBulbe: 54,
            pixCode: "00020126580014BR.GOV.BCB.PIX0136bulbe-energia-fatura-setembro-2026-306"
        },
        ago: {
            mesNome: "Agosto / 2026",
            economia: 72,
            percentual: 15,
            tradicional: 580,
            cemigValor: 100,
            cemigStatus: "[ Paga ]",
            cemigBadgeClass: "badge-paid",
            cemigVenc: "10/08",
            kwhRede: 580,
            consumoRedeValor: 530,
            taxasValor: 50,
            creditoCemig: 480,
            bulbeValor: 408,
            bulbeStatus: "[ Paga ]",
            bulbeBadgeClass: "badge-paid",
            bulbeVenc: "15/08",
            kwhSolar: 533,
            energiaSolarValor: 480,
            descontoBulbe: 72,
            pixCode: "00020126580014BR.GOV.BCB.PIX0136bulbe-energia-fatura-agosto-2026-408"
        }
    };

    let currentMonthKey = "out";

    // Utilitário para formatar moeda em Real (BRL)
    const formatBRL = (value) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    };

    // 2. Elementos do DOM
    const appWrapper = document.getElementById("app-wrapper");
    const viewportDimsLabel = document.getElementById("viewport-dimensions");
    const selectDesktop = document.getElementById("month-select-desktop");
    const selectMobile = document.getElementById("month-select-mobile");

    // 3. Atualização Dinâmica da Interface por Mês
    function renderInvoiceMonth(monthKey) {
        const data = invoicesData[monthKey];
        if (!data) return;
        currentMonthKey = monthKey;

        const totalComBulbe = data.cemigValor + data.bulbeValor;

        // Textos de Economia
        document.getElementById("val-economia").textContent = formatBRL(data.economia);
        document.getElementById("val-economia-mob").textContent = formatBRL(data.economia);
        document.getElementById("val-perc").textContent = `${data.percentual}%`;

        // Textos e Barras de Progresso
        document.getElementById("val-tradicional").textContent = formatBRL(data.tradicional);
        document.getElementById("val-total-breakdown").textContent =
            `${formatBRL(data.cemigValor)} (Cemig) + ${formatBRL(data.bulbeValor)} (Bulbe) = ${formatBRL(totalComBulbe)}`;

        const cemigPerc = Math.round((data.cemigValor / data.tradicional) * 100);
        const bulbePerc = Math.round((data.bulbeValor / data.tradicional) * 100);

        document.getElementById("bar-cemig").style.width = `${cemigPerc}%`;
        document.getElementById("bar-bulbe").style.width = `${bulbePerc}%`;

        // Card 1: Cemig
        const statusCemigEl = document.getElementById("status-cemig");
        statusCemigEl.textContent = data.cemigStatus;
        statusCemigEl.className = `badge ${data.cemigBadgeClass}`;
        document.getElementById("venc-cemig").textContent = data.cemigVenc;
        document.getElementById("kwh-rede").textContent = data.kwhRede;
        document.getElementById("val-consumo-rede").textContent = formatBRL(data.consumoRedeValor);
        document.getElementById("val-taxas").textContent = `+${formatBRL(data.taxasValor)}`;
        document.getElementById("val-credito-cemig").textContent = `-${formatBRL(data.creditoCemig)}`;
        document.getElementById("val-final-cemig").textContent = formatBRL(data.cemigValor);

        // Card 2: Bulbe
        const statusBulbeEl = document.getElementById("status-bulbe");
        statusBulbeEl.textContent = data.bulbeStatus;
        statusBulbeEl.className = `badge ${data.bulbeBadgeClass}`;
        document.getElementById("venc-bulbe").textContent = data.bulbeVenc;
        document.getElementById("kwh-solar").textContent = data.kwhSolar;
        document.getElementById("val-energia-solar").textContent = formatBRL(data.energiaSolarValor);
        document.getElementById("val-desconto-bulbe").textContent = `-${formatBRL(data.descontoBulbe)}`;
        document.getElementById("val-final-bulbe").textContent = formatBRL(data.bulbeValor);

        // Box Explicativo
        document.getElementById("explainer-dynamic-text").textContent =
            `A Cemig cobra taxas obrigatórias (R$ ${data.cemigValor}) e a Bulbe desconta R$ ${data.creditoCemig} e cobra R$ ${data.bulbeValor}.`;
    }

    // Sincronizar os dois seletores de mês (Mobile e Desktop)
    selectDesktop.addEventListener("change", (e) => {
        selectMobile.value = e.target.value;
        renderInvoiceMonth(e.target.value);
        showToast(`Fatura alterada para ${invoicesData[e.target.value].mesNome}`);
    });

    selectMobile.addEventListener("change", (e) => {
        selectDesktop.value = e.target.value;
        renderInvoiceMonth(e.target.value);
        showToast(`Fatura alterada para ${invoicesData[e.target.value].mesNome}`);
    });

    // 4. Sistema de Adaptação de Dispositivos e ResizeObserver Automático
    const simButtons = document.querySelectorAll(".sim-btn");

    function updateViewportIndicator() {
        const rect = appWrapper.getBoundingClientRect();
        viewportDimsLabel.textContent = `${Math.round(rect.width)} × ${Math.round(rect.height)} px`;
    }

    simButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            simButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const targetViewport = btn.getAttribute("data-viewport");

            if (targetViewport === "auto") {
                appWrapper.className = "app-wrapper auto-mode";
                appWrapper.style.width = "";
                appWrapper.style.height = "";
            } else {
                const [w, h] = targetViewport.split("x").map(Number);
                appWrapper.className = "app-wrapper framed-mode";
                if (w < 768) {
                    appWrapper.classList.add("force-mobile");
                }
                appWrapper.style.width = `${w}px`;
                appWrapper.style.height = `${h}px`;
            }

            setTimeout(updateViewportIndicator, 310);
        });
    });

    // Monitorar redimensionamento real da janela automaticamente
    window.addEventListener("resize", updateViewportIndicator);
    updateViewportIndicator();

    // 5. Sistema de Toast e Modais
    const toastEl = document.getElementById("toast-notification");
    const toastMsg = document.getElementById("toast-message");
    let toastTimeout;

    function showToast(message) {
        toastMsg.textContent = message;
        toastEl.classList.add("show");
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastEl.classList.remove("show");
        }, 2800);
    }

    const modalOverlay = document.getElementById("info-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalClose = document.getElementById("modal-close");
    const modalOk = document.getElementById("modal-ok-btn");

    function openModal(title, htmlContent) {
        modalTitle.textContent = title;
        modalBody.innerHTML = htmlContent;
        modalOverlay.classList.add("open");
        modalOverlay.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
        modalOverlay.classList.remove("open");
        modalOverlay.setAttribute("aria-hidden", "true");
    }

    modalClose.addEventListener("click", closeModal);
    modalOk.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Eventos dos Botões dos Cards
    document.getElementById("btn-ver-desconto").addEventListener("click", () => {
        const d = invoicesData[currentMonthKey];
        openModal(
            "Onde o desconto aparece na Cemig?",
            `<p>Na sua fatura oficial da <strong>Cemig</strong>, procure pelo campo <strong>"Itens da Fatura / Energia Injetada GDR"</strong>.</p>
             <div style="background:#F1F5F9; padding:12px; border-radius:8px; margin-top:10px; border-left:4px solid #22C55E;">
                <strong>Energia Solar Injetada Bulbe:</strong> -${formatBRL(d.creditoCemig)}<br>
                <small style="color:#475569;">Esse valor abateu seu consumo da rede de ${d.kwhRede} kWh.</small>
             </div>`
        );
    });

    document.getElementById("btn-detalhamento").addEventListener("click", () => {
        const d = invoicesData[currentMonthKey];
        openModal(
            "Detalhamento de Consumo Solar",
            `<p>Confira o balanço energético da sua unidade consumidora em <strong>${d.mesNome}</strong>:</p>
             <ul style="margin-top:10px; padding-left:18px; line-height:1.8;">
                <li><strong>Consumo Total na Rede:</strong> ${d.kwhRede} kWh</li>
                <li><strong>Energia Solar Injetada:</strong> ${d.kwhSolar} kWh</li>
                <li><strong>Tarifa Sem Desconto:</strong> ${formatBRL(d.energiaSolarValor)}</li>
                <li><strong>Desconto Garantido Bulbe (15%):</strong> -${formatBRL(d.descontoBulbe)}</li>
                <li><strong>Total Líquido Bulbe:</strong> ${formatBRL(d.bulbeValor)}</li>
             </ul>`
        );
    });

    document.getElementById("btn-copiar-pix").addEventListener("click", () => {
        const code = invoicesData[currentMonthKey].pixCode;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code).catch(() => {});
        }
        showToast("Código PIX Copia e Cola copiado!");
    });

    document.getElementById("btn-baixar-boleto").addEventListener("click", () => {
        showToast("Iniciando download do Boleto Bulbe (.PDF)...");
    });

    document.getElementById("btn-pdf-cemig").addEventListener("click", () => {
        showToast("Abrindo PDF original da distribuidora (Cemig)...");
    });

    // 6. Navegação Inferior (Tabs)
    const navTabs = document.querySelectorAll(".nav-tab");
    navTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            navTabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            const tabName = tab.getAttribute("data-tab") === "conexao" ? "Conexão (Raio-X)" : "Indicações";
            showToast(`Aba selecionada: ${tabName}`);
        });
    });

    // Inicializar com Outubro
    renderInvoiceMonth("out");
});
