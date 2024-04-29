export type InitData = [string, string];
export type FullData = [string, string, string];
export type Data = [FullData[], FullData[]] | [];

export type Buffer = {
  [key: string]: {
    a: FullData[];
    b: FullData[];
    u: number;
  };
};

export type FilterData = (
  newData: InitData[] | FullData[],
  oldData?: FullData[]
) => FullData[];

export type Socket = WebSocket;
