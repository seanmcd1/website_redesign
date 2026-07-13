// AIR by Revolut clone — interactions

// ---------- Nav scroll state ----------
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
	nav.classList.toggle("is-scrolled", window.scrollY > 10);
}, { passive: true });

// ---------- Mobile menu ----------
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
burger.addEventListener("click", () => {
	const open = mobileMenu.classList.toggle("is-open");
	burger.setAttribute("aria-expanded", String(open));
});

// ---------- Phone clock ----------
function tickClock() {
	const d = new Date();
	document.getElementById("phoneClock").textContent =
		`${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}
tickClock();
setInterval(tickClock, 30_000);

// ---------- Chat scenarios (one per hero tab) ----------
const SCENARIOS = {
	holiday: [
		{ who: "user", text: "How much did I spend on my Lisbon trip?" },
		{ who: "air", text: "You spent £642.18 in Lisbon between 2–6 July. Here's the breakdown:" },
		{ who: "card", html: `
			<div class="card-title">Lisbon · 2–6 Jul</div>
			<div class="card-big">£642.18</div>
			<div class="card-row"><span>🍽 Eating out</span><b>£248.40</b></div>
			<div class="card-row"><span>🏨 Stays</span><b>£221.00</b></div>
			<div class="card-row"><span>🚕 Transport</span><b>£96.78</b></div>
			<div class="card-bar"><i></i></div>` },
		{ who: "air", text: "That's 12% under the budget you set. Want me to create a budget for your next trip?" },
	],
	travel: [
		{ who: "user", text: "I'm flying to Tokyo on Friday. What do I need?" },
		{ who: "air", text: "Exciting! ✈️ Here's what I can sort out for you right now:" },
		{ who: "card", html: `
			<div class="card-title">Tokyo essentials</div>
			<div class="card-row"><span>📶 eSIM · 5GB, 7 days</span><b>£9.50</b></div>
			<div class="card-row"><span>💴 GBP → JPY</span><b>1 = ¥192.40</b></div>
			<div class="card-row"><span>🛡 Travel insurance</span><b class="up">Included</b></div>` },
		{ who: "air", text: "Want me to activate the eSIM so it's ready when you land?" },
	],
	portfolio: [
		{ who: "user", text: "How are my investments doing this month?" },
		{ who: "air", text: "Your portfolio is up 2.4% this month. Here's the snapshot:" },
		{ who: "card", html: `
			<div class="card-title">Portfolio · July</div>
			<div class="card-big">£5,830.12 <span class="up" style="font-size:14px">▲ 2.4%</span></div>
			<div class="card-row"><span>AAPL</span><b class="up">+4.1%</b></div>
			<div class="card-row"><span>VUSA</span><b class="up">+1.8%</b></div>
			<div class="card-row"><span>TSLA</span><b class="down">−0.9%</b></div>` },
		{ who: "air", text: "Your best performer is Apple. Capital at risk — want the full report?" },
	],
	cards: [
		{ who: "user", text: "I can't find my card. Freeze it please!" },
		{ who: "air", text: "Done — your Metal card ending in 4921 is frozen. 🧊 No payments can go through." },
		{ who: "card", html: `
			<div class="card-title">Card status</div>
			<div class="card-big">Frozen ❄️</div>
			<div class="card-row"><span>Metal ·· 4921</span><b>Frozen just now</b></div>
			<div class="card-row"><span>Online payments</span><b class="down">Blocked</b></div>
			<div class="card-row"><span>ATM withdrawals</span><b class="down">Blocked</b></div>` },
		{ who: "air", text: "If it turns up, just ask me to unfreeze it. Should I order a replacement in the meantime?" },
	],
	subs: [
		{ who: "user", text: "Which subscriptions am I paying for?" },
		{ who: "air", text: "You have 6 active subscriptions totalling £58.94/month. The biggest ones:" },
		{ who: "card", html: `
			<div class="card-title">Subscriptions · monthly</div>
			<div class="card-big">£58.94</div>
			<div class="card-row"><span>🎬 Streaming</span><b>£17.98</b></div>
			<div class="card-row"><span>🎧 Music</span><b>£11.99</b></div>
			<div class="card-row"><span>☁️ Cloud storage</span><b>£7.99</b></div>` },
		{ who: "air", text: "You haven't used one of them since April. Want me to pause it?" },
	],
};

const chatEl = document.getElementById("chat");
const tabs = document.querySelectorAll(".chip");
let playToken = 0;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function playScenario(key) {
	const token = ++playToken;
	const script = SCENARIOS[key];
	chatEl.innerHTML = "";

	for (const step of script) {
		if (token !== playToken) return; // superseded by a newer tab click

		if (step.who !== "user") {
			// show typing indicator before AIR responds
			const typing = document.createElement("div");
			typing.className = "typing";
			typing.innerHTML = "<i></i><i></i><i></i>";
			chatEl.appendChild(typing);
			await wait(850);
			typing.remove();
			if (token !== playToken) return;
		}

		const el = document.createElement("div");
		if (step.who === "card") {
			el.className = "msg msg--card";
			el.innerHTML = step.html;
		} else {
			el.className = `msg msg--${step.who}`;
			el.textContent = step.text;
		}
		chatEl.appendChild(el);
		await wait(step.who === "user" ? 900 : 1300);
	}

	// loop after a pause
	await wait(4000);
	if (token === playToken) playScenario(key);
}

tabs.forEach((tab) => {
	tab.addEventListener("click", () => {
		tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
		tab.setAttribute("aria-selected", "true");
		stopAutoRotate();
		playScenario(tab.dataset.scenario);
	});
});

// ---------- Auto-rotate tabs until the user picks one ----------
const KEYS = [...tabs].map((t) => t.dataset.scenario);
let autoIndex = 0;
let autoTimer = setInterval(() => {
	autoIndex = (autoIndex + 1) % KEYS.length;
	tabs.forEach((t, i) => t.setAttribute("aria-selected", String(i === autoIndex)));
	playScenario(KEYS[autoIndex]);
}, 14_000);

function stopAutoRotate() {
	if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
}

// kick off
playScenario("holiday");

// ---------- Login modal ----------
const loginModal = document.getElementById("loginModal");
const loginDialog = loginModal.querySelector(".modal__dialog");
const loginForm = document.getElementById("loginForm");
const loginPhone = document.getElementById("loginPhone");
const loginError = document.getElementById("loginError");
const loginContinue = document.getElementById("loginContinue");
let lastFocused = null;

const FOCUSABLE = 'button, [href], input, [tabindex]:not([tabindex="-1"])';

function openLogin() {
	lastFocused = document.activeElement;
	loginModal.hidden = false;
	document.body.style.overflow = "hidden";
	// close the mobile menu if it was open
	mobileMenu.classList.remove("is-open");
	burger.setAttribute("aria-expanded", "false");
	requestAnimationFrame(() => loginPhone.focus());
}

function closeLogin() {
	loginModal.hidden = true;
	document.body.style.overflow = "";
	clearError();
	loginForm.reset();
	if (lastFocused) lastFocused.focus();
}

function showError(msg) {
	loginError.textContent = msg;
	loginError.hidden = false;
	loginPhone.classList.add("is-invalid");
}
function clearError() {
	loginError.hidden = true;
	loginPhone.classList.remove("is-invalid");
}

// Open triggers
document.querySelectorAll("[data-open-login]").forEach((btn) => {
	btn.addEventListener("click", openLogin);
});

// Close triggers (X + overlay)
loginModal.querySelectorAll("[data-close-login]").forEach((el) => {
	el.addEventListener("click", closeLogin);
});

// Esc to close + focus trap
document.addEventListener("keydown", (e) => {
	if (loginModal.hidden) return;
	if (e.key === "Escape") { closeLogin(); return; }
	if (e.key === "Tab") {
		const items = [...loginDialog.querySelectorAll(FOCUSABLE)].filter((el) => !el.disabled && el.offsetParent !== null);
		if (!items.length) return;
		const first = items[0];
		const last = items[items.length - 1];
		if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
		else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
	}
});

// Clear the error as soon as the user starts typing
loginPhone.addEventListener("input", clearError);

// Submit — validate, then run stub auth
loginForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const digits = loginPhone.value.replace(/\D/g, "");
	if (!digits) { showError("Please enter your phone number."); loginPhone.focus(); return; }
	if (digits.length < 7) { showError("That phone number looks too short."); loginPhone.focus(); return; }

	clearError();
	loginContinue.disabled = true;
	loginContinue.textContent = "Checking…";
	// Stub: no auth backend wired up yet.
	setTimeout(() => {
		loginContinue.disabled = false;
		loginContinue.textContent = "Continue";
		showError("This is a demo — login isn’t connected to a real account yet.");
	}, 700);
});

// Stub handlers for the remaining actions (socials, create account, lost access)
loginModal.querySelectorAll("[data-demo]").forEach((el) => {
	el.addEventListener("click", (e) => {
		e.preventDefault();
		showError("This is a demo — that option isn’t wired up yet.");
	});
});

// ---------- Customer coin carousel ----------
const coinStage = document.getElementById("coinStage");
if (coinStage) {
	const PARTNERS = [
		{ mark: "NW", name: "Northwind", note: "Scaling payments across 34 markets" },
		{ mark: "C",  name: "Contoso",   note: "Cut FX costs by 41% in a year" },
		{ mark: "G",  name: "Globex",    note: "Runs global payroll on Revolut" },
		{ mark: "V",  name: "Vertex",    note: "Issued 2,000 team cards in a week" },
		{ mark: "L",  name: "Lumen",     note: "Real-time spend controls for 12 teams" },
		{ mark: "A",  name: "Atlas",     note: "Automated expenses end to end" },
		{ mark: "U",  name: "Umbra",     note: "One account across 18 currencies" },
		{ mark: "M",  name: "Meridian",  note: "Closes the books 3× faster" },
	];

	const coinCaption = document.getElementById("coinCaption");
	const coinDots = document.getElementById("coinDots");
	const coinwall = document.getElementById("coinwall");
	const N = PARTNERS.length;
	const coins = [];
	let active = 0;

	PARTNERS.forEach((p, i) => {
		const coin = document.createElement("div");
		coin.className = "coin";
		coin.setAttribute("role", "button");
		coin.setAttribute("aria-label", p.name);
		coin.innerHTML = `<div class="coin__disc"><span class="coin__mark">${p.mark}</span></div>`;
		coin.addEventListener("click", () => { go(i); restart(); });
		coinStage.appendChild(coin);
		coins.push(coin);

		const dot = document.createElement("button");
		dot.className = "coinwall__dot";
		dot.type = "button";
		dot.setAttribute("aria-label", `Show ${p.name}`);
		dot.addEventListener("click", () => { go(i); restart(); });
		coinDots.appendChild(dot);
	});
	const dots = [...coinDots.children];

	function render() {
		coins.forEach((coin, i) => {
			let rel = i - active;
			if (rel > N / 2) rel -= N;
			if (rel < -N / 2) rel += N;
			const abs = Math.abs(rel);
			const hidden = abs > 3;
			coin.style.transform =
				`translateX(${rel * 132}px) translateZ(${-abs * 140}px) rotateY(${rel * -22}deg) scale(${Math.max(0.55, 1 - abs * 0.14)})`;
			coin.style.opacity = hidden ? "0" : String(Math.max(0.15, 1 - abs * 0.26));
			coin.style.zIndex = String(100 - abs);
			coin.style.pointerEvents = hidden ? "none" : "auto";
			coin.classList.toggle("is-active", rel === 0);
		});
		dots.forEach((d, i) => d.classList.toggle("is-active", i === active));
		const p = PARTNERS[active];
		coinCaption.innerHTML = `<b>${p.name}</b> · ${p.note}`;
	}

	function go(i) { active = (i + N) % N; render(); }

	// Auto-advance on loop, pausing on hover or when the tab is hidden
	const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	let timer = null;
	function start() { if (!reduce && !timer) timer = setInterval(() => go(active + 1), 2600); }
	function stop() { if (timer) { clearInterval(timer); timer = null; } }
	function restart() { stop(); start(); }

	document.getElementById("coinPrev").addEventListener("click", () => { go(active - 1); restart(); });
	document.getElementById("coinNext").addEventListener("click", () => { go(active + 1); restart(); });
	coinwall.addEventListener("mouseenter", stop);
	coinwall.addEventListener("mouseleave", start);
	document.addEventListener("visibilitychange", () => { document.hidden ? stop() : start(); });

	render();
	start();
}
