import { create } from "zustand";
import { getCurrentLocation, clearWatchLocation, watchCurrentLocation } from '../../actions/location/location';
import { Location } from "../../interfaces/location";

interface LocationState {
    lastKnownLocation: Location | null;
    userLocationsList: Location[];
    watchId: number | null;

    getLocation: () => Promise<Location | null>;
    watchLocation: () => void;
    clearWatchLocation: () => void;
}

export const useLocationStore = create<LocationState>()((set, get) => ({
    lastKnownLocation: null,
    userLocationsList: [],
    watchId: null,

    getLocation: async () => {
        const location = await getCurrentLocation();
        set({ lastKnownLocation: location });
        return location;
    },

    watchLocation: () => {
        const watchId = get().watchId;
        if (watchId !== null) {

            get().clearWatchLocation()
        }
        const id = watchCurrentLocation( (location) => {
            let updatedList = [...get().userLocationsList, location];
            if (updatedList.length > 10) {
                updatedList.shift();
            }
            set({
                lastKnownLocation: location,
                // userLocationsList: [...get().userLocationsList, location]
                userLocationsList: updatedList
            })
        });

        set({ watchId: id});
    },

    clearWatchLocation: () => {
        const watchId = get().watchId;
        if (watchId !== null) {
            clearWatchLocation(watchId)
        }
    }

}))