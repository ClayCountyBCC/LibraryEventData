namespace EventData
{
  interface IGenericData
  {
    Label: string;
    Value: string;
  }

  export class GenericData implements IGenericData
  {
    constructor(public Label: string, public Value: string)
    {

    }
  }
}