export const collapseMixin = {
    methods: {
        collapseClicked: function (collapseId) {
            const splittedId = collapseId.split("-");

            if (splittedId.length === 2) {
                switch (splittedId[0]) {
                    case "Y":
                        if (splittedId[0] == "Y") {
                            this.$store
                                .dispatch("logbook/loadFlightsBddShort", {
                                    mode: "M",
                                    parcel: splittedId[1],
                                })
                                .then(() => {
                                    this.$store
                                        .dispatch("logbook/collapseToggleY", {
                                            year: splittedId[1],
                                        })
                                        .then(() => {
                                            this.$root.$emit("bv::toggle::collapse", collapseId);
                                        });
                                });
                        }
                        break;
                    case "M":
                        this.$store
                            .dispatch("logbook/loadFlightsBdd", {
                                parcel: splittedId[1],
                            })
                            .then(() => {
                                this.$store
                                    .dispatch("logbook/collapseToggleM", {
                                        month: splittedId[1],
                                    })
                                    .then(() => {
                                        this.$root.$emit("bv::toggle::collapse", collapseId);
                                    });
                            });
                }
            }
        },
    }
}