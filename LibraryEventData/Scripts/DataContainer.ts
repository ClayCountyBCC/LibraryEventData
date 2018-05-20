namespace EventData
{
  interface IDataContainer
  {
    Event_Types: Array<TargetData>;
    Locations: Array<TargetData>;
    Target_Audiences: Array<TargetData>;
    CurrentAccess: UserAccess;
    Times: Array<TargetData>;

  }

  export class DataContainer implements IDataContainer
  {
    public Event_Types: Array<TargetData>;
    public Locations: Array<TargetData>;
    public Target_Audiences: Array<TargetData>;
    public CurrentAccess: UserAccess;
    public Times: Array<TargetData>;

    constructor()
    {

    }

    public static Get() : Promise<DataContainer>
    {
      return XHR.GetObject("../API/InitialData/Get");
    }

  }

}