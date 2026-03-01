// ===============================
// INITIAL SETUP
// ===============================

// Notification
const notification = document.getElementById('notification');

function showNotification(message) {
    if (!notification) return;

    notification.innerText = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2500);
}

// ===============================
// THEME SYSTEM
// ===============================

const themeToggle = document.createElement('button');
themeToggle.innerText = "🌗";
themeToggle.id = "themeToggle";

const topbar = document.querySelector('.topbar');
if (topbar) topbar.appendChild(themeToggle);

// Load saved theme
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');

    if (document.body.classList.contains("light")) {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }
});

// ===============================
// SIDEBAR TOGGLE
// ===============================

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");

if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    });
}

// ===============================
// LOGIN SYSTEM
// ===============================

const loginScreen = document.getElementById('loginScreen');
const loginBtn = document.getElementById('loginBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('loginError');

if (localStorage.getItem("isLoggedIn") === "true") {
    loginScreen?.classList.add("hide");
}

loginBtn?.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "admin" && password === "1234") {
        localStorage.setItem("isLoggedIn", "true");
        loginScreen.classList.add("hide");
        showNotification("Login reușit!");
    } else {
        loginError.innerText = "Date incorecte!";
    }
});

// Logout
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem("isLoggedIn");

    usernameInput.value = "";
    passwordInput.value = "";
    loginError.innerText = "";

    loginScreen.classList.remove("hide");
    showNotification("Te-ai delogat cu succes!");
});

// ===============================
// NAVIGATION SYSTEM
// ===============================

const pageTitle = document.getElementById("pageTitle");
const pages = document.querySelectorAll(".page");
const sidebarItems = document.querySelectorAll(".sidebar li");

sidebarItems.forEach(item => {
    item.addEventListener("click", () => {

        const text = item.innerText.toLowerCase();
        if (text.includes("logout")) return;

        sidebarItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        pages.forEach(page => page.classList.remove("active-page"));

        if (text.includes("stat")) {
            document.getElementById("statistici")?.classList.add("active-page");
            pageTitle.innerText = "Statistici";
        }

        if (text.includes("task")) {
            document.getElementById("taskuri")?.classList.add("active-page");
            pageTitle.innerText = "Task-uri";
        }

        if (text.includes("set")) {
            document.getElementById("setari")?.classList.add("active-page");
            pageTitle.innerText = "Setări";
        }

       if (text.includes("fact")) {
    document.getElementById("facturi")?.classList.add("active-page");
    pageTitle.innerText = "Facturi";
}

    });
});

// ===============================
// TASK MANAGER
// ===============================

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const progressFill = document.getElementById('progressFill');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    if (!taskList) return;

    taskList.innerHTML = '';
    let completedCount = 0;

    tasks.forEach((task, index) => {
        const li = document.createElement('li');

        if (task.completed) {
            li.classList.add('completed');
            completedCount++;
        }

        li.innerHTML = `
            <div class="task-left">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
            </div>
            <button class="delete-btn">X</button>
        `;

        const checkbox = li.querySelector("input");
        const deleteBtn = li.querySelector(".delete-btn");

        checkbox.addEventListener("change", () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });

        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
            showNotification("Task șters!");
        });

        taskList.appendChild(li);
    });

    if (taskCounter) {
        taskCounter.innerText = `${tasks.length} task-uri (${completedCount} completate)`;
    }

    if (progressFill) {
        let progress = tasks.length === 0 ? 0 : (completedCount / tasks.length) * 100;
        progressFill.style.width = progress + "%";
    }
}

addTaskBtn?.addEventListener('click', () => {
    const newTask = taskInput.value.trim();

    if (newTask !== '') {
        tasks.push({
            text: newTask,
            completed: false
        });

        saveTasks();
        renderTasks();
        taskInput.value = '';
        showNotification("Task adăugat!");
    }
});

renderTasks();

// ===============================
// CLEAR TASKS
// ===============================

const clearTasksBtn = document.getElementById("clearTasks");

clearTasksBtn?.addEventListener("click", () => {
    tasks = [];
    saveTasks();
    renderTasks();
    showNotification("Task-urile au fost resetate!");
});

// ===============================
// PROFILE SYSTEM
// ===============================

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const saveProfileBtn = document.getElementById("saveProfile");

if (profileName) {
    profileName.value = localStorage.getItem("profileName") || "";
}

if (profileEmail) {
    profileEmail.value = localStorage.getItem("profileEmail") || "";
}

saveProfileBtn?.addEventListener("click", () => {
    localStorage.setItem("profileName", profileName.value);
    localStorage.setItem("profileEmail", profileEmail.value);
    showNotification("Profil salvat cu succes!");
});

// ===============================
// CHARTS
// ===============================

const ctx = document.getElementById('myChart');

if (ctx) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun'],
            datasets: [{
                label: 'Vânzări',
                data: [1200, 1900, 3000, 2500, 4200, 5000],
                borderColor: '#00f5ff',
                backgroundColor: 'rgba(0,245,255,0.2)',
                tension: 0.4,
                fill: true
            }]
        }
    });
}

