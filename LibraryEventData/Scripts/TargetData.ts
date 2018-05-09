namespace EventData
{
  interface ITargetData
  {
    Label: string;
    Value: string;
  }

  export class TargetData implements ITargetData
  {
    constructor(public Label: string = "", public Value: string = "")
    {

    }

    public static GetTargetData(data: Array<TargetData>, searchValue: string): TargetData
    {
      if (data === undefined || data === null) return new TargetData();
      let found = data.filter(
        function (d)
        {
          return d.Value === searchValue;
        });
      if (found.length > 0)
      {
        return found[0];
      }
      return new TargetData();
    }
  }
}