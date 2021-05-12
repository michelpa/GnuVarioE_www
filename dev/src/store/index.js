import loading from "./loading";
import config from "./config";
import configweb from "./configweb";
import wifi from "./wifi";
import flight from "./flight";
import file from "./file";
import firmware from "./firmware";
import carnet from "./carnet";
import paragliding from "./paragliding";
import dropbox from "./dropbox";
import calibration from "./calibration";
import logbook from "./logbook";

// eslint-disable-next-line no-undef
export default new Vuex.Store({
    modules: {
        loading,
        config,
        configweb,
        wifi,
        flight,
        file,
        firmware,
        carnet,
        paragliding,
        dropbox,
        calibration,
        logbook
    }
});