export type CreateUserParams = {
  email:    string;
  password: string;
  username: string;
};

export type UserTableRow = {
  id:                string;
  email:             string;
  password:          string;
  username:          string;
  confirmation_code: string;
};
