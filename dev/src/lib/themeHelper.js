export const ThemeHelper = function () {

    const themesLst = {
        Default:
            "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css",
        Cerulean:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/cerulean/bootstrap.min.css",
        Cosmo:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/cosmo/bootstrap.min.css",
        Cyborg:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/cyborg/bootstrap.min.css",
        Darkly:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/darkly/bootstrap.min.css",
        Flaty:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/flatly/bootstrap.min.css",
        Journal:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/journal/bootstrap.min.css",
        Litera:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/litera/bootstrap.min.css",
        Lumen:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/lumen/bootstrap.min.css",
        LUX:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/lux/bootstrap.min.css",
        Materia:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/materia/bootstrap.min.css",
        Minty:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/minty/bootstrap.min.css",
        Pulse:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/pulse/bootstrap.min.css",
        Sandstone:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/sandstone/bootstrap.min.css",
        Simplex:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/simplex/bootstrap.min.css",
        Sketchy:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/sketchy/bootstrap.min.css",
        Slate:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/slate/bootstrap.min.css",
        Solar:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/solar/bootstrap.min.css",
        Spacelab:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/spacelab/bootstrap.min.css",
        Supehero:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/superhero/bootstrap.min.css",
        United:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/united/bootstrap.min.css",
        Yeti:
            "https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/yeti/bootstrap.min.css"
    };

    const themesTypeLst = ["light", "dark"];

    const themesVariantLst = [
        "primary",
        "success",
        "info",
        "warning",
        "danger",
        "dark",
        "light"
    ];

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

    const preloadThemeFromName = (name) => {
        if (!themes[name]) {
            let href = themesLst[name];
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

        } else {
            return Promise.reject();
        }
    };

    const selectTheme = (themes, name) => {
        if (name && !themes[name]) {
            throw new Error(`"${name}" has not been defined as a theme.`);
        }
        Object.keys(themes).forEach(n => themes[n].disabled = (n !== name));
    }

    let themes = {};

    return {
        addNewTheme(name) { return preloadThemeFromName(name).then(s => themes[name] = s) },
        add(name, href) { return preloadTheme(href).then(s => themes[name] = s) },
        set theme(name) { selectTheme(themes, name) },
        get theme() { return Object.keys(themes).find(n => !themes[n].disabled) },
        themesLst,
        themesTypeLst,
        themesVariantLst
    };
};
