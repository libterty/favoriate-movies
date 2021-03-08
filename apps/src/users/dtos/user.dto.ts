import { IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class UserCreditDto {
  @IsString({
    message: 'Username must be a string type',
  })
  @MinLength(4, {
    message: 'Username is too short, min length is 4',
  })
  @MaxLength(20, {
    message: 'Username is too long, max length is 20',
  })
  username: string = '';

  @IsString({
    message: 'Password must be a string type',
  })
  @MinLength(8, {
    message: 'Password is too short, min length is 8',
  })
  @MaxLength(20, {
    message: 'Password is too long, max length is 20',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string = '';
}

export class SigninCreditDto extends UserCreditDto {}
