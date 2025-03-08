chrome.storage.sync.get(["dubEnabled", "subEnabled"], function(result) {
    const dubCheckbox = result.dubEnabled === true;
    const subCheckbox = result.subEnabled === true;

    if (dubCheckbox) {
        const dubElement = document.getElementById('dubbed-series');
        if (dubElement) {
            dubElement.scrollIntoView({ behavior: 'smooth' });
        }
    } else if (subCheckbox) {
        const subElement = document.getElementById('subbed-series');
        if (subElement) {
            subElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
});