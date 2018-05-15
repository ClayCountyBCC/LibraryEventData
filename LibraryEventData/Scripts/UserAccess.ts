namespace EventData
{

  export enum access_type 
  {
    admin_access = 1,
    edit_access = 2
  }

  interface IUserAccess
  {
    authenticated: boolean;
    user_name: string;
    employee_id: number;
    display_name: string;
    current_access: access_type;
  }

  export class UserAccess implements IUserAccess
  {
    public authenticated: boolean;
    public user_name: string;
    public employee_id: number;
    public display_name: string;
    public current_access: access_type;

    constructor()
    {

    }
  }
}