const salesCtx = document.getElementById('salesChart');

if (salesCtx) {
    new Chart(salesCtx, {
        type: 'bar',
        data: {
            labels: ['Produs A', 'Produs B', 'Produs C', 'Produs D'],
            datasets: [{
                label: 'Vânzări produse',
                data: [120, 90, 150, 70],
                backgroundColor: ['#00f5ff', '#00ff88', '#0077ff', '#8a2be2']
            }]
        }
    });
}

// ===============================
// INVOICE GENERATOR PRO
// ===============================

const { jsPDF } = window.jspdf;

const clientName = document.getElementById("clientName");
const productPrice = document.getElementById("productPrice");
const productQty = document.getElementById("productQty");
const addInvoiceItemBtn = document.getElementById("addInvoiceItem");
const invoiceItems = document.getElementById("invoiceItems");
const invoiceSubtotal = document.getElementById("invoiceSubtotal");
const invoiceVAT = document.getElementById("invoiceVAT");
const invoiceTotal = document.getElementById("invoiceTotal");
const generateInvoiceBtn = document.getElementById("generateInvoice");
const invoiceHistory = document.getElementById("invoiceHistory");

let invoice = [];
let invoices = JSON.parse(localStorage.getItem("invoices")) || [];

function saveInvoices() {
    localStorage.setItem("invoices", JSON.stringify(invoices));
}

function updateInvoice() {
    invoiceItems.innerHTML = "";
    let subtotal = 0;

    invoice.forEach((item, index) => {
        const li = document.createElement("li");
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        li.innerHTML = `
            ${item.qty} x €${item.price} = €${itemTotal.toFixed(2)}
            <button onclick="removeInvoiceItem(${index})">X</button>
        `;

        invoiceItems.appendChild(li);
    });

    const vat = subtotal * 0.19;
    const total = subtotal + vat;

    invoiceSubtotal.innerText = subtotal.toFixed(2);
    invoiceVAT.innerText = vat.toFixed(2);
    invoiceTotal.innerText = total.toFixed(2);
}

function removeInvoiceItem(index) {
    invoice.splice(index, 1);
    updateInvoice();
}

addInvoiceItemBtn?.addEventListener("click", () => {
    const price = parseFloat(productPrice.value);
    const qty = parseInt(productQty.value);

    if (!price || !qty) {
        showNotification("Completează corect produsul!");
        return;
    }

    invoice.push({ price, qty });
    updateInvoice();

    productPrice.value = "";
    productQty.value = "";

    showNotification("Produs adăugat!");
});

function renderInvoiceHistory() {
    invoiceHistory.innerHTML = "";

    invoices.forEach((inv, index) => {
        const li = document.createElement("li");
        li.innerText = `${inv.client} - €${inv.total}`;
        invoiceHistory.appendChild(li);
    });
}

generateInvoiceBtn?.addEventListener("click", () => {

    if (!clientName.value.trim()) {
        showNotification("Introdu numele clientului!");
        return;
    }

    if (invoice.length === 0) {
        showNotification("Adaugă produse înainte!");
        return;
    }

    const subtotal = parseFloat(invoiceSubtotal.innerText);
    const vat = parseFloat(invoiceVAT.innerText);
    const total = parseFloat(invoiceTotal.innerText);

    const doc = new jsPDF();

    // HEADER
    doc.setFontSize(22);
    doc.text("DAVID TECH SOLUTIONS", 20, 20);

    doc.setFontSize(14);
    doc.text("FACTURĂ", 150, 20);

    doc.setFontSize(11);
    doc.text(`Client: ${clientName.value}`, 20, 40);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 20, 48);

    doc.line(20, 55, 190, 55);

    // TABLE HEADER
    let y = 65;
    doc.setFontSize(12);
    doc.text("Cantitate", 20, y);
    doc.text("Preț", 70, y);
    doc.text("Total", 120, y);

    doc.line(20, y + 3, 190, y + 3);

    y += 10;

    // PRODUSE
    invoice.forEach(item => {
        doc.text(String(item.qty), 20, y);
        doc.text(`€${item.price}`, 70, y);
        doc.text(`€${(item.qty * item.price).toFixed(2)}`, 120, y);
        y += 10;
    });

    y += 10;
    doc.line(20, y, 190, y);

    y += 10;

    // TOTALURI
    doc.text(`Subtotal: €${subtotal.toFixed(2)}`, 120, y);
    y += 8;
    doc.text(`TVA (19%): €${vat.toFixed(2)}`, 120, y);
    y += 10;

    doc.setFontSize(14);
    doc.text(`TOTAL: €${total.toFixed(2)}`, 120, y);

    // FOOTER
    doc.setFontSize(10);
    doc.text("Mulțumim pentru colaborare!", 20, 280);

    doc.save(`Factura_${clientName.value}.pdf`);

    invoices.push({
        client: clientName.value,
        total: total.toFixed(2),
        date: new Date().toLocaleDateString()
    });

    saveInvoices();
    renderInvoiceHistory();

    invoice = [];
    updateInvoice();

    showNotification("Factură profesională generată!");
});

