async function fetchSeries() {
    const data = await chrome.storage.sync.get(["locale", "lastLocale","timestamp"]);
    const locale = data.locale || "en-US";
    const timestamp = data.timestamp || 0
    const currentTime = Date.now();

    if (!(currentTime - timestamp <= 24 * 60 * 60 * 1000) || data.lastLocale !== locale) {
        chrome.storage.local.remove("dubbed_series");
        chrome.storage.local.remove("subbed_series");
        chrome.storage.sync.remove("timestamp");

        chrome.webRequest.onBeforeSendHeaders.addListener(
            async (details) => {

                const authorizationHeader = details.requestHeaders.find(
                    (header) => header.name.toLowerCase() === 'authorization'
                );

                if (authorizationHeader && authorizationHeader.value.startsWith('Bearer ')) {
                    try {
                        const response = await fetch(`https://www.crunchyroll.com/content/v2/discover/browse?n=1300&type=series&ratings=true&locale=${locale}&sort_by=newly_added&preferred_audio_language=${locale}`, {
                            method: "GET",
                            headers: {
                                "Authorization": authorizationHeader.value,
                                "Content-Type": "application/json"
                            }
                        });

                        const result = await response.json();

                        const dubbed_series = [];
                        const subbed_series = [];

                        result.data.forEach(series => {
                            if (series.series_metadata.audio_locales.includes(locale)) {
                                dubbed_series.push(series);
                            }
                            if (series.series_metadata.subtitle_locales.includes(locale)) {
                                subbed_series.push(series);
                            }
                        });

                        chrome.storage.local.set({
                            dubbed_series,
                            subbed_series
                        });
                        chrome.storage.sync.set({
                            "locale": locale,
                            "timestamp": Date.now(),
                            "lastLocale": locale
                        });
                    } catch (error) {
                        chrome.storage.sync.set({
                            "error": "Failed to fetch series",
                        })
                    }
                } else {
                    chrome.storage.sync.set({
                        "error": "Failed to obtain token",
                    })
                }
            },
            {
                urls: [
                    "*://www.crunchyroll.com/f/v1/home*",
                    "https://www.crunchyroll.com/content/v2/*/watch-history*"
                ],
                types: ["xmlhttprequest"]
            },
            ["requestHeaders"]
        );
    }
}
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        let tabUrl = tab.url;

        if (tabUrl && tabUrl.includes("crunchyroll.com")) {
            fetchSeries();
        }
    }
});