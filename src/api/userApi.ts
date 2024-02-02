export const getMyGeoLocation = (): Promise<number[]> => {
  const result: Promise<number[]> = new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve([position.coords.latitude, position.coords.longitude]);
    });
  });

  result.then((data: number[]) => {
    if (data) {
      return data;
    } else {
      return [];
    }
  });
  return result;
};
