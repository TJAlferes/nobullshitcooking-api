import { User, Email, Password, Username } from './model';

describe('User model', () => {
  describe('update method', () => {
    it('handles when confirmation_code is null', () => {
      const params = {
        user_id: "99999999-9999-9999-9999-999999999999",
        email: "username@nobsc.com",
        password: "password",
        username: "username",
        confirmation_code: null
      };
      const user = User.update(params);
      expect(user).toBeInstanceOf(User);
      expect(user.getDTO()).toEqual(params);
    });

    it('handles when confirmation_code is not null', () => {
      const params = {
        user_id: "99999999-9999-9999-9999-999999999999",
        email: "username@nobsc.com",
        password: "password",
        username: "username",
        confirmation_code: "99999999-9999-9999-9999-999999999999"
      };
      const user = User.update(params);
      expect(user).toBeInstanceOf(User);
      expect(user.getDTO()).toEqual(params);
    });
  });
});

describe('Email value object', () => {
  it('handles invalid email', () => {
    expect(() => Email('invalid-email')).toThrow('Invalid email.');
  });

  it('handles success', () => {
    expect(() => Email('valid@email.com')).not.toThrow();
  });
});

describe('Password value object', () => {
  it('handles too short', () => {
    expect(() => Password('short')).toThrow('Password must be at least 6 characters.');
  });

  it('handles too long', () => {
    expect(() => Password('toolongpasswordtoolongpasswordtoolongpasswordtoolongpasswordt'))
      .toThrow('Password must be no more than 60 characters.');
  });
  
  it('handles success', () => {
    expect(() => Password('validPassword')).not.toThrow();
  });
});

describe('Username value object', () => {
  it('handles too short', () => {
    expect(() => Username('short')).toThrow('Username must be at least 6 characters.');
  });

  it('handles too long', () => {
    expect(() => Username('toolongusernametoolon'))
      .toThrow('Username must be no more than 20 characters.');
  });
  
  it('handles success', () => {
    expect(() => Username('validUsername')).not.toThrow();
  });
});
