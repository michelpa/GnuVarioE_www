export const ThemeHelper = function () {

    const preloadTheme = (href) => {
        let link = document.createElement('link');
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);

        return new Promise((resolve, reject) => {
            link.onload = e => {
                const sheet = e.target.sheet;
                sheet.disabled = true;
                resolve(sheet);
            };
            link.onerror = reject;
        });

    };

    const selectTheme = (themes, name) => {
        if (name && !themes[name]) {
            throw new Error(`"${name}" has not been defined as a theme.`);
        }
        Object.keys(themes).forEach(n => themes[n].disabled = (n !== name));
    }

    let themes = {};

    return {
        add(name, href) { return preloadTheme(href).then(s => themes[name] = s) },
        set theme(name) { selectTheme(themes, name) },
        get theme() { return Object.keys(themes).find(n => !themes[n].disabled) }
    };
};
