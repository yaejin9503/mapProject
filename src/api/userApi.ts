export const getMyGeoLocation = (): number[] => {
  if (!navigator.geolocation) {
    console.log("사용 불가능");
  } else {
    // console.log('사용 불가능');
    const result: Promise<number[]> = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          reject([]);
        }
      );
    });

    result
      .then((data: number[]) => {
        return data;
      })
      .catch((emptyArray: number[]) => {
        return emptyArray;
      });
  }
  return [];
};
