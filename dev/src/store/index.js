import loading from "./loading";
import vario from "./firmware";
import config from "./config";
import configweb from "./configweb";
import wifi from "./wifi";
import flight from "./flight";
import file from "./file";
import firmware from "./firmware";
import carnet from "./carnet";

// eslint-disable-next-line no-undef
export default new Vuex.Store({
    modules: {
        loading,
        vario,
        config,
        configweb,
        wifi,
        flight,
        file,
        firmware,
        carnet
    }
});