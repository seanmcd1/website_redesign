// AIR by Revolut clone — interactions

// ---------- Refer-a-friend promo bar ----------
const promoBar = document.getElementById("promoBar");
if (promoBar) {
	// The banner shows on every page load. Dismissing hides it for the current
	// view only — refreshing the page brings it back.
	const syncPromoHeight = () =>
		document.body.style.setProperty("--promo-h", `${promoBar.offsetHeight}px`);

	syncPromoHeight();
	window.addEventListener("resize", syncPromoHeight, { passive: true });

	document.getElementById("promoClose").addEventListener("click", () => {
		document.body.classList.remove("promo-open");
		promoBar.hidden = true;
	});
}

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

// ---------- Multi-currency plan pricing ----------
// Japan Team asked for a multi-currency view in "Choose your plan".
// Prices are indicative local pricing for the demo, not live FX.
const CURRENCIES = {
	GBP: { symbol: "£", decimals: 2, prices: { standard: 0, plus: 3.99, premium: 7.99, metal: 14.99, ultra: 55 } },
	EUR: { symbol: "€", decimals: 2, prices: { standard: 0, plus: 3.99, premium: 7.99, metal: 14.99, ultra: 55 } },
	USD: { symbol: "$", decimals: 2, prices: { standard: 0, plus: 4.99, premium: 9.99, metal: 16.99, ultra: 65 } },
	JPY: { symbol: "¥", decimals: 0, prices: { standard: 0, plus: 600, premium: 1200, metal: 2200, ultra: 8000 } },
	SGD: { symbol: "S$", decimals: 2, prices: { standard: 0, plus: 4.99, premium: 9.99, metal: 19.99, ultra: 78 } },
};

const currencyToggle = document.querySelector(".currency__toggle");
if (currencyToggle) {
	const CURRENCY_KEY = "plans-currency";
	const opts = [...currencyToggle.querySelectorAll(".currency__opt")];
	const priceEls = [...document.querySelectorAll(".plan__price[data-plan]")];
	const fxNote = document.getElementById("fxNote");

	const formatPrice = (code, plan) => {
		const cur = CURRENCIES[code];
		const amount = cur.prices[plan];
		if (!amount) return "Free";
		const value = amount.toLocaleString("en-GB", {
			minimumFractionDigits: cur.decimals,
			maximumFractionDigits: cur.decimals,
		});
		return `${cur.symbol}${value}/month`;
	};

	function applyCurrency(code, { animate = true } = {}) {
		if (!CURRENCIES[code]) code = "GBP";

		opts.forEach((o) => o.setAttribute("aria-checked", String(o.dataset.currency === code)));

		priceEls.forEach((el) => {
			const next = formatPrice(code, el.dataset.plan);
			if (!animate) { el.textContent = next; return; }
			el.classList.add("is-updating");
			setTimeout(() => {
				el.textContent = next;
				el.classList.remove("is-updating");
			}, 180);
		});

		if (fxNote) fxNote.textContent =
			`Prices shown in ${code}. Local prices are indicative and for demo purposes only.`;

		try { localStorage.setItem(CURRENCY_KEY, code); } catch (_) {}
	}

	opts.forEach((opt, i) => {
		opt.addEventListener("click", () => applyCurrency(opt.dataset.currency));
		// Arrow-key navigation across the radio group
		opt.addEventListener("keydown", (e) => {
			if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
			e.preventDefault();
			const dir = e.key === "ArrowRight" ? 1 : -1;
			const next = opts[(i + dir + opts.length) % opts.length];
			next.focus();
			applyCurrency(next.dataset.currency);
		});
	});

	let saved = "GBP";
	try { saved = localStorage.getItem(CURRENCY_KEY) || "GBP"; } catch (_) {}
	applyCurrency(saved, { animate: false });
}

// ---------- Customer logo showreel ----------
// The partner-logo carousel is the design team's approved video, looping on mute.
// Honour reduced-motion preferences by holding on the poster frame instead of playing.
const showreelVideo = document.querySelector(".showreel__video");
if (showreelVideo && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
	showreelVideo.removeAttribute("autoplay");
	showreelVideo.pause();
}
