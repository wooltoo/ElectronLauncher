"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LauncherConfig = /** @class */ (function () {
    function LauncherConfig() {
    }
    // The name of the launcher window
    LauncherConfig.NAME = "Tales of Time";
    // How often the launcher checks if a patch is missing locally (MS).
    LauncherConfig.INTERVAL_CHECK_FOR_PATCH_TO_DL = 500;
    // Decides if the launcher should check for new patches on the remote host.
    LauncherConfig.SHOULD_CHECK_FOR_NEW_REMOTE_PATCHES = true;
    // How often the launcher checks for new patches added on the remote host (MS).
    LauncherConfig.INTERVAL_CHECK_FOR_NEW_REMOTE_PATCHES = 2500;
    return LauncherConfig;
}());
exports.LauncherConfig = LauncherConfig;
//# sourceMappingURL=launcherconfig.js.map