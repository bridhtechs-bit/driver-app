import locationReducer, {
  updateDriverLocation,
  clearDriverLocation,
  setTrackingStatus,
  setLocationError,
} from './locationSlice';

describe('locationSlice', () => {
  it('stores the latest driver location and timestamp', () => {
    const state = locationReducer(undefined, updateDriverLocation({
      latitude: 6.176,
      longitude: 1.231,
    }));

    expect(state.current).toEqual({
      latitude: 6.176,
      longitude: 1.231,
    });
    expect(state.lastUpdate).toBeTruthy();
  });

  it('clears the current location and tracking error', () => {
    const state = locationReducer(
      {
        current: { latitude: 6.176, longitude: 1.231 },
        lastUpdate: Date.now(),
        tracking: true,
        error: 'previous',
      },
      clearDriverLocation()
    );

    expect(state.current).toBeNull();
    expect(state.error).toBeNull();
  });

  it('updates tracking and error state', () => {
    const trackingState = locationReducer(undefined, setTrackingStatus(true));
    expect(trackingState.tracking).toBe(true);

    const errorState = locationReducer(trackingState, setLocationError('gps off'));
    expect(errorState.error).toBe('gps off');
  });
});
