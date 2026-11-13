document.addEventListener("DOMContentLoaded", () => {
    const invoicesData = {
        out: {
            mesNome: "Outubro / 2026",
            economia: 60,
            percentual: 15,
            tradicional: 500,
            cemigValor: 100,
            cemigStatus: "Paga",
            cemigBadgeClass: "badge-paid",
            cemigVenc: "10/10",
            kwhRede: 500,
            consumoRedeValor: 450,
            taxasValor: 50,
            creditoCemig: 400,
            bulbeValor: 340,
            bulbeStatus: "Aberta",
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
            cemigStatus: "Paga",
            cemigBadgeClass: "badge-paid",
            cemigVenc: "10/09",
            kwhRede: 455,
            consumoRedeValor: 410,
            taxasValor: 50,
            creditoCemig: 360,
            bulbeValor: 306,
            bulbeStatus: "Paga",
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
            cemigStatus: "Paga",
            cemigBadgeClass: "badge-paid",
            cemigVenc: "10/08",
            kwhRede: 580,
            consumoRedeValor: 530,
            taxasValor: 50,
            creditoCemig: 480,
            bulbeValor: 408,
            bulbeStatus: "Paga",
            bulbeBadgeClass: "badge-paid",
            bulbeVenc: "15/08",
            kwhSolar: 533,
            energiaSolarValor: 480,
            descontoBulbe: 72,
            pixCode: "00020126580014BR.GOV.BCB.PIX0136bulbe-energia-fatura-agosto-2026-408"
        }
    };

    let currentMonthKey = "out";

    const formatBRL = (value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    // A tela agora vive no frame de celular do app, então só existe o seletor compacto.
    const selectMobile = document.getElementById("month-select-mobile");

    function renderInvoiceMonth(monthKey) {
        const data = invoicesData[monthKey];
        if (!data) return;
        currentMonthKey = monthKey;

        const totalComBulbe = data.cemigValor + data.bulbeValor;

        document.getElementById("val-economia").textContent = formatBRL(data.economia);
        document.getElementById("val-perc").textContent = `${data.percentual}%`;
        document.getElementById("val-tradicional").textContent = formatBRL(data.tradicional);
        // Total com a Bulbe + legenda da barra (Cemig e Bulbe separados)
        document.getElementById("val-total").textContent = formatBRL(totalComBulbe);
        document.getElementById("leg-cemig").textContent = formatBRL(data.cemigValor);
        document.getElementById("leg-bulbe").textContent = formatBRL(data.bulbeValor);

        const cemigPerc = Math.round((data.cemigValor / data.tradicional) * 100);
        const bulbePerc = Math.round((data.bulbeValor / data.tradicional) * 100);
        document.getElementById("bar-cemig").style.width = `${cemigPerc}%`;
        document.getElementById("bar-bulbe").style.width = `${bulbePerc}%`;

        const statusCemigEl = document.getElementById("status-cemig");
        statusCemigEl.textContent = data.cemigStatus;
        statusCemigEl.className = `badge ${data.cemigBadgeClass}`;
        document.getElementById("venc-cemig").textContent = data.cemigVenc;
        document.getElementById("kwh-rede").textContent = data.kwhRede;
        document.getElementById("val-consumo-rede").textContent = formatBRL(data.consumoRedeValor);
        document.getElementById("val-taxas").textContent = `+${formatBRL(data.taxasValor)}`;
        document.getElementById("val-credito-cemig").textContent = `-${formatBRL(data.creditoCemig)}`;
        document.getElementById("val-final-cemig").textContent = formatBRL(data.cemigValor);

        const statusBulbeEl = document.getElementById("status-bulbe");
        statusBulbeEl.textContent = data.bulbeStatus;
        statusBulbeEl.className = `badge ${data.bulbeBadgeClass}`;
        document.getElementById("venc-bulbe").textContent = data.bulbeVenc;
        document.getElementById("kwh-solar").textContent = data.kwhSolar;
        document.getElementById("val-energia-solar").textContent = formatBRL(data.energiaSolarValor);
        document.getElementById("val-desconto-bulbe").textContent = `-${formatBRL(data.descontoBulbe)}`;
        document.getElementById("val-final-bulbe").textContent = formatBRL(data.bulbeValor);

        document.getElementById("explainer-dynamic-text").textContent =
            `A Cemig continua levando a energia até você e cobra as taxas obrigatórias (${formatBRL(data.cemigValor)}). ` +
            `A Bulbe gera a energia solar, abate ${formatBRL(data.creditoCemig)} da conta da Cemig e cobra ${formatBRL(data.bulbeValor)} já com o seu desconto.`;
    }

    selectMobile.addEventListener("change", (e) => {
        const val = e.target.value;
        renderInvoiceMonth(val);
        showToast(`Fatura alterada para ${invoicesData[val].mesNome}`);
    });

    const toastEl = document.getElementById("toast-notification");
    const toastMsg = document.getElementById("toast-message");
    let toastTimeout;

    function showToast(message) {
        toastMsg.textContent = message;
        toastEl.classList.add("show");
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => toastEl.classList.remove("show"), 2800);
    }

    const modalOverlay = document.getElementById("info-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");

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

    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("modal-ok-btn").addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });

    document.getElementById("btn-ver-desconto").addEventListener("click", () => {
        const d = invoicesData[currentMonthKey];
        openModal("Onde o desconto aparece na Cemig?",
            `<p>Na fatura da <strong>Cemig</strong>, procure por <strong>"Energia Injetada GDR"</strong>.</p>
             <div style="background:var(--verde-claro); color:var(--verde); padding:12px; border-radius:10px; margin-top:10px; border:1.5px dashed var(--verde-vivo);">
                <strong style="color:inherit;">Energia solar injetada Bulbe:</strong> <span style="white-space:nowrap;">-${formatBRL(d.creditoCemig)}</span><br>
                <small>Isso abateu seu consumo de ${d.kwhRede} kWh.</small>
             </div>`
        );
    });

    document.getElementById("btn-detalhamento").addEventListener("click", () => {
        const d = invoicesData[currentMonthKey];
        openModal("Detalhamento de consumo",
            `<ul style="padding-left:18px; line-height:1.8;">
                <li><strong>Consumo Total:</strong> ${d.kwhRede} kWh</li>
                <li><strong>Energia Solar:</strong> ${d.kwhSolar} kWh</li>
                <li><strong>Desconto Bulbe (15%):</strong> -${formatBRL(d.descontoBulbe)}</li>
                <li><strong>Líquido Bulbe:</strong> ${formatBRL(d.bulbeValor)}</li>
             </ul>`
        );
    });

    document.getElementById("btn-copiar-pix").addEventListener("click", () => {
        const code = invoicesData[currentMonthKey].pixCode;
        if (navigator.clipboard) navigator.clipboard.writeText(code).catch(() => {});
        showToast("Código PIX copiado!");
    });

    document.getElementById("btn-baixar-boleto").addEventListener("click", () => showToast("Iniciando download..."));
    document.getElementById("btn-pdf-cemig").addEventListener("click", () => showToast("Abrindo PDF Cemig..."));
    document.getElementById("btn-whatsapp").addEventListener("click", () => showToast("Abrindo o WhatsApp da Bulbe..."));

    // A navegação inferior é o rodapé comum do app (assets/js/rodape.js).

    // ?mes=ago|set|out abre direto aquele mês (usado pelo Histórico e 2ª via); sem ele, outubro.
    const mesDaUrl = new URLSearchParams(location.search).get("mes");
    const mesInicial = invoicesData[mesDaUrl] ? mesDaUrl : "out";
    selectMobile.value = mesInicial;
    renderInvoiceMonth(mesInicial);
});