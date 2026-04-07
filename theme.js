(function () {
    function getSydneyHour() {
        const parts = new Intl.DateTimeFormat("en-AU", {
            hour: "numeric",
            hourCycle: "h23",
            timeZone: "Australia/Sydney"
        }).formatToParts(new Date());
        const hourPart = parts.find((part) => part.type === "hour");
        return Number(hourPart ? hourPart.value : 12);
    }

    const hour = getSydneyHour();
    const theme = hour >= 18 || hour < 6 ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
})();
