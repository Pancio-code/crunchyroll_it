document.addEventListener("DOMContentLoaded", async () => {
    const redirectMessage = document.getElementById("redirectMessage");
    const tokenLoading = document.getElementById("tokenLoading");
    const seriesObtained = document.getElementById("seriesObtained");
    const errors = document.getElementById("errors");
    const redirectButton = redirectMessage.querySelector("button");
    const retryButton = errors.querySelector("button");
    const goButton = seriesObtained.querySelector("button");
    const creditButton = document.getElementById("credit-button");
    creditButton.addEventListener("click", async () => {
        chrome.tabs.create({url: "https://github.com/Pancio-code/crunchyroll_it/tree/master"});
    });

    const localeSelect = document.getElementById("localeSelect");
    const dubCheckbox = document.getElementById("dubCheckbox");
    const subCheckbox = document.getElementById("subCheckbox");
    const dubToggle = document.getElementById("dubToggle");
    const subToggle = document.getElementById("subToggle");
    const dubParent = dubToggle.parentElement;
    const subParent = subToggle.parentElement;
    let dubbedSeries = null;
    let subbedSeries = null;
    let timestamp = null;

    chrome.storage.onChanged.addListener((changes, _) => {
        for (let [key, { oldValue, newValue}] of Object.entries(changes)) {
            if (key === "error" && newValue !== "") {
                showSection("errors");
                retryButton.addEventListener("click", () => {
                    chrome.tabs.reload();
                });
            } else if (key === "timestamp" && newValue !== null) {
                showSection("tokenLoading");
                chrome.storage.local.get(["dubbed_series", "subbed_series"], (result) => {
                    dubbedSeries = result.dubbed_series || null;
                    subbedSeries = result.subbed_series || null;

                    (async () => {
                        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
                        if (tab.url.includes("crunchyroll.com")) {
                            showSection("seriesObtained");
                            chrome.tabs.sendMessage(tab.id, {message: 'build_cards', dubEnabled: dubCheckbox.checked, subbedEnabled: subCheckbox.checked}, (response) => {
                                if (response && response.success) {
                                    goButton.addEventListener('click', () => {
                                        chrome.scripting.executeScript({
                                            target: { tabId: tab.id },
                                            files: ['scripts/scroll.js']
                                        });
                                    });
                                }
                            });
                        } else {
                            showSection("redirectMessage");
                        }
                    })();
                });
            }
        }
    });

    chrome.storage.local.get(["dubbed_series", "subbed_series"], (result) => {
        dubbedSeries = result.dubbed_series || null;
        subbedSeries = result.subbed_series || null;
        if (dubbedSeries !== null && subbedSeries !== null) {
            showSection("seriesObtained");
            (async () => {
                const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
                if (tab.url.includes("crunchyroll.com")) {
                    showSection("seriesObtained");
                    chrome.tabs.sendMessage(tab.id, {message: 'build_cards', dubEnabled: dubCheckbox.checked, subbedEnabled: subCheckbox.checked}, (response) => {
                        if (response && response.success) {
                            goButton.addEventListener('click', () => {
                                chrome.scripting.executeScript({
                                    target: { tabId: tab.id },
                                    files: ['scripts/scroll.js']
                                });
                            });
                        }
                    });
                } else {
                    showSection("redirectMessage");
                }
            })();
        }
    });

    // Carica le impostazioni salvate
    chrome.storage.sync.get(["locale", "timestamp","dubEnabled", "subEnabled"], function(result) {
        localeSelect.value = result.locale || "en-US";
        dubCheckbox.checked = result.dubEnabled === true;
        subCheckbox.checked = result.subEnabled === true;
        timestamp = result.timestamp || null;

        updateToggleClass(dubParent, dubCheckbox.checked);
        updateToggleClass(subParent, subCheckbox.checked);
    });

    localeSelect.addEventListener("change", () => {
        chrome.storage.sync.set({"locale": localeSelect.value}).then(() => {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                const activeTab = tabs[0];
                if (activeTab.url.includes("crunchyroll.com")) {
                    chrome.tabs.reload();
                }
            });
        });
    });

    function toggleCheckbox(checkbox, parent) {
        checkbox.checked = !checkbox.checked;
        if (checkbox.id === "dubCheckbox") {
            chrome.storage.sync.set({"dubEnabled": checkbox.checked});
        } else {
            chrome.storage.sync.set({"subEnabled": checkbox.checked});
        }
        updateToggleClass(parent, checkbox.checked);
        chrome.tabs.reload();
    }

    // Aggiorna la classe "visible" nel parent
    function updateToggleClass(parent, isChecked) {
        if (isChecked) {
            parent.classList.add("active");
        } else {
            parent.classList.remove("active");
        }
    }

    dubToggle.addEventListener("click", () => toggleCheckbox(dubCheckbox, dubParent));
    subToggle.addEventListener("click", () => toggleCheckbox(subCheckbox, subParent));

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        showSection("tokenLoading");
        // Controlla se siamo su Crunchyroll
        if (!activeTab.url.includes("crunchyroll.com")) {
            showSection("redirectMessage");
            redirectButton.addEventListener("click", () => {
                chrome.tabs.create({url: "https://www.crunchyroll.com"});
            });
        }
    });

    function showSection(sectionId) {
        [redirectMessage, tokenLoading, seriesObtained, errors].forEach(sec => sec.style.display = "none");
        document.getElementById(sectionId).style.display = "flex";
    }
});
