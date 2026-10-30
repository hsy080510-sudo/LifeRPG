/* Supabase Configuration */

const SUPABASE_URL = "https://yquxksabyrawjirzagra.supabase.co";

const SUPABASE_KEY = "sb_publishable_e-IHxulK9fZiB3FoRKTrKQ_xuUzsldB";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Supabase connected!");
/* Life RPG - Game System */

// Load saved game data
let totalXP = Number(localStorage.getItem("totalXP")) || 0;

let completedQuests = JSON.parse(
    localStorage.getItem("completedQuests") || "[]"
);

// Calculate player level
function updateGame() {
    const level = Math.floor(totalXP / 100) + 1;
    const currentXP = totalXP % 100;

    document.getElementById("level").textContent =
        "LV. " + level;

    document.getElementById("xp").textContent =
        currentXP + " / 100 XP";

    document.getElementById("progress").style.width =
        currentXP + "%";

    document.getElementById("status").textContent =
        "Keep going! Your next level is waiting.";

    // Update quest buttons
    document.querySelectorAll(".quest button").forEach(button => {
        const questId = button.getAttribute("onclick")
            .match(/'([^']+)'/)[1];

        if (completedQuests.includes(questId)) {
            button.textContent = "COMPLETED";
            button.disabled = true;
        }
    });

    // Unlock achievement
    if (completedQuests.length > 0) {
        document.getElementById("achievement").textContent =
            "🏆 First Quest — UNLOCKED";
    }
}

// Complete a quest
function completeQuest(questId, reward) {
    if (completedQuests.includes(questId)) {
        return;
    }

    const oldLevel = Math.floor(totalXP / 100) + 1;

    totalXP += reward;
    completedQuests.push(questId);

    localStorage.setItem("totalXP", totalXP);
    localStorage.setItem(
        "completedQuests",
        JSON.stringify(completedQuests)
    );

    const newLevel = Math.floor(totalXP / 100) + 1;

    updateGame();

    if (newLevel > oldLevel) {
        alert("LEVEL UP! You are now Level " + newLevel + "!");
    } else {
        alert("Quest completed! +" + reward + " XP");
    }
}

// Reset game
function resetGame() {
    const confirmReset = confirm(
        "Are you sure you want to reset your progress?"
    );

    if (confirmReset) {
        totalXP = 0;
        completedQuests = [];

        localStorage.removeItem("totalXP");
        localStorage.removeItem("completedQuests");

        location.reload();
    }
}

// Start game
updateGame();
// User Authentication

async function registerUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const status = document.getElementById("auth-status");

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        status.textContent = error.message;
        return;
    }

    status.textContent = "Registration successful! Check your email.";
}

async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const status = document.getElementById("auth-status");

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        status.textContent = error.message;
        return;
    }

    status.textContent = "Login successful!";

    console.log("Logged in user:", data.user.id);
}

async function logoutUser() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        document.getElementById("auth-status").textContent = error.message;
        return;
    }

    document.getElementById("auth-status").textContent = "Logged out.";
}