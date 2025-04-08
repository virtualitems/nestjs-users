export interface JwtPayload {
  iss?: string; // issuer of the jwt
  sub?: number; // subject of the jwt (the user)
  aud?: string; // recipient for which the jwt is intended
  exp?: number; // time after which the jwt expires
  nbf?: number; // time before which the jwt must not be accepted for processing
  iat?: number; // time at which the jwt was issued; can be used to determine age of the jwt
  jti?: number; // unique identifier; can be used to prevent the jwt from being replayed (allows a token to be used only once)
  rex?: number; // time after which the jwt can not be refreshed
  ver?: number; // user version of the jwt
}