renderInvoiceHistory();

// ===============================
// INVOICE GENERATOR PRO
// ===============================



function updateInvoice() {
    invoiceItems.innerHTML = "";
    let subtotal = 0;

    invoice.forEach((item, index) => {
        const li = document.createElement("li");
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        li.innerHTML = `
            ${item.qty} x €${item.price} = €${itemTotal.toFixed(2)}
            <button onclick="removeInvoiceItem(${index})">X</button>
        `;

        invoiceItems.appendChild(li);
    });

    const vat = subtotal * 0.19;
    const total = subtotal + vat;

    invoiceSubtotal.innerText = subtotal.toFixed(2);
    invoiceVAT.innerText = vat.toFixed(2);
    invoiceTotal.innerText = total.toFixed(2);
}

function removeInvoiceItem(index) {
    invoice.splice(index, 1);
    updateInvoice();
}

addInvoiceItemBtn?.addEventListener("click", () => {
    const price = parseFloat(productPrice.value);
    const qty = parseInt(productQty.value);

    if (!price || !qty) {
        showNotification("Completează corect produsul!");
        return;
    }

    invoice.push({ price, qty });
    updateInvoice();

    productPrice.value = "";
    productQty.value = "";

    showNotification("Produs adăugat!");
});

function renderInvoiceHistory() {
    invoiceHistory.innerHTML = "";

    invoices.forEach((inv, index) => {
        const li = document.createElement("li");
        li.innerText = `${inv.client} - €${inv.total}`;
        invoiceHistory.appendChild(li);
    });
}

generateInvoiceBtn?.addEventListener("click", () => {

    if (!clientName.value.trim()) {
        showNotification("Introdu numele clientului!");
        return;
    }

    if (invoice.length === 0) {
        showNotification("Adaugă produse înainte!");
        return;
    }

    const subtotal = parseFloat(invoiceSubtotal.innerText);
    const vat = parseFloat(invoiceVAT.innerText);
    const total = parseFloat(invoiceTotal.innerText);

    const doc = new jsPDF();

    // HEADER
    doc.setFontSize(22);
    doc.text("DAVID TECH SOLUTIONS", 20, 20);

    doc.setFontSize(14);
    doc.text("FACTURĂ", 150, 20);

    doc.setFontSize(11);
    doc.text(`Client: ${clientName.value}`, 20, 40);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 20, 48);

    doc.line(20, 55, 190, 55);

    // TABLE HEADER
    let y = 65;
    doc.setFontSize(12);
    doc.text("Cantitate", 20, y);
    doc.text("Preț", 70, y);
    doc.text("Total", 120, y);

    doc.line(20, y + 3, 190, y + 3);

    y += 10;

    // PRODUSE
    invoice.forEach(item => {
        doc.text(String(item.qty), 20, y);
        doc.text(`€${item.price}`, 70, y);
        doc.text(`€${(item.qty * item.price).toFixed(2)}`, 120, y);
        y += 10;
    });

    y += 10;
    doc.line(20, y, 190, y);

    y += 10;

    // TOTALURI
    doc.text(`Subtotal: €${subtotal.toFixed(2)}`, 120, y);
    y += 8;
    doc.text(`TVA (19%): €${vat.toFixed(2)}`, 120, y);
    y += 10;

    doc.setFontSize(14);
    doc.text(`TOTAL: €${total.toFixed(2)}`, 120, y);

    // FOOTER
    doc.setFontSize(10);
    doc.text("Mulțumim pentru colaborare!", 20, 280);

    doc.save(`Factura_${clientName.value}.pdf`);

    invoices.push({
        client: clientName.value,
        total: total.toFixed(2),
        date: new Date().toLocaleDateString()
    });

    saveInvoices();
    renderInvoiceHistory();

    invoice = [];
    updateInvoice();

    showNotification("Factură profesională generată!");
});

    const subtotal = parseFloat(invoiceSubtotal.innerText);
    const vat = parseFloat(invoiceVAT.innerText);
    const total = parseFloat(invoiceTotal.innerText);

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("FACTURĂ", 90, 20);

    doc.setFontSize(12);
    doc.text(`Client: ${clientName.value}`, 20, 40);

    let y = 60;
    invoice.forEach(item => {
        doc.text(`${item.qty} x €${item.price}`, 20, y);
        y += 10;
    });

    doc.text(`Subtotal: €${subtotal}`, 20, y + 10);
    doc.text(`TVA (19%): €${vat}`, 20, y + 20);
    doc.text(`Total: €${total}`, 20, y + 30);

    doc.save(`Factura_${clientName.value}.pdf`);

    invoices.push({
        client: clientName.value,
        total: total.toFixed(2)
    });

    saveInvoices();
    renderInvoiceHistory();

    invoice = [];
    updateInvoice();

    showNotification("PDF generat și salvat!");


renderInvoiceHistory();
