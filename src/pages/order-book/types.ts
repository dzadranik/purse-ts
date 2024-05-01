export type Limit = 100 | 500 | 1000;

export type InitData = [string, string];
export type FullData = [...InitData, string];
export type Data = [FullData[], FullData[]] | [];

export type Buffer = {
  [key: string]: {
    a: InitData[];
    b: InitData[];
    u: number;
  };
};

// export type FilterData = (
//   newData: InitData[],
//   oldData?: FullData[]
// ) => FullData[];
