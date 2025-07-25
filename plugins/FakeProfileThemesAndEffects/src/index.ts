import { FluxDispatcher } from "@lib/flux";
import { UserProfileStore, UserStore } from "@lib/stores";
import {
    patchGetPurchase,
    patchGetUserProfile,
    patchGuildProfileEditForm,
    patchUseProfileEffectSections,
    patchUseProfileTheme,
    // patchUserProfileEditForm  // disabled to remove builder from profile settings
} from "@patches";
import { Settings } from "@ui/pages";

/** Updates the profile theme and effect used by YouScreen and BottomTabBar. */
function updateProfileThemeAndEffect() {
    const user = UserStore.getCurrentUser();
    if (!user) return;
    const user_profile = UserProfileStore.getUserProfile(user.id);
    if (!user_profile) return;
    FluxDispatcher.dispatch({
        type: "USER_PROFILE_FETCH_SUCCESS",
        user,
        user_profile,
        connected_accounts: user_profile.connectedAccounts
    });
}

const patches: (() => boolean)[] = [];

export default {
    onLoad() {
        patches.push(
            patchGetPurchase(),
            patchGetUserProfile(),
            patchGuildProfileEditForm(),
            patchUseProfileTheme(),
            patchUseProfileEffectSections()
            // patchUserProfileEditForm()  // disabled to remove builder from profile settings
        );

        updateProfileThemeAndEffect();
    },

    onUnload() {
        for (const unpatch of patches) {
            try {
                unpatch();
            } catch {}
        }
    }
};

export const settings = Settings;